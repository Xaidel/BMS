import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/datatable";
import Filter from "@/components/ui/filter";
import Searchbar from "@/components/ui/searchbar";
import AddBlotterModal from "@/features/blotter/addBlotterModal";
import DeleteBlotterModal from "@/features/blotter/deleteBlotterModal";
import ViewBlotterModal from "@/features/blotter/viewBlotterModal";
import SummaryCard from "@/components/ui/summarycardblotter"; // <== import this
import { DollarSign, Eye, Users, AlarmClock, Gavel, BookOpenCheck } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Blotter } from "@/types/types";
import sort from "@/service/blotterSort";
import searchBlotter from "@/service/searchBlotter";

const filters = [
  "All Blotter Records",
  "Alphabetical",
  "ID",
  "Active",
  "On Going",
  "Closed",
  "Transferred to Police",
  "Date Incident",
];

const columns: ColumnDef<Blotter>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false
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
    header: "Blotter ID",
    accessorKey: "id"
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "Reported By",
    accessorKey: "reportedBy",
  },
  {
    header: "Involved",
    accessorKey: "involved",
  },
  {
    header: "Date Incident",
    accessorKey: "date",
    cell: ({ row }) => {
      return (
        <div>{format(row.original.date, "MMMM do, yyyy")}</div>
      )
    }
  },
  {
    header: "Location",
    accessorKey: "location"
  },
  {
    header: "Zone",
    accessorKey: "zone"
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      let color: string;
      switch (status) {
        case "On Going": {
          color = "#BD0000";
          break;
        }
        case "Active": {
          color = "#00BD29";
          break;
        }
        case "Closed": {
          color = "#000000";
          break;
        }
        case "Transferred to Police": {
          color = "#FFB30F";
          break;
        }
        default: {
          color = "#000000";
        }
      }
      return (
        <div style={{ color: color }}>{status}</div>
      );
    }
  }
]

const data: Blotter[] = [
  {
    id: 323,
    type: "Theft",
    reportedBy: "Jerome Patrick Tayco",
    involved: "Sheer Jay Francisco",
    date: new Date("June 29, 2025"),
    location: "Brgy. Tambo",
    zone: "Zone 4",
    status: "On Going",
  },
  {
    id: 223,
    type: "Theft",
    reportedBy: "Karl Abechuela",
    involved: "Lincoln Armann Bonecile",
    date: new Date("June 29, 2003"),
    location: "Brgy. Tambo",
    zone: "Zone 4",
    status: "On Going",
  },
  {
    id: 123,
    type: "Theft",
    reportedBy: "Karl Abechuela",
    involved: "Lincoln Armann Bonecile",
    date: new Date("June 29, 2003"),
    location: "Brgy. Tambo",
    zone: "Zone 4",
    status: "On Going",
  },
]


export default function Blotters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSortChange = (sortValue: string) => {
    searchParams.set("sort", sortValue);
    setSearchParams(searchParams);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
  };

  const filteredData = useMemo(() => {
    const sortedData = sort(data, searchParams.get("sort") ?? "All Blotters");

    if (searchQuery.trim()) {
      return searchBlotter(searchQuery, sortedData);
    }

    return sortedData;
  }, [searchParams, data, searchQuery]);

  // Summary Values
  const total = data.length;
  const totalFinish = data.length;
  const active = data.filter(d => d.status === "Active").length;
  const ongoing = data.filter(d => d.status === "On Going").length;
  const closed = data.filter(d => d.status === "Closed").length;
  const transferred = data.filter(d => d.status === "Transferred to Police").length;

  return (
    <>
      {/* Summary Section */}
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCard title="Total Blotters" value={total} icon={<Users size={50} />} />
        <SummaryCard title="Total Finished" value={total} icon={<BookOpenCheck size={50} />} />
        <SummaryCard title="Active" value={active} icon={<Eye size={50} />} />
        <SummaryCard title="On Going" value={ongoing} icon={<AlarmClock size={50} />} />
        <SummaryCard title="Closed" value={closed} icon={<Gavel size={50} />} />
        <SummaryCard title="Transferred to Police" value={transferred} icon={<DollarSign size={50} />} />
      </div>

      {/* Search/Filter Controls */}
      <div className="flex gap-5 w-full items-center justify-center">
        <Searchbar onChange={handleSearch} placeholder="Search Blotter" classname="flex flex-5" />
        <Filter onChange={handleSortChange} filters={filters} initial="All Blotter" classname="flex-1" />
        <Button variant="destructive" size="lg">
          <Trash />
          Delete Selected
        </Button>
        <AddBlotterModal />
      </div>

      {/* Table */}
      <DataTable<Blotter>
        classname="py-5"
        height="43.3rem"
        data={filteredData}
        columns={[
          ...columns,
          {
            id: "view",
            header: "",
            cell: ({ row }) => {
              const status = row.original.status;
              return (
                <div className="flex gap-3">
                  <ViewBlotterModal {...row.original} />
                  {status !== "Active" && <DeleteBlotterModal {...row.original} />}
                </div>
              );
            },
          },
        ]}
      />
    </>
  );
}
