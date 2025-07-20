import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/datatable";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Certificate = {
  price: number,
  type: string,
}

const column: ColumnDef<Certificate>[] = [
  {
    id: "price",
    header: "Price",
    accessorKey: "price"
  },
  {
    id: "type",
    header: "Type",
    accessorKey: "type"
  },
]

const data: Certificate[] =
  [
    { "price": 10, "type": "4PS Certification" },
    { "price": 30, "type": "Barangay Certificate" },
    { "price": 30, "type": "Barangay Clearance" },
    { "price": 30, "type": "Barangay Indigency" },
    { "price": 30, "type": "Barangay Permit" },
    { "price": 30, "type": "Business Certificate" },
    { "price": 30, "type": "Certificate of Ownership" },
    { "price": 30, "type": "Certification of BARC" },
    { "price": 30, "type": "Certification of Blood" },
    { "price": 30, "type": "Certification of Blood" },
    { "price": 30, "type": "Certification of Cut Tree" },
    { "price": 30, "type": "Certification of Farmers" },
    { "price": 30, "type": "Certification of First Job Seeker" },
    { "price": 30, "type": "Certification of Good Moral" },
    { "price": 30, "type": "Certification of Marriage" },
    { "price": 30, "type": "Certification of Non Existing Business" },
    { "price": 30, "type": "Certification of Organization" },
    { "price": 30, "type": "Certification of PWD" },
    { "price": 30, "type": "Certification of Relationship" },
    { "price": 30, "type": "Certification of Residing" },
    { "price": 30, "type": "Certification of SSS" },
    { "price": 30, "type": "Certification of Same Person" },
    { "price": 30, "type": "Certification of Same Person" },
    { "price": 30, "type": "Certification of Shelter Damage" },
    { "price": 30, "type": "Certification of Solo Parent" },
    { "price": 30, "type": "Certification of Tenant Cultivation" },
    { "price": 30, "type": "Certification of Unemployment" },
    { "price": 30, "type": "Registration of Birth" }
  ]


export default function IssueCertificateModal() {
  const navigate = useNavigate()
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" >
            <Plus />
            Issue Certificate
          </Button>
        </DialogTrigger>
        <DialogContent className=" p-0 flex flex-col gap-0 overflow-auto ">
          <div className="p-6  border-b bg-background">
            <DialogHeader>
              <DialogTitle className="text-black">Select Certificate Type</DialogTitle>
              <DialogDescription>Please choose the type of certificate you’d like to generate. This helps us customize the content and layout based on your selection.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 text-black px-6  ">
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
