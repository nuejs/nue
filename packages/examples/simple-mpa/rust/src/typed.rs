use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use regex::Regex;

#[derive(Deserialize, Serialize, Clone)]
#[serde(rename_all = "snake_case")]
enum EventType {
    DemoRequest,
    Question,
    Problem,
    Feedback
}

#[derive(Deserialize, Serialize, Clone)]
struct Event {
    ts: u64,
    r#type: EventType,
    data: EventData
}

#[derive(Deserialize, Serialize, Clone)]
struct EventData {
    id: u64,
    cc: String,
    email: String,
    name: Option<String>,
    plan: Option<String>,
    org: Option<String>,
    website: Option<String>,
    company_size: Option<u64>,
    message: Option<String>,
}


#[derive(Deserialize)]
struct QueryParams {
    start: usize,
    length: usize,
    query: Option<String>,
    filters: Option<HashMap<String, String>>
}

#[derive(Serialize)]
struct ResultSet {
    items: Vec<Event>,
    total: usize
}

#[wasm_bindgen]
pub struct Model {
    events: Vec<Event>
}

#[wasm_bindgen]
impl Model {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Model { events: Vec::new() }
    }

    #[wasm_bindgen]
    pub fn process_chunk(&mut self, chunk_str: String) {
        if let Ok(mut chunk) = serde_json::from_str(&chunk_str) {
            self.events.append(&mut chunk);
            self.events.sort_by_key(|e| e.ts);
        }
    }

    pub fn search(&self, params: JsValue) -> JsValue {
        let params: QueryParams = serde_wasm_bindgen::from_value(params)
            .expect("Invalid params");

        let results: Vec<Event> = match &params.query {
            Some(query) => {
                let query = query.to_lowercase();
                self.events.iter()
                    .filter_map(|event| self.highlight_matches(event, &query))
                    .collect()
            },
            None => self.events.clone()
        };

        self.paginate_results(&results, params.start, params.length)
    }


   fn highlight_matches(&self, event: &Event, query: &str) -> Option<Event> {
       // Create word-boundary aware case-insensitive pattern
       let pattern = format!(r"(?i)\b({})\b|(?i)({})", regex::escape(query), regex::escape(query));
       let re = Regex::new(&pattern).unwrap();
       let mut found = false;
       let mut event = event.clone();

       // Now we don't need to lowercase the source text since regex handles case-insensitivity
       if re.is_match(&event.data.email) {
           event.data.email = re.replace_all(&event.data.email, "<mark>$0</mark>").to_string();
           found = true;
       }

       if let Some(name) = &event.data.name {
           if re.is_match(name) {
               event.data.name = Some(re.replace_all(name, "<mark>$0</mark>").to_string());
               found = true;
           }
       }

       if let Some(message) = &event.data.message {
           if re.is_match(message) {
               event.data.message = Some(re.replace_all(message, "<mark>$0</mark>").to_string());
               found = true;
           }
       }

       if found { Some(event) } else { None }
   }

    pub fn filter(&self, params: JsValue) -> JsValue {
        let params: QueryParams = serde_wasm_bindgen::from_value(params)
            .expect("Invalid params");

        let results: Vec<Event> = match &params.filters {
            Some(filters) => self.events.iter()
                .filter(|e| self.matches_filters(e, filters))
                .cloned()
                .collect(),
            None => self.events.clone()
        };

        self.paginate_results(&results, params.start, params.length)
    }

    fn matches_filters(&self, event: &Event, filters: &HashMap<String, String>) -> bool {
        for (key, value) in filters {
            match key.as_str() {
                "type" => {
                    let type_str = match event.r#type {
                        EventType::DemoRequest => "demo_request",
                        EventType::Question => "question",
                        EventType::Problem => "problem",
                        EventType::Feedback => "feedback"
                    };
                    if type_str != value {
                        return false;
                    }
                },
                "plan" => if event.data.plan.as_deref() != Some(value.as_str()) {
                    return false;
                },
                "cc" => if event.data.cc != *value {
                    return false;
                },
                _ => ()
            }
        }
        true
    }

    fn paginate_results(&self, items: &[Event], start: usize, length: usize) -> JsValue {
        let total = items.len();
        let page = items[start..std::cmp::min(start + length, items.len())].to_vec();

        serde_wasm_bindgen::to_value(&ResultSet {
            items: page,
            total
        }).unwrap()
    }
}