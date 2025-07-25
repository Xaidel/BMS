#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod commands;
mod models;

use commands::settings::{save_settings_command, fetch_settings_command, fetch_logo_command};
use commands::events::{save_event_command, insert_event_command, fetch_all_events_command, delete_event_command, update_event_command};
use commands::households::{save_household_command, insert_household_command, fetch_all_households_command, delete_household_command, update_household_command};
use commands::expense::{save_expense_command, insert_expense_command, fetch_all_expenses_command, delete_expense_command, update_expense_command};
use commands::income::{save_income_command, insert_income_command, fetch_all_incomes_command, delete_income_command, update_income_command};
use commands::blotters::{save_blotter_command, insert_blotter_command, fetch_all_blotters_command, delete_blotter_command, update_blotter_command};
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

            insert_event_command,
            fetch_all_events_command,
            delete_event_command,
            update_event_command,
            save_event_command,

            insert_household_command,
            fetch_all_households_command,
            delete_household_command,
            update_household_command,
            save_household_command,

            insert_expense_command,
            fetch_all_expenses_command,
            delete_expense_command,
            update_expense_command,
            save_expense_command,

            insert_income_command,
            fetch_all_incomes_command,
            delete_income_command,
            update_income_command,
            save_income_command,

            insert_blotter_command,
            fetch_all_blotters_command,
            delete_blotter_command,
            update_blotter_command,
            save_blotter_command,

            fetch_settings_command,
            save_settings_command,
            fetch_logo_command,

        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
