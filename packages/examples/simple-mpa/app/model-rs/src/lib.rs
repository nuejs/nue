
/*
  Engine for a high-performance CRM demo handling large in-memory event-sourced datasets.
  Easily processes 100k-1M records, providing fast sorting and real-time keypress search.

  Goals:
  Outscale JS (crashes at ~125k) with responsive UX for business use cases like CRMs.

  Performance tricks:
  - Index-based sorting (~200ms) avoids cloning events, using Vec<usize> for lightweight ops.
  - Precomputed search index (HashMap) enables sub-200ms keypress searches on 150k records.
  - Optimized comparators (rank_plan/rank_size) for O(1) plan/size sorting.
*/

use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::cmp::Ordering;
use std::collections::HashMap;

#[derive(Clone, Deserialize, Serialize)]
struct Event {
  #[serde(rename = "type")]
  event_type: String,
  ts: u32,
  data: HashMap<String, Value>,
}

#[derive(Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SortField { Id, Cc, Plan, Size }

#[derive(Deserialize)]
pub struct QueryParams {
  start: usize,
  length: usize,
  sort_by: Option<SortField>,
  ascending: Option<bool>,
}

#[wasm_bindgen]
pub struct Engine {
  events: Vec<Event>,
  search_index: HashMap<String, Vec<usize>>,
}

#[wasm_bindgen]
impl Engine {
  #[wasm_bindgen(constructor)]
  pub fn new() -> Self {
    Engine {
      events: Vec::new(),
      search_index: HashMap::new(),
    }
  }

  pub fn add_events(&mut self, input: String) {
    let new_events: Vec<Event> = input
      .lines()
      .filter(|s| !s.trim().is_empty())
      .filter_map(|s| serde_json::from_str(s).ok())
      .collect();
    let start_idx = self.events.len();
    self.events.extend(new_events);

    // Build search index
    for (i, event) in self.events[start_idx..].iter().enumerate() {
      let idx = start_idx + i;
      for field in ["message", "name", "email"] {
        if let Some(value) = event.data.get(field).and_then(|v| v.as_str()) {
          let lower = value.to_lowercase();
          for word in lower.split_whitespace() {
            self.search_index.entry(word.to_string()).or_default().push(idx);
          }
        }
      }
    }
  }

  pub fn get_total(&self) -> usize {
    self.events.len()
  }

  pub fn clear(&mut self) {
    self.events.clear();
    self.search_index.clear();
  }

  #[wasm_bindgen]
  pub fn all(&self, params: JsValue) -> Result<String, JsError> {
    let params: QueryParams = serde_wasm_bindgen::from_value(params)?;
    let mut indices: Vec<usize> = (0..self.events.len()).collect();
    sort_indices(&self.events, &mut indices, params.sort_by.as_ref(), params.ascending.unwrap_or(false));
    Ok(self.paginate(&indices, params.start, params.length))
  }

  #[wasm_bindgen]
  pub fn filter(&self, filters: JsValue, params: JsValue) -> Result<String, JsError> {
    let filters: HashMap<String, String> = serde_wasm_bindgen::from_value(filters)?;
    let params: QueryParams = serde_wasm_bindgen::from_value(params)?;

    let mut indices: Vec<usize> = self.events.iter().enumerate()
      .filter(|(_, event)| {
        filters.iter().all(|(k, v)| match k.as_str() {
          "type" => event.event_type == *v,
          key => event.data.get(key).and_then(|val| val.as_str()) == Some(v),
        })
      })
      .map(|(i, _)| i)
      .collect();

    sort_indices(&self.events, &mut indices, params.sort_by.as_ref(), params.ascending.unwrap_or(false));
    Ok(self.paginate(&indices, params.start, params.length))
  }

