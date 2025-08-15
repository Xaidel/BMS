use rusqlite::params;
use serde::{Deserialize, Serialize};

use crate::{commands::residents::Resident, database::connection::establish_connection};

#[derive(Debug, Serialize, Deserialize)]
pub struct ResidentHead {
    pub id: Option<i32>,
    pub household_number: String,
    pub prefix: String,
    pub first_name: String,
    pub middle_name: Option<String>,
    pub last_name: String,
    pub suffix: Option<String>,
    pub zone: String,
    pub date_of_birth: String,
    pub status: String,
}

#[tauri::command]
pub fn fetch_household_heads_command() -> Result<Vec<ResidentHead>, String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(
        "SELECT id, household_number, prefix, first_name, middle_name, last_name, suffix, zone, date_of_birth, status
         FROM residents WHERE role_in_household = 'Head'"
    ).map_err(|e| e.to_string())?;

    let head_iter = stmt.query_map([], |row| {
        Ok(ResidentHead {
            id: row.get(0)?,
            household_number: row.get(1)?,
            prefix: row.get(2)?,
            first_name: row.get(3)?,
            middle_name: row.get(4)?,
            last_name: row.get(5)?,
            suffix: row.get(6)?,
            zone: row.get(7)?,
            date_of_birth: row.get(8)?,
            status: row.get(9)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut heads = Vec::new();
    for head in head_iter {
        heads.push(head.map_err(|e| e.to_string())?);
    }

    Ok(heads)
}

#[tauri::command]
pub fn fetch_residents_by_household_number(household_number: String) -> Result<Vec<Resident>, String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(
        "SELECT id, prefix, first_name, middle_name, last_name, suffix, civil_status, gender, nationality,
         mobile_number, religion, occupation, source_of_income, average_monthly_income, date_of_birth,
         town_of_birth, province_of_birth, zone, barangay, town, province,
         household_number, role_in_household,
         father_prefix, father_first_name, father_middle_name, father_last_name, father_suffix,
         mother_prefix, mother_first_name, mother_middle_name, mother_last_name, status, photo,
         is_registered_voter, is_pwd, is_senior
         FROM residents
         WHERE household_number = ?1"
    ).map_err(|e| e.to_string())?;

    let resident_iter = stmt
        .query_map(params![household_number], |row| {
            Ok(Resident {
                id: row.get(0)?,
                prefix: row.get(1)?,
                first_name: row.get(2)?,
                middle_name: row.get(3)?,
                last_name: row.get(4)?,
                suffix: row.get(5)?,
                civil_status: row.get(6)?,
                gender: row.get(7)?,
                nationality: row.get(8)?,
                mobile_number: row.get(9)?,
                religion: row.get(10)?,
                occupation: row.get(11)?,
                source_of_income: row.get(12)?,
                average_monthly_income: row.get(13)?,
                date_of_birth: row.get(14)?,
                town_of_birth: row.get(15)?,
                province_of_birth: row.get(16)?,
                zone: row.get(17)?,
                barangay: row.get(18)?,
                town: row.get(19)?,
                province: row.get(20)?,
                household_number: row.get(21)?,
                role_in_household: row.get(22)?,
                father_prefix: row.get(23)?,
                father_first_name: row.get(24)?,
                father_middle_name: row.get(25)?,
                father_last_name: row.get(26)?,
                father_suffix: row.get(27)?,
                mother_prefix: row.get(28)?,
                mother_first_name: row.get(29)?,
                mother_middle_name: row.get(30)?,
                mother_last_name: row.get(31)?,
                status: row.get(32)?,
                photo: row.get(33)?,
                is_registered_voter: row.get(34)?,
                is_pwd: row.get(35)?,
                is_senior: row.get(36)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut residents = Vec::new();
    for resident in resident_iter {
        residents.push(resident.map_err(|e| e.to_string())?);
    }

    Ok(residents)
}

#[tauri::command]
pub fn fetch_all_residents_with_income() -> Result<Vec<(String, i64)>, String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(
        "SELECT household_number, average_monthly_income FROM residents WHERE household_number IS NOT NULL"
    ).map_err(|e| e.to_string())?;

    let rows = stmt.query_map([], |row| {
        Ok((
            row.get::<_, Option<String>>(0)?.unwrap_or_default(),
            row.get::<_, i64>(1)?,
        ))
    }).map_err(|e| e.to_string())?;

    let mut incomes = Vec::new();
    for row in rows {
        incomes.push(row.map_err(|e| e.to_string())?);
    }

    Ok(incomes)
}

#[tauri::command]
pub fn fetch_residents_with_pwd() -> Result<Vec<i32>, String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT DISTINCT household_number 
         FROM residents 
         WHERE is_pwd = 1 
         AND household_number IS NOT NULL"
    ).map_err(|e| e.to_string())?;

    let rows = stmt.query_map([], |row| {
        Ok(row.get::<_, Option<i32>>(0)?.unwrap_or_default())
    }).map_err(|e| e.to_string())?;

    let mut household_numbers = Vec::new();
    for row in rows {
        household_numbers.push(row.map_err(|e| e.to_string())?);
    }
    Ok(household_numbers)
}

#[tauri::command]
pub fn fetch_residents_with_senior() -> Result<Vec<String>, String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT DISTINCT household_number 
         FROM residents 
         WHERE is_senior = 1 
         AND household_number IS NOT NULL"
    ).map_err(|e| e.to_string())?;

    let rows = stmt.query_map([], |row| {
        Ok(row.get::<_, Option<String>>(0)?.unwrap_or_default())
    }).map_err(|e| e.to_string())?;

    let mut household_numbers: Vec<String> = Vec::new();
    for row in rows {
        household_numbers.push(row.map_err(|e| e.to_string())?);
    }
    Ok(household_numbers)
}