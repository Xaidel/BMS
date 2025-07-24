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
  path: string
}

const data: Certificate[] = [
  { price: 10, type: "4PS Certification", path: "fourps" },
  { price: 30, type: "Barangay Certificate", path: "brgy-certificate" },
  { price: 30, type: "Barangay Clearance", path: "brgy-clearance" },
  { price: 30, type: "Barangay Indigency", path: "brgy-indigency" },
  { price: 30, type: "Barangay Permit", path: "brgy-permit" },
  { price: 30, type: "Certificate of Ownership", path: "cert-ownership" },
  { price: 30, type: "Certification of BARC", path: "cert-barc" },
  { price: 30, type: "Certification of Blood", path: "cert-blood" },
  { price: 30, type: "Certification of Cut Tree", path: "cert-cut" },
  { price: 30, type: "Certification of Farmers", path: "cert-farmer" },
  { price: 30, type: "Certification of First Job Seeker", path: "cert-job" },
  { price: 30, type: "Certification of Good Moral", path: "cert-moral" },
  { price: 30, type: "Certification of Marriage", path: "cert-marriage" },
  { price: 30, type: "Certification of Non Existing Business", path: "cert-non" },
  { price: 30, type: "Certification of Organization", path: "cert-org" },
  { price: 30, type: "Certification of PWD", path: "cert-pwd" },
  { price: 30, type: "Certification of Relationship", path: "cert-relationship" },
  { price: 30, type: "Certification of Residing", path: "cert-residing" },
  { price: 30, type: "Certification of SSS", path: "cert-sss" },
  { price: 30, type: "Certification of Same Person", path: "cert-same" },
  { price: 30, type: "Certification of Shelter Damage", path: "cert-shelter" },
  { price: 30, type: "Certification of Solo Parent", path: "cert-solo" },
  { price: 30, type: "Certification of Tenant Cultivation", path: "cert-tenant" },
  { price: 30, type: "Certification of Unemployment", path: "cert-unemployment" },
  { price: 30, type: "Registration of Birth", path: "registration-birth" },
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
                          <Button onClick={() => navigate(`/certificates/template/${cert.path}`)}>Select</Button>
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
