use rusqlite::params;
use serde::{Deserialize, Serialize};

use crate::database::connection::establish_connection;

#[derive(Debug, Serialize, Deserialize)]
pub struct Resident {
    pub id: Option<i32>,
    pub prefix: String,
    pub first_name: String,
    pub middle_name: Option<String>,
    pub last_name: String,
    pub suffix: Option<String>,
    pub civil_status: String,
    pub gender: String,
    pub nationality: String,
    pub mobile_number: String,
    pub religion: String,
    pub occupation: String,
    pub source_of_income: String,
    pub average_monthly_income: i64,
    pub date_of_birth: String,
    pub town_of_birth: String,
    pub province_of_birth: String,
    pub zone: String,
    pub barangay: String,
    pub town: String,
    pub province: String,
    pub household_number: String,      
    pub role_in_household: String,            
    pub father_prefix: String,
    pub father_first_name: String,
    pub father_middle_name: String,
    pub father_last_name: String,
    pub father_suffix: String,
    pub mother_first_name: String,
    pub mother_middle_name: String,
    pub mother_last_name: String,
    pub status: String,
    pub photo: Option<String>,
    pub is_registered_voter: bool,
    pub is_pwd: bool,
    pub is_senior: bool,
}

#[tauri::command]
pub fn fetch_all_residents_command() -> Result<Vec<Resident>, String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(
        "SELECT id, prefix, first_name, middle_name, last_name, suffix, civil_status, gender, nationality,
           mobile_number, religion, occupation, source_of_income, average_monthly_income, date_of_birth,
           town_of_birth, province_of_birth, zone, barangay, town, province,
           household_number, role_in_household,
           father_prefix, father_first_name, father_middle_name, father_last_name, father_suffix,
            mother_first_name, mother_middle_name, mother_last_name, status, photo,
           is_registered_voter, is_pwd, is_senior
         FROM residents"
    ).map_err(|e| e.to_string())?;

    let resident_iter = stmt
        .query_map([], |row| {
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
                mother_first_name: row.get(28)?,
                mother_middle_name: row.get(29)?,
                mother_last_name: row.get(30)?,
                status: row.get(31)?,
                photo: row.get(32)?,
                is_registered_voter: row.get(33)?,
                is_pwd: row.get(34)?,
                is_senior: row.get(35)?,
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
pub fn insert_resident_command(resident: Resident) -> Result<(), String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO residents (
            prefix, first_name, middle_name, last_name, suffix, civil_status, gender, nationality,
            mobile_number, religion, occupation, source_of_income, average_monthly_income, date_of_birth,
            town_of_birth, province_of_birth, zone, barangay, town, province,
            household_number, role_in_household,
            father_prefix, father_first_name, father_middle_name, father_last_name, father_suffix,
             mother_first_name, mother_middle_name, mother_last_name, status, photo,
            is_registered_voter, is_pwd, is_senior
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20,
                  ?21, ?22,
                  ?23, ?24, ?25, ?26, ?27, ?28, ?29, ?30, ?31, ?32, ?33, ?34, ?35)",
        params![
            resident.prefix,
            resident.first_name,
            resident.middle_name,
            resident.last_name,
            resident.suffix,
            resident.civil_status,
            resident.gender,
            resident.nationality,
            resident.mobile_number,
            resident.religion,
            resident.occupation,
            resident.source_of_income,
            resident.average_monthly_income,
            resident.date_of_birth,
            resident.town_of_birth,
            resident.province_of_birth,
            resident.zone,
            resident.barangay,
            resident.town,
            resident.province,
            resident.household_number,
            resident.role_in_household,
            resident.father_prefix,
            resident.father_first_name,
            resident.father_middle_name,
            resident.father_last_name,
            resident.father_suffix,
            resident.mother_first_name,
            resident.mother_middle_name,
            resident.mother_last_name,
            resident.status,
            resident.photo,
            resident.is_registered_voter,
            resident.is_pwd,
            resident.is_senior,
        ],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn update_resident_command(resident: Resident) -> Result<(), String> {
    println!("Attempting to update resident: {:?}", resident.id);

    let conn = establish_connection().map_err(|e| e.to_string())?;

    let rows_updated = conn.execute(
        "UPDATE residents SET
            prefix = ?1, first_name = ?2, middle_name = ?3, last_name = ?4, suffix = ?5, civil_status = ?6,
            gender = ?7, nationality = ?8, mobile_number = ?9, religion = ?10, occupation = ?11, source_of_income = ?12, average_monthly_income = ?13,
            date_of_birth = ?14, town_of_birth = ?15, province_of_birth = ?16, zone = ?17, barangay = ?18, town = ?19, province = ?20,
            household_number = ?21, role_in_household = ?22,
            father_prefix = ?23, father_first_name = ?24, father_middle_name = ?25, father_last_name = ?26, father_suffix = ?27,
            mother_first_name = ?28, mother_middle_name = ?29, mother_last_name = ?30,
            status = ?31, photo = ?32, is_registered_voter = ?33, is_pwd = ?34, is_senior = ?35
         WHERE id = ?36",
        params![
            resident.prefix,
            resident.first_name,
            resident.middle_name,
            resident.last_name,
            resident.suffix,
            resident.civil_status,
            resident.gender,
            resident.nationality,
            resident.mobile_number,
            resident.religion,
            resident.occupation,
            resident.source_of_income,
            resident.average_monthly_income,
            resident.date_of_birth,
            resident.town_of_birth,
            resident.province_of_birth,
            resident.zone,
            resident.barangay,
            resident.town,
            resident.province,
            resident.household_number,
            resident.role_in_household,
            resident.father_prefix,
            resident.father_first_name,
            resident.father_middle_name,
            resident.father_last_name,
            resident.father_suffix,
            resident.mother_first_name,
            resident.mother_middle_name,
            resident.mother_last_name,
            resident.status,
            resident.photo,
            resident.is_registered_voter,
            resident.is_pwd,
            resident.is_senior,
            resident.id
        ],
    ).map_err(|e| e.to_string())?;

    println!("Rows updated: {}", rows_updated);

    Ok(())
}

#[tauri::command]
pub fn save_resident_command(resident: Resident) -> Result<(), String> {
    if resident.id.is_some() {
        update_resident_command(resident)
    } else {
        insert_resident_command(resident)
    }
}

#[tauri::command]
pub fn delete_resident_command(id: i32) -> Result<(), String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM residents WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}


