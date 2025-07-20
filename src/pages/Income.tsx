import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/datatable";
import Filter from "@/components/ui/filter";
import Searchbar from "@/components/ui/searchbar";
import AddIncomeModal from "@/features/income/addIncomeModal";
import DeleteIncomeModal from "@/features/income/deleteIncomeModal";
import ViewIncomeModal from "@/features/income/viewIncomeModal";
import { sort } from "@/service/incomeSort";
import type { Income } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Shirt, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DollarSign,
  Banknote,
  PiggyBank,
  Gift,
  Landmark,
  Coins,
  Wallet,
  Layers,
} from "lucide-react"; // or custom icons
import SummaryCardIncome from "@/components/ui/summary-card/income";

const filters = [
  "All Income",
  "Numerical",
  "Date Issued",
  "This Month",
  "This Week",
];

const columns: ColumnDef<Income>[] = [
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
  { header: "Type", accessorKey: "type" },
  { header: "Amount", accessorKey: "amount" },
  { header: "Received From", accessorKey: "receivedFrom" },
  { header: "Received By", accessorKey: "receivedBy" },
  {
    header: "Date Issued",
    accessorKey: "date",
    cell: ({ row }) => <div>{format(row.original.date, "MMMM do, yyyy")}</div>,
  },
];

const data: Income[] = [
  {
    type: "Business Permit",
    amount: 150,
    or: 123456,
    receivedFrom: "Treasurer Office",
    receivedBy: "John Doe",
    date: new Date("July 1, 2025"),
  },
  {
    type: "Business Permit",
    amount: 150,
    or: 123456,
    receivedFrom: "Treasurer Office",
    receivedBy: "John Doe",
    date: new Date(),
  },
  {
    type: "Business Permit",
    amount: 150,
    or: 123456,
    receivedFrom: "Treasurer Office",
    receivedBy: "John Doe",
    date: new Date("June 29, 2023"),
  },
  {
    type: "Business Permit",
    amount: 1500,
    or: 123456,
    receivedFrom: "Treasurer Office",
    receivedBy: "John Doe",
    date: new Date("June 29, 2023"),
  },
  {
    type: "Business Permit",
    amount: 1500,
    or: 123456,
    receivedFrom: "Treasurer Office",
    receivedBy: "John Doe",
    date: new Date("June 29, 2023"),
  },
  {
    type: "Business Permit",
    amount: 1500,
    or: 123456,
    receivedFrom: "Treasurer Office",
    receivedBy: "John Doe",
    date: new Date("June 29, 2023"),
  },
  {
    type: "Business Permit",
    amount: 1500,
    or: 123456,
    receivedFrom: "Treasurer Office",
    receivedBy: "John Doe",
    date: new Date("June 29, 2023"),
  },
];

export default function Income() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSortChange = (sortValue: string) => {
    searchParams.set("sort", sortValue);
    setSearchParams(searchParams);
  };

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  const filteredData = useMemo(() => {
    const sortValue = searchParams.get("sort") ?? "All Income";
    let sorted = sort(data, sortValue);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sorted = sorted.filter(
        (item) =>
          item.type.toLowerCase().includes(query) ||
          item.receivedFrom.toLowerCase().includes(query)
      );
    }

    return sorted;
  }, [searchParams, searchQuery]);

  return (
    <>
      {/* Summary Cards */}
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCardIncome
          title="Total Revenue"
          value={2050}
          icon={<DollarSign size={50} />}
        />
        <SummaryCardIncome
          title="Local Revenue"
          value={750}
          icon={<Banknote size={50} />}
        />
        <SummaryCardIncome
          title="Tax Revenue"
          value={300}
          icon={<PiggyBank size={50} />}
        />
        <SummaryCardIncome
          title="Government Grants"
          value={500}
          icon={<Gift size={50} />}
        />
        <SummaryCardIncome
          title="Service Revenue"
          value={100}
          icon={<Coins size={50} />}
        />
        <SummaryCardIncome
          title="Rental Income"
          value={100}
          icon={<Wallet size={50} />}
        />
        <SummaryCardIncome
          title="Government Funds (IRA)"
          value={100}
          icon={<Layers size={50} />}
        />
        <SummaryCardIncome
          title="Others"
          value={200}
          icon={<Shirt size={50} />}
        />
      </div>

      {/* Search + Filter */}
      <div className="flex gap-5 w-full items-center justify-center mb-0">
        <Searchbar
          placeholder="Search Income"
          onChange={handleSearch}
          classname="flex flex-5"
        />
        <Filter
          onChange={handleSortChange}
          filters={filters}
          initial="All Income"
          classname="flex-1"
        />
        <Button variant="destructive" size="lg">
          <Trash />
          Delete Selected
        </Button>
        <AddIncomeModal />
      </div>

      {/* Data Table */}
      <DataTable<Income>
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
                <ViewIncomeModal {...row.original} />
                <DeleteIncomeModal {...row.original} />
              </div>
            ),
          },
        ]}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </>
  );
}
