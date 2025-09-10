import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../../contexts/AuthContext";
import { 
    PersonIcon,
    EnvelopeClosedIcon,
    Cross2Icon,
    Pencil1Icon,
    ExitIcon,
    CheckCircledIcon,
    ClockIcon,
    LockClosedIcon
} from "@radix-ui/react-icons";

interface UserProfileProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
    const { user, logout, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        branch: user?.branch || "",
        year: user?.year || "",
        registrationNumber: user?.registrationNumber || ""
    });

    const handleSave = () => {
        updateProfile(editData);
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    const getVerificationBadge = () => {
        if (!user) return null;
        
        const status = user.verificationStatus || 'none';
        
        switch (status) {
            case 'approved':
                return (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <CheckCircledIcon className="h-3 w-3" />
                        Verified
                    </div>
                );
            case 'pending':
                return (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        <ClockIcon className="h-3 w-3" />
                        Pending
                    </div>
                );
            default:
                return (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                        <LockClosedIcon className="h-3 w-3" />
                        Unverified
                    </div>
                );
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-background border rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                            {user.picture ? (
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <PersonIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="font-semibold">{user.name}</h2>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <EnvelopeClosedIcon className="h-3 w-3" />
                                {user.email}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8"
                    >
                        <Cross2Icon className="h-4 w-4" />
                    </Button>
                </div>

                <div className="px-6 pb-2">
                    {getVerificationBadge()}
                </div>

                {/* Profile Details */}
                <div className="px-6 pb-6 space-y-4">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="registrationNumber">Registration Number</Label>
                                <Input
                                    id="registrationNumber"
                                    value={editData.registrationNumber}
                                    onChange={(e) => setEditData({...editData, registrationNumber: e.target.value})}
                                    placeholder="Enter registration number"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="branch">Branch</Label>
                                <select
                                    id="branch"
                                    value={editData.branch}
                                    onChange={(e) => setEditData({...editData, branch: e.target.value})}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select Branch</option>
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
                                    value={editData.year}
                                    onChange={(e) => setEditData({...editData, year: e.target.value})}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="Graduate">Graduate</option>
                                </select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="flex-1"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <div className="text-xs text-muted-foreground">Registration Number</div>
                                <div className="text-sm">{user.registrationNumber || "Not provided"}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs text-muted-foreground">Branch</div>
                                <div className="text-sm">{user.branch || "Not provided"}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs text-muted-foreground">Year</div>
                                <div className="text-sm">{user.year || "Not provided"}</div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1"
                                >
                                    <Pencil1Icon className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleLogout}
                                    className="flex-1"
                                >
                                    <ExitIcon className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Verification Section */}
                    {user.verificationStatus !== 'approved' && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                                <LockClosedIcon className="h-4 w-4" />
                                <h3 className="text-sm font-medium">Verify Your Account</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                                Upload your student ID to get verified and build trust.
                            </p>
                            <Button size="sm" className="w-full">
                                Upload Student ID
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};