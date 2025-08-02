import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { format, getDate } from "date-fns";
import getOrdinal from "@/service/ordinal";

type ResidentInfo = {
  fullname: string;
  gender: string;
};

export const FourpsPDF = (info: ResidentInfo) => {
  const recipient = `${info.gender === "Male" ? "MR." : "MS."} ${info.fullname.toUpperCase()}`;
  const date = new Date();
  const day = getOrdinal(getDate(date));
  const month = format(date, "MMMM");

  return (
    <Document>
      <Page size="A4" style={{ padding: 40 }}>
        <View style={{ alignItems: "center", marginBottom: 15 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#000",
              marginBottom: 10,
            }}
          />
          <Text style={{ fontSize: 12 }}>Republic of the Philippines</Text>
          <Text style={{ fontSize: 12 }}>Province of Camarines Sur</Text>
          <Text style={{ fontSize: 12 }}>Municipality of Pamplona</Text>
          <Text style={{ fontSize: 12, fontWeight: "bold" }}>BARANGAY TAMBO</Text>
          <Text style={{ fontSize: 12 }}>_o0o_</Text>
          <Text style={{ fontSize: 12, marginTop: 10 }}>OFFICE OF THE PUNONG BARANGAY</Text>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 12, letterSpacing: 2 }}>
            CERTIFICATION
          </Text>
        </View>

        <View style={{ fontSize: 12, marginVertical: 15 }}>
          <Text style={{ marginBottom: 8 }}>TO WHOM IT MAY CONCERN:</Text>

          <Text style={{ textAlign: "justify", marginBottom: 8 }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            This is to certify that <Text style={{ fontWeight: "bold" }}>{recipient}</Text>, legal age, is a resident of Barangay Tambo Pamplona Camarines Sur.
          </Text>

          <Text style={{ textAlign: "justify", marginBottom: 8 }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            This certifies further that the said above-named person is a member of (4Ps) Programang Pantawid Pamilyang Pilipino in this Barangay and has been transpired at Tambo Pamplona Camarines Sur.
          </Text>

          <Text style={{ textAlign: "justify", marginBottom: 8 }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            This certification is issued upon request of the interested party and application for record and reference purposes.
          </Text>

          <Text style={{ textAlign: "justify" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Given this {day} day of {month} {date.getFullYear()}, at Tambo Pamplona Camarines Sur.
          </Text>
        </View>

        <View style={{ alignItems: "flex-end", marginTop: 40 }}>
          <Text style={{ fontSize: 12, marginBottom: 4 }}>Certifying Officer,</Text>
          <Text style={{ fontSize: 12, fontWeight: "bold" }}>HON. JOHN CENA</Text>
          <Text style={{ fontSize: 12 }}>Punong Barangay</Text>
        </View>
      </Page>
    </Document>
  );
};
