export interface Tomb {
  id: string;
  owner_gh_user: string;
  lobster_name: string;
  avatar_url?: string;
  born_at: string;
  died_at: string;
  cause_of_death: string;
  personality_tags?: string[];
  epitaph?: string;
  incense_count: number;
  gift_total: number;
  created_at: string;
  updated_at: string;
}

export interface IncenseLog {
  id: string;
  tomb_id: string;
  visitor_gh_user?: string;
  message?: string;
  count: number;
  created_at: string;
}

export interface GiftLog {
  id: string;
  tomb_id: string;
  from_gh_user?: string;
  amount: number;
  gift_type?: string;
  message?: string;
  created_at: string;
}
