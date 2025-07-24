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
import { useMemo, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
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
    accessorKey: "type_",
  },
  {
    header: "Category",
    accessorKey: "category",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Paid From",
    accessorKey: "paid_to",
  },
  {
    header: "Paid By",
    accessorKey: "paid_by",
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


export default function Expense() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<Expense[]>([]);

  const fetchExpenses = () => {
    invoke<Expense[]>("fetch_all_expenses_command")
      .then((fetched) => {
        const parsed = fetched.map((expense) => ({
          ...expense,
          date: new Date(expense.date),
          category: expense.category,
        }));
        setData(parsed);
      })
      .catch((err) => console.error("Failed to fetch expenses:", err));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

    <AddExpenseModal onSave={fetchExpenses} />;

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

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => filteredData[parseInt(key)])
      .filter((row) => !!row)
      .map((row) => row.id);

    if (selectedIds.length === 0) {
      console.error("No expense records selected.");
      return;
    }

    try {
      for (const id of selectedIds) {
        if (id !== undefined) {
          await invoke("delete_expense_command", { id });
        }
      }
      console.log("Selected expenses deleted.");
      fetchExpenses();
      setRowSelection({});
    } catch (err) {
      console.error("Failed to delete selected expenses", err);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCardExpense
          title="Total Expenditure"
          value={data.reduce((acc, item) => acc + item.amount, 0)}
          icon={<DollarSign size={50} />}
        />
        <SummaryCardExpense
          title="Infrastructure Expenses"
          value={data
            .filter((d) => d.category === "Infrastructure")
            .reduce((acc, item) => acc + item.amount, 0)}
          icon={<Landmark size={50} />}
        />
        <SummaryCardExpense
          title="Honoraria"
          value={data
            .filter((d) => d.category === "Honoraria")
            .reduce((acc, item) => acc + item.amount, 0)}
          icon={<PiggyBank size={50} />}
        />
        <SummaryCardExpense
          title="Utilities"
          value={data
            .filter((d) => d.category === "Utilities")
            .reduce((acc, item) => acc + item.amount, 0)}
          icon={<Wallet size={50} />}
        />
        <SummaryCardExpense
          title="Local Funds Used"
          value={data
            .filter((d) => d.category === "Local Funds")
            .reduce((acc, item) => acc + item.amount, 0)}
          icon={<Banknote size={50} />}
        />
        <SummaryCardExpense
          title="Foods"
          value={data
            .filter((d) => d.category === "Foods")
            .reduce((acc, item) => acc + item.amount, 0)}
          icon={<Salad size={50} />}
        />
        <SummaryCardExpense
          title="IRA Used"
          value={data
            .filter((d) => d.category === "IRA")
            .reduce((acc, item) => acc + item.amount, 0)}
          icon={<Layers size={50} />}
        />
        <SummaryCardExpense
          title="Others"
          value={data
            .filter((d) => d.category === "Others")
            .reduce((acc, item) => acc + item.amount, 0)}
          icon={<Shirt size={50} />}
        />
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
        <Button
          variant="destructive"
          size="lg"
          disabled={Object.keys(rowSelection).length === 0}
          onClick={handleDeleteSelected}
        >
          <Trash />
          Delete Selected
        </Button>
        <AddExpenseModal onSave={fetchExpenses}/>
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
                <DeleteExpenseModal 
                  id={row.original.id!}
                  type_={row.original.type_}
                  category={row.original.category}
                  onDelete={fetchExpenses}                
                />
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
