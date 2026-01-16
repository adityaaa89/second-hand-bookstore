import { api } from './api';

export interface UserAnalytics {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  itemCount: number;
  totalItemsValue: number;
}

export interface AdminStats {
  totalUsers: number;
  totalItems: number;
  totalCategories: number;
  totalItemsValue: number;
  activeUsers: number;
  adminUsers: number;
}

export const adminService = {
  async getAdminStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getAllUsers(page: number = 0, size: number = 10): Promise<{
    content: UserAnalytics[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> {
    const response = await api.get(`/admin/users?page=${page}&size=${size}`);
    return response.data;
  },

  async getAllUsersList(): Promise<UserAnalytics[]> {
    const response = await api.get('/admin/users/all');
    return response.data;
  },

  async deleteItem(itemId: number): Promise<void> {
    await api.delete(`/items/${itemId}`);
  }
};
