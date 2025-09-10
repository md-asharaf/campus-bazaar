import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileSetupProps {
    isOpen: boolean;
    onComplete: (profileData: any) => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ isOpen, onComplete }) => {
    const [formData, setFormData] = useState({
        registrationNumber: "",
        branch: "",
        year: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const isFormValid = formData.registrationNumber && formData.branch && formData.year;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-background border rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="p-6 pb-4">
                    <h2 className="text-lg font-semibold">Complete your profile</h2>
                    <p className="text-sm text-muted-foreground">
                        Help us verify your student status
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input
                            id="registrationNumber"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            placeholder="e.g., 2021BCS001"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <select
                            id="branch"
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="">Select branch</option>
                            <option value="Computer Science Engineering">Computer Science Engineering</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics & Communication">Electronics & Communication</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <select
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="">Select year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="Graduate">Graduate</option>
                        </select>
                    </div>

                    <div className="bg-muted/50 rounded-md p-3">
                        <p className="text-xs text-muted-foreground">
                            You can verify your student status later by uploading your ID card.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={!isFormValid}
                        className="w-full"
                    >
                        Complete Profile
                    </Button>
                </form>
            </div>
        </div>
    );
};