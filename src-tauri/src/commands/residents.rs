use rusqlite::params;
use crate::{database::connection::establish_connection, models::resident::Resident};

#[tauri::command]
pub fn fetch_all_residents_command() -> Result<Vec<Resident>, String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(
        "SELECT id, first_name, middle_name, last_name, suffix, civil_status, gender, nationality,
           mobile_number, religion, occupation, average_monthly_income, date_of_birth,
           town_of_birth, province_of_birth, zone, barangay, town, province,
           household_number, role_in_household,
           father_first_name, father_middle_name, father_last_name, father_suffix,
            mother_first_name, mother_middle_name, mother_last_name, status, photo,
           is_registered_voter, is_pwd, is_senior, is_solo_parent
         FROM residents"
    ).map_err(|e| e.to_string())?;

    let resident_iter = stmt
        .query_map([], |row| {
            Ok(Resident {
                id: row.get(0)?,
                first_name: row.get(1)?,
                middle_name: row.get(2)?,
                last_name: row.get(3)?,
                suffix: row.get(4)?,
                civil_status: row.get(5)?,
                gender: row.get(6)?,
                nationality: row.get(7)?,
                mobile_number: row.get(8)?,
                religion: row.get(9)?,
                occupation: row.get(10)?,
                average_monthly_income: row.get(11)?,
                date_of_birth: row.get(12)?,
                town_of_birth: row.get(13)?,
                province_of_birth: row.get(14)?,
                zone: row.get(15)?,
                barangay: row.get(16)?,
                town: row.get(17)?,
                province: row.get(18)?,
                household_number: row.get(19)?,
                role_in_household: row.get(20)?,
                father_first_name: row.get(21)?,
                father_middle_name: row.get(22)?,
                father_last_name: row.get(23)?,
                father_suffix: row.get(24)?,
                mother_first_name: row.get(25)?,
                mother_middle_name: row.get(26)?,
                mother_last_name: row.get(27)?,
                status: row.get(28)?,
                photo: row.get(29)?,
                is_registered_voter: row.get(30)?,
                is_pwd: row.get(31)?,
                is_senior: row.get(32)?,
                is_solo_parent: row.get(33)?,
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
            first_name, middle_name, last_name, suffix, civil_status, gender, nationality,
            mobile_number, religion, occupation, average_monthly_income, date_of_birth,
            town_of_birth, province_of_birth, zone, barangay, town, province,
            household_number, role_in_household,
            father_first_name, father_middle_name, father_last_name, father_suffix,
             mother_first_name, mother_middle_name, mother_last_name, status, photo,
            is_registered_voter, is_pwd, is_senior, is_solo_parent
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18,
                  ?19, ?20, ?21, ?22, ?23, ?24, ?25, ?26, ?27, ?28, ?29, ?30, ?31, ?32, ?33)",
        params![
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
            resident.is_solo_parent
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
            first_name = ?1, middle_name = ?2, last_name = ?3, suffix = ?4, civil_status = ?5,
            gender = ?6, nationality = ?7, mobile_number = ?8, religion = ?9, occupation = ?10, average_monthly_income = ?11,
            date_of_birth = ?12, town_of_birth = ?13, province_of_birth = ?14, zone = ?15, barangay = ?16, town = ?17, province = ?18,
            household_number = ?19, role_in_household = ?20,
            father_first_name = ?21, father_middle_name = ?22, father_last_name = ?23, father_suffix = ?24,
            mother_first_name = ?25, mother_middle_name = ?26, mother_last_name = ?27,
            status = ?28, photo = ?29, is_registered_voter = ?30, is_pwd = ?31, is_senior = ?32, is_solo_parent = ?33
         WHERE id = ?34",
        params![
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
            resident.is_solo_parent,
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
