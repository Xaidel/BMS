import { Resident } from "@/types/types"; // Import Resident type

export function sortResidents(data: Resident[], term: string, householdIncomeMap?: Map<number, number>): Resident[] {
  switch (term) {
  case "Numerical":
    return sortByHouseholdNumber(data);
  case "AgeDesc":
    return sortByAgeDesc(data);
  case "NameAsc":
    return sortByNameAsc(data);
  default:
    return data;
}
}

function sortByHouseholdNumber(data: Resident[]): Resident[] {
  return [...data].sort((a, b) => a.household_number - b.household_number);
}

function sortByAgeDesc(data: Resident[]): Resident[] {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.date_of_birth).getTime();
    const dateB = new Date(b.date_of_birth).getTime();
    return dateA - dateB; // older first
  });
}

function sortByNameAsc(data: Resident[]): Resident[] {
  return [...data].sort((a, b) => {
    const nameA = (a.full_name || "").toLowerCase();
    const nameB = (b.full_name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });
}
