import { Document, Page, Text, View } from "@react-pdf/renderer"

type Props = {
  filter: string
}

export const BlotterPDF = ({ filter }: Props) => {
  return (
    <Document>
      <Page
        orientation="landscape"
        size="A4"
        wrap={false}
      >
        <View style={{ margin: "20px" }}>
          <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Text>Republic of the Philippines</Text>
            <Text>Province of Camarines Sur</Text>
            <Text>Municipality of Pamplona</Text>
          </View>
          <View style={{ margin: "40px" }}>
            <Text>{filter}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
