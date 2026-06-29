export type ItineraryItem = {
  id: string;
  plan_id: string;
  user_id: string;
  day_date: string;
  sort_order: number;
  title: string;
  location_name: string | null;
  lat: number | null;
  lng: number | null;
  notes: string | null;
  created_at: string;
};

export type CreateItineraryItemInput = {
  plan_id: string;
  day_date: string;
  title: string;
  location_name?: string;
  lat?: number;
  lng?: number;
  notes?: string;
};

export type ItineraryItemUpdate = {
  id: string;
  day_date: string;
  sort_order: number;
};

export type PlaceSearchResult = {
  title: string;
  location_name: string;
  lat: number;
  lng: number;
};
