export type Event = {
  id: number;
  name: string,
  type_: string,
  status: "Upcoming" | "Finished" | "Ongoing" | "Cancelled",
  date: Date,
  venue: string,
  attendee: string,
  notes: string
}

export type Resident = {
  is_registered_voter: boolean;
  is_pwd: boolean;
  is_senior: boolean;
  prefix: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  full_name?: string; // can be generated later
  civil_status: string;
  gender: string;
  nationality: string;
  mobile_number: string;
  date_of_birth: Date;
  town_of_birth: string;
  province_of_birth: string;
  zone: string;
  barangay: string;
  town: string;
  province: string;
  father_prefix: string;
  father_first_name: string;
  father_middle_name: string;
  father_last_name: string;
  father_suffix: string;
  mother_prefix: string;
  mother_first_name: string;
  mother_middle_name: string;
  mother_last_name: string;
  status: "Moved Out" | "Active" | "Dead" | "Missing";
  photo?: any;
};

export type Household = {
  id?: number;
  household_number: number;
  type_: string;
  members: number;
  head: string;
  zone: string;
  date: Date;
  status: "Moved Out" | "Active";
};

export type Income = {
  id?: number;
  category: string,
  type_: string,
  amount: number,
  or_number: number,
  received_from: string,
  received_by: string,
  date: Date,
}

export type Expense = {
  id?: number;
  type_: string;
  category: string;
  amount: number;
  or_number: number;
  paid_to: string;
  paid_by: string;
  date: Date;
};

export type Certificate = {
  name: string;
  type_: string;
  or: string;
  date: Date;
  zone: string;
};

export type Blotter = {
  id?: number;
  type_: string;
  reported_by: string;
  involved: string;
  incident_date: Date; // <- must be Date, not string
  location: string;
  zone: string;
  status: string;
  narrative: string;
  action: string;
  witnesses: string;
  evidence: string;
  resolution: string;
  hearing_date: Date; // <- must be Date, not string
};

export type Settings = {
  id?: number;
  barangay: string;
  municipality: string;
  province: string;
  phone_number: string;
  email: string;
  logo?: string;
};
