use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};

pub fn delete_blotter(conn: &Connection, id: i32) -> rusqlite::Result<()> {
    conn.execute("DELETE FROM blotters WHERE id = ?", params![id])?;
    Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Blotter {
    pub id: Option<i32>,
    pub type_: String,
    pub reported_by: String,
    pub involved: String,
    pub incident_date: String,
    pub location: String,
    pub zone: String,
    pub status: String,
    pub narrative: String,
    pub action: String,
    pub witnesses: String,
    pub evidence: String,
    pub resolution: String,
    pub hearing_date: String,
}

// ✅ Insert a new blotter record into the database
pub fn insert_blotter(conn: &Connection, blotter: Blotter) -> rusqlite::Result<usize> {
    conn.execute(
        "INSERT INTO blotters (
            type,
            reported_by,
            involved,
            incident_date,
            location,
            zone,
            status,
            narrative,
            action,
            witnesses,
            evidence,
            resolution,
            hearing_date
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        params![
            blotter.type_,
            blotter.reported_by,
            blotter.involved,
            blotter.incident_date,
            blotter.location,
            blotter.zone,
            blotter.status,
            blotter.narrative,
            blotter.action,
            blotter.witnesses,
            blotter.evidence,
            blotter.resolution,
            blotter.hearing_date
        ],
    )
}
pub fn insert_or_update_blotter(conn: &Connection, blotter: Blotter) -> rusqlite::Result<usize> {
    if let Some(id) = blotter.id {
        conn.execute(
            "UPDATE blotters SET
                type = ?1,
                reported_by = ?2,
                involved = ?3,
                incident_date = ?4,
                location = ?5,
                zone = ?6,
                status = ?7,
                narrative = ?8,
                action = ?9,
                witnesses = ?10,
                evidence = ?11,
                resolution = ?12,
                hearing_date = ?13
             WHERE id = ?14",
            params![
                blotter.type_,
                blotter.reported_by,
                blotter.involved,
                blotter.incident_date,
                blotter.location,
                blotter.zone,
                blotter.status,
                blotter.narrative,
                blotter.action,
                blotter.witnesses,
                blotter.evidence,
                blotter.resolution,
                blotter.hearing_date,
                id
            ],
        )
    } else {
        insert_blotter(conn, blotter)
    }
}

pub fn fetch_all_blotters(conn: &Connection) -> rusqlite::Result<Vec<Blotter>> {
    let mut stmt = conn.prepare(
        "SELECT id, type, reported_by, involved, incident_date, location, zone, status, narrative, action, witnesses, evidence, resolution, hearing_date FROM blotters",
    )?;

    let blotters = stmt
        .query_map([], |row| {
            Ok(Blotter {
                id: row.get(0)?,
                type_: row.get(1)?,
                reported_by: row.get(2)?,
                involved: row.get(3)?,
                incident_date: row.get(4)?,
                location: row.get(5)?,
                zone: row.get(6)?,
                status: row.get(7)?,
                narrative: row.get(8)?,
                action: row.get(9)?,
                witnesses: row.get(10)?,
                evidence: row.get(11)?,
                resolution: row.get(12)?,
                hearing_date: row.get(13)?,
            })
        })?
        .collect();

    blotters
}
