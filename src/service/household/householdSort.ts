import { ResidentHead } from "@/types/types"; // Import ResidentHead type

export function sortResidents(data: ResidentHead[], term: string): ResidentHead[] {
  switch (term) {
    case "Numerical":
      return sortByHouseholdNumber(data);
    case "AgeDesc":
      return sortByAgeDesc(data);
    case "NameAsc":
      return sortByNameAsc(data);
    case "ZoneAsc":
      return sortByZoneAsc(data);
    default:
      return data;
  }
}

function sortByHouseholdNumber(data: ResidentHead[]): ResidentHead[] {
  return [...data].sort((a, b) => a.household_number - b.household_number);
}

function sortByAgeDesc(data: ResidentHead[]): ResidentHead[] {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.date_of_birth).getTime();
    const dateB = new Date(b.date_of_birth).getTime();
    return dateA - dateB; // older first
  });
}

function sortByNameAsc(data: ResidentHead[]): ResidentHead[] {
  return [...data].sort((a, b) => {
    const nameA = (a.full_name || "").toLowerCase();
    const nameB = (b.full_name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

function sortByZoneAsc(data: ResidentHead[]): ResidentHead[] {
  const zoneOrder = ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7", "Zone 8"];
  return [...data].sort((a, b) => {
    const zoneAIndex = zoneOrder.indexOf(a.zone || "");
    const zoneBIndex = zoneOrder.indexOf(b.zone || "");
    const adjustedZoneAIndex = zoneAIndex === -1 ? zoneOrder.length : zoneAIndex;
    const adjustedZoneBIndex = zoneBIndex === -1 ? zoneOrder.length : zoneBIndex;
    return adjustedZoneAIndex - adjustedZoneBIndex;
  });
}