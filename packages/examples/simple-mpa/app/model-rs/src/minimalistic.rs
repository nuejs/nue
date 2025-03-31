
/*
  Not currently in use.

  The codebase is simpler and more readable, though less optimized for performance.
  It delivers the same functionality but relies on looser type checking with
  string-based matching.
*/

use wasm_bindgen::prelude::*;
use serde::Deserialize;
use std::collections::HashMap;
use serde_json::Value;

#[derive(Clone, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SortField { Id, Cc, Plan, Size, }

#[derive(Deserialize)]
pub struct QueryParams {
 start: usize,
 length: usize,
 sort_by: Option<SortField>,
 ascending: Option<bool>,
}

#[wasm_bindgen]
pub struct Engine {
 events: Vec<String>,
}

#[wasm_bindgen]
impl Engine {
 #[wasm_bindgen(constructor)]
 pub fn new() -> Self {
   Engine { events: Vec::new() }
 }

 pub fn add_events(&mut self, input: String) {
   let new_events: Vec<String> = input.lines().map(|s| s.to_string()).collect();
   self.events.extend(new_events);
 }

 #[wasm_bindgen]
 pub fn get_total(&self) -> usize {
   self.events.len()
 }

 #[wasm_bindgen]
 pub fn clear(&mut self) {
   self.events.clear();
 }

 #[wasm_bindgen]
 pub fn all(&self, params: JsValue) -> Result<String, JsError> {
   let params: QueryParams = serde_wasm_bindgen::from_value(params)?;
   let mut matches: Vec<&String> = self.events.iter().collect();
   sort_entries(&mut matches, params.sort_by.as_ref(), params.ascending.unwrap_or(false));
   Ok(self.paginate(matches, params.start, params.length))
 }

 #[wasm_bindgen]
 pub fn filter(&self, filters: JsValue, params: JsValue) -> Result<String, JsError> {
   let filters: HashMap<String, String> = serde_wasm_bindgen::from_value(filters)?;
   let params: QueryParams = serde_wasm_bindgen::from_value(params)?;

   let mut matches = self.events.iter()
     .filter(|line| filters.iter().all(|(k,v)| line.contains(&format!("{}\":\"{}\"", k, v))))
     .collect::<Vec<_>>();

   sort_entries(&mut matches, params.sort_by.as_ref(), params.ascending.unwrap_or(false));
   Ok(self.paginate(matches, params.start, params.length))
 }

 #[wasm_bindgen]
 pub fn search(&self, query: String, params: JsValue) -> Result<String, JsError> {
   let params: QueryParams = serde_wasm_bindgen::from_value(params)?;
   let query = query.to_lowercase();

   let mut matches: Vec<&String> = self.events.iter()
     .filter(|line| {
       let line = line.to_lowercase();
       line.contains(&"message\":\"".to_string()) && line.contains(&query) ||
       line.contains(&"name\":\"".to_string()) && line.contains(&query) ||
       line.contains(&"email\":\"".to_string()) && line.contains(&query)
     })
     .collect();

   sort_entries(&mut matches, params.sort_by.as_ref(), params.ascending.unwrap_or(false));
   Ok(self.paginate(matches, params.start, params.length))
 }

 #[wasm_bindgen]
 pub fn get(&self, id: u32) -> Option<String> {
   let pattern = format!("id\":{}", id);
   self.events.iter()
     .find(|line| line.contains(&pattern))
     .cloned()
 }

 fn paginate(&self, matches: Vec<&String>, start: usize, length: usize) -> String {
   let total = matches.len();
   let end = (start + length).min(matches.len());
   let items = &matches[start..end];

   format!("{{\"total\":{},\"start\":{},\"length\":{},\"items\":[{}]}}",
     total, start, length,
     items.iter().map(|s| s.as_str()).collect::<Vec<&str>>().join(","))
 }
}

fn sort_entries(entries: &mut Vec<&String>, sort_by: Option<&SortField>, ascending: bool) {
  let plan = vec!["free", "pro", "enterprise"];
  let size = vec!["s", "m", "l", "xl"];
  
  let pos = |s: &str, vec: &Vec<&str>| {
    vec.iter().position(|&r| r == s).unwrap_or(vec.len())
  };

  let extract_field = |s: &&String, field: &str| {
    let value: Value = serde_json::from_str(s).unwrap_or_default();
    value["data"][field].as_str().unwrap_or("").to_string()
  };

  let get_number = |s: &&String, field: &str| {
    let value: Value = serde_json::from_str(s).unwrap_or_default();
    value["data"][field].as_u64().unwrap_or(0)
  };
 
  entries.sort_by(|a, b| {
    let compare = match sort_by {
      Some(SortField::Id) => get_number(a, "id").cmp(&get_number(b, "id")),
      Some(SortField::Cc) => extract_field(a, "cc").cmp(&extract_field(b, "cc")),
      Some(SortField::Plan) => pos(extract_field(a, "plan").as_str(), &plan).cmp(&pos(extract_field(b, "plan").as_str(), &plan)),
      Some(SortField::Size) => pos(extract_field(a, "size").as_str(), &size).cmp(&pos(extract_field(b, "size").as_str(), &size)),
      None => get_number(a, "id").cmp(&get_number(b, "id"))
    };

    if ascending { compare } else { compare.reverse() }
  });
}
