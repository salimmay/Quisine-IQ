import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Plus, Minus, X, ChevronLeft, Store, Info 
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import QuisineLoader from "@/components/ui/QuisineLoader";

export default function Menu() {
  const { shopId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = searchParams.get("table");

  // --- 1. Data Fetching ---
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-menu", shopId],
    queryFn: async () => {
      const { data } = await api.get(`/auth/menu/${shopId}`); // Adjust route if needed
      return data;
    },
    enabled: !!shopId,
  });

  // --- 2. State ---
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Modifier Modal State
  const [selectedItem, setSelectedItem] = useState(null); // The item being customized
  const [chosenModifiers, setChosenModifiers] = useState({}); // { "Modifier Name": price }
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 3. Derived State ---
  const shop = data?.shop;
  const categories = data?.menu?.categories || [];

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return categories.flatMap((c) => c.items);
    return categories.find((c) => c.name === activeCategory)?.items || [];
  }, [activeCategory, categories]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // --- 4. Logic Handlers ---

  // Triggered when user clicks "Add" on a card
  const handleItemClick = (item) => {
    // If item has no modifiers, add directly
    if (!item.modifiers || item.modifiers.length === 0) {
      addToCart(item, [], item.baseprice);
    } else {
      // Open customization modal
      setSelectedItem(item);
      setChosenModifiers({}); // Reset choices
      setIsModalOpen(true);
    }
  };

  // Add to cart logic (Handles duplicates with different modifiers)
  const addToCart = (item, modifiersList, price) => {
    const modifierSignature = modifiersList.map(m => m.name).sort().join("|");
    const cartItemId = `${item._id}-${modifierSignature}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) => i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { 
        ...item, 
        cartItemId, 
        selectedModifiers: modifiersList, 
        finalPrice: price, 
        qty: 1 
      }];
    });

    toast.success(`Added ${item.name}`);
    setIsModalOpen(false);
  };

  const updateQty = (cartItemId, delta) => {
    setCart((prev) => prev.map((item) => {
      if (item.cartItemId === cartItemId) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }).filter(i => i.qty > 0));
  };

  // --- 5. Checkout Mutation ---
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        shopId: shop.userId,
        table: tableNumber || 0, // 0 means "Counter/Takeaway"
        items: cart.map(i => ({
          name: i.name,
          qty: i.qty,
          price: i.finalPrice,
          modifiers: i.selectedModifiers // Store modifiers for the kitchen
        })),
        total: cartTotal
      };
      // Ensure backend has a public POST route for orders
      const res = await api.post("/shop/order", payload); 
      return res.data;
    },
    onSuccess: (data) => {
      setCart([]);
      setIsCartOpen(false);
      navigate(`/order/success/${data._id}`);
    },
    onError: () => toast.error("Failed to place order. Try again.")
  });

  if (isLoading) return <QuisineLoader fullScreen text="Loading Menu..." />;
  if (error) return <div className="p-10 text-center">Menu not found or Shop is closed.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans">
      
      {/* --- HERO HEADER --- */}
      <div className="relative h-56 w-full overflow-hidden">
        <img src={shop.cover} alt="Cover" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-white shadow-lg">
            <img src={shop.logo} alt="Logo" className="h-full w-full object-cover" />
          </div>
          <div className="text-white mb-1">
            <h1 className="text-2xl font-bold leading-tight">{shop.shopname}</h1>
            <p className="text-sm opacity-90 flex items-center gap-1"><Store size={14} /> {shop.address}</p>
          </div>
        </div>
      </div>

      {/* --- CATEGORY NAV (Sticky) --- */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
          <Badge 
            variant={activeCategory === "all" ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm whitespace-nowrap bg-orange-600 hover:bg-orange-700 data-[variant=outline]:bg-transparent"
            onClick={() => setActiveCategory("all")}
          >
            All Items
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat._id}
              variant={activeCategory === cat.name ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm whitespace-nowrap transition-colors ${activeCategory === cat.name ? "bg-orange-600 hover:bg-orange-700" : ""}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* --- MENU GRID --- */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          {activeCategory === "all" ? "Full Menu" : activeCategory}
        </h2>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div 
              key={item._id} 
              className="group flex h-32 w-full overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md border border-slate-100"
              onClick={() => handleItemClick(item)}
            >
              <div className="w-32 shrink-0 bg-slate-100">
                <img src={item.img} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-3">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="line-clamp-1 font-bold text-slate-900">{item.name}</h3>
                    <span className="font-bold text-orange-600">${item.baseprice}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.description}</p>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" className="h-8 rounded-full bg-slate-100 text-slate-900 hover:bg-orange-100 hover:text-orange-700 transition-colors">
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FLOATING CART BUTTON --- */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center"
          >
            <Button 
              size="lg" 
              className="w-full max-w-md shadow-2xl bg-slate-900 text-white flex justify-between items-center py-7 rounded-2xl border-t border-slate-700"
              onClick={() => setIsCartOpen(true)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-orange-600 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {cartCount}
                </div>
                <span className="font-semibold">View Order</span>
              </div>
              <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ITEM MODIFIER DIALOG --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden">
          {selectedItem && (
            <>
              {/* Header Image */}
              <div className="h-40 w-full bg-slate-100">
                <img src={selectedItem.img} className="h-full w-full object-cover" />
              </div>
              
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex justify-between">
                    {selectedItem.name}
                    <span className="text-orange-600">${selectedItem.baseprice}</span>
                  </DialogTitle>
                  <DialogDescription>{selectedItem.description}</DialogDescription>
                </DialogHeader>

                {selectedItem.modifiers?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Customize</h4>
                    <div className="space-y-3">
                      {selectedItem.modifiers.map((mod, idx) => {
                        const isChecked = !!chosenModifiers[mod.name];
                        return (
                          <div key={idx} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-slate-50 transition-colors cursor-pointer" 
                               onClick={() => {
                                 setChosenModifiers(prev => {
                                   const next = { ...prev };
                                   if (next[mod.name]) delete next[mod.name];
                                   else next[mod.name] = mod.price;
                                   return next;
                                 });
                               }}>
                            <Checkbox id={`mod-${idx}`} checked={isChecked} />
                            <div className="grid gap-1.5 leading-none flex-1">
                              <label htmlFor={`mod-${idx}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                {mod.name}
                              </label>
                            </div>
                            <span className="text-sm font-medium text-slate-600">
                              {mod.price > 0 ? `+$${mod.price}` : "Free"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="p-6 pt-2 bg-slate-50 border-t">
                <Button className="w-full py-6 text-lg bg-orange-600 hover:bg-orange-700" onClick={() => {
                  const modList = Object.entries(chosenModifiers).map(([name, price]) => ({ name, price, on: true }));
                  const total = selectedItem.baseprice + modList.reduce((acc, curr) => acc + curr.price, 0);
                  addToCart(selectedItem, modList, total);
                }}>
                  Add to Order — ${(selectedItem.baseprice + Object.values(chosenModifiers).reduce((a, b) => a + b, 0)).toFixed(2)}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* --- CART SHEET (CHECKOUT) --- */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex flex-col h-full w-full sm:max-w-md p-0">
            <div className="p-6 border-b bg-slate-50">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingBag className="text-orange-600" /> Your Order
                    </SheetTitle>
                    {tableNumber && <p className="text-sm text-slate-500">Table #{tableNumber}</p>}
                </SheetHeader>
            </div>
            
            <ScrollArea className="flex-1 p-6">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 mt-20">
                        <ShoppingBag size={64} className="opacity-20" />
                        <p>Your cart is empty.</p>
                        <Button variant="outline" onClick={() => setIsCartOpen(false)}>Browse Menu</Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {cart.map((item) => (
                            <div key={item.cartItemId} className="flex gap-4">
                                <div className="h-16 w-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                    <img src={item.img} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                                        <span className="font-bold text-slate-900">${(item.finalPrice * item.qty).toFixed(2)}</span>
                                    </div>
                                    
                                    {/* Show Modifiers */}
                                    {item.selectedModifiers?.length > 0 && (
                                        <p className="text-xs text-slate-500 mt-1">
                                            {item.selectedModifiers.map(m => m.name).join(", ")}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-3 mt-3">
                                        <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => updateQty(item.cartItemId, -1)}>
                                            <Minus size={12} />
                                        </Button>
                                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                        <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => updateQty(item.cartItemId, 1)}>
                                            <Plus size={12} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <div className="p-6 border-t bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-slate-900">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
                
                <Button 
                    className="w-full py-6 text-lg font-bold bg-slate-900 hover:bg-slate-800"
                    disabled={cart.length === 0 || checkoutMutation.isPending}
                    onClick={() => checkoutMutation.mutate()}
                >
                    {checkoutMutation.isPending ? "Sending..." : "Place Order"}
                </Button>
                <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                    <Info size={12} /> Payment is collected at the counter
                </p>
            </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
