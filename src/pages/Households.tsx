import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/datatable";
import Filter from "@/components/ui/filter";
import Searchbar from "@/components/ui/searchbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import ViewHouseholdModal from "@/features/households/viewhouseholdmodal";
import SummaryCardHousehold from "@/components/summary-card/household";
import { Home, HomeIcon, UserCheck, Users } from "lucide-react";
import { HouseholdPDF } from "@/components/pdf/householdpdf";
import { pdf } from "@react-pdf/renderer";
import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";
type ResidentHead = {
  id: number;
  household_number: number;
  full_name: string;
  zone: string;
  date_of_birth: string;
};

const columns: ColumnDef<ResidentHead>[] = [
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
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    accessorKey: "full_name",
  },
  {
    header: "Zone",
    accessorKey: "zone",
  },
  {
    header: "Date of Birth",
    accessorKey: "date_of_birth",
    cell: ({ row }) => {
      return (
        <div>
          {format(new Date(row.original.date_of_birth), "MMMM d, yyyy")}
        </div>
      );
    },
  },
];

export default function Households() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState(
    searchParams.get("sort") ?? "All"
  );
  const [data, setData] = useState<ResidentHead[]>([]);
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
      sorted = sorted.filter(
        (item) =>
          item.full_name.toLowerCase().includes(query) ||
          item.household_number.toString().includes(query)
      );
    }

    return sorted;
  }, [filterValue, searchQuery, data]);

  const fetchHouseholdHeads = () => {
    invoke<ResidentHead[]>("fetch_household_heads_command")
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
  const [householdIncomeMap, setHouseholdIncomeMap] = useState<
    Map<number, number>
  >(new Map());

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

  const householdIncome = useMemo(() => {
    // Find all households with low income (active)
    const lowIncomeHouseholds = data.filter((household) => {
      const totalIncome =
        householdIncomeMap.get(household.household_number) ?? 0;
      // console.log(
      //   `Household ${household.household_number} income: ${totalIncome}, status: ${household.status}`
      // );
      return totalIncome < LOW_INCOME_THRESHOLD;
    });
    let count = lowIncomeHouseholds.length;

    // Also count selectedHousehold from ViewHouseholdModal if its total income is less than threshold,
    // and it is not already counted in the above filter.
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

  const [householdPwdSeniorMap, setHouseholdPwdSeniorMap] = useState<
    Set<number>
  >(new Set());

  useEffect(() => {
    invoke("fetch_residents_with_pwd_and_senior")
      .then((residents: { household_number: number }[]) => {
        const setHouseholds = new Set<number>();
        residents.forEach(({ household_number }) => {
          setHouseholds.add(household_number);
        });
        setHouseholdPwdSeniorMap(setHouseholds);
      })
      .catch((err) => {
        console.error("Failed to fetch residents with PWDs and Seniors:", err);
      });
  }, []);

  const householdPwdSenior = useMemo(() => {
    return data.filter((household) =>
      householdPwdSeniorMap.has(household.household_number)
    ).length;
  }, [data, householdPwdSeniorMap]);

  const total = data.length;

  // New state to track additional count from modal
  const [modalLowIncomeCount, setModalLowIncomeCount] = useState(0);

  // Handler to receive totalIncome from ViewHouseholdModal
  const onTotalIncomeCalculated = (totalIncome: number) => {
    if (selectedHousehold) {
      const selectedHhNum = selectedHousehold.household_number;
      const alreadyCounted = data.some(
        (hh) =>
          hh.household_number === selectedHhNum &&
          householdIncomeMap.get(selectedHhNum)! < LOW_INCOME_THRESHOLD
      );
      if (!alreadyCounted && totalIncome < LOW_INCOME_THRESHOLD) {
        setModalLowIncomeCount(1);
      } else {
        setModalLowIncomeCount(0);
      }
    } else {
      setModalLowIncomeCount(0);
    }
  };

  const adjustedHouseholdIncome = useMemo(() => {
    if (!selectedHousehold) return householdIncome;

    const selectedHhNum = selectedHousehold.household_number;
    const alreadyCounted = data.some(
      (hh) =>
        hh.household_number === selectedHhNum &&
        (householdIncomeMap.get(selectedHhNum) ?? 0) < LOW_INCOME_THRESHOLD
    );

    return alreadyCounted
      ? householdIncome
      : householdIncome + (modalLowIncomeCount > 0 ? 1 : 0);
  }, [
    householdIncome,
    modalLowIncomeCount,
    selectedHousehold,
    data,
    householdIncomeMap,
  ]);

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCardHousehold
          title="Total Households"
          value={total}
          icon={<Users size={50} />}
          onClick={async () => {
            const blob = await pdf(
              <HouseholdPDF filter="All Households" households={data} />
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
                households={filtered}
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
          title="Households with PWDs and Senior Citizens"
          value={householdPwdSenior}
          icon={<HomeIcon size={50} />}
          // onClick={async () => {
          //   const filtered = data.filter((d) => d.type_ === "householdPwdSenior");
          //   const blob = await pdf(
          //     <HouseholdPDF filter="Renter Households" households={filtered} />
          //   ).toBlob();
          //   const buffer = await blob.arrayBuffer();
          //   const contents = new Uint8Array(buffer);
          //   try {
          //     await writeFile("RenterHouseholds.pdf", contents, {
          //       baseDir: BaseDirectory.Document,
          //     });
          //     toast.success("Renter Households PDF saved", {
          //       description: "Saved in Documents folder",
          //     });
          //   } catch (e) {
          //     toast.error("Error", {
          //       description: "Failed to save Renter Households PDF",
          //     });
          //   }
          // }}
        />
      </div>
      <div className="flex gap-5 w-full items-center justify-center mb-5">
        <Searchbar
          onChange={(value) => setSearchQuery(value)}
          placeholder="Search Household Head"
          classname="flex flex-5"
        />
        {/* <Filter
          onChange={handleSortChange}
          filters={filters}
          initial="All"
          classname="flex-1"
        /> */}
      </div>
      <DataTable<ResidentHead>
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