  #[wasm_bindgen]
  pub fn search(&self, query: String, params: JsValue) -> Result<String, JsError> {
    let params: QueryParams = serde_wasm_bindgen::from_value(params)?;
    let query = query.to_lowercase();
    let words: Vec<&str> = query.split_whitespace().collect();

    let mut indices: Vec<usize> = if words.is_empty() {
      (0..self.events.len()).collect()
    } else {
      let mut result: Vec<usize> = Vec::new();
      // Start with first word's indices
      if let Some(first_word) = words.first() {
        if let Some(indices) = self.search_index.get(*first_word) {
          result.extend(indices);
        }
      }
      // Intersect with remaining words
      for word in words.iter().skip(1) {
        if let Some(next_indices) = self.search_index.get(*word) {
          result.retain(|idx| next_indices.contains(idx));
        } else {
          result.clear(); // If a word isn't found, reset but keep going
        }
      }
      // Fallback to full scan if index fails
      if result.is_empty() {
        self.events.iter().enumerate()
          .filter(|(_, event)| {
            let message = event.data.get("message").and_then(|v| v.as_str()).unwrap_or("");
            let name = event.data.get("name").and_then(|v| v.as_str()).unwrap_or("");
            let email = event.data.get("email").and_then(|v| v.as_str()).unwrap_or("");
            let text = format!("{} {} {}", message, name, email).to_lowercase();
            words.iter().all(|w| text.contains(w))
          })
          .map(|(i, _)| i)
          .collect()
      } else {
        result.sort_unstable();
        result.dedup();
        result
      }
    };

    sort_indices(&self.events, &mut indices, params.sort_by.as_ref(), params.ascending.unwrap_or(false));
    Ok(self.paginate(&indices, params.start, params.length))
  }

  #[wasm_bindgen]
  pub fn get(&self, id: u32) -> Option<String> {
    self.events.iter()
      .find(|event| event.data.get("id").and_then(|v| v.as_u64()).unwrap_or(0) == id as u64)
      .map(|event| serde_json::to_string(event).unwrap_or_default())
  }

  fn paginate(&self, indices: &[usize], start: usize, length: usize) -> String {
    let total = indices.len();
    let end = (start + length).min(total);
    let items = indices[start..end]
      .iter()
      .map(|&i| serde_json::to_string(&self.events[i]).unwrap_or_default())
      .collect::<Vec<_>>()
      .join(",");

    format!(r#"{{"total":{},"start":{},"length":{},"items":[{}]}}"#, total, start, length, items)
  }
}

fn rank_plan(plan: &str) -> u8 {
  match plan {
    "free" => 0,
    "pro" => 1,
    "enterprise" => 2,
    _ => 3,
  }
}

fn rank_size(size: &str) -> u8 {
  match size {
    "s" => 0,
    "m" => 1,
    "l" => 2,
    "xl" => 3,
    _ => 4,
  }
}

fn sort_indices(events: &[Event], indices: &mut Vec<usize>, sort_by: Option<&SortField>, ascending: bool) {
  let compare_by = |field: &SortField, a: &Event, b: &Event| -> Ordering {
    match field {
      SortField::Id => a.data["id"].as_u64().unwrap().cmp(&b.data["id"].as_u64().unwrap()),
      SortField::Cc => a.data["cc"].as_str().unwrap().cmp(&b.data["cc"].as_str().unwrap()),
      SortField::Plan => {
        let a_plan = a.data.get("plan").and_then(|v| v.as_str()).unwrap_or("");
        let b_plan = b.data.get("plan").and_then(|v| v.as_str()).unwrap_or("");
        rank_plan(a_plan).cmp(&rank_plan(b_plan))
      }
      SortField::Size => {
        let a_size = a.data.get("size").and_then(|v| v.as_str()).unwrap_or("");
        let b_size = b.data.get("size").and_then(|v| v.as_str()).unwrap_or("");
        rank_size(a_size).cmp(&rank_size(b_size))
      }
    }
  };

  indices.sort_unstable_by(|&a, &b| {
    let order = match sort_by {
      Some(field) => compare_by(field, &events[a], &events[b]),
      None => events[a].data["id"].as_u64().unwrap().cmp(&events[b].data["id"].as_u64().unwrap()),
    };
    if ascending { order } else { order.reverse() }
  });
}