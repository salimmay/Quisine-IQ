import { useState } from "react";
import { useManageMenu } from "@/hooks/useManageMenu"; // Use the new hook
import { 
  Plus, Trash2, Edit, Settings, Utensils, Image as ImageIcon, 
  Clock, DollarSign 
} from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import QuisineLoader from "@/components/ui/QuisineLoader";

export default function MenuPage() {
  const { 
    categories, isLoading, addCategory, deleteCategory, saveItem, deleteItem, toggleAvailability 
  } = useManageMenu();

  // --- State ---
  const [activeCat, setActiveCat] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  // Dialog States
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({ open: false, type: null, id: null, catId: null });

  // Forms
  const [catName, setCatName] = useState("");
  const [itemForm, setItemForm] = useState({ 
    name: "", baseprice: "", description: "", time: "", img: null 
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  // --- Handlers ---

  const handleCatSubmit = () => {
    if(!catName) return;
    addCategory.mutate({ name: catName });
    setIsCatOpen(false);
    setCatName("");
  };

  const handleItemSubmit = () => {
    saveItem.mutate({
        categoryId: activeCat._id,
        itemData: itemForm,
        isEdit: !!editingItem,
        itemId: editingItem?._id
    }, {
        onSuccess: () => {
            setIsItemOpen(false);
            resetItemForm();
        }
    });
  };

  const openItemModal = (category, item = null) => {
    setActiveCat(category);
    if (item) {
        setEditingItem(item);
        setItemForm({
            name: item.name,
            baseprice: item.baseprice,
            description: item.description,
            time: item.time,
            img: item.img || item.imageUrl // handle both legacy/new
        });
        setPreviewUrl(item.img || item.imageUrl); // Show existing URL
    } else {
        resetItemForm();
    }
    setIsItemOpen(true);
  };

  const resetItemForm = () => {
    setEditingItem(null);
    setItemForm({ name: "", baseprice: "", description: "", time: "", img: null });
    setPreviewUrl(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setItemForm(prev => ({ ...prev, img: file })); // Store File object for upload
        setPreviewUrl(URL.createObjectURL(file)); // Create local preview
    }
  };

  // --- Render ---
if (isLoading) return <QuisineLoader text="Loading your dishes..." />;

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Menu Management</h1>
            <p className="text-slate-500">Organize your dishes, categories, and prices.</p>
        </div>
        <Button onClick={() => setIsCatOpen(true)} className="bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-200">
            <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {categories.map((category) => (
            <Card key={category._id} className="overflow-hidden border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 pb-4 border-b border-slate-100">
                    <CardTitle className="text-xl font-bold text-slate-800">{category.name}</CardTitle>
                    <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-orange-600" onClick={() => openItemModal(category)}>
                            <Plus className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => setDeleteData({ open: true, type: 'category', id: category._id })}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {category.items?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <Utensils className="mb-2 h-8 w-8 opacity-20" />
                                <span className="text-sm">No items yet</span>
                            </div>
                        ) : (
                            category.items.map((item) => (
                                <div key={item._id} className="group flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                                        {(item.img || item.imageUrl) ? (
                                            <img src={item.img || item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-300"><ImageIcon className="h-5 w-5" /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-slate-900 truncate">{item.name}</h4>
                                            <span className="font-bold text-orange-600">${item.baseprice}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{item.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Switch 
                                            checked={item.available !== false} // Default true
                                            onCheckedChange={(val) => toggleAvailability.mutate({ categoryId: category._id, itemId: item._id, status: val })}
                                        />
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => openItemModal(category, item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => setDeleteData({ open: true, type: 'item', id: item._id, catId: category._id })}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      {/* --- MODALS --- */}

      {/* Add Category */}
      <Dialog open={isCatOpen} onOpenChange={setIsCatOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>New Category</DialogTitle></DialogHeader>
            <div className="py-4 space-y-2">
                <Label>Name</Label>
                <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Desserts" />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsCatOpen(false)}>Cancel</Button>
                <Button onClick={handleCatSubmit} disabled={addCategory.isPending}>
                   {addCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Modal */}
      <Dialog open={isItemOpen} onOpenChange={setIsItemOpen}>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Item" : "New Item"}</DialogTitle>
                <DialogDescription>{activeCat?.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
                {/* Image Upload */}
                <div className="flex gap-4 items-center">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                        {previewUrl ? (
                            <img src={previewUrl} className="h-full w-full object-cover" />
                        ) : (
                            <ImageIcon className="absolute inset-0 m-auto h-6 w-6 text-slate-300" />
                        )}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="img" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                            Choose Image
                        </Label>
                        <Input id="img" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={itemForm.name} onChange={(e) => setItemForm({...itemForm, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Price</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input className="pl-9" type="number" value={itemForm.baseprice} onChange={(e) => setItemForm({...itemForm, baseprice: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={itemForm.description} onChange={(e) => setItemForm({...itemForm, description: e.target.value})} />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsItemOpen(false)}>Cancel</Button>
                <Button onClick={handleItemSubmit} disabled={saveItem.isPending} className="bg-orange-600 hover:bg-orange-700">
                    {saveItem.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Item
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={deleteData.open} onOpenChange={(val) => !val && setDeleteData({...deleteData, open:false})}>
        <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
            <AlertDialogDescription>This will permanently delete this item.</AlertDialogDescription>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                        if(deleteData.type === 'category') deleteCategory.mutate(deleteData.id);
                        else deleteItem.mutate({ categoryId: deleteData.catId, itemId: deleteData.id });
                        setDeleteData({...deleteData, open: false});
                    }}
                >
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
