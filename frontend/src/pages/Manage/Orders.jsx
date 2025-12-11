import { useState } from "react";
import { useManageOrders } from "@/hooks/useManageOrders";
import { printOrderTicket } from "@/lib/printUtils"; // Import the helper from above (or paste it at bottom)
import { 
  CheckCircle2, XCircle, ChefHat, Trash2, ArrowRight, Utensils, Printer 
} from "lucide-react";

// Shadcn UI
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import QuisineLoader from "@/components/ui/QuisineLoader";

export default function ManageOrders() {
  const { orders, isLoading, updateStatus, deleteOrder } = useManageOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (isLoading) return <QuisineLoader text="Loading Orders..." />;

  // Group orders by status
  const pending = orders.filter(o => o.status === 'pending');
  const preparing = orders.filter(o => o.status === 'preparing');
  const ready = orders.filter(o => o.status === 'ready' || o.status === 'completed');

  return (
    <div className="space-y-6 pb-24 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kitchen Display</h1>
          <p className="text-slate-500">Manage incoming orders in real-time.</p>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="text-lg px-4 py-1 border-orange-200 bg-orange-50 text-orange-700">
                {pending.length} Pending
            </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start h-12 bg-slate-100 p-1">
          <TabsTrigger value="pending" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-orange-600 font-bold">
            New Orders ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="preparing" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 font-bold">
            Preparing ({preparing.length})
          </TabsTrigger>
          <TabsTrigger value="ready" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-green-600 font-bold">
            Completed ({ready.length})
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 bg-slate-50/50 mt-4 rounded-xl border border-slate-200 p-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
                <TabsContent value="pending" className="mt-0 space-y-4">
                    <OrderGrid orders={pending} type="pending" onSelect={setSelectedOrder} />
                </TabsContent>
                <TabsContent value="preparing" className="mt-0 space-y-4">
                    <OrderGrid orders={preparing} type="preparing" onSelect={setSelectedOrder} />
                </TabsContent>
                <TabsContent value="ready" className="mt-0 space-y-4">
                    <OrderGrid orders={ready} type="ready" onSelect={setSelectedOrder} />
                </TabsContent>
            </ScrollArea>
        </div>
      </Tabs>

      {/* --- Order Detail Dialog --- */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[500px]">
            {selectedOrder && (
                <>
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl">Table {selectedOrder.table}</DialogTitle>
                        <Badge variant="secondary" className="text-md">#{selectedOrder._id.slice(-4).toUpperCase()}</Badge>
                    </div>
                    <DialogDescription>
                        Placed at {new Date(selectedOrder.createdAt).toLocaleTimeString('fr-TN', {hour: '2-digit', minute:'2-digit'})}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4 space-y-4">
                    <div className="border rounded-lg divide-y">
                        {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="p-3 flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-lg">
                                        <span className="text-orange-600 mr-2">{item.qty || 1}x</span>
                                        {item.name}
                                    </div>
                                    {/* Modifiers List */}
                                    {item.modifiers && item.modifiers.length > 0 && (
                                        <div className="mt-1 space-y-1 pl-6">
                                            {item.modifiers.map((mod, midx) => (
                                                <div key={midx} className="text-sm flex items-center gap-2">
                                                    {mod.on ? (
                                                        <span className="text-green-600 flex items-center gap-1">
                                                            <CheckCircle2 size={12} /> {mod.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-500 line-through flex items-center gap-1">
                                                            <XCircle size={12} /> {mod.name}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="font-mono font-medium">{item.price?.toFixed(3)} DT</div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-lg font-bold px-2">
                        <span>Total</span>
                        <span>{selectedOrder.total?.toFixed(3)} DT</span>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    {/* Action Buttons */}
                    <div className="flex flex-1 gap-2">
                        <Button 
                           variant="outline" 
                           className="flex-1"
                           onClick={() => printOrderTicket(selectedOrder)}
                        >
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                         <Button 
                            variant="destructive" 
                            className="flex-1"
                            onClick={() => {
                                deleteOrder.mutate(selectedOrder._id);
                                setSelectedOrder(null);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    {selectedOrder.status === 'pending' && (
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 flex-1"
                            onClick={() => {
                                updateStatus.mutate({ orderId: selectedOrder._id, status: 'preparing' });
                                setSelectedOrder(null);
                            }}
                        >
                            Start Cooking <ChefHat className="ml-2 h-4 w-4" />
                        </Button>
                    )}

                    {selectedOrder.status === 'preparing' && (
                        <Button 
                            className="bg-green-600 hover:bg-green-700 flex-1"
                            onClick={() => {
                                updateStatus.mutate({ orderId: selectedOrder._id, status: 'ready' });
                                setSelectedOrder(null);
                            }}
                        >
                            Mark Ready <CheckCircle2 className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Sub-Components ---

function OrderGrid({ orders, type, onSelect }) {
    if (orders.length === 0) return (
        <div className="flex h-64 flex-col items-center justify-center text-slate-400">
            <Utensils className="h-12 w-12 opacity-20 mb-4" />
            <p>No {type} orders</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => (
                <OrderCard key={order._id} order={order} onClick={() => onSelect(order)} />
            ))}
        </div>
    );
}

function OrderCard({ order, onClick }) {
    const timeString = new Date(order.createdAt).toLocaleTimeString('fr-TN', {hour: '2-digit', minute:'2-digit'});
    
    return (
        <Card 
            className="cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all group" 
            onClick={onClick}
        >
            <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Table {order.table}</CardTitle>
                    <Badge variant="outline" className="font-mono">{timeString}</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-4 pb-2">
                <ul className="space-y-2">
                    {order.items.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="font-bold text-slate-900 bg-slate-100 px-1.5 rounded">{item.qty || 1}</span>
                            <span className="line-clamp-1 text-slate-700">{item.name}</span>
                        </li>
                    ))}
                    {order.items.length > 3 && (
                        <li className="text-xs text-slate-400 font-medium italic">
                            + {order.items.length - 3} more items...
                        </li>
                    )}
                </ul>
            </CardContent>
            <CardFooter className="pt-2 text-xs text-slate-400 flex justify-between">
                <span>#{order._id.slice(-4).toUpperCase()}</span>
                <span className="group-hover:text-orange-600 flex items-center font-medium transition-colors">
                    View Details <ArrowRight size={12} className="ml-1" />
                </span>
            </CardFooter>
        </Card>
    )
}