import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, CheckCircle } from "lucide-react";

interface VerificationUploadProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (file: File) => void;
}

export const VerificationUpload: React.FC<VerificationUploadProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit 
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;
        
        setIsUploading(true);
        
        // Mock upload - in real app, this would upload to server
        setTimeout(() => {
            onSubmit(selectedFile);
            setIsUploading(false);
            setSelectedFile(null);
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Verify Student Status</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Upload your student ID card for verification
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {selectedFile ? (
                            <div className="space-y-2">
                                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                                <p className="text-sm font-medium">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                                <p className="text-sm text-muted-foreground">
                                    Click to upload your student ID card
                                </p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-md">
                        <p className="text-sm text-yellow-800">
                            📋 Make sure your ID card is clear and readable. 
                            Verification usually takes 1-2 business days.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit}
                            disabled={!selectedFile || isUploading}
                            className="flex-1"
                        >
                            {isUploading ? "Uploading..." : "Submit for Verification"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};