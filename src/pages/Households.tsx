import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/datatable";
import Filter from "@/components/ui/filter";
import Searchbar from "@/components/ui/searchbar";
import AddHouseholdModal from "@/features/households/addHouseholdModal";
import DeleteHouseholdModal from "@/features/households/deleteHouseholdModal";
import ViewHouseholdModal from "@/features/households/viewHouseholdModal";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash, Home, HomeIcon, UserCheck, UserMinus } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Household } from "@/types/types";
import { sort } from "@/service/householdSort";
import searchHousehold from "@/service/searchHousehold";
import SummaryCard from "@/components/ui/summarycardhousehold";

const filters = ["All Households", "Numerical", "Renter", "Owner"];

const columns: ColumnDef<Household>[] = [
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
    header: "House Number",
    accessorKey: "householdNumber",
  },
  {
    header: "Type of Household",
    accessorKey: "type",
  },
  {
    header: "Family Members",
    accessorKey: "members",
  },
  {
    header: "Head of Household",
    accessorKey: "head",
  },
  {
    header: "Zone",
    accessorKey: "zone",
  },
  {
    header: "Date of Residency",
    accessorKey: "date",
    cell: ({ row }) => {
      return <div>{format(row.original.date, "MMMM do, yyyy")}</div>;
    },
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
        default: {
          color = "#000000";
        }
      }
      return <div style={{ color: color }}>{status}</div>;
    },
  },
];

const data: Household[] = [
  {
    householdNumber: 1232,
    type: "Renter",
    members: 15,
    head: "Jerome Tayco",
    zone: "Zone 1",
    date: new Date("June 29, 2023"),
    status: "Active",
  },
  {
    householdNumber: 1242,
    type: "Owner",
    members: 5,
    head: "Karl Abechuela",
    zone: "Zone 1",
    date: new Date("June 29, 2023"),
    status: "Active",
  },
  {
    householdNumber: 1132,
    type: "Renter",
    members: 5,
    head: "Sheerjay FranciscoS",
    zone: "Zone 1",
    date: new Date("June 29, 2023"),
    status: "Active",
  },
  {
    householdNumber: 1432,
    type: "Renter",
    members: 5,
    head: "Karl Abechuela",
    zone: "Zone 1",
    date: new Date("June 29, 2023"),
    status: "Moved Out",
  },
];

export default function Households() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSortChange = (sortValue: string) => {
    searchParams.set("sort", sortValue);
    setSearchParams(searchParams);
  };

  const filteredData = useMemo(() => {
    const sortedData = sort(data, searchParams.get("sort") ?? "All Households");

    if (searchQuery.trim()) {
      return searchHousehold(searchQuery, sortedData);
    }

    return sortedData;
  }, [searchParams, data, searchQuery]);

  const totalActive = data.filter((item) => item.status === "Active").length;
  const totalMovedOut = data.filter((item) => item.status === "Moved Out").length;
  const totalRenter = data.filter((item) => item.type === "Renter").length;
  const totalOwner = data.filter((item) => item.type === "Owner").length;

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCard title="Active Households" value={totalActive} icon={<UserCheck size={50} />} />
        <SummaryCard title="Moved Out" value={totalMovedOut} icon={<UserMinus size={50} />} />
        <SummaryCard title="Renter" value={totalRenter} icon={<HomeIcon size={50} />} />
        <SummaryCard title="Owner" value={totalOwner} icon={<Home size={50} />} />
      </div>

      <div className="flex gap-5 w-full items-center justify-center">
        <Searchbar
          onChange={(value) => setSearchQuery(value)}
          placeholder="Search Household"
          classname="flex flex-5"
        />

        <Filter
          onChange={handleSortChange}
          filters={filters}
          initial="All Households"
          classname="flex-1"
        />
        <Button variant="destructive" size="lg">
          <Trash />
          Delete Selected
        </Button>
        <AddHouseholdModal />
      </div>
      <DataTable<Household>
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
                <div className="flex gap-3 ">
                  <ViewHouseholdModal {...row.original} />
                  {status == "Moved Out" && (
                    <DeleteHouseholdModal {...row.original} />
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
