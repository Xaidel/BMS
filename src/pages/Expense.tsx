import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/datatable";
import Filter from "@/components/ui/filter";
import Searchbar from "@/components/ui/searchbar";
import AddExpenseModal from "@/features/expense/addExpenseModal";
import DeleteExpenseModal from "@/features/expense/deleteExpenseModal";
import ViewExpenseModal from "@/features/expense/viewExpenseModal";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash, Banknote, Coins, Gift, Landmark, Layers, PiggyBank, DollarSign, Wallet, Home, Salad, Shirt } from "lucide-react";
import type { Expense } from "@/types/types";
import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { sort } from "@/service/expenseSort";
import searchExpense from "@/service/searchExpense";
import SummaryCardExpense from "@/components/ui/summary-card/expense";

const filters = [
  "All Expense",
  "Numerical",
  "Date Issued",
  "This Month",
  "This Week",
];

const columns: ColumnDef<Expense>[] = [
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
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Paid From",
    accessorKey: "paidFrom",
  },
  {
    header: "Paid By",
    accessorKey: "paidBy",
  },
  {
    header: "Date Issued",
    accessorKey: "date",
    cell: ({ row }) => {
      return (
        <div>{format(row.original.date, "MMMM do, yyyy")}</div>
      );
    },
  },
];

const data: Expense[] = [
  {
    type: "Certificate",
    amount: 150,
    or: 123456,
    paidFrom: "Kagawad Office",
    paidBy: "John John",
    date: new Date("June 29, 2023"),
  },
  {
    type: "Business Permit",
    amount: 150,
    or: 123456,
    paidFrom: "Treasurer Office",
    paidBy: "John Doe",
    date: new Date(),
  },
  {
    type: "Infrastructure",
    amount: 150,
    or: 123456,
    paidFrom: "IRA",
    paidBy: "John Doe",
    date: new Date("July 1, 2025"),
  },
  {
    type: "Honorarium",
    amount: 1500,
    or: 123456,
    paidFrom: "Local Fund",
    paidBy: "John Doe",
    date: new Date("June 29, 2023"),
  },
];

export default function Expense() {
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
    const sorted = sort(data, searchParams.get("sort") ?? "All Expense");
    if (searchQuery.trim()) {
      return searchExpense(searchQuery, sorted);
    }
    return sorted;
  }, [searchParams, data, searchQuery]);

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCardExpense title="Total Expenditure" value={2050} icon={<DollarSign size={50} />} />
        <SummaryCardExpense title="Infrastructure Expenses" value={750} icon={<Landmark size={50} />} />
        <SummaryCardExpense title="Honoraria" value={300} icon={<PiggyBank size={50} />} />
        <SummaryCardExpense title="Utilities" value={500} icon={<Wallet size={50} />} />
        <SummaryCardExpense title="Local Funds Used" value={200} icon={<Banknote size={50} />} />
        <SummaryCardExpense title="Foods" value={100} icon={<Salad size={50} />} />
        <SummaryCardExpense title="IRA Used" value={100} icon={<Layers size={50} />} />
        <SummaryCardExpense title="Others" value={100} icon={<Shirt size={50} />} />
      </div>


      <div className="flex gap-5 w-full items-center justify-center mb-4">
        <Searchbar
          placeholder="Search Expense"
          classname="flex flex-5"
          onChange={handleSearch}
        />
        <Filter
          onChange={handleSortChange}
          filters={filters}
          initial="All Expense"
          classname="flex-1"
        />
        <Button variant="destructive" size="lg">
          <Trash />
          Delete Selected
        </Button>
        <AddExpenseModal />
      </div>

      <DataTable<Expense>
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
                <ViewExpenseModal {...row.original} />
                <DeleteExpenseModal {...row.original} />
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
