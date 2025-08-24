use rusqlite::{Connection, Result};

pub fn migrate(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS blotters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type_ TEXT NOT NULL,
            reported_by TEXT NOT NULL,
            involved TEXT NOT NULL,
            incident_date TEXT NOT NULL,
            location TEXT NOT NULL,
            zone TEXT NOT NULL,
            status TEXT NOT NULL,
            narrative TEXT NOT NULL,
            action TEXT NOT NULL,
            witnesses TEXT NOT NULL,
            evidence TEXT NOT NULL,
            resolution TEXT NOT NULL,
            hearing_date TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS incomes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type_ TEXT NOT NULL,
            amount REAL NOT NULL,
            or_number INTEGER NOT NULL,
            received_from TEXT NOT NULL,
            received_by TEXT NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type_ TEXT NOT NULL,
            amount REAL NOT NULL,
            paid_to TEXT NOT NULL,
            paid_by TEXT NOT NULL,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            or_number INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type_ TEXT NOT NULL,
            status TEXT NOT NULL,
            date TEXT NOT NULL,
            venue TEXT NOT NULL,
            attendee TEXT NOT NULL,
            notes TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY CHECK (id = 1), -- only one row
            barangay TEXT,
            municipality TEXT,
            province TEXT,
            phone_number TEXT,
            email TEXT,
            logo TEXT,  -- base64 or file path
            logo_municipality TEXT  -- base64 or file path
            );
        CREATE TABLE IF NOT EXISTS residents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            middle_name TEXT,
            last_name TEXT NOT NULL,
            suffix TEXT,
            civil_status TEXT NOT NULL,
            gender TEXT NOT NULL,
            nationality TEXT NOT NULL,
            mobile_number TEXT NOT NULL,
            religion TEXT,
            occupation TEXT,
            average_monthly_income INTEGER,
            date_of_birth TEXT NOT NULL,
            town_of_birth TEXT NOT NULL,
            province_of_birth TEXT NOT NULL,
            zone TEXT NOT NULL,
            barangay TEXT NOT NULL,
            town TEXT NOT NULL,
            province TEXT NOT NULL,
            household_number TEXT NOT NULL,
            role_in_household TEXT NOT NULL,
            father_first_name TEXT NOT NULL,
            father_middle_name TEXT,
            father_last_name TEXT NOT NULL,
            father_suffix TEXT NOT NULL,
            mother_first_name TEXT NOT NULL,
            mother_middle_name TEXT,
            mother_last_name TEXT NOT NULL,
            status TEXT NOT NULL,
            photo TEXT,
            is_registered_voter BOOLEAN NOT NULL DEFAULT 0,
            is_pwd BOOLEAN NOT NULL DEFAULT 0,
            is_senior BOOLEAN NOT NULL DEFAULT 0,
            is_solo_parent BOOLEAN NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS barangay_map (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            x REAL NOT NULL,
            y REAL NOT NULL,
            house_number TEXT,
            zone TEXT,
            section TEXT
        );
        CREATE TABLE IF NOT EXISTS officials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            section TEXT NOT NULL,
            age INTEGER NOT NULL,
            contact TEXT NOT NULL,
            term_start TEXT NOT NULL,
            term_end TEXT NOT NULL,
            zone TEXT NOT NULL,
            image TEXT
        );
        CREATE TABLE IF NOT EXISTS certificates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resident_name TEXT NOT NULL,
            type_ TEXT NOT NULL,
            age INTEGER,
            civil_status TEXT,
            ownership_text TEXT,
            amount TEXT,
            issued_date TEXT,
            purpose TEXT
        );
        CREATE TABLE IF NOT EXISTS logbook (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            official_name TEXT NOT NULL,
            date TEXT NOT NULL,
            time_in_am TEXT,
            time_out_am TEXT,
            time_in_pm TEXT,
            time_out_pm TEXT,
            remarks TEXT,
            status TEXT,
            total_hours REAL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
        ",
    )?;
    Ok(())
}
