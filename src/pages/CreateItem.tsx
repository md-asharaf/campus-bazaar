import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useCreateItem, useCategories } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Upload,
  X,
  ImageIcon,
  Loader2,
  AlertCircle,
  BadgeCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Form validation schema
const createItemSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  price: z.number()
    .min(1, 'Price must be at least ₹1')
    .max(100000, 'Price must be less than ₹1,00,000'),
  categoryId: z.string().min(1, 'Please select a category'),
  condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor']),
  image: z.instanceof(File, { message: 'Please select an image' })
});

type CreateItemData = z.infer<typeof createItemSchema>;

const conditionOptions = [
  { value: 'new', label: 'New', description: 'Never used, in original packaging' },
  { value: 'like-new', label: 'Like New', description: 'Barely used, excellent condition' },
  { value: 'good', label: 'Good', description: 'Used with minor wear, works perfectly' },
  { value: 'fair', label: 'Fair', description: 'Used with visible wear, fully functional' },
  { value: 'poor', label: 'Poor', description: 'Heavy wear, may have issues' }
];

export function CreateItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading: categoriesLoading } = useCategories();
  const createItemMutation = useCreateItem();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateItemData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      categoryId: '',
      condition: 'good',
    }
  });

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-center py-8 flex-1">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto" />
              <h2 className="text-xl font-semibold">Authentication Required</h2>
              <p className="text-muted-foreground">
                Please log in to sell items on Campus Bazaar
              </p>
              <Link to="/login?from=/sell">
                <Button>Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show verification message if user is not verified
  if (!user.isVerified) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-center py-8 flex-1">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center space-y-4">
              <BadgeCheck className="h-12 w-12 text-blue-500 mx-auto" />
              <h2 className="text-xl font-semibold">Verification Required</h2>
              <p className="text-muted-foreground">
                You need to verify your account before you can sell items
              </p>
              <Link to="/verify">
                <Button>Verify Account</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      form.setValue('image', file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue('image', undefined as any);
  };

  const onSubmit = async (data: CreateItemData) => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    try {
      const itemData = {
        title: data.title,
        price: data.price,
        categoryId: data.categoryId,
        image: selectedImage,
        // Note: description and condition would need backend support
      };

      await createItemMutation.mutateAsync(itemData);
      toast.success('Item listed successfully!');
      navigate('/dashboard?tab=items');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create item');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Sell an Item</h1>
              <p className="text-muted-foreground">
                List your item for other students to discover and buy
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>
                        Tell us about your item
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Title *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., MacBook Air M2, Physics Textbook, Gaming Chair"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Be descriptive and specific to attract more buyers
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your item's condition, features, and any relevant details..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Include details about condition, age, usage, and any included accessories
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (₹) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="1000"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormDescription>
                                Set a fair price based on condition and market value
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categoriesLoading ? (
                                    <div className="flex items-center justify-center p-2">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                  ) : (
                                    data?.categories?.map((category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {conditionOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{option.label}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {option.description}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Images */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Photos</CardTitle>
                      <CardDescription>
                        Add at least one clear photo of your item
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field: _ }) => (
                          <FormItem>
                            <FormControl>
                              <div className="space-y-4">
                                {!imagePreview ? (
                                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                                    <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                    <div className="space-y-2">
                                      <h4 className="text-lg font-medium">Upload Item Photo</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Choose a clear, well-lit photo that shows your item's condition
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      className="mt-4"
                                      onClick={() => fileInputRef.current?.click()}
                                    >
                                      <Upload className="h-4 w-4 mr-2" />
                                      Choose Photo
                                    </Button>
                                    <Input
                                      ref={fileInputRef}
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageSelect}
                                      className="hidden"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                      JPG, PNG, or WebP. Max 5MB.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <img
                                      src={imagePreview}
                                      alt="Item preview"
                                      className="w-full aspect-square object-cover rounded-lg border"
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
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Preview</CardTitle>
                      <CardDescription>
                        How your listing will appear to buyers
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold truncate">
                          {form.watch('title') || 'Item Title'}
                        </h3>
                        <p className="text-lg font-bold text-primary">
                          ₹{form.watch('price')?.toLocaleString() || '0'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {data?.categories?.find(c => c.id === form.watch('categoryId'))?.name || 'Category'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tips */}
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Selling Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>• Use clear, well-lit photos</div>
                      <div>• Write detailed descriptions</div>
                      <div>• Price competitively</div>
                      <div>• Respond quickly to messages</div>
                      <div>• Meet in safe, public places</div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={createItemMutation.isPending}
                    >
                      {createItemMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Listing Item...
                        </>
                      ) : (
                        'List Item for Sale'
                      )}
                    </Button>
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}