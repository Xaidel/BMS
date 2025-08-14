import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/datatable";
import Searchbar from "@/components/ui/searchbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import SummaryCardHousehold from "@/components/summary-card/household";
import { HomeIcon, UserCheck, Users } from "lucide-react";
import { HouseholdPDF } from "@/components/pdf/householdpdf";
import { pdf } from "@react-pdf/renderer";
import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import Filter from "@/components/ui/filter";
import { sortResidents } from "@/service/household/householdSort";
import { Resident } from "@/types/types";
import ViewHouseholdModal from "@/features/households/viewHouseholdModal";



export default function Households() {
  const [householdIncomeMap, setHouseholdIncomeMap] = useState<
    Map<number, number>
  >(new Map());
  const columns = useMemo<ColumnDef<Resident>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="flex items-center justify-center"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="flex items-center justify-center"
          />
        ),
      },
      {
        header: "Household Number",
        accessorKey: "household_number",
      },
      {
        header: "Head of Household",
        cell: ({ row }) => {
          const r = row.original as Resident;
          const fullName = [
            r.last_name ? r.last_name + "," : "",
            r.first_name,
            r.middle_name,
            r.suffix,
          ]
            .filter(Boolean)
            .join(" ");
          return <div>{fullName}</div>;
        },
      },
      {
        header: "Zone",
        accessorKey: "zone",
      },
      {
        header: "Total Household Income",
        cell: ({ row }) => {
          const income =
            householdIncomeMap.get(row.original.household_number) ?? 0;
          return `₱${income.toLocaleString()}`;
        },
      },
      {
        header: "Total Members",
        accessorKey: "members", // can be dummy key
        cell: ({ row }) => {
          return (
            <div>
              {householdMembersMap.get(row.original.household_number) ?? 0}
            </div>
          );
        },
      },
    ],
    [householdIncomeMap]
  );

  const [householdPwdMap, setHouseholdPwdMap] = useState<Set<number>>(
    new Set()
  );
  const [householdSeniorMap, setHouseholdSeniorMap] = useState<Set<number>>(
    new Set()
  );
  const [householdMembersMap, setHouseholdMembersMap] = useState<
    Map<number, number>
  >(new Map());
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState(
    searchParams.get("sort") ?? "All"
  );
  const [data, setData] = useState<Resident[]>([]);
  const [selectedHousehold, setSelectedHousehold] = useState<{
    household_number: number;
    full_name: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSortChange = (sortValue: string) => {
    searchParams.set("sort", sortValue);
    setSearchParams(searchParams);
    setFilterValue(sortValue);
  };


  const filteredData = useMemo(() => {
    let sorted = [...data];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      sorted = sorted.filter((item) => {
        const firstName = item.first_name ?? "";
        const middleName = item.middle_name ?? "";
        const lastName = item.last_name ?? "";
        const fullName = [lastName, firstName, middleName].filter(Boolean).join(" ").toLowerCase();
        const householdNumber = item.household_number?.toString() ?? "";
        const zone = item.zone?.toLowerCase() ?? "";

        return (
          fullName.includes(query) ||
          firstName.toLowerCase().includes(query) ||
          middleName.toLowerCase().includes(query) ||
          lastName.toLowerCase().includes(query) ||
          householdNumber.includes(query) ||
          zone.includes(query)
        );
      });
    }

    return sortResidents(sorted, filterValue);
  }, [data, searchQuery, filterValue]);

  useEffect(() => {
    if (!data || data.length === 0) return;
    const fetchMembersAndCalcIncome = async () => {
      const updatedIncomeMap = new Map(householdIncomeMap);
      const updatedMembersMap = new Map<number, number>();

      for (const household of data) {
        try {
          const members: { average_monthly_income: number | null }[] =
            await invoke("fetch_residents_by_household_number", {
              householdNumber: household.household_number,
            });
          const totalIncome = members.reduce(
            (acc, m) => acc + (Number(m.average_monthly_income) || 0),
            0
          );
          updatedIncomeMap.set(household.household_number, totalIncome);
          updatedMembersMap.set(household.household_number, members.length);
        } catch (error) {
          console.error(
            `Failed to fetch members for household ${household.household_number}:`,
            error
          );
          updatedMembersMap.set(household.household_number, 0);
        }
      }
      setHouseholdIncomeMap(updatedIncomeMap);
      setHouseholdMembersMap(updatedMembersMap);
    };
    fetchMembersAndCalcIncome();
  }, [data]);

  // Compute counts separately
  const pwdCount = useMemo(() => {
    if (!data.length || !householdPwdMap.size) return 0;
    return data.filter((household) =>
      householdPwdMap.has(household.household_number)
    ).length;
  }, [data, householdPwdMap]);

  const seniorCount = useMemo(() => {
    if (!data.length || !householdSeniorMap.size) return 0;
    return data.filter((household) =>
      householdSeniorMap.has(household.household_number)
    ).length;
  }, [data, householdSeniorMap]);

  const fetchHouseholdHeads = () => {
    invoke<Resident[]>("fetch_household_heads_command")
      .then((fetched) => {
        setData(fetched);
      })
      .catch((err) => {
        console.error("Failed to fetch household heads:", err);
        toast.error("Failed to fetch household heads");
      });
  };

  useEffect(() => {
    fetchHouseholdHeads();
  }, []);

  const LOW_INCOME_THRESHOLD = 20000;

  useEffect(() => {
    invoke("fetch_all_residents_with_income")
      .then(
        (
          residents: {
            household_number: number;
            average_monthly_income: number | null;
          }[]
        ) => {
          const incomeMap = new Map<number, number>();

          residents.forEach(({ household_number, average_monthly_income }) => {
            // Ensure valid numeric income
            const validIncome = Number(average_monthly_income) || 0;
            const current = incomeMap.get(household_number) ?? 0;
            incomeMap.set(household_number, current + validIncome);
          });

          setHouseholdIncomeMap(incomeMap);
        }
      )
      .catch((err) => {
        console.error("Failed to fetch residents income data:", err);
      });
  }, []);

  // New useEffect: fetch members for each household in data and calculate income
  useEffect(() => {
    if (!data || data.length === 0) return;
    // For each household, fetch members, sum their income, and update householdIncomeMap if low income
    const fetchMembersAndCalcIncome = async () => {
      const updatedMap = new Map(householdIncomeMap); // Start from previous values
      for (const household of data) {
        try {
          const members: { average_monthly_income: number | null }[] =
            await invoke("fetch_residents_by_household_number", {
              householdNumber: household.household_number,
            });
          const totalIncome = members.reduce(
            (acc, m) => acc + (Number(m.average_monthly_income) || 0),
            0
          );
          // If total income is less than threshold, update the map
          if (totalIncome < LOW_INCOME_THRESHOLD) {
            updatedMap.set(household.household_number, totalIncome);
          } else {
            updatedMap.set(household.household_number, totalIncome);
          }
        } catch (error) {
          console.error(
            `Failed to fetch members for household ${household.household_number}:`,
            error
          );
        }
      }
      setHouseholdIncomeMap(updatedMap);
    };
    fetchMembersAndCalcIncome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const householdIncome = useMemo(() => {
    // Find all households with low income (active)
    const lowIncomeHouseholds = data.filter((household) => {
      const totalIncome =
        householdIncomeMap.get(household.household_number) ?? 0;
      return totalIncome < LOW_INCOME_THRESHOLD;
    });
    let count = lowIncomeHouseholds.length;

    if (selectedHousehold) {
      const selectedHhNum = selectedHousehold.household_number;
      // Only check if not already included in the filtered list
      const alreadyCounted = lowIncomeHouseholds.some(
        (hh) => hh.household_number === selectedHhNum
      );
      if (!alreadyCounted) {
        // Compute total income for selected household
        const selectedTotalIncome = householdIncomeMap.get(selectedHhNum) ?? 0;
        if (selectedTotalIncome < LOW_INCOME_THRESHOLD) {
          count += 1;
        }
      }
    }
    return count;
  }, [data, householdIncomeMap, selectedHousehold]);

  useEffect(() => {
    invoke<number[]>("fetch_residents_with_pwd")
      .then((households) => {
        setHouseholdPwdMap(new Set(households));
      })
      .catch((err) => {
        console.error("Failed to fetch households with PWDs:", err);
      });
  }, []);

  useEffect(() => {
    invoke<number[]>("fetch_residents_with_senior")
      .then((households) => {
        setHouseholdSeniorMap(new Set(households));
      })
      .catch((err) => {
        console.error("Failed to fetch households with seniors:", err);
      });
  }, []);

  const total = data.length;

  // Handler to receive totalIncome from ViewHouseholdModal
  const onTotalIncomeCalculated = (income: number) => {
    console.log("Household income calculated in modal:", income);
  };

  const adjustedHouseholdIncome = householdIncome;

  const filters = [
    "All",
    "Numerical",
    "AgeDesc",
    "NameAsc",
  ];

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCardHousehold
          title="Total Households"
          value={total}
          icon={<Users size={50} />}
          onClick={async () => {
            const blob = await pdf(
              <HouseholdPDF
                filter="All Households"
                households={data.map((hh) => ({
                  ...hh,
                  members: householdMembersMap.get(hh.household_number) ?? 0,
                  low_income:
                    (householdIncomeMap.get(hh.household_number) ?? 0) <
                    LOW_INCOME_THRESHOLD,
                  has_senior: householdSeniorMap.has(hh.household_number),
                  has_pwd: householdPwdMap.has(hh.household_number),
                }))}
              />
            ).toBlob();
            const buffer = await blob.arrayBuffer();
            const contents = new Uint8Array(buffer);
            try {
              await writeFile("AllHouseholds.pdf", contents, {
                baseDir: BaseDirectory.Document,
              });
              toast.success("All Households PDF downloaded", {
                description: "Saved in Documents folder",
              });
            } catch (e) {
              toast.error("Error", {
                description: "Failed to save the file",
              });
            }
          }}
        />
        <SummaryCardHousehold
          title="Households with Less than 20,000 Income"
          value={adjustedHouseholdIncome}
          icon={<UserCheck size={50} />}
          onClick={async () => {
            const filtered = data.filter((household) => {
              const totalIncome =
                householdIncomeMap.get(household.household_number) ?? 0;
              return totalIncome < LOW_INCOME_THRESHOLD;
            });

            const blob = await pdf(
              <HouseholdPDF
                filter="Low Income Households"
                households={filtered.map((hh) => ({
                  ...hh,
                  members: householdMembersMap.get(hh.household_number) ?? 0,
                  low_income: true,
                  has_senior: householdSeniorMap.has(hh.household_number),
                  has_pwd: householdPwdMap.has(hh.household_number),
                }))}
              />
            ).toBlob();
            const buffer = await blob.arrayBuffer();
            const contents = new Uint8Array(buffer);

            try {
              await writeFile("LowIncomeHouseholds.pdf", contents, {
                baseDir: BaseDirectory.Document,
              });
              toast.success("Low Income Households PDF saved", {
                description: "Saved in Documents folder",
              });
            } catch (e) {
              toast.error("Error", {
                description: "Failed to save Low Income Households PDF",
              });
            }
          }}
        />
        <SummaryCardHousehold
          title="Households with PWDs"
          value={pwdCount}
          icon={<HomeIcon size={50} />}
          onClick={async () => {
            const filtered = data.filter((household) =>
              householdPwdMap.has(household.household_number)
            );

            const blob = await pdf(
              <HouseholdPDF
                filter="PWD Households"
                households={filtered.map((hh) => ({
                  ...hh,
                  members: householdMembersMap.get(hh.household_number) ?? 0,
                  low_income:
                    (householdIncomeMap.get(hh.household_number) ?? 0) <
                    LOW_INCOME_THRESHOLD,
                  has_senior: householdSeniorMap.has(hh.household_number),
                  has_pwd: householdPwdMap.has(hh.household_number),
                }))}
              />
            ).toBlob();
            const buffer = await blob.arrayBuffer();
            const contents = new Uint8Array(buffer);

            try {
              await writeFile("PWDHouseholds.pdf", contents, {
                baseDir: BaseDirectory.Document,
              });
              toast.success("PWD Households PDF saved", {
                description: "Saved in Documents folder",
              });
            } catch (e) {
              toast.error("Error", {
                description: "Failed to save PWD Households PDF",
              });
            }
          }}
        />
        <SummaryCardHousehold
          title="Households with Senior Citizens"
          value={seniorCount}
          icon={<HomeIcon size={50} />}
          onClick={async () => {
            const filtered = data.filter((household) =>
              householdSeniorMap.has(household.household_number)
            );

            const blob = await pdf(
              <HouseholdPDF
                filter="Senior Households"
                households={filtered.map((hh) => ({
                  ...hh,
                  members: householdMembersMap.get(hh.household_number) ?? 0,
                  low_income:
                    (householdIncomeMap.get(hh.household_number) ?? 0) <
                    LOW_INCOME_THRESHOLD,
                  has_senior: true,
                  has_pwd: true,
                }))}
              />
            ).toBlob();
            const buffer = await blob.arrayBuffer();
            const contents = new Uint8Array(buffer);

            try {
              await writeFile("SeniorHouseholds.pdf", contents, {
                baseDir: BaseDirectory.Document,
              });
              toast.success("Senior Households PDF saved", {
                description: "Saved in Documents folder",
              });
            } catch (e) {
              toast.error("Error", {
                description: "Failed to save Senior Households PDF",
              });
            }
          }}
        />
      </div>
      <div className="flex gap-5 w-full items-center justify-center mb-5">
        <Searchbar
          onChange={(value) => setSearchQuery(value)}
          placeholder="Search Household Head"
          classname="flex flex-5"
        />
        <Filter
          onChange={handleSortChange}
          filters={filters}
          initial="All"
          classname="flex-1"
        />
      </div>
      <DataTable<Resident>
        classname="py-5"
        height="43.3rem"
        data={filteredData}
        columns={[
          ...columns,
          {
            id: "view",
            header: "",
            cell: ({ row }) => (
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSelectedHousehold({
                      household_number: row.original.household_number,
                      full_name: row.original.full_name,
                    });
                    setIsModalOpen(true);
                  }}
                >
                  View More
                </Button>
              </div>
            ),
          },
        ]}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black">Household Details</DialogTitle>
            <DialogDescription className="text-black">
              This shows the head of the household and all members.
            </DialogDescription>
          </DialogHeader>
          {selectedHousehold && (
            <ViewHouseholdModal
              household_number={selectedHousehold.household_number}
              head_name={selectedHousehold.full_name}
              onClose={() => setIsModalOpen(false)}
              onTotalIncomeCalculated={onTotalIncomeCalculated}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
