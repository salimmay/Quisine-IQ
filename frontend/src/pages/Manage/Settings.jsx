import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Save, Upload, Store, Palette } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import QuisineLoader from "@/components/ui/QuisineLoader";

export default function Settings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // State for form
  const [formData, setFormData] = useState({
    shopname: "",
    address: "",
    contactphone: "",
    primarycolor: "#000000",
    secondarycolor: "#ffffff"
  });
  
  // Preview states for images
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // 1. Fetch Shop Data
  const { data: shop, isLoading } = useQuery({
    queryKey: ['shop-settings', user?.userId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/info/${user.userId}`);
      return data;
    },
    enabled: !!user?.userId,
  });

  // Populate form when data loads
  useEffect(() => {
    if (shop) {
      setFormData({
        shopname: shop.shopname || "",
        address: shop.address || "",
        contactphone: shop.contactphone || "",
        primarycolor: shop.primarycolor || "#000000",
        secondarycolor: shop.secondarycolor || "#ffffff"
      });
      setLogoPreview(shop.logo);
      setCoverPreview(shop.cover);
    }
  }, [shop]);

  // 2. Update Mutation
  const updateSettings = useMutation({
    mutationFn: async (e) => {
      e.preventDefault();
      
      const data = new FormData();
      data.append("shopname", formData.shopname);
      data.append("address", formData.address);
      data.append("contactphone", formData.contactphone);
      data.append("primarycolor", formData.primarycolor);
      data.append("secondarycolor", formData.secondarycolor);
      
      if (logoFile) data.append("logo", logoFile);
      if (coverFile) data.append("cover", coverFile);

      // Assuming your backend route is PUT /admin/info/:userId
      return await api.put(`/admin/info/${user.userId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shop-settings']);
      // Also refresh the global auth user to update the sidebar logo
      queryClient.invalidateQueries(['auth-user']); 
      toast.success("Shop settings updated successfully!");
    },
    onError: () => toast.error("Failed to update settings.")
  });

  // Handlers
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(url);
      } else {
        setCoverFile(file);
        setCoverPreview(url);
      }
    }
  };

  if (isLoading) return <QuisineLoader text="Loading Shop Details..." />;

  return (
    <div className="space-y-6 pb-24 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shop Settings</h1>
        <p className="text-slate-500">Manage your restaurant's profile and branding.</p>
      </div>

      <form onSubmit={updateSettings.mutate} className="space-y-8">
        
        {/* --- Branding Section --- */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Branding</CardTitle>
                <CardDescription>This is how your shop looks to customers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Logo & Cover */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Logo */}
                    <div className="space-y-2">
                        <Label>Logo</Label>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-2 border-slate-100">
                                <AvatarImage src={logoPreview} className="object-cover" />
                                <AvatarFallback>LG</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Label htmlFor="logo-upload" className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-slate-100 px-4 text-sm font-medium hover:bg-slate-200 transition-colors w-full">
                                    <Upload className="mr-2 h-4 w-4" /> Change Logo
                                </Label>
                                <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2">
                        <Label>Cover Image</Label>
                        <div className="relative h-32 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                            {coverPreview && <img src={coverPreview} className="h-full w-full object-cover" />}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity hover:bg-black/20">
                                <Label htmlFor="cover-upload" className="cursor-pointer rounded-full bg-white/90 px-4 py-2 text-xs font-bold shadow-sm hover:bg-white">
                                    Change Cover
                                </Label>
                                <Input id="cover-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Colors */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                            <div className="h-10 w-10 rounded border shadow-sm shrink-0" style={{ backgroundColor: formData.primarycolor }}></div>
                            <Input 
                                value={formData.primarycolor} 
                                onChange={(e) => setFormData({...formData, primarycolor: e.target.value})} 
                                placeholder="#000000"
                            />
                            <Input 
                                type="color" 
                                value={formData.primarycolor} 
                                onChange={(e) => setFormData({...formData, primarycolor: e.target.value})} 
                                className="w-12 p-1 cursor-pointer" 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Secondary Color</Label>
                        <div className="flex gap-2">
                            <div className="h-10 w-10 rounded border shadow-sm shrink-0" style={{ backgroundColor: formData.secondarycolor }}></div>
                            <Input 
                                value={formData.secondarycolor} 
                                onChange={(e) => setFormData({...formData, secondarycolor: e.target.value})} 
                                placeholder="#ffffff"
                            />
                            <Input 
                                type="color" 
                                value={formData.secondarycolor} 
                                onChange={(e) => setFormData({...formData, secondarycolor: e.target.value})} 
                                className="w-12 p-1 cursor-pointer" 
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* --- General Info Section --- */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> Restaurant Details</CardTitle>
                <CardDescription>Basic contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Restaurant Name</Label>
                        <Input 
                            value={formData.shopname} 
                            onChange={(e) => setFormData({...formData, shopname: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input 
                            value={formData.contactphone} 
                            onChange={(e) => setFormData({...formData, contactphone: e.target.value})} 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Address</Label>
                    <Input 
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})} 
                    />
                </div>
            </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>Discard Changes</Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={updateSettings.isPending}>
                {updateSettings.isPending && <QuisineLoader  />}
                Save Changes
            </Button>
        </div>

      </form>
    </div>
  );
}