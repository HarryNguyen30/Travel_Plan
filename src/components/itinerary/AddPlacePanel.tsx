"use client";

import { useState, useTransition } from "react";
import { addItineraryItem, searchPlaces } from "@/app/actions/itinerary-items";
import type { ItineraryItem, PlaceSearchResult } from "@/types/itinerary-item";

type AddPlacePanelProps = {
  planId: string;
  dayDate: string;
  destination: string;
  onAdded: (item: ItineraryItem) => void;
};

export function AddPlacePanel({
  planId,
  dayDate,
  destination,
  onAdded,
}: AddPlacePanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [error, setError] = useState("");
  const [isSearching, startSearch] = useTransition();
  const [isAdding, startAdd] = useTransition();

  function handleSearch() {
    setError("");
    startSearch(async () => {
      const places = await searchPlaces(query, destination);
      setResults(places);
      if (places.length === 0) {
        setError("Không tìm thấy địa điểm. Thử tên khác hoặc thêm tên thành phố.");
      }
    });
  }

  function handleAdd(place: PlaceSearchResult) {
    setError("");
    startAdd(async () => {
      const result = await addItineraryItem({
        plan_id: planId,
        day_date: dayDate,
        title: place.title,
        location_name: place.location_name,
        lat: place.lat,
        lng: place.lng,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setQuery("");
      setResults([]);
      onAdded(result.item);
    });
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">Thêm địa điểm</h3>
      <p className="mt-1 text-xs text-muted">
        Tìm điểm tham quan gần {destination}
      </p>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          placeholder="VD: Bãi biển Mỹ Khê, Chùa Linh Ứng..."
          className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching || query.trim().length < 2}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? "..." : "Tìm"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((place) => (
            <li
              key={`${place.lat}-${place.lng}-${place.title}`}
              className="rounded-lg border border-border p-3"
            >
              <p className="text-sm font-medium text-foreground">{place.title}</p>
              <p className="mt-1 text-xs text-muted">{place.location_name}</p>
              <button
                type="button"
                onClick={() => handleAdd(place)}
                disabled={isAdding}
                className="mt-3 rounded-md bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-100 disabled:opacity-60"
              >
                {isAdding ? "Đang thêm..." : "Thêm vào ngày này"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
