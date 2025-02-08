"use client";

import { useState } from "react";
import { addSiteInfo } from "@/lib/supabaseFunctions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddSiteInfoProps {
  onClose: () => void;
}

export default function AddSiteInfo({ onClose }: AddSiteInfoProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    site_name: "",
    site_type: "",
    manager: "",
    site_address: "",
    site_telephone_number: "",
    currency: "",
    department: "",
    time_zone: "",
    zone_offset: 0,
    area_code: "",
    deposit_push_url: "",
    withdraw_push_url: "",
    site_status: "Available",
    sms_sign: "",
    texting_over_time: "No",
    remarks: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await addSiteInfo(formData);
    if (success) {
      alert("Site info added successfully!");
      onClose();
      window.location.reload(); // Refresh data after adding new entry
    } else {
      alert("Error saving site info");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="site_name" placeholder="Site Name" value={formData.site_name} onChange={handleChange} required />
          
          <Select onValueChange={(value) => handleSelectChange("site_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Site Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="office">Office</SelectItem>
            </SelectContent>
          </Select>

          <Input name="manager" placeholder="Manager Name" value={formData.manager} onChange={handleChange} required />
          <Input name="site_address" placeholder="Site Address" value={formData.site_address} onChange={handleChange} required />
          <Input name="site_telephone_number" placeholder="Telephone Number" value={formData.site_telephone_number} onChange={handleChange} required />

          <Select onValueChange={(value) => handleSelectChange("currency", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleSelectChange("department", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Limbagsik">Limbagsik</SelectItem>
              <SelectItem value="Limbagsik06--canada">Limbagsik06--canada</SelectItem>
            </SelectContent>
          </Select>
          <Input name="time_zone" placeholder="Time Zone" value={formData.time_zone} onChange={handleChange} required />
          <Input name="zone_offset" type="number" placeholder="Zone Offset (minutes)" value={formData.zone_offset} onChange={handleChange} required />
          <Input name="area_code" placeholder="Area Code" value={formData.area_code} onChange={handleChange} required />
          <Input name="deposit_push_url" placeholder="Deposit Push URL" value={formData.deposit_push_url} onChange={handleChange} />
          <Input name="withdraw_push_url" placeholder="Withdraw Push URL" value={formData.withdraw_push_url} onChange={handleChange} />

          <Select onValueChange={(value) => handleSelectChange("site_status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Site Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Input name="sms_sign" placeholder="SMS Sign" value={formData.sms_sign} onChange={handleChange} />

          <Select onValueChange={(value) => handleSelectChange("texting_over_time", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Texting Over Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>

          <Input name="remarks" placeholder="Remarks" value={formData.remarks} onChange={handleChange} />
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="default" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
