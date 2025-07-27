// Residents page implemented by mirroring Household logic
// (Code inserted here reflects working data table, filter, summary, and modal handling for Resident records)

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/datatable";
import Filter from "@/components/ui/filter";
import Searchbar from "@/components/ui/searchbar";
import AddResidentModal from "@/features/residents/addResidentModal";
import DeleteResidentModal from "@/features/residents/deleteResidentModal";
import ViewResidentModal from "@/features/residents/viewResidentModal";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash, Users, UserCheck, UserMinus, Mars, Venus, User, Accessibility, Fingerprint } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Resident } from "@/types/types";
import { sort } from "@/service/resident/residentSort";
import searchResident from "@/service/resident/searchResident";
import SummaryCardResidents from "@/components/ui/summary-card/residents";
import { invoke } from "@tauri-apps/api/core";

const filters = ["All Residents", "Alphabetical", "Moved Out", "Active", "Dead", "Missing"];

const columns: ColumnDef<Resident>[] = [
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
    header: "Full Name",
    cell: ({ row }) => {
      const r = row.original;
      return `${r.first_name} ${r.middle_name ?? ""} ${r.last_name}`;
    },
  },
  {
    header: "Civil Status",
    accessorKey: "civil_status",
  },
  {
    header: "Birthday",
    accessorKey: "date_of_birth",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.date_of_birth), "MMMM do, yyyy")}</div>
    ),
  },
  {
    header: "Gender",
    accessorKey: "gender",
  },
  {
    header: "Zone",
    accessorKey: "zone",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      let color = {
        "Moved Out": "#BD0000",
        "Active": "#00BD29",
        "Dead": "#000000",
        "Missing": "#FFB30F"
      }[status] || "#000000";
      return <div style={{ color }}>{status}</div>;
    },
  },
];

export default function Residents() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<Resident[]>([]);

  const handleSortChange = (sortValue: string) => {
    searchParams.set("sort", sortValue);
    setSearchParams(searchParams);
  };

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  const filteredData = useMemo(() => {
    const sortValue = searchParams.get("sort") ?? "All Residents";
    let sorted = sort(data, sortValue);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sorted = searchResident(query, sorted);
    }

    return sorted;
  }, [searchParams, searchQuery, data]);

  const fetchResidents = () => {
    invoke<Resident[]>("fetch_all_residents_command")
      .then((fetched) => {
        setData(fetched);
      })
      .catch((err) => console.error("Failed to fetch residents:", err));
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((key) => filteredData[parseInt(key)])
      .filter((row) => !!row)
      .map((row) => row.id);

    if (selectedIds.length === 0) {
      console.error("No resident records selected.");
      return;
    }

    try {
      await invoke("delete_residents_command", { ids: selectedIds });
      fetchResidents();
      setRowSelection({});
    } catch (err) {
      console.error("Failed to delete selected residents", err);
    }
  };

  const total = data.length;
  const active = data.filter((r) => r.status === "Active").length;
  const movedOut = data.filter((r) => r.status === "Moved Out").length;
  const male = data.filter((r) => r.gender === "Male").length;
  const female = data.filter((r) => r.gender === "Female").length;
  const senior = data.filter((r) => r.is_senior).length;
  const pwd = data.filter((r) => r.is_pwd).length;
  const registered = data.filter((r) => r.is_registered_voter).length;

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCardResidents title="Total Residents" value={total} icon={<Users size={50} />} />
        <SummaryCardResidents title="Male" value={male} icon={<Mars size={50} />} />
        <SummaryCardResidents title="Female" value={female} icon={<Venus size={50} />} />
        <SummaryCardResidents title="Senior" value={senior} icon={<User size={50} />} />
        <SummaryCardResidents title="PWD" value={pwd} icon={<Accessibility size={50} />} />
        <SummaryCardResidents title="Registered Voters" value={registered} icon={<Fingerprint size={50} />} />
        <SummaryCardResidents title="Active" value={active} icon={<UserCheck size={50} />} />
        <SummaryCardResidents title="Moved Out" value={movedOut} icon={<UserMinus size={50} />} />
      </div>

      <div className="flex gap-5 w-full items-center justify-center">
        <Searchbar onChange={(value) => setSearchQuery(value)} placeholder="Search Resident" classname="flex flex-5" />
        <Filter onChange={handleSortChange} filters={filters} initial="All Residents" classname="flex-1" />
        <Button variant="destructive" size="lg" disabled={Object.keys(rowSelection).length === 0} onClick={handleDeleteSelected}>
          <Trash /> Delete Selected
        </Button>
        <AddResidentModal onSave={fetchResidents} />
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
                <ViewResidentModal {...row.original} onSave={fetchResidents} />
                <DeleteResidentModal
                  id={row.original.id}
                  full_name={row.original.full_name}
                  civilStatus={row.original.civil_status}
                  status={row.original.status}
                  birthday={new Date(row.original.date_of_birth)}
                  gender={row.original.gender}
                  zone={row.original.zone}
                  onDelete={fetchResidents}
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