export type TravelPlan = {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTravelPlanInput = {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description?: string;
};
