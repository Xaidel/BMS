import { Resident } from "@/types/types";
import sanitize from "../sanitize";

export default function searchResident(term: string, data: Resident[]) {
  const sanitizedQuery = sanitize(term)
  const pattern = new RegExp(sanitizedQuery, "i")

  return data.filter((resident) => pattern.test(resident.full_name))
}
