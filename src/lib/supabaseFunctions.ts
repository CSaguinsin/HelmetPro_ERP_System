import { supabase } from "./supabase";

// Define the expected structure of site_info data
export interface SiteInfo {
  site_id?: number; // Optional for inserts
  site_name: string;
  site_type: string;
  manager: string;
  location: string;
  created_at?: string; // Optional, managed by Supabase
  [key: string]: unknown; // Allow additional fields if necessary
}

// Fetch all site_info data
export const getSiteInfo = async (): Promise<SiteInfo[]> => {
  const { data, error } = await supabase.from("site_info").select("*");

  if (error) {
    console.error("Error fetching site_info:", error);
    return [];
  }

  return data as SiteInfo[]; // ✅ Explicitly cast to SiteInfo[]
};

// Create new site_info entry
export const addSiteInfo = async (formData: SiteInfo): Promise<boolean> => {
  const { error } = await supabase.from("site_info").insert([formData]);

  if (error) {
    console.error("Error inserting site_info:", error);
    return false;
  }

  return true;
};

// Update site_info entry
export const updateSiteInfo = async (site_id: number, formData: Partial<SiteInfo>): Promise<boolean> => {
  const { error } = await supabase.from("site_info").update(formData).eq("site_id", site_id);

  if (error) {
    console.error("Error updating site_info:", error);
    return false;
  }

  return true;
};

// Delete site_info entry
export const deleteSiteInfo = async (site_id: number): Promise<boolean> => {
  const { error } = await supabase.from("site_info").delete().eq("site_id", site_id);

  if (error) {
    console.error("Error deleting site_info:", error);
    return false;
  }

  return true;
};
