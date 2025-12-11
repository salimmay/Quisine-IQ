import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useManageOrders = () => {
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Fetch Orders (Auto-refresh every 10 seconds)
  const ordersQuery = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await api.get(`/admin/orders/${user.userId}`);
      return data;
    },
    refetchInterval: 10000, // Polling every 10s
    enabled: !!user?.userId,
  });

  // 2. Update Status (Pending -> Preparing -> Ready)
  const updateStatus = useMutation({
    mutationFn: async ({ orderId, status }) => {
      return await api.patch(`/admin/order/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update order")
  });

  // 3. Delete Order
  const deleteOrder = useMutation({
    mutationFn: async (orderId) => {
      return await api.delete(`/admin/order/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
      toast.success("Order deleted");
    }
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    updateStatus,
    deleteOrder
  };
};