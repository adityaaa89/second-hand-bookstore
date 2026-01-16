import api from './api';

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CategoryCreateRequest {
  name: string;
  description?: string;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(categoryData: CategoryCreateRequest): Promise<Category> {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(id: number, categoryData: CategoryCreateRequest): Promise<Category> {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
};
