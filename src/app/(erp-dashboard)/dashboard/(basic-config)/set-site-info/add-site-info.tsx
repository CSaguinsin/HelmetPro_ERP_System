"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddSiteInfoProps {
  onClose: () => void;
}

export default function AddSiteInfo({ onClose }: AddSiteInfoProps) {
  const [formData, setFormData] = useState({
    siteId: "",
    siteName: "",
    siteType: "",
    manager: "",
    siteAddress: "",
    siteTelephone: "",
    currency: "",
    department: "",
    timeZone: "",
    zoneOffset: "",
    areaCode: "",
    depositPushUrl: "",
    withdrawPushUrl: "",
    siteStatus: "",
    smsSign: "",
    textingOverTime: "",
    remarks: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    onClose(); // Close modal after submission
  };

  return (
    <div>
      {/* Glassmorphic Header */}


      {/* Form Wrapper */}
      <div className="p-8 bg-gray-50">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="siteId" placeholder="Site ID" value={formData.siteId} onChange={handleChange} className="input-style" />
            <Input name="siteName" placeholder="Site Name" value={formData.siteName} onChange={handleChange} className="input-style" />

            <Select onValueChange={(value) => setFormData({ ...formData, siteType: value })}>
              <SelectTrigger className="select-style">
                <SelectValue placeholder="Select Site Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setFormData({ ...formData, manager: value })}>
              <SelectTrigger className="select-style">
                <SelectValue placeholder="Select Manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john_doe">John Doe</SelectItem>
                <SelectItem value="jane_smith">Jane Smith</SelectItem>
              </SelectContent>
            </Select>

            <Input name="siteAddress" placeholder="Site Address" value={formData.siteAddress} onChange={handleChange} className="input-style" />
            <Input name="siteTelephone" placeholder="Telephone Number" value={formData.siteTelephone} onChange={handleChange} className="input-style" />

            <Select onValueChange={(value) => setFormData({ ...formData, currency: value })}>
              <SelectTrigger className="select-style">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="gbp">GBP</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setFormData({ ...formData, department: value })}>
              <SelectTrigger className="select-style">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>

            <Input name="timeZone" placeholder="Time Zone" value={formData.timeZone} onChange={handleChange} className="input-style" />
            <Input name="zoneOffset" type="number" placeholder="Zone Offset (minutes)" value={formData.zoneOffset} onChange={handleChange} className="input-style" />
            <Input name="areaCode" placeholder="Area Code" value={formData.areaCode} onChange={handleChange} className="input-style" />
            <Input name="depositPushUrl" placeholder="Deposit Push URL" value={formData.depositPushUrl} onChange={handleChange} className="input-style" />
            <Input name="withdrawPushUrl" placeholder="Withdraw Push URL" value={formData.withdrawPushUrl} onChange={handleChange} className="input-style" />

            <Select onValueChange={(value) => setFormData({ ...formData, siteStatus: value })}>
              <SelectTrigger className="select-style">
                <SelectValue placeholder="Select Site Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Input name="smsSign" placeholder="SMS Sign" value={formData.smsSign} onChange={handleChange} className="input-style" />

            <Select onValueChange={(value) => setFormData({ ...formData, textingOverTime: value })}>
              <SelectTrigger className="select-style">
                <SelectValue placeholder="Select Texting Over Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allowed">Allowed</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
                <SelectItem value="not_allowed">Not Allowed</SelectItem>
              </SelectContent>
            </Select>

            <Input name="remarks" placeholder="Remarks" value={formData.remarks} onChange={handleChange} className="input-style" />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              Cancel
            </Button>
            <Button variant="default" type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
