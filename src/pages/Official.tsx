// OfficialsPage.tsx
import { useState } from "react";
import ViewOfficialModal from "@/features/official/viewOfficialModal";
import donald from "../assets/donaldT.jpg";

const sections = [
  {
    title: "Barangay Officials",
    members: ["captain", "councilors"],
    type: "barangay",
  },
  {
    title: "Barangay Staffs",
    members: ["staffs"],
    type: "barangay",
  },
  {
    title: "SK Officials",
    members: ["captain", "councilors"],
    type: "sk",
  },
  {
    title: "Tanod Officials",
    members: ["chief", "members"],
    type: "tanod",
  },
];

const officials = {
  barangay: {
    captain: { name: "John Cena", role: "Captain", image: donald, section: "Barangay Officials", info: { age: 45, contact: "09123456789", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 1" } },
    councilors: [
      { name: "Councilor A", role: "Councilor", image: donald, section: "Barangay Officials", info: { age: 40, contact: "09123456788", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 2" } },
      { name: "Councilor B", role: "Councilor", image: donald, section: "Barangay Officials", info: { age: 39, contact: "09123456785", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 6" } },
      { name: "Councilor B", role: "Councilor", image: donald, section: "Barangay Officials", info: { age: 39, contact: "09123456785", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 6" } },
      { name: "Councilor B", role: "Councilor", image: donald, section: "Barangay Officials", info: { age: 39, contact: "09123456785", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 6" } },
      { name: "Councilor B", role: "Councilor", image: donald, section: "Barangay Officials", info: { age: 39, contact: "09123456785", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 6" } },
      { name: "Councilor B", role: "Councilor", image: donald, section: "Barangay Officials", info: { age: 39, contact: "09123456785", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 6" } },
      { name: "Councilor B", role: "Councilor", image: donald, section: "Barangay Officials", info: { age: 39, contact: "09123456785", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 6" } },
    ],
    staffs: [
      { name: "Secretary", role: "Secretary", image: donald, section: "Barangay Staffs", info: { age: 38, contact: "09123456777", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 3" } },
      { name: "Treasurer", role: "Treasurer", image: donald, section: "Barangay Staffs", info: { age: 42, contact: "09123456776", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 4" } },
      { name: "Caretaker", role: "Caretaker", image: donald, section: "Barangay Staffs", info: { age: 37, contact: "09123456775", termStart: "2022-01-01", termEnd: "2025-01-01", zone: "Zone 5" } },
    ],
  },
  sk: {
    captain: { name: "SK Chair", role: "SK Chairman", image: donald, section: "SK Officials", info: { age: 25, contact: "09123456770", termStart: "2023-01-01", termEnd: "2026-01-01", zone: "Zone A" } },
    councilors: [
      { name: "SK Kagawad 1", role: "SK Kagawad", image: donald, section: "SK Officials", info: { age: 22, contact: "09123456771", termStart: "2023-01-01", termEnd: "2026-01-01", zone: "Zone B" } },
      { name: "SK Kagawad 1", role: "SK Kagawad", image: donald, section: "SK Officials", info: { age: 22, contact: "09123456771", termStart: "2023-01-01", termEnd: "2026-01-01", zone: "Zone B" } },
      { name: "SK Kagawad 1", role: "SK Kagawad", image: donald, section: "SK Officials", info: { age: 22, contact: "09123456771", termStart: "2023-01-01", termEnd: "2026-01-01", zone: "Zone B" } },
      { name: "SK Kagawad 1", role: "SK Kagawad", image: donald, section: "SK Officials", info: { age: 22, contact: "09123456771", termStart: "2023-01-01", termEnd: "2026-01-01", zone: "Zone B" } },
      { name: "SK Kagawad 1", role: "SK Kagawad", image: donald, section: "SK Officials", info: { age: 22, contact: "09123456771", termStart: "2023-01-01", termEnd: "2026-01-01", zone: "Zone B" } },
      { name: "SK Kagawad 1", role: "SK Kagawad", image: donald, section: "SK Officials", info: { age: 22, contact: "09123456771", termStart: "2023-01-01", termEnd: "2026-01-01", zone: "Zone B" } },
      { name: "SK Kagawad 1", role: "SK Kagawad", image: donald, section: "SK Officials", info: { age: 22, contact: "09123456771", termStart: "2023-01-01", termEnd: "2026-01-01", zone: "Zone B" } },
    ],
  },
  tanod: {
    chief: { name: "Chief Tanod", role: "Chief", image: donald, section: "Tanod Officials", info: { age: 50, contact: "09123456772", termStart: "2021-01-01", termEnd: "2024-01-01", zone: "Zone C" } },
    members: [
      { name: "Tanod A", role: "Tanod", image: donald, section: "Tanod Officials", info: { age: 48, contact: "09123456773", termStart: "2021-01-01", termEnd: "2024-01-01", zone: "Zone D" } },
      { name: "Tanod A", role: "Tanod", image: donald, section: "Tanod Officials", info: { age: 48, contact: "09123456773", termStart: "2021-01-01", termEnd: "2024-01-01", zone: "Zone D" } },
      { name: "Tanod A", role: "Tanod", image: donald, section: "Tanod Officials", info: { age: 48, contact: "09123456773", termStart: "2021-01-01", termEnd: "2024-01-01", zone: "Zone D" } },
      { name: "Tanod A", role: "Tanod", image: donald, section: "Tanod Officials", info: { age: 48, contact: "09123456773", termStart: "2021-01-01", termEnd: "2024-01-01", zone: "Zone D" } },
      { name: "Tanod A", role: "Tanod", image: donald, section: "Tanod Officials", info: { age: 48, contact: "09123456773", termStart: "2021-01-01", termEnd: "2024-01-01", zone: "Zone D" } },
      { name: "Tanod A", role: "Tanod", image: donald, section: "Tanod Officials", info: { age: 48, contact: "09123456773", termStart: "2021-01-01", termEnd: "2024-01-01", zone: "Zone D" } },
      { name: "Tanod A", role: "Tanod", image: donald, section: "Tanod Officials", info: { age: 48, contact: "09123456773", termStart: "2021-01-01", termEnd: "2024-01-01", zone: "Zone D" } },
    ],
  },
};

export default function OfficialsPage() {
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const viewMore = (official) => setSelectedOfficial(official);

  const ProfileCard = ({ person }) => (
    <div
      onClick={() => viewMore(person)}
      className="cursor-pointer p-3 rounded-lg bg-white shadow-md hover:bg-gray-100 w-50 h-auto text-center scale-[0.95] hover:scale-100 transition-transform"
    >
      <img src={person.image} alt={person.name} className="rounded-full w-34 h-34 mx-auto object-cover mb-2" />
      <p className="text-base font-bold">{person.name}</p>
      <p className="text-sm font-bold text-gray-700">{person.role}</p>
      <div className="text-sm text-gray-700 mt-2 space-y-1">
        {person.info?.age && <p>Age: {person.info.age}</p>}
        {person.info?.contact && <p>Contact: {person.info.contact}</p>}
        {person.info?.termStart && <p>Term Start: {person.info.termStart}</p>}
        {person.info?.termEnd && <p>Term End: {person.info.termEnd}</p>}
        {person.info?.zone && <p>Zone: {person.info.zone}</p>}
      </div>
    </div>
  );

  return (
    <div className="ml-0 pl-0 pr-2 py-6 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scale-90 xl:scale-79 origin-top-left transition-transform">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Officials</h1>
      </div>

      {sections.map((section, index) => (
        <div key={index}>
          <div className="h-0.5 w-full bg-gray-500/20 my-8" />
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-center">{section.title}</h2>
            <div className="flex flex-col items-center space-y-4 mt-4">
              {section.members.map((key) => {
                const value = officials[section.type][key];
                if (Array.isArray(value)) {
                  const isCouncilorRow = key === "councilors" && section.members.includes("captain");
                  return (
                    <div
                      key={key}
                      className={`flex ${isCouncilorRow ? "flex-row flex-nowrap overflow-x-auto gap-6 justify-start w-full" : "gap-6 flex-wrap justify-center"}`}
                    >
                      {value.map((person, i) => (
                        <ProfileCard key={`${key}-${i}`} person={person} />
                      ))}
                    </div>
                  );
                } else if (value) {
                  return <ProfileCard key={key} person={value} />;
                }
                return null;
              })}
            </div>
          </section>
        </div>
      ))}
      {selectedOfficial && (
        <ViewOfficialModal person={selectedOfficial} onClose={() => setSelectedOfficial(null)} />
      )}
    </div>
  );
}
