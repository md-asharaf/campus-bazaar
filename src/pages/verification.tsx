import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useVerifyUser } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
  ArrowLeft,
  Upload,
  X,
  FileImage,
  Loader2,
  CheckCircle,
  Info,
  Camera,
  BadgeCheck
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const maxFileSize = 10 * 1024 * 1024; // 5MB

const verificationTips = [
  'Use a clear, high-resolution photo of your student ID',
  'Ensure all text on the ID is clearly readable',
  'Include your photo, name, and registration number',
  'Avoid glare, shadows, or blurred images',
  'Do not edit or modify the image in any way'
];

const verificationSteps = [
  {
    step: 1,
    title: 'Upload Document',
    description: 'Take a clear photo of your student ID card'
  },
  {
    step: 2,
    title: 'Admin Review',
    description: 'Our team will review your submission within 24-48 hours'
  },
  {
    step: 3,
    title: 'Verification Complete',
    description: 'Once approved, you can start selling items on the platform'
  }
];

export function Verification() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const verifyUserMutation = useVerifyUser();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login?from=/verify" replace />;
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If already verified, show success message
  if (user?.isVerified) {
    return (
      <div className="flex items-center justify-center py-8">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-semibold">Account Verified!</h2>
            <p className="text-muted-foreground">
              Your account is already verified. You can now sell items on Campus Bazaar.
            </p>
            <div className="flex gap-3">
              <Link to="/sell">
                <Button className="flex-1">Start Selling</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="flex-1">Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileSelect = (file: File) => {
    if (file.size > maxFileSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error('Please select an image to upload');
      return;
    }

    try {
      await verifyUserMutation.mutateAsync({
        verificationImage: selectedImage
      });
      toast.success('Verification submitted successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit verification');
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Account Verification</h1>
            <p className="text-muted-foreground">
              Verify your student identity to start selling on Campus Bazaar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alert */}
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardContent className="flex items-start gap-3 p-4">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Verification Required
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    To ensure trust and safety, all sellers must verify their student identity before listing items.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Student ID</CardTitle>
                <CardDescription>
                  Please upload a clear photo of your valid student ID card
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!imagePreview ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <FileImage className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <div className="space-y-3">
                      <h4 className="text-lg font-medium">Upload Student ID</h4>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your student ID photo here, or click to browse
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button
                          type="button"
                          className="cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                        <Button type="button" variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground">
                        Supported formats: JPEG, PNG, WebP. Max size: 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative max-w-md mx-auto">
                      <img
                        src={imagePreview}
                        alt="Student ID preview"
                        className="w-full rounded-lg border shadow-sm"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        ✓ Image uploaded successfully
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Make sure all details are clearly visible before submitting
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>
                  Please ensure your ID photo meets these requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {verificationTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!selectedImage || verifyUserMutation.isPending}
                className="flex-1"
                size="lg"
              >
                {verifyUserMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <BadgeCheck className="h-4 w-4 mr-2" />
                    Submit for Verification
                  </>
                )}
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Process Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verification Process</CardTitle>
                <CardDescription>
                  How account verification works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {verificationSteps.map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      item.step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                  <p>Your ID information is encrypted and securely stored</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                  <p>We only use this data for verification purposes</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                  <p>Your personal information is never shared with third parties</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                  <p>You can request data deletion at any time</p>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Having trouble with verification? Our support team is here to help.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <span className="mr-2">📧</span>
                    Email Support
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <span className="mr-2">💬</span>
                    Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}