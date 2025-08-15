import { Resident } from "@/types/types";
import sanitize from "../sanitize";

export default function searchResident(term: string, data: Resident[]) {
  if (!term.trim()) return data;

  const sanitizedQuery = sanitize(term);
  const pattern = new RegExp(sanitizedQuery, "i");

  return data.filter((resident) => {
    // Collect all searchable fields dynamically
    const searchableFields = [
      resident.first_name,
      resident.middle_name,
      resident.last_name,
      resident.zone,
      resident.gender,
      resident.status,
      resident.civil_status,
      resident.household_number,
    ];

    // Construct full name for extra matching
    const fullName = `${resident.last_name ?? ""}, ${resident.first_name ?? ""} ${resident.middle_name ?? ""}`.trim();

    // Return true if any field matches or full name matches
    return searchableFields.some((field) => field && pattern.test(field)) || pattern.test(fullName);
  });
}