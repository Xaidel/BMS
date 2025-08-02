import { Buffer } from "buffer";

if (!window.Buffer) {
  window.Buffer = Buffer;
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PDFViewer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useEffect } from "react";
import { Image } from "@react-pdf/renderer";
import { invoke } from "@tauri-apps/api/core";
import { ArrowLeftCircleIcon, Check, ChevronsUpDown, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Resident = {
  id?: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  // Add more fields if needed
};

type mock = {
  value: string,
  label: string
}

export default function BusinessPermit() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [residents, setResidents] = useState<Resident[]>([]);
  const allResidents = useMemo(() => {
    return residents.map((res) => ({
      value: `${res.first_name} ${res.last_name}`.toLowerCase(),
      label: `${res.first_name} ${res.last_name}`,
      data: res,
    }));
  }, [residents]);
  const [search, setSearch] = useState("")
  const filteredResidents = useMemo(() => {
    return allResidents.filter((res) =>
      res.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [allResidents, search])
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null)
  const [settings, setSettings] = useState<{ barangay: string; municipality: string; province: string } | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [businessOwner, setBusinessOwner] = useState("");
  const [amount, setAmount] = useState("150.00");

  useEffect(() => {
    invoke("fetch_logo_command")
      .then((res) => {
        if (typeof res === "string") setLogoDataUrl(res);
      })
      .catch(console.error);

    invoke("fetch_settings_command")
      .then((res) => {
        if (typeof res === "object" && res !== null) {
          const s = res as any;
          setSettings({
            barangay: s.barangay || "",
            municipality: s.municipality || "",
            province: s.province || "",
          });
        }
      })
      .catch(console.error);

    invoke("fetch_all_residents_command")
      .then((res) => {
        if (Array.isArray(res)) setResidents(res as Resident[]);
      })
      .catch(console.error);
  }, []);
  const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 },
    heading: { fontSize: 18, marginBottom: 10 },
    bodyText: { fontSize: 14 },
  });
  // Download/Print handler function
  function handleDownload() {
    if (!value) {
      alert("Please select a resident first.");
      return;
    }
    console.log("Download started...");
    // Download/print logic goes here...
  }
  return (
    <>
      <div className="flex gap-1 ">
        <Card className="flex-2 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center justify-start">
              <ArrowLeftCircleIcon className="h-8 w-8" onClick={() => navigate(-1)} />
              Barangay Business Permit
            </CardTitle>
            <CardDescription className="text-start">
              Please fill out the necessary information needed for Barangay Business Permit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label>Business Name</Label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Enter business name" />
              </div>
              <div>
                <Label>Type of Business</Label>
                <Input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Enter type of business" />
              </div>
              <div>
                <Label>Business Location</Label>
                <Input value={businessLocation} onChange={(e) => setBusinessLocation(e.target.value)} placeholder="Enter business location" />
              </div>
              <div>
                <Label>Owner</Label>
                <Input value={businessOwner} onChange={(e) => setBusinessOwner(e.target.value)} placeholder="Enter owner's name" />
              </div>
              <div>
                <Label>Amount</Label>
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount (e.g. 150.00)" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <Button onClick={handleDownload}>
              <Printer />
              Print Certificate
            </Button>
          </CardFooter>
        </Card>
        <div className="flex-4">
          <PDFViewer width="100%" height={600}>
            <Document>
              <Page size="A4" style={styles.page}>
                <View style={{ position: "relative" }}>
                  {logoDataUrl && (
                    <Image
                      src={logoDataUrl}
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 30,
                        width: 90,
                        height: 90
                      }}
                    />
                  )}
                  {logoDataUrl && (
                    <Image
                      src={logoDataUrl}
                      style={{
                        position: "absolute",
                        top: "35%",
                        left: "23%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        height: 400,
                        opacity: 0.1,
                      }}
                    />
                  )}
                  <View style={styles.section}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: "center" }}>Republic of the Philippines</Text>
                        <Text style={{ textAlign: "center" }}>Province of {settings?.province || "Province"}</Text>
                        <Text style={{ textAlign: "center" }}>Municipality of {settings?.municipality || "Municipality"}</Text>
                        <Text style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }}>BARANGAY {settings?.barangay?.toUpperCase() || "Barangay"}</Text>
                      </View>
                    </View>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
                      OFFICE OF THE PUNONG BARANGAY
                    </Text>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>BARANGAY BUSINESS PERMIT</Text>
                    <View
                      style={{
                        border: "2pt solid black",
                        padding: 20,
                        marginBottom: 20,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 19, fontWeight: "bold", marginBottom: 4 }}>
                        {businessName || "________________"}
                      </Text>
                      <Text style={{ fontSize: 14, marginBottom: 10 }}>Business Name</Text>
                      <Text style={{ fontSize: 19, fontWeight: "bold", marginBottom: 4 }}>
                        {businessType || "________________"}
                      </Text>
                      <Text style={{ fontSize: 14, marginBottom: 10 }}>Type of Business</Text>
                      <Text style={{ fontSize: 19, fontWeight: "bold", marginBottom: 4 }}>
                        {businessLocation || "________________"}
                      </Text>
                      <Text style={{ fontSize: 14, marginBottom: 10 }}>Location</Text>
                      <Text style={{ fontSize: 19, fontWeight: "bold", marginBottom: 4 }}>
                        {businessOwner || "________________"}
                      </Text>
                      <Text style={{ fontSize: 14 }}>Owner</Text>
                    </View>
                    <>
                      <Text style={[styles.bodyText, { textAlign: "justify", marginBottom: 8 }]}>
                        And which said person had accomplish <Text style={{ fontWeight: "bold" }}>Barangay Ordinance No.14</Text>. This ordinance is imposing Barangay Permit fee and it is required for every business Trade or any transaction within the jurisdiction of this Barangay.
                      </Text>
                      <Text style={[styles.bodyText, { textAlign: "justify", marginBottom: 8 }]}>
                        This Barangay permit on business indorsed to this Municipality for registration purposes only.
                      </Text>
                      <Text style={[styles.bodyText, { marginTop: 10, marginBottom: 8 }]}>
                          Given this {new Date().toLocaleDateString("en-PH", {
                            day: "numeric", month: "long", year: "numeric"
                          })}, at Tambo, Pamplona, Camarines Sur.
                        </Text>
                      <Text style={[styles.bodyText, { textAlign: "justify", marginBottom: 8 }]}>
                        This Barangay Permit is not valid without official receipt.
                      </Text>
                    </>
                    <Text style={[styles.bodyText, { marginTop: 40, marginBottom: 6 }]}>Certifying Officer,</Text>
                    <Text style={[styles.bodyText, { marginTop: 20, marginBottom: 4, fontWeight: "bold" }]}>HON. JERRY T. AQUINO</Text>
                    <Text style={[styles.bodyText, { marginBottom: 10 }]}>Punong Barangay</Text>
                    <Text style={[styles.bodyText, { marginBottom: 4 }]}>O.R. No.: ____________________</Text>
                    <Text style={[styles.bodyText, { marginBottom: 4 }]}>Date: _________________________</Text>
                    <Text style={styles.bodyText}>Amount: PHP {amount || "_________"}</Text>
                  </View>
                </View>
              </Page>
            </Document>
          </PDFViewer>
        </div>
      </div>
    </>
  )
}
