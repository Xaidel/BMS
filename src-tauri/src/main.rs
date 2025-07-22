#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;

use crate::database::blotters::{delete_blotter, fetch_all_blotters, insert_or_update_blotter};
use database::blotters::Blotter;
use database::connection::establish_connection;
use database::migration::migrate;
use tauri::command;

#[tauri::command]
fn delete_blotter_command(id: i32) -> Result<(), String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    delete_blotter(&conn, id).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn save_blotter(data: Blotter) -> Result<(), String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    insert_or_update_blotter(&conn, data).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn fetch_all_blotters_command() -> Result<Vec<Blotter>, String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    fetch_all_blotters(&conn).map_err(|e| e.to_string())
}

#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to BMS!", name)
}

#[command]
fn test_db_connection() -> String {
    "Database is working!".to_string()
}

fn main() {
    println!("🔧 Attempting to connect and migrate DB...");

    let conn = establish_connection();
    if let Ok(conn) = conn {
        println!("✅ Connected to DB!");
        if let Err(e) = migrate(&conn) {
            eprintln!("❌ Migration failed: {:?}", e);
        } else {
            println!("✅ Migration ran successfully!");
        }
    } else {
        eprintln!("❌ Failed to connect to DB");
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            test_db_connection,
            save_blotter,
            fetch_all_blotters_command,
            delete_blotter_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
