use rusqlite::{params, Connection};
use crate::database::connection::establish_connection;
use crate::models::blotter::Blotter;

pub fn delete_blotter(conn: &Connection, id: i32) -> rusqlite::Result<()> {
    conn.execute("DELETE FROM blotters WHERE id = ?", params![id])?;
    Ok(())
}


pub fn insert_blotter(conn: &Connection, blotter: Blotter) -> rusqlite::Result<usize> {
    conn.execute(
        "INSERT INTO blotters (
            type_,
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
                type_ = ?1,
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
        "SELECT id, type_, reported_by, involved, incident_date, location, zone, status, narrative, action, witnesses, evidence, resolution, hearing_date FROM blotters",
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

#[tauri::command]
pub fn delete_blotter_command(id: i32) -> Result<(), String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    super::blotters::delete_blotter(&conn, id).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn save_blotter(data: Blotter) -> Result<(), String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    insert_or_update_blotter(&conn, data).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn fetch_all_blotters_command() -> Result<Vec<Blotter>, String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    fetch_all_blotters(&conn).map_err(|e| e.to_string())
}
