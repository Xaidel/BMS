import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./Stylesheet";

type Props = {
  filter: string;
  households: any[];
};

export const HouseholdPDF = ({ filter, households }: Props) => {
  return (
    <Document>
      <Page orientation="landscape" size="A4" wrap={false}>
        <View style={{ margin: "20px" }}>
          <View style={styles.header}>
            <Text>Republic of the Philippines</Text>
            <Text>Province of Camarines Sur</Text>
            <Text>Municipality of Pamplona</Text>
          </View>
          <View style={{ margin: "40px" }}>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 14 }}>{filter}</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.headerCell}><Text>ID</Text></View>
              <View style={styles.headerCell}><Text>House #</Text></View>
              <View style={styles.headerCell}><Text>Head</Text></View>
              <View style={styles.headerCell}><Text>Zone</Text></View>
              <View style={styles.headerCell}><Text>Members</Text></View>
              <View style={styles.headerCell}><Text>Households with PWD</Text></View>
              <View style={styles.headerCell}><Text>Households with Senior</Text></View>
              <View style={styles.headerCell}><Text>Low Income</Text></View>
            </View>
            <View style={styles.table}>
              {households.map((household, index) => {
                return (
                  <View
                    style={[
                      styles.tableRow,
                      { backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }
                    ]}
                    key={household.id || index}
                  >
                    <View style={styles.tableCell}><Text>{household.id}</Text></View>
                    <View style={styles.tableCell}><Text>{household.household_number}</Text></View>
                    <View style={styles.tableCell}>
                      <Text>
                        {household.full_name || [household.last_name, household.first_name, household.middle_name, household.suffix].filter(Boolean).join(" ")}
                      </Text>
                    </View>
                    <View style={styles.tableCell}><Text>{household.zone}</Text></View>
                    <View style={styles.tableCell}><Text>{household.members}</Text></View>
                    <View style={styles.tableCell}><Text>{household.has_pwd ? "Yes" : "No"}</Text></View>
                    <View style={styles.tableCell}><Text>{household.has_senior ? "Yes" : "No"}</Text></View>
                    <View style={styles.tableCell}><Text>{household.low_income ? "Yes" : "No"}</Text></View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};