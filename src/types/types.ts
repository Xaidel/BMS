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
  isRegisteredVoter: boolean
  isPWD: boolean
  isSenior: boolean
  full_name: string,
  civilStatus: string,
  status: "Moved Out" | "Active" | "Dead" | "Missing",
  birthday: Date,
  gender: string,
  zone: string,
}
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
