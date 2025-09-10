import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, AlertTriangle, Upload, Camera } from "lucide-react";

interface ReportUserProps {
    isOpen: boolean;
    onClose: () => void;
    reportedUserId: string;
    reportedUserName: string;
    itemId?: string;
    transactionId?: string;
    conversationId?: string;
}

const reportCategories = [
    { id: "fraud", label: "Fraudulent Activity", description: "Scam, fake payment, or dishonest behavior" },
    { id: "harassment", label: "Harassment", description: "Inappropriate messages or threatening behavior" },
    { id: "fake_item", label: "Fake/Misleading Item", description: "Item not as described or fake product" },
    { id: "no_show", label: "No Show", description: "Didn't show up for agreed meetup" },
    { id: "payment_issue", label: "Payment Issues", description: "Payment disputes or problems" },
    { id: "inappropriate_content", label: "Inappropriate Content", description: "Offensive images or descriptions" },
    { id: "spam", label: "Spam", description: "Repetitive or unwanted messages" },
    { id: "other", label: "Other", description: "Other violations of community guidelines" }
];

export const ReportUser: React.FC<ReportUserProps> = ({
    isOpen,
    onClose,
    reportedUserId,
    reportedUserName,
    itemId,
    transactionId,
    conversationId
}) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [evidence, setEvidence] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleEvidenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // Simulate file upload
            const newEvidence = Array.from(files).map((_, index) => 
                `https://example.com/evidence/${Date.now()}_${index}.jpg`
            );
            setEvidence(prev => [...prev, ...newEvidence]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedCategory || !title.trim() || !description.trim()) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log("Report submitted:", {
                reportedUserId,
                category: selectedCategory,
                title,
                description,
                evidence,
                itemId,
                transactionId,
                conversationId
            });
            
            setIsSubmitting(false);
            setIsSubmitted(true);
            
            // Auto close after 3 seconds
            setTimeout(() => {
                onClose();
                // Reset form
                setSelectedCategory("");
                setTitle("");
                setDescription("");
                setEvidence([]);
                setIsSubmitted(false);
            }, 3000);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Report User
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!isSubmitted ? (
                        <>
                            {/* User Info */}
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h3 className="font-semibold text-red-800 mb-2">Reporting: {reportedUserName}</h3>
                                <p className="text-sm text-red-600">
                                    Please provide detailed information about the issue. False reports may result in action against your account.
                                </p>
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-3">
                                    What type of issue are you reporting? *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {reportCategories.map((category) => (
                                        <div
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                                selectedCategory === category.id
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <h4 className="font-medium text-sm">{category.label}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {category.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Brief Summary *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., User didn't show up for meetup"
                                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    maxLength={100}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {title.length}/100 characters
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Detailed Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Please provide as much detail as possible about what happened..."
                                    className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                                    rows={4}
                                    maxLength={500}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {description.length}/500 characters
                                </p>
                            </div>

                            {/* Evidence Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Evidence (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Upload screenshots, photos, or other evidence
                                    </p>
                                    <label className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                                        <Upload className="h-4 w-4" />
                                        Choose Files
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleEvidenceUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                
                                {evidence.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium mb-2">Uploaded Evidence:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {evidence.map((url, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={url}
                                                        alt={`Evidence ${index + 1}`}
                                                        className="w-16 h-16 object-cover rounded border"
                                                    />
                                                    <button
                                                        onClick={() => setEvidence(prev => prev.filter((_, i) => i !== index))}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!selectedCategory || !title.trim() || !description.trim() || isSubmitting}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Report"}
                                </Button>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <h4 className="font-semibold text-yellow-800 text-sm mb-2">Important Notes:</h4>
                                <ul className="text-xs text-yellow-700 space-y-1">
                                    <li>• Reports are reviewed by our moderation team within 24-48 hours</li>
                                    <li>• False or malicious reports may result in action against your account</li>
                                    <li>• Serious violations may be reported to college authorities</li>
                                    <li>• You'll receive an update once the report is reviewed</li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Report Submitted</h3>
                            <p className="text-muted-foreground mb-4">
                                Thank you for reporting this issue. Our moderation team will review it within 24-48 hours.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                You'll receive a notification once the report is reviewed.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};