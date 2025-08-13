import { Resident } from "@/types/types";
import sanitize from "../sanitize";

export default function searchResident(term: string, data: Resident[]): Resident[] {
  const sanitized = sanitize(term);
  const pattern = new RegExp(sanitized, "i");

  return data.filter(
    (resident) =>
      pattern.test(resident.first_name) ||
      pattern.test(resident.middle_name ?? "") ||
      pattern.test(resident.last_name) ||
      pattern.test(resident.full_name ?? "") ||
      pattern.test(resident.household_number.toString())
  );
}