import CustomEstablishment from "@/components/icons/CustomEstablishments";
import CustomFemale from "@/components/icons/CustomFemale";
import CustomHouse from "@/components/icons/CustomHouse";
import CustomMale from "@/components/icons/CustomMale";
import CustomPopulation from "@/components/icons/CustomPopulation";
import CustomPWD from "@/components/icons/CustomPWD";
import CustomSenior from "@/components/icons/CustomSenior";
import CustomVoters from "@/components/icons/CustomVoters";
import CategoryCard from "@/components/ui/categorycard";
import ExpenseChart from "@/components/ui/expensechart";
import Greet from "@/components/ui/greetings";
import IncomeChart from "@/components/ui/incomechart";
import PopulationChart from "@/components/ui/populationchart";

const categories = [
  {
    title: "Households",
    count: 200,
    icon: CustomHouse,
  },
  {
    title: "Population",
    count: 22000,
    icon: CustomPopulation,
  },
  {
    title: "Registered Voters",
    count: 2,
    icon: CustomVoters,
  },
  {
    title: "Establishments",
    count: 2,
    icon: CustomEstablishment,
  },
  {
    title: "Male",
    count: 2,
    icon: CustomMale,
  },
  {
    title: "Female",
    count: 2,
    icon: CustomFemale,
  },
  {
    title: "Senior",
    count: 2,
    icon: CustomSenior,
  },
  {
    title: "PWD",
    count: 2,
    icon: CustomPWD,
  },
];

const PopulationData = [
  {
    population: 100,
    zone: 1,
  },
  {
    population: 100,
    zone: 2,
  },
  {
    population: 100,
    zone: 3,
  },
  {
    population: 100,
    zone: 4,
  },
  {
    population: 100,
    zone: 5,
  },
  {
    population: 200,
    zone: 6,
  },
];

const IncomeData = [
  {
    source: "Local Revenue",
    description: "Income from barangay permits, and services",
    fill: "#7F50CC",
    value: 37, // (750 / 2050) * 100 ≈ 36.59
  },
  {
    source: "Tax Revenue",
    description: "Collected community and property taxes",
    fill: "#440987",
    value: 15, // (300 / 2050) * 100 ≈ 14.63
  },
  {
    source: "Government Grants",
    description: "National or local government financial support",
    fill: "#3830CE",
    value: 24, // (500 / 2050) * 100 ≈ 24.39
  },
  {
    source: "Service Revenue",
    description: "Barangay clearances, document fees, etc.",
    fill: "#8D9BFF",
    value: 5, // (100 / 2050) * 100 ≈ 4.88
  },
  {
    source: "Rental Income",
    description: "Rental of barangay properties/facilities",
    fill: "#5165F6",
    value: 5, // (100 / 2050) * 100 ≈ 4.88
  },
  {
    source: "Government Funds (IRA)",
    description: "Internal Revenue Allotment (IRA)",
    fill: "#4E3D8F",
    value: 5, // (100 / 2050) * 100 ≈ 4.88
  },
  {
    source: "Others",
    description: "Donations, grants, or other income",
    fill: "#9A8CFF",
    value: 10, // (200 / 2050) * 100 ≈ 9.76
  },
];


const ExpenseData = [
  {
    source: "Infrastructure Expenses",
    description: "Spending on buildings, and roads",
    fill: "#7F50CC",
    value: 37, // (750 / 2050) * 100 ≈ 36.59
  },
  {
    source: "Honoraria",
    description: "Payments given to public servants or officials",
    fill: "#440987",
    value: 15, // (300 / 2050) * 100 ≈ 14.63
  },
  {
    source: "Utilities",
    description: "Electricity, water, communication, etc.",
    fill: "#3830CE",
    value: 24, // (500 / 2050) * 100 ≈ 24.39
  },
  {
    source: "Local Funds Used",
    description: "Expenses covered by the local fund",
    fill: "#8D9BFF",
    value: 10, // (200 / 2050) * 100 ≈ 9.76
  },
  {
    source: "Foods",
    description: "Food expenses for programs, meetings, etc.",
    fill: "#5165F6",
    value: 5, // (100 / 2050) * 100 ≈ 4.88
  },
  {
    source: "IRA Used",
    description: "Portion of Internal Revenue Allotment spent",
    fill: "#4E3D8F",
    value: 5, // (100 / 2050) * 100 ≈ 4.88
  },
  {
    source: "Others",
    description: "Miscellaneous or unclassified expenses",
    fill: "#9A8CFF",
    value: 5, // (100 / 2050) * 100 ≈ 4.88
  },
];


export default function Dashboard() {
  return (
    <div className="w-screen h-screen overflow-y-auto overflow-x-hidden">
      {/* Wrapper that controls overall scale and margin */}
      <div className="scale-[81%] origin-top-left mx-auto w-[100%] box-border">
        <Greet />

        <div className="flex gap-6 my-6 flex-wrap justify-around flex-1">
          {categories.map((category, i) => (
            <div key={i} className="w-[22%] min-w-[150px]">
              <CategoryCard
                title={category.title}
                count={category.count}
                icon={category.icon}
              />
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-5 ml-3 mr-0 w-full">
          <div className="w-[100%] min-w-[300px]">
            <PopulationChart data={PopulationData} />
          </div>
            <div className="flex flex-row gap-5 w-full">
            <div className="w-[50%] min-w-[300px]">
              <IncomeChart data={IncomeData} />
            </div>
            <div className="w-[50%] min-w-[300px]">
              <ExpenseChart data={ExpenseData} />
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}
