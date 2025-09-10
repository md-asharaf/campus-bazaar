import React, { useState } from "react";
import { GoogleLogin } from "./GoogleLogin";
import { ProfileSetup } from "./ProfileSetup";
import { useAuth } from "../../contexts/AuthContext";

interface AuthManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthManager: React.FC<AuthManagerProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const [showProfileSetup, setShowProfileSetup] = useState(false);
    const [tempUserData, setTempUserData] = useState<any>(null);

    const handleLoginSuccess = (userData: any) => {
        setTempUserData(userData);
        setShowProfileSetup(true);
    };

    const handleProfileComplete = (profileData: any) => {
        login({
            id: tempUserData.id,
            email: tempUserData.email,
            name: tempUserData.name,
            picture: tempUserData.picture,
            registrationNumber: profileData.registrationNumber,
            branch: profileData.branch,
            year: profileData.year,
            verified: false,
            profileComplete: true,
            verificationStatus: 'none'
        });
        setShowProfileSetup(false);
        setTempUserData(null);
        onClose();
    };

    const handleClose = () => {
        if (!showProfileSetup) {
            onClose();
        }
    };

    return (
        <>
            <GoogleLogin
                isOpen={isOpen && !showProfileSetup}
                onClose={handleClose}
                onLoginSuccess={handleLoginSuccess}
            />
            <ProfileSetup
                isOpen={showProfileSetup}
                onComplete={handleProfileComplete}
            />
        </>
    );
};