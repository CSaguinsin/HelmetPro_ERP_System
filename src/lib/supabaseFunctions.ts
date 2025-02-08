import { supabase } from "./supabase";

// Fetch all site_info data
export const getSiteInfo = async () => {
  const { data, error } = await supabase.from("site_info").select("*");
  if (error) {
    console.error("Error fetching site_info:", error);
    return [];
  }
  return data;
};

// Create new site_info entry
export const addSiteInfo = async (formData: any) => {
  const { error } = await supabase.from("site_info").insert([formData]);
  if (error) {
    console.error("Error inserting site_info:", error);
    return false;
  }
  return true;
};

// Update site_info entry
export const updateSiteInfo = async (site_id: number, formData: any) => {
  const { error } = await supabase.from("site_info").update(formData).eq("site_id", site_id);
  if (error) {
    console.error("Error updating site_info:", error);
    return false;
  }
  return true;
};

// Delete site_info entry
export const deleteSiteInfo = async (site_id: number) => {
  const { error } = await supabase.from("site_info").delete().eq("site_id", site_id);
  if (error) {
    console.error("Error deleting site_info:", error);
    return false;
  }
  return true;
};
