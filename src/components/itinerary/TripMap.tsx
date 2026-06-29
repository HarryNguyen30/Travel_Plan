"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import type { ItineraryItem } from "@/types/itinerary-item";
import "leaflet/dist/leaflet.css";

function createNumberedIcon(order: number) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 28px;
      height: 28px;
      background: #0ea5e9;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 700;
    ">${order}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function FitBounds({ items }: { items: ItineraryItem[] }) {
  const map = useMap();

  useEffect(() => {
    const points = items
      .filter((item) => item.lat != null && item.lng != null)
      .map((item) => [item.lat!, item.lng!] as [number, number]);

    if (points.length === 0) {
      map.setView([16.0544, 108.2022], 6);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }

    map.fitBounds(points, { padding: [40, 40] });
  }, [items, map]);

  return null;
}

type TripMapProps = {
  items: ItineraryItem[];
  destination: string;
};

export function TripMap({ items, destination }: TripMapProps) {
  const mappedItems = items.filter((item) => item.lat != null && item.lng != null);
  const route: [number, number][] = mappedItems.map(
    (item) => [item.lat!, item.lng!] as [number, number]
  );

  const center: [number, number] =
    mappedItems.length > 0
      ? [mappedItems[0].lat!, mappedItems[0].lng!]
      : [16.0544, 108.2022];

  return (
    <div className="h-full min-h-[360px] overflow-hidden rounded-2xl border border-border">
      {mappedItems.length === 0 ? (
        <div className="flex h-full min-h-[360px] flex-col items-center justify-center bg-slate-50 px-6 text-center">
          <p className="font-medium text-foreground">Chưa có địa điểm trên bản đồ</p>
          <p className="mt-2 text-sm text-muted">
            Thêm địa điểm có tọa độ để xem lộ trình trong ngày tại {destination}.
          </p>
        </div>
      ) : (
        <MapContainer center={center} zoom={13} className="h-full min-h-[360px] w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds items={mappedItems} />
          {route.length > 1 && (
            <Polyline
              positions={route}
              pathOptions={{ color: "#0ea5e9", weight: 4, opacity: 0.85, dashArray: "8 8" }}
            />
          )}
          {mappedItems.map((item, index) => (
            <Marker
              key={item.id}
              position={[item.lat!, item.lng!]}
              icon={createNumberedIcon(index + 1)}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">
                    {index + 1}. {item.title}
                  </p>
                  {item.location_name && (
                    <p className="mt-1 text-slate-600">{item.location_name}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
