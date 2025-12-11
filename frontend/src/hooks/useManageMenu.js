import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useManageMenu = () => {
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem('user')); // Get shopId from logged in user

  // 1. Fetch Menu (Read)
  const menuQuery = useQuery({
    queryKey: ['admin-menu'],
    queryFn: async () => {
      // Assuming your backend route is /admin/menu/:userId
      const { data } = await api.get(`/admin/menu/${user.userId}`); 
      return data; 
    },
    enabled: !!user?.userId,
  });

  // 2. Add Category
  const addCategory = useMutation({
    mutationFn: async (formData) => {
      return await api.post('/admin/category', { ...formData, userId: user.userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-menu']);
      toast.success("Category created");
    },
    onError: (err) => toast.error("Failed to add category")
  });

  // 3. Delete Category
  const deleteCategory = useMutation({
    mutationFn: async (categoryId) => {
      return await api.delete(`/admin/category/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-menu']);
      toast.success("Category deleted");
    }
  });

  // 4. Add/Edit Item (Multipart Form Data for Images)
  const saveItem = useMutation({
    mutationFn: async ({ categoryId, itemData, isEdit, itemId }) => {
      const formData = new FormData();
      formData.append('name', itemData.name);
      formData.append('baseprice', itemData.baseprice);
      formData.append('description', itemData.description);
      formData.append('time', itemData.time);
      
      // Only append image if it's a File object (new upload)
      // If it's a string, it's already a URL, so we don't send it again
      if (itemData.img instanceof File) {
        formData.append('image', itemData.img);
      }

      if (isEdit) {
        return await api.put(`/admin/category/${categoryId}/item/${itemId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        return await api.post(`/admin/category/${categoryId}/item`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-menu']);
      toast.success("Item saved successfully");
    },
    onError: (err) => {
        console.error(err);
        toast.error("Failed to save item");
    }
  });

  // 5. Delete Item
  const deleteItem = useMutation({
    mutationFn: async ({ categoryId, itemId }) => {
      return await api.delete(`/admin/category/${categoryId}/item/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-menu']);
      toast.success("Item removed");
    }
  });

  // 6. Toggle Availability
  const toggleAvailability = useMutation({
    mutationFn: async ({ categoryId, itemId, status }) => {
       return await api.patch(`/admin/category/${categoryId}/item/${itemId}/availability`, { available: status });
    },
    onSuccess: () => {
       queryClient.invalidateQueries(['admin-menu']);
    }
  });

  return {
    menu: menuQuery.data,
    isLoading: menuQuery.isLoading,
    categories: menuQuery.data?.categories || [],
    addCategory,
    deleteCategory,
    saveItem,
    deleteItem,
    toggleAvailability
  };
};