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

        // DROP TABLE IF EXISTS expenses;
        CREATE TABLE expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type_ TEXT NOT NULL,
            amount REAL NOT NULL,
            paid_to TEXT NOT NULL,
            paid_by TEXT NOT NULL,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            or_number INTEGER NOT NULL
        );
        ",
    )?;
    Ok(())
}
