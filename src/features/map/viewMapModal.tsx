// src/features/map/viewMapModal.tsx
import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

type Resident = {
  zone: string;
  section: string;
  household_number: string;
  id?: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  date_of_birth?: string;
  civil_status?: string;
};

type ViewMapModalProps = {
  open: boolean;
  onClose: () => void;
  markerLatLng: { lat: number; lng: number } | null;
  onSave: (household: {
    name: string;
    x: number;
    y: number;
    house_number: string;
    zone: string;
    section: string;
  }) => void;
  residents: Resident[];
  household?: {
    name: string;
    x: number;
    y: number;
    house_number: string;
    zone: string;
    section: string;
    residentId?: number;
  };
};

export default function ViewMapModal({
  open,
  onClose,
  markerLatLng,
  onSave,
  residents,
  household,
}: ViewMapModalProps) {
  const [name, setName] = useState("");
  const [x, setX] = useState<number>(markerLatLng ? markerLatLng.lng : 0);
  const [y, setY] = useState<number>(markerLatLng ? markerLatLng.lat : 0);
  const [houseNumber, setHouseNumber] = useState("");
  const [zone, setZone] = useState("");
  const [section, setSection] = useState("");
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");
  const [residentSearch, setResidentSearch] = useState("");
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  useEffect(() => {
    if (household) {
      setName(household.name);
      setX(household.x);
      setY(household.y);
      setHouseNumber(household.house_number);
      setZone(household.zone);
      setSection(household.section);
      setSelectedResidentId(household.residentId?.toString() || "");
      setResidentSearch(household.name);
    } else if (markerLatLng) {
      setX(markerLatLng.lng);
      setY(markerLatLng.lat);
      setName("");
      setHouseNumber("");
      setZone("");
      setSection("");
      setSelectedResidentId("");
      setResidentSearch("");
    }
  }, [household, markerLatLng]);

  function handleResidentChange(e: React.ChangeEvent<HTMLInputElement>) {
    setResidentSearch(e.target.value);
    setSuggestionsVisible(true);
  }

  function handleResidentSelect(resident: Resident) {
    const fullName = `${resident.first_name} ${resident.middle_name ? resident.middle_name + " " : ""}${resident.last_name}${resident.suffix ? ", " + resident.suffix : ""}`;
    setName(fullName);
    setHouseNumber(resident.household_number || "");
    setZone(resident.zone || "");
    setSection(resident.section || "Default Section");
    setSelectedResidentId(resident.id?.toString() || "");
    setResidentSearch(fullName);
    setSuggestionsVisible(false);
  }

  function handleResidentKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const match = residents.find((r) => {
        const fullName = `${r.first_name} ${r.middle_name ? r.middle_name + " " : ""}${r.last_name}${r.suffix ? ", " + r.suffix : ""}`;
        return fullName.toLowerCase() === residentSearch.trim().toLowerCase();
      });
      if (match) handleResidentSelect(match);
      setSuggestionsVisible(false);
    }
  }

  async function handleDelete() {
    if (!selectedResidentId) {
      alert("Please select a resident to delete.");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to delete this household?");
    if (!confirmed) return;
    try {
      await invoke("delete_household", { residentId: Number(selectedResidentId) });
      alert("Household deleted successfully.");
      onClose();
    } catch (err) {
      alert("Failed to delete household. Check console for details.");
      console.error(err);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      alert("Please enter a name.");
      return;
    }

    try {
      await invoke("save_household", {
        name,
        x,
        y,
        house_number: houseNumber,
        zone,
        section,
        residentId: selectedResidentId ? Number(selectedResidentId) : undefined,
      });

      alert(`Household for ${name} saved successfully!`);
      onSave({ name, x, y, house_number: houseNumber, zone, section });
      onClose();
    } catch (err) {
      alert("Failed to save household. Check console for details.");
      console.error(err);
    }
  }

  if (!open) return null;

  const filteredResidents = residents.filter((r) => {
    const fullName = `${r.first_name} ${r.middle_name ? r.middle_name + " " : ""}${r.last_name}${r.suffix ? ", " + r.suffix : ""}`.toLowerCase();
    return fullName.includes(residentSearch.toLowerCase());
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          padding: 20,
          width: 320,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>View / Edit Household</h2>

        {/* Resident Search Input and Suggestions */}
        <div style={{ marginBottom: 16, position: "relative" }}>
          <label style={{ display: "block", marginBottom: 4 }}>Search Resident</label>
          <input
            type="text"
            value={residentSearch}
            onChange={handleResidentChange}
            onKeyDown={handleResidentKeyDown}
            placeholder="Search resident name"
            style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
            onFocus={() => setSuggestionsVisible(true)}
            onBlur={() => setTimeout(() => setSuggestionsVisible(false), 150)}
          />
          {suggestionsVisible && residentSearch.trim() !== "" && filteredResidents.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: 150,
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: 4,
                backgroundColor: "white",
                margin: 0,
                padding: 0,
                listStyleType: "none",
                zIndex: 10001,
              }}
            >
              {filteredResidents.map((r) => {
                const fullName = `${r.first_name} ${r.middle_name ? r.middle_name + " " : ""}${r.last_name}${r.suffix ? ", " + r.suffix : ""}`;
                return (
                  <li
                    key={r.id}
                    onClick={() => handleResidentSelect(r)}
                    style={{ padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {fullName}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Fields */}
        {[
          { label: "Name", value: name, setter: setName },
          { label: "X (Longitude)", value: x, setter: setX, type: "number" },
          { label: "Y (Latitude)", value: y, setter: setY, type: "number" },
          { label: "House Number", value: houseNumber, setter: setHouseNumber },
          { label: "Zone", value: zone, setter: setZone },
          { label: "Section", value: section, setter: setSection },
        ].map((field, idx) => (
          <div key={idx} style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4 }}>{field.label}</label>
            <input
              type={field.type || "text"}
              value={field.value}
              placeholder={field.label}
              onChange={(e) => {
                if (field.type === "number") {
                  (field.setter as React.Dispatch<React.SetStateAction<number>>)(Number(e.target.value));
                } else {
                  (field.setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value);
                }
              }}
              style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>
        ))}

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={onClose}
            style={{ padding: "8px 16px", borderRadius: 4, border: "1px solid #ccc", backgroundColor: "white", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            style={{ padding: "8px 16px", borderRadius: 4, border: "none", backgroundColor: "#dc3545", color: "white", cursor: "pointer" }}
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            style={{ padding: "8px 16px", borderRadius: 4, border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
