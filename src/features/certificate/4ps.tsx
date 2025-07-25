import { FourpsPDF } from "@/components/pdf/fourpsPDF";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { mockResidents } from "@/mock/residents";
import { PDFViewer } from "@react-pdf/renderer";
import { ArrowLeftCircleIcon, Check, ChevronsUpDown, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";

type mock = {
  value: string
  label: string
  gender: string
}

const residents = (): mock[] => {
  return mockResidents.map((res) => ({
    value: res.full_name.toLowerCase(),
    label: res.full_name,
    gender: res.gender
  }))
}

export default function Fourps() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [selected, setSelected] = useState<mock>()
  const allResidents = residents()
  const [search, setSearch] = useState("")
  const filteredResidents = useMemo(() => {
    return allResidents.filter((res) =>
      res.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [allResidents, search])
  return (
    <>
      <div className="flex gap-4 ">
        <div className="flex-2">
          <Card className=" flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center justify-center">
                <ArrowLeftCircleIcon onClick={() => navigate(-1)} />
                4ps Certificate
              </CardTitle>
              <CardDescription className="text-center">
                Please fill out the necessary information needed for 4ps Certification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full flex justify-between"
                    >
                      {value
                        ? allResidents.find((res) => res.value === value)?.label
                        : "Select a Resident"
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full">
                    <Command>
                      <CommandInput
                        placeholder="Search Resident..."
                        className="h-9"
                        value={search}
                        onValueChange={setSearch}
                      />
                      {allResidents.length === 0 ? (
                        <CommandEmpty>No Residents Found</CommandEmpty>
                      )
                        :
                        (
                          <div className="h-60 overflow-hidden">
                            <Virtuoso
                              style={{ height: "100%" }}
                              totalCount={filteredResidents.length}
                              itemContent={(index) => {
                                const res = filteredResidents[index]
                                return (
                                  <CommandItem
                                    key={res.value}
                                    value={res.value}
                                    className="text-black"
                                    onSelect={(currentValue) => {
                                      setValue(
                                        currentValue === value ? "" : currentValue
                                      )
                                      setOpen(false)
                                      setSelected(res)
                                    }}
                                  >
                                    {res.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        value === res.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                )
                              }}
                            />
                          </div>
                        )
                      }
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center items-center">
              <Button>
                <Printer />
                Print Certificate
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="flex-4">
          <PDFViewer className="w-full h-[53rem]">
            <FourpsPDF fullname={selected?.label || ""} gender={selected?.gender || ""} />
          </PDFViewer>
        </div>
      </div>
    </>
  )
}
