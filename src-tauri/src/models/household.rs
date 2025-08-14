#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
pub struct ResidentHead {
    pub id: Option<i32>,
    pub household_number: Option<i32>,
    pub full_name: String, // or split into last_name, first_name, middle_name
    pub zone: String,
    pub date_of_birth: String,
    pub status: String,
    pub is_pwd: bool,
    pub is_senior: bool,
}