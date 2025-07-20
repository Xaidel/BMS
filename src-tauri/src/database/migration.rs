use rusqlite::{Connection, Result};

pub fn migrate(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS blotters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
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
        ",
    )?;
    Ok(())
}
