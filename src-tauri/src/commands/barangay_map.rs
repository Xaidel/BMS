use rusqlite::{params, Result};
use serde::{Deserialize, Serialize};
use tauri::command;
use crate::database::connection::establish_connection;

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

#[command]
pub fn fetch_households() -> Result<Vec<BarangayMap>, String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, name, x, y, house_number, zone, section FROM households")
        .map_err(|e| e.to_string())?;

    let household_iter = stmt
        .query_map([], |row| {
            Ok(BarangayMap {
                id: row.get(0)?,
                name: row.get(1)?,
                x: row.get(2)?,
                y: row.get(3)?,
                house_number: row.get(4)?,
                zone: row.get(5)?,
                section: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut households = Vec::new();
    for household in household_iter {
        households.push(household.map_err(|e| e.to_string())?);
    }

    Ok(households)
}

#[command]
pub fn insert_household(
    name: String,
    x: f64,
    y: f64,
    house_number: String,
    zone: String,
    section: String,
) -> Result<(), String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO households (name, x, y, house_number, zone, section) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![name, x, y, house_number, zone, section],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn update_household(
    id: i32,
    name: String,
    x: f64,
    y: f64,
    house_number: String,
    zone: String,
    section: String,
) -> Result<(), String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE households SET name = ?1, x = ?2, y = ?3, house_number = ?4, zone = ?5, section = ?6 WHERE id = ?7",
        params![name, x, y, house_number, zone, section, id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn delete_household(id: i32) -> Result<(), String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM households WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
