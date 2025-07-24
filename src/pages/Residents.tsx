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
import { Accessibility, Fingerprint, Trash } from "lucide-react";
import { Resident } from "@/types/types";
import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { sort } from "@/service/residentSort";
import searchResident from "@/service/searchResident";
import { mockResidents } from "@/mock/residents";
import SummaryCardResidents from "@/components/ui/summary-card/residents";
import {
  Users,
  UserCheck,
  UserMinus,
  Mars,
  Venus,
  User,
} from "lucide-react";

const filters = [
  "All Residents",
  "Alphabetical",
  "Moved Out",
  "Active",
  "Dead",
  "Missing",
];

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
    accessorKey: "full_name",
  },
  {
    header: "Civil Status",
    accessorKey: "civilStatus",
  },
  {
    header: "Birthday",
    accessorKey: "birthdate",
    cell: ({ row }) => {
      return <div>{format(row.original.birthday, "MMMM do, yyyy")}</div>;
    },
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
      let color: string;
      switch (status) {
        case "Moved Out": {
          color = "#BD0000";
          break;
        }
        case "Active": {
          color = "#00BD29";
          break;
        }
        case "Dead": {
          color = "#000000";
          break;
        }
        case "Missing": {
          color = "#FFB30F";
          break;
        }
        default: {
          color = "#000000";
        }
      }
      return <div style={{ color: color }}>{status}</div>;
    },
  },
];

export default function Residents() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSortChange = (sortValue: string) => {
    searchParams.set("sort", sortValue);
    setSearchParams(searchParams);
  };
  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
  };

  const filteredData = useMemo(() => {
    if (searchQuery.trim()) {
      const processedData = sort(
        mockResidents,
        searchParams.get("sort") ?? "All Residents"
      );
      return searchResident(searchQuery, processedData);
    }

    return sort(mockResidents, searchParams.get("sort") ?? "All Residents");
  }, [searchParams, mockResidents, searchQuery]);

  const total = mockResidents.length;
  const active = mockResidents.filter((r) => r.status === "Active").length;
  const movedOut = mockResidents.filter((r) => r.status === "Moved Out").length;
  const male = mockResidents.filter((r) => r.gender === "Male").length;
  const female = mockResidents.filter((r) => r.gender === "Female").length;
  const senior = mockResidents.filter((r) => r.isSenior === true).length;
  const pwd = mockResidents.filter((r) => r.isPWD === true).length;
  const registered = mockResidents.filter(
    (r) => r.isRegisteredVoter === true
  ).length;

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCardResidents
          title="Total Residents"
          value={total}
          icon={<Users size={50} />}
        />
        <SummaryCardResidents
          title="Male"
          value={male}
          icon={<Mars size={50} />}
        />
        <SummaryCardResidents
          title="Female"
          value={female}
          icon={<Venus size={50} />}
        />
        <SummaryCardResidents
          title="Senior"
          value={senior}
          icon={<User size={50} />}
        />
        <SummaryCardResidents
          title="PWD"
          value={pwd}
          icon={<Accessibility size={50} />}
        />
        <SummaryCardResidents
          title="Registered Voters"
          value={registered}
          icon={<Fingerprint size={50} />}
        />
        <SummaryCardResidents
          title="Active"
          value={active}
          icon={<UserCheck size={50} />}
        />
        <SummaryCardResidents
          title="Moved Out"
          value={movedOut}
          icon={<UserMinus size={50} />}
        />
      </div>

      <div className="flex gap-5 w-full items-center justify-center">
        <Searchbar
          onChange={handleSearch}
          placeholder="Search Resident"
          classname="flex flex-5"
        />
        <Filter
          onChange={handleSortChange}
          filters={filters}
          initial="All Residents"
          classname="flex-1"
        />
        <Button variant="destructive" size="lg">
          <Trash />
          Delete Selected
        </Button>
        <AddResidentModal />
      </div>

      <DataTable<Resident>
        classname="py-5"
        data={filteredData}
        height="43.3rem"
        columns={[
          ...columns,
          {
            id: "view",
            header: "",
            cell: ({ row }) => {
              const status = row.original.status;
              return (
                <div className="flex gap-3 ">
                  <ViewResidentModal {...row.original} />
                  {status !== "Active" && (
                    <DeleteResidentModal {...row.original} />
                  )}
                </div>
              );
            },
          },
        ]}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </>
  );
}
