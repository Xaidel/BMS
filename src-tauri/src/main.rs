#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod commands;


use commands::income::{save_income_command, insert_income_command, fetch_all_incomes_command, delete_income_command, update_income_command};
use crate::commands::blotters::{delete_blotter_command, fetch_all_blotters_command, save_blotter};
use database::connection::establish_connection;
use database::migration::migrate;
use tauri::command;


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
            insert_income_command,
            fetch_all_incomes_command,
            delete_income_command,
            update_income_command,
            save_income_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
