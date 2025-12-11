import { useManageMenu } from "@/hooks/useManageMenu";
import { Clock, DollarSign, Utensils, Image as ImageIcon, Search } from "lucide-react";

// Shadcn UI
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import QuisineLoader from "@/components/ui/QuisineLoader";

export default function DayMenu() {
  const { categories, isLoading, toggleAvailability } = useManageMenu();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <QuisineLoader text="Loading your dishes..." />;

  // Filter logic for quick searching
  const filteredCategories = categories?.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="space-y-6 pb-24">
      {/* --- Header & Search --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daily Availability</h1>
          <p className="text-slate-500">Instantly mark items as "Sold Out" for today.</p>
        </div>
        <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
                placeholder="Search item..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* --- Content --- */}
      <div className="space-y-8">
        {filteredCategories?.map((category) => (
          <div key={category._id} className="space-y-4 animate-in fade-in duration-500">
            
            {/* Category Header */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <h2 className="text-xl font-bold text-slate-800">{category.name}</h2>
              <Badge variant="outline" className="rounded-full border-slate-300 text-slate-500">
                {category.items.length}
              </Badge>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.items.map((item) => (
                <ItemCard 
                    key={item._id} 
                    item={item} 
                    categoryId={category._id}
                    onToggle={(val) => toggleAvailability.mutate({ 
                        categoryId: category._id, 
                        itemId: item._id, 
                        status: val 
                    })} 
                />
              ))}
            </div>
          </div>
        ))}

        {(!filteredCategories || filteredCategories.length === 0) && (
            <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                <Utensils className="mb-2 h-10 w-10 opacity-20" />
                <p>No items found matching your search.</p>
            </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-Component: Item Card ---
function ItemCard({ item, categoryId, onToggle }) {
  // Use the Cloudinary URL or fallback
  const imageUrl = item.img || item.imageUrl;
  const isAvailable = item.available !== false; // Default to true if undefined

  return (
    <Card className={`overflow-hidden transition-all duration-300 border-slate-200 shadow-sm
        ${!isAvailable ? 'bg-slate-50/80 grayscale border-dashed' : 'bg-white hover:shadow-md hover:border-orange-200'}
    `}>
      <div className="flex h-full flex-row sm:flex-col">
        
        {/* Image Section */}
        <div className="relative h-24 w-24 shrink-0 sm:h-40 sm:w-full bg-slate-100">
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt={item.name} 
                    className={`h-full w-full object-cover transition-opacity ${!isAvailable ? 'opacity-50' : 'opacity-100'}`} 
                    loading="lazy"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <ImageIcon className="h-8 w-8" />
                </div>
            )}
            
            {/* Status Badge (Desktop Overlay) */}
            <div className="absolute right-2 top-2 hidden sm:block">
                <Badge 
                    variant={isAvailable ? "default" : "destructive"} 
                    className={`shadow-sm ${isAvailable ? "bg-green-600 hover:bg-green-700" : "bg-slate-600 hover:bg-slate-700"}`}
                >
                    {isAvailable ? "In Stock" : "Sold Out"}
                </Badge>
            </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
            <div>
                <div className="flex items-start justify-between gap-2">
                    <h3 className={`line-clamp-1 font-bold text-sm sm:text-base ${isAvailable ? 'text-slate-900' : 'text-slate-500 line-through'}`} title={item.name}>
                        {item.name}
                    </h3>
                </div>
                
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1 font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                        <DollarSign className="h-3 w-3" />
                        <span>{item.baseprice}</span>
                    </div>
                    {item.time && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.time}m</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <Label htmlFor={`switch-${item._id}`} className={`text-xs font-semibold ${isAvailable ? "text-green-600" : "text-slate-400"}`}>
                    {isAvailable ? "Available" : "Unavailable"}
                </Label>
                <Switch 
                    id={`switch-${item._id}`}
                    checked={isAvailable}
                    onCheckedChange={onToggle}
                    className="data-[state=checked]:bg-green-600"
                />
            </div>
        </div>
      </div>
    </Card>
  );
}

