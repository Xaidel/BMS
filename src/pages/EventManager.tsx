import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/datatable";
import Filter from "@/components/ui/filter";
import Searchbar from "@/components/ui/searchbar";
import AddEventModal from "@/features/event-manager/addEventModal";
import ViewEventModal from "@/features/event-manager/viewEventModal";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash } from "lucide-react";

const filters = [
  "All Events",
  "Alphabetical",
  "Date",
  "Venue",
  "Upcoming",
  "Finished",
  "Cancelled",
]

type Event = {
  name: string,
  type: string,
  status: "Upcoming" | "Finished" | "Ongoing" | "Cancelled",
  date: Date,
  venue: string,
  atendee: string,
  notes: string
}

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
    date: new Date("June 3, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Livelihood Progra",
    type: "Seminar",
    status: "Finished",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Livelihood Progra",
    type: "Seminar",
    status: "Cancelled",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Livelihood Progra",
    type: "Seminar",
    status: "Ongoing",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
  {
    name: "Livelihood Progra",
    type: "Seminar",
    status: "Finished",
    date: new Date("June 2, 2025"),
    venue: "Barangay Hall",
    atendee: "All Officials",
    notes: "Sample Notes",
  },
]

export default function EventManager() {
  return (
    <>
      <div className="flex gap-5 w-full items-center justify-center">
        <Searchbar placeholder="Search event" classname="flex flex-5" />
        <Filter filters={filters} initial="All Events" classname="flex-1" />
        <Button variant="destructive" size="lg" >
          <Trash />
          Delete Selected
        </Button>
        <AddEventModal />
      </div >
      <DataTable<Event> data={data} columns={[...columns,
      {
        id: "action",
        header: "",
        cell: ({ row }) => (
          <ViewEventModal {...row.original} />
        )
      }]} />
    </>
  )
}
