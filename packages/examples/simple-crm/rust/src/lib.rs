use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Model {
  events: Vec<String>,
}

#[wasm_bindgen]
impl Model {
  #[wasm_bindgen(constructor)]
  pub fn new() -> Self {
    Model { events: Vec::new() }
  }

  pub fn add_events(&mut self, input: String) {
    let new_events: Vec<String> = input.lines().map(|s| s.to_string()).collect();
    self.events.extend(new_events);
  }

  #[wasm_bindgen]
  pub fn filter(&self, filters: String, start: usize, length: usize) -> String {
    let patterns: Vec<String> = filters.split(',')
     .map(|s| s.trim().to_string())
     .collect();
    let matches = self.filter_events(patterns);
    self.paginate(matches, start, length)
  }

  #[wasm_bindgen]
  pub fn search(&self, query: String, start: usize, length: usize) -> String {
    let query = query.to_lowercase();

    let matches: Vec<&String> = self.events.iter()
     .filter(|line| {
      let line = line.to_lowercase();
      line.contains(&format!("message\":\"")) && line.contains(&query) ||
      line.contains(&format!("name\":\"")) && line.contains(&query) ||
      line.contains(&format!("email\":\"")) && line.contains(&query)
     })
     .collect();

    self.paginate(matches, start, length)
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

  fn filter_events(&self, patterns: Vec<String>) -> Vec<&String> {
    self.events.iter()
     .filter(|line| patterns.iter().all(|p| line.contains(p)))
     .collect()
  }
}