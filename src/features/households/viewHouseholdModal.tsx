import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type Props = {
  household_number: number;
  head_name: string;
  onClose: () => void;
  onTotalIncomeCalculated: (totalIncome: number) => void;
};

type Resident = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  role_in_household: string;
  date_of_birth: string;
  average_monthly_income: number;
};

export default function ViewHouseholdModal({ household_number, head_name, onClose, onTotalIncomeCalculated }: Props) {
  const [members, setMembers] = useState<Resident[]>([]);

  useEffect(() => {
    if (household_number) {
      invoke<Resident[]>("fetch_residents_by_household_number", { householdNumber: household_number })
        .then(residents => {
          // Sort by birthdate (oldest first)
          const sortedResidents = [...residents].sort((a, b) => new Date(a.date_of_birth).getTime() - new Date(b.date_of_birth).getTime());
          setMembers(sortedResidents);
        })
        .catch(err => console.error("Failed to fetch household members:", err));
    }
  }, [household_number]);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate total household income
  const totalIncome = members.reduce((sum, m) => sum + (m.average_monthly_income || 0), 0);

  // Notify parent about total income, only if below threshold
  useEffect(() => {
    const LOW_INCOME_THRESHOLD = 20000;
    if (totalIncome < LOW_INCOME_THRESHOLD) {
      onTotalIncomeCalculated(totalIncome);
    } else {
      onTotalIncomeCalculated(0);
    }
  }, [totalIncome, onTotalIncomeCalculated]);

  // Count members
  const memberCount = members.length;

  return (
    <div>
      <h3 style={{ color: "black" }}>Household Members of {head_name}</h3>
      <p style={{ color: "black" }}>
        Total Members: {memberCount}
      </p>
      <p style={{ color: "black" }}>
        Total Household Income: ₱{totalIncome.toLocaleString()}
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ color: "black", textAlign: "left", padding: "8px" }}>Name</th>
            <th style={{ color: "black", textAlign: "left", padding: "8px" }}>Age</th>
            <th style={{ color: "black", textAlign: "left", padding: "8px" }}>Income</th>
            <th style={{ color: "black", textAlign: "left", padding: "8px" }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td style={{ color: "black", padding: "8px" }}>
                {m.last_name}, {m.first_name} {m.middle_name}
              </td>
              <td style={{ color: "black", padding: "8px" }}>
                {calculateAge(m.date_of_birth)}
              </td>
              <td style={{ color: "black", padding: "8px" }}>
                ₱{m.average_monthly_income.toLocaleString()}
              </td>
              <td style={{ color: "black", padding: "8px" }}>
                {m.role_in_household}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button onClick={onClose} style={{ color: "black" }}>Close</button>
      </div>
    </div>
  );
}