import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/datatable";
import Filter from "@/components/ui/filter";
import Searchbar from "@/components/ui/searchbar";
import IssueCertificateModal from "@/features/certificate/issueCertificateModal";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Trash,
  FileText,
  CheckCircle,
  XCircle,
  ListChecks,
} from "lucide-react";
import searchCertificate from "@/service/searchCertificate";
import SummaryCard from "@/components/ui/summary-card/certificate";

const filters = [
  "All Certificates",
  "OR ASC",
  "OR DESC",
  "Date ASC",
  "Date DESC",
  "Active",
  "Expired",
];

type Certificate = {
  name: string;
  type: string;
  or: string;
  date: Date;
  zone: string;
};

const columns: ColumnDef<Certificate>[] = [
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
    header: "Issued To",
    accessorKey: "name",
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "OR#",
    accessorKey: "or",
  },
  {
    header: "Issued On",
    accessorKey: "date",
    cell: ({ row }) => <div>{format(row.original.date, "MMMM do, yyyy")}</div>,
  },
  {
    header: "Address",
    accessorKey: "zone",
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const oneYearLater = new Date(row.original.date);
      oneYearLater.setFullYear(row.original.date.getFullYear() + 1);
      const status = new Date() > oneYearLater ? "Expired" : "Active";
      return <p>{status}</p>;
    },
  },
];

const date: Certificate[] = [
  {
    name: "John Cena",
    type: "Barangay Certificate",
    or: "0932",
    date: new Date("June 2, 2025"),
    zone: "Zone 3",
  },
  {
    name: "Jane Doe",
    type: "Barangay Clearance",
    or: "1045",
    date: new Date("July 8, 2024"),
    zone: "Zone 1",
  },
  {
    name: "Carlos Rivera",
    type: "Residency Certificate",
    or: "0871",
    date: new Date("May 10, 2023"),
    zone: "Zone 2",
  },
  {
    name: "Maria Santos",
    type: "Barangay Certificate",
    or: "0555",
    date: new Date("August 15, 2022"),
    zone: "Zone 3",
  },
];

export default function Certificate() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const totalCertificates = date.length;
  const activeCertificates = date.filter((cert) => {
    const expiry = new Date(cert.date);
    expiry.setFullYear(expiry.getFullYear() + 1);
    return new Date() <= expiry;
  }).length;
  const expiredCertificates = date.filter((cert) => {
    const expiry = new Date(cert.date);
    expiry.setFullYear(expiry.getFullYear() + 1);
    return new Date() > expiry;
  }).length;
  const typeCount = date.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostCommonType =
    Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  const filteredData = useMemo(() => {
    const sortValue = searchParams.get("sort") ?? "All Certificates";

    let sorted = [...date];

    if (sortValue === "OR ASC") {
      sorted.sort((a, b) => a.or.localeCompare(b.or));
    } else if (sortValue === "OR DESC") {
      sorted.sort((a, b) => b.or.localeCompare(a.or));
    } else if (sortValue === "Date ASC") {
      sorted.sort((a, b) => a.date.getTime() - b.date.getTime());
    } else if (sortValue === "Date DESC") {
      sorted.sort((a, b) => b.date.getTime() - a.date.getTime());
    } else if (sortValue === "Active") {
      sorted = sorted.filter((cert) => {
        const oneYearLater = new Date(cert.date);
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        return new Date() <= oneYearLater;
      });
    } else if (sortValue === "Expired") {
      sorted = sorted.filter((cert) => {
        const oneYearLater = new Date(cert.date);
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        return new Date() > oneYearLater;
      });
    }

    if (searchQuery.trim()) {
      return searchCertificate(searchQuery, sorted);
    }

    return sorted;
  }, [searchParams, searchQuery]);

  const handleSortChange = (sortValue: string) => {
    searchParams.set("sort", sortValue);
    setSearchParams(searchParams);
  };

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-around mb-5 mt-1">
        <SummaryCard
          title="Total Certificates"
          value={totalCertificates}
          icon={<FileText size={50} />}
        />
        <SummaryCard
          title="Active Certificates"
          value={activeCertificates}
          icon={<CheckCircle size={50} />}
        />
        <SummaryCard
          title="Expired Certificates"
          value={expiredCertificates}
          icon={<XCircle size={50} />}
        />
        <SummaryCard
          title="Most Common Type"
          value={mostCommonType}
          icon={<ListChecks size={50} />}
        />
      </div>

      <div className="flex gap-5 w-full items-center justify-center mb-4">
        <Searchbar
          onChange={(value) => setSearchQuery(value)}
          placeholder="Search by Name, Type, or OR#"
          classname="flex flex-5"
        />
        <Filter
          filters={filters}
          onChange={handleSortChange}
          initial="All Certificates"
          classname="flex-1"
        />

        <Button variant="destructive" size="lg">
          <Trash />
          Delete Selected
        </Button>
        <IssueCertificateModal />
      </div>
      <DataTable<Certificate>
        classname="py-5"
        height="43.3rem"
        columns={[
          ...columns,
          {
            id: "view",
            header: "",
            cell: () => <Button>View more</Button>,
          },
        ]}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        data={filteredData}
      />
    </>
  );
}
