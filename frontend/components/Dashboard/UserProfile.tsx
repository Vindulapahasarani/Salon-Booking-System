"use client";

import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";

const UserProfile = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        city: user.city || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put("/auth/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled // Email should typically not be editable
        />
        <Input
          name="mobile"
          type="text"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
        />
        <Input
          name="city"
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
