export function searchHouseholds(households: any[], query: string) {
  if (!query) return households;
  const lowerQuery = query.toLowerCase();
  return households.filter(household =>
    Object.values(household).some(value =>
      String(value).toLowerCase().includes(lowerQuery)
    )
  );
}
