import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/datatable";
import Filter from "@/components/ui/filter";
import Searchbar from "@/components/ui/searchbar";
import AddEventModal from "@/features/event-manager/addEventModal";
import CancelEventModal from "@/features/event-manager/cancelEventModal";
import ViewEventModal from "@/features/event-manager/viewEventModal";
import { sort } from "@/service/eventSort";
import searchEvent from "@/service/searchEvent";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash, CalendarPlus, CalendarCheck, CalendarX2, CalendarClock } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCard from "@/components/ui/summary-card/eventmanager"; // or create SummaryCardEvent if needed

const filters = [
  "All Events", "Date ASC", "Date DESC", "Venue", "Upcoming", "On Going", "Finished", "Cancelled",
];

type Event = {
  name: string;
  type: string;
  status: "Upcoming" | "Finished" | "Ongoing" | "Cancelled";
  date: Date;
  venue: string;
  atendee: string;
  notes: string;
};

const columns: ColumnDef<Event>[] = [
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
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Type",
    accessorKey: "type"
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status
      let color: string;
      switch (status) {
        case "Upcoming": {
          color = "#00BD29"
          break;
        }
        case "Finished": {
          color = "#000000"
          break;
        }
        case "Ongoing": {
          color = "#FFB30F"
          break;
        }
        case "Cancelled": {
          color = "#BD0000"
          break;
        }
      }
      return (
        <div style={{ color: color }}>{status}</div>
      )
    }
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => {
      return (
        <div>{format(row.original.date, "MMMM do, yyyy")}</div>
      )
    }

  },
  {
    header: "Venue",
    accessorKey: "venue"
  },
]

const data: Event[] = [
  {
    name: "Meeting for event",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for event",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 12, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for event",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 10, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for event",
    type: "Session",
    status: "Upcoming",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for event",
    type: "Session",
    status: "Upcoming",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for event",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for event",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for event",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for event",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for event",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for event",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for Youth Program",
    type: "Assembly",
    status: "Cancelled",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Meeting for Youth Program",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Quarterly Seminar",
    type: "Assembly",
    status: "Upcoming",
    date: new Date("June 3, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Livelihood Program",
    type: "Seminar",
    status: "Finished",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Livelihood Program",
    type: "Seminar",
    status: "Cancelled",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Livelihood Program",
    type: "Seminar",
    status: "Ongoing",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Livelihood Program",
    type: "Seminar",
    status: "Finished",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
]

export default function EventManager() {
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
    const sorted = sort(data, searchParams.get("sort") ?? "All Events");
    return searchQuery.trim() ? searchEvent(searchQuery, sorted) : sorted;
  }, [searchParams, data, searchQuery]);

  // Summary calculations
  const upcoming = data.filter((e) => e.status === "Upcoming").length;
  const ongoing = data.filter((e) => e.status === "Ongoing").length;
  const finished = data.filter((e) => e.status === "Finished").length;
  const cancelled = data.filter((e) => e.status === "Cancelled").length;

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCard title="Upcoming Events" value={upcoming} icon={<CalendarPlus size={50} />} />
        <SummaryCard title="Ongoing Events" value={ongoing} icon={<CalendarClock size={50} />} />
        <SummaryCard title="Finished Events" value={finished} icon={<CalendarCheck size={50} />} />
        <SummaryCard title="Cancelled Events" value={cancelled} icon={<CalendarX2 size={50} />} />
      </div>

      <div className="flex gap-5 w-full items-center justify-center">
        <Searchbar onChange={handleSearch} placeholder="Search Event" classname="flex flex-5" />
        <Filter onChange={handleSortChange} filters={filters} initial="All Events" classname="flex-1" />
        <Button variant="destructive" size="lg">
          <Trash />
          Delete Selected
        </Button>
        <AddEventModal />
      </div>

      <DataTable<Event>
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
                  <ViewEventModal {...row.original} />
                  {status !== "Cancelled" && status !== "Finished" && (
                    <CancelEventModal {...row.original} />
                  )}
                </div>
              );
            },
          },
        ]}
      />
    </>
  );
}
