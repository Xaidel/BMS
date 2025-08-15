use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct BarangayMap {
    pub id: i32,
    pub name: String,
    pub x: f64,
    pub y: f64,
    pub house_number: String,
    pub zone: String,
    pub section: String,
}
