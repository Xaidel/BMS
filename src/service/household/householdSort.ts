import { Resident } from "@/types/types";

export function sortResidents(data: Resident[], term: string): Resident[] {
  switch (term) {
    case "Numerical":
      return sortByHouseholdNumber(data);
    case "AgeDesc":
      return sortByAgeDesc(data);
    case "NameAsc":
      return sortByNameAsc(data);
    // add more sorting criteria here as needed
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
    return dateA - dateB; // older first (earlier date)
  });
}

function sortByNameAsc(data: Resident[]): Resident[] {
  return [...data].sort((a, b) => {
    const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
    const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
}