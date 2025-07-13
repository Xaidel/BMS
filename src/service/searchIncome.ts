import { Income } from "@/types/types";
import sanitize from "./sanitize";

export default function searchIncome(term: string, data: Income[]) {
  const sanitizedQuery = sanitize(term);
  const pattern = new RegExp(sanitizedQuery, "i");

  return data.filter((income) =>
    pattern.test(income.type) ||
    pattern.test(income.or.toString()) ||  // 🔧 fixed here
    pattern.test(income.receivedFrom)
  );
}
