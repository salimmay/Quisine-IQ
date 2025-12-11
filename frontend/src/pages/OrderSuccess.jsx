import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Receipt, ArrowLeft } from "lucide-react";

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import QuisineLoader from "@/components/ui/QuisineLoader";

export default function OrderSuccess() {
  const { orderId } = useParams();

  // Fetch Order Data
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/shop/order/${orderId}`);
      return data;
    }
  });

  if (isLoading) return <QuisineLoader fullScreen text="Retrieving Receipt..." />;

  if (isError) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-4">
        <h2 className="text-xl font-bold text-red-500">Order Not Found</h2>
        <Link to="/"><Button>Go Home</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-slate-200 overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-600 p-8 text-center text-white">
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                >
                    <CheckCircle2 className="h-10 w-10 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold">Order Confirmed!</h1>
                <p className="text-green-100 opacity-90">Your kitchen is preparing it now.</p>
            </div>

            <CardHeader className="text-center pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                    Order Receipt
                </CardTitle>
                <div className="text-3xl font-bold text-slate-900">#{order._id.slice(-6).toUpperCase()}</div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center rounded-lg bg-slate-50 p-3">
                        <span className="text-xs font-medium text-slate-500">Table No.</span>
                        <span className="text-xl font-bold text-slate-900">{order.table}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-slate-50 p-3">
                        <span className="text-xs font-medium text-slate-500">Est. Time</span>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-xl font-bold text-slate-900">~25m</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-500">
                        <span>Items</span>
                        <span>Price</span>
                    </div>
                    {/* Assuming order.items is your array of items */}
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-800">
                                <span className="font-bold mr-2">{item.qty}x</span> 
                                {item.name}
                            </span>
                            <span className="font-medium text-slate-900">
                                ${(item.price * (item.qty || 1)).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-slate-500">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">${order.total?.toFixed(2)}</span>
                </div>
            </CardContent>

            <CardFooter className="flex-col gap-3 bg-slate-50 p-6">
                <Button className="w-full bg-slate-900 hover:bg-slate-800" size="lg">
                    Track Order Status
                </Button>
                <Link to={`/menu/${order.shopId}`} className="w-full">
                    <Button variant="outline" className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
                    </Button>
                </Link>
            </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}