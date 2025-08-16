// src/pages/BarangayMap.tsx
import { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { invoke } from "@tauri-apps/api/core";
import AddMapModal from "@/features/map/addMapModal";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { toast } from "sonner";

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

export default function BarangayMapPage() {
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<{
    marker: L.Marker;
    latlng: L.LatLng;
  } | null>(null);
  const [markerResidentMap, setMarkerResidentMap] = useState<
    Map<L.Marker, Resident>
  >(new Map());
  const mapRef = useRef<L.Map | null>(null);
  const [, setNewMarker] = useState<L.Marker | null>(null);
  const [households, setHouseholds] = useState<
    {
      id: number;
      name: string;
      x: number;
      y: number;
      houseNumber: string;
      zone: string;
      section: string;
    }[]
  >([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalCoords, setModalCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [notification, setNotification] = useState("");

  // New state for delete confirmation modal and selected household to delete
  const [deleteHousehold, setDeleteHousehold] = useState<{
    household: {
      id: number;
      name: string;
      x: number;
      y: number;
      houseNumber: string;
      zone: string;
      section: string;
    };
    marker: L.Marker;
  } | null>(null);

  const filteredHouseholds = useMemo(() => {
    return households.filter(
      (h) =>
        `${h.name}`.toLowerCase().includes(search.toLowerCase()) ||
        `${h.houseNumber}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [households, search]);

  // Search bar state
  const [searchQuery, setSearchQuery] = useState("");

  // Derived list of suggestions filtered from households using searchQuery
  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return households.filter(
      (h) =>
        (h.name && h.name.toLowerCase().includes(query)) ||
        (h.houseNumber && h.houseNumber.toLowerCase().includes(query))
    );
  }, [searchQuery, households]);

  useEffect(() => {
    invoke("fetch_household_heads_command")
      .then((res: any) => {
        setAllResidents(res || []);
      })
      .catch(() => {});
  }, []);

  // Fetch existing households from backend
  useEffect(() => {
    async function fetchHouseholds() {
      try {
        const data = await invoke("fetch_households");

        // Flatten if backend returned nested array
        const flattened: typeof households = Array.isArray(data)
          ? data.flat()
          : [];
        setHouseholds(flattened);
      } catch (error) {}
    }

    fetchHouseholds();
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map", {
        minZoom: 0,
        maxZoom: 2,
        center: [0, 0],
        zoom: 0,
        crs: L.CRS.Simple,
      });
      mapRef.current = map;

      const imageWidth = 5120;
      const imageHeight = 3840;
      const southWest = map.unproject([0, imageHeight], map.getMaxZoom());
      const northEast = map.unproject([imageWidth, 0], map.getMaxZoom());
      const bounds = new L.LatLngBounds(southWest, northEast);
      L.imageOverlay("/images/tambo-map.jpeg", bounds).addTo(map);
      map.fitBounds(bounds);
      map.setMaxBounds(bounds);

      map.on("click", (e) => {
        const marker = L.marker(e.latlng).addTo(map);
        marker.bindTooltip("New Household", {
          permanent: false,
          direction: "top",
          offset: L.point(0, -20),
        });

        marker.on("click", (evt) => {
          evt.originalEvent.preventDefault();
          evt.originalEvent.stopPropagation();
          setSelectedMarker({ marker, latlng: e.latlng });
          setModalCoords({ x: e.latlng.lng, y: e.latlng.lat });
          setModalOpen(true);
        });

        setSelectedMarker({ marker, latlng: e.latlng });
        setNewMarker(marker);
        setModalCoords({ x: e.latlng.lng, y: e.latlng.lat });
        setModalOpen(true);
      });
    }

    // Render markers for all households
    households.forEach((h) => {
      // Optionally check existing markers by iterating layers
      mapRef.current!.eachLayer((layer) => {
        // you can check if this layer is a marker, if needed
      });

      const marker = L.marker([h.y, h.x]).addTo(mapRef.current!);
      marker.bindTooltip(h.name, {
        permanent: false,
        direction: "top",
        offset: L.point(0, -20),
      });

      marker.on("click", async (evt) => {
        evt.originalEvent.preventDefault();
        evt.originalEvent.stopPropagation();
        // Find household corresponding to this marker
        const household = households.find(
          (house) => house.x === h.x && house.y === h.y && house.id === h.id
        );
        if (household) {
          setDeleteHousehold({ household, marker });
        }
      });
    });
  }, [households]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function handleModalSubmit(data: {
    resident_id?: number;
    name: string;
    x: number;
    y: number;
    houseNumber: string;
    zone: string;
    section: string;
  }) {
    if (!selectedMarker?.marker) {
      return;
    }

    const marker = selectedMarker.marker;

    if (data.resident_id === undefined) {
      alert("Please select a resident to save household.");
      return;
    }

    // Check if resident is already associated with any marker
    const residentAlreadyExists = Array.from(markerResidentMap.values()).some(
      (resident) => resident.id === data.resident_id
    );

    if (residentAlreadyExists) {
      setNotification(
        "This resident is already associated with a household on the map."
      );
      return;
    }

    try {
      const result = await invoke("insert_household", {
        resident_id: data.resident_id,
        x: data.x,
        y: data.y,
        houseNumber: data.houseNumber,
        zone: data.zone || "default_zone",
        section: data.section || "default_section",
      });

      alert(`✅ Household for ${data.name} saved successfully!`);

      marker.unbindPopup();
      marker.bindPopup(data.name, { offset: L.point(0, -20) }).openPopup();

      const resident = allResidents.find((r) => r.id === data.resident_id);
      if (resident) {
        setMarkerResidentMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(marker, resident);
          return newMap;
        });
      }

      setModalOpen(false);
      setSelectedMarker(null);
      setNewMarker(null);

      // Update households state to include newly added household
      setHouseholds((prev) => [
        ...prev,
        {
          id: Date.now(), // temporary unique id for frontend
          name: data.name,
          x: data.x,
          y: data.y,
          houseNumber: data.houseNumber,
          zone: data.zone,
          section: data.section,
        },
      ]);
    } catch (error: any) {
      alert(`❌ Failed to save household: ${error?.toString() || error}`);
    }
  }

  // Search handler
  function handleSearch(query?: string) {
    const searchTerm = (query !== undefined ? query : searchQuery)
      .trim()
      .toLowerCase();
    if (!searchTerm) return;
    // Find by name or household_number (houseNumber)
    const household = households.find(
      (h) =>
        (h.name && h.name.toLowerCase().includes(searchTerm)) ||
        (h.houseNumber && h.houseNumber.toLowerCase().includes(searchTerm))
    );
    if (household && mapRef.current) {
      mapRef.current.setView(
        [household.y, household.x],
        mapRef.current.getZoom() + 2
      );
      setSearchQuery(household.name);
    } else {
      alert("Household not found.");
    }
  }

  // Handler for confirming deletion
  async function confirmDelete() {
    if (!deleteHousehold) return;
    const { household, marker } = deleteHousehold;

    try {
      await invoke("delete_household", { id: household.id });
      // Remove marker from map
      mapRef.current?.removeLayer(marker);

      // Remove household from state
      setHouseholds((prev) => prev.filter((h) => h.id !== household.id));

      // Remove marker-resident association
      setMarkerResidentMap((prev) => {
        const newMap = new Map(prev);
        newMap.delete(marker);
        return newMap;
      });

      toast.success(`Household "${household.name}" deleted successfully!`);

      // Reload page to update map
      setTimeout(() => window.location.reload());
    } catch (error: any) {
      setNotification(
        `Failed to delete household: ${error?.toString() || error}`
      );
    } finally {
      setDeleteHousehold(null);
    }
  }

  // Handler for canceling deletion
  function cancelDelete() {
    setDeleteHousehold(null);
  }

  return (
    <>
      <style>
        {`
          .leaflet-pane {
            z-index: 0 !important;
          }
        `}
      </style>
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px 20px",
            textAlign: "center",
            zIndex: 1100,
            fontWeight: "bold",
          }}
        >
          {notification}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: 360,
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full flex justify-between"
            >
              {search || "Search household..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full">
            <Command>
              <CommandInput
                placeholder="Search household by name or number..."
                value={search}
                onValueChange={setSearch}
              />
              {filteredHouseholds.length === 0 ? (
                <CommandEmpty>No households found</CommandEmpty>
              ) : (
                <Virtuoso
                  style={{ height: 200 }}
                  totalCount={filteredHouseholds.length}
                  itemContent={(index) => {
                    const h = filteredHouseholds[index];
                    return (
                      <CommandItem
                        key={h.id}
                        value={h.name}
                        onSelect={() => {
                          if (mapRef.current) {
                            mapRef.current.setView(
                              [h.y, h.x],
                              mapRef.current.getZoom() + 2
                            );
                          }
                          setSearch(h.name);
                          setOpen(false);
                        }}
                      >
                        {h.name} ({h.houseNumber})
                      </CommandItem>
                    );
                  }}
                />
              )}
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div
        id="map"
        style={{
          width: "100%",
          height: "100vh",
          position: "relative",
          zIndex: 0,
        }}
        tabIndex={-1}
      />
      <AddMapModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        markerLatLng={{ lat: modalCoords.y, lng: modalCoords.x }}
        residents={allResidents}
        onSave={handleModalSubmit}
      />
      {/* Delete confirmation modal */}
      {deleteHousehold && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 8,
              maxWidth: 400,
              width: "90%",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: 20, fontWeight: "bold" }}>
              Are you sure you want to delete household "{deleteHousehold.household.name}"?
            </p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
