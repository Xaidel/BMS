import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

type Certificate = {
  price: number
  type: string
}

const data: Certificate[] = [
  { price: 10, type: "4PS Certification" },
  { price: 30, type: "Barangay Certificate" },
  { price: 30, type: "Barangay Clearance" },
  { price: 30, type: "Barangay Indigency" },
  { price: 30, type: "Barangay Permit" },
  { price: 30, type: "Business Certificate" },
  { price: 30, type: "Certificate of Ownership" },
  { price: 30, type: "Certification of BARC" },
  { price: 30, type: "Certification of Blood" },
  { price: 30, type: "Certification of Blood" },
  { price: 30, type: "Certification of Cut Tree" },
  { price: 30, type: "Certification of Farmers" },
  { price: 30, type: "Certification of First Job Seeker" },
  { price: 30, type: "Certification of Good Moral" },
  { price: 30, type: "Certification of Marriage" },
  { price: 30, type: "Certification of Non Existing Business" },
  { price: 30, type: "Certification of Organization" },
  { price: 30, type: "Certification of PWD" },
  { price: 30, type: "Certification of Relationship" },
  { price: 30, type: "Certification of Residing" },
  { price: 30, type: "Certification of SSS" },
  { price: 30, type: "Certification of Same Person" },
  { price: 30, type: "Certification of Same Person" },
  { price: 30, type: "Certification of Shelter Damage" },
  { price: 30, type: "Certification of Solo Parent" },
  { price: 30, type: "Certification of Tenant Cultivation" },
  { price: 30, type: "Certification of Unemployment" },
  { price: 30, type: "Registration of Birth" },
]

export default function IssueCertificateModal() {
  const navigate = useNavigate()

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg">
            <Plus />
            Issue Certificate
          </Button>
        </DialogTrigger>
        <DialogContent className="py-5 px-0 flex flex-col gap-0 max-h-[30rem] overflow-hidden">
          <div className="sticky top-0 z-10 p-6 border-b bg-background">
            <DialogHeader>
              <DialogTitle className="text-black">Select Certificate Type</DialogTitle>
              <DialogDescription>
                Please choose the type of certificate you'd like to generate. This helps us customize the content and
                layout based on your selection.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="px-6">
              <Table>
                <TableCaption>Certificate services being offered.</TableCaption>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead className="w-[100px] text-black bg-background">Price</TableHead>
                    <TableHead className="text-black bg-background">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((cert, i) => (
                    <TableRow key={i} className="text-black">
                      <TableCell className="font-medium">₱{cert.price}</TableCell>
                      <TableCell>
                        <div className="flex justify-between items-center">
                          {cert.type}
                          <Button>Select</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
