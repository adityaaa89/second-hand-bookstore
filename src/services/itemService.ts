import api from './api';

export interface Item {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  condition: 'NEW' | 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR';
  description?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
  categoryName: string;
  categoryId: number;
  sellerName: string;
  sellerEmail?: string;
  sellerId: number;
}

export interface ItemCreateRequest {
  name: string;
  price: number;
  imageUrl: string;
  condition: 'NEW' | 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR';
  description?: string;
  categoryId: number;
}

export interface ItemUpdateRequest extends ItemCreateRequest {
  isAvailable?: boolean;
}

export interface SearchParams {
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export const itemService = {
  async getItems(page = 0, size = 12, sortBy = 'createdAt', sortDir: 'asc' | 'desc' = 'desc'): Promise<PaginatedResponse<Item>> {
    const response = await api.get<PaginatedResponse<Item>>('/items', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  async searchItems(params: SearchParams): Promise<PaginatedResponse<Item>> {
    const response = await api.get<PaginatedResponse<Item>>('/items/search', { params });
    return response.data;
  },

  async getItemById(id: number): Promise<Item> {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  },

  async createItem(itemData: ItemCreateRequest): Promise<Item> {
    const response = await api.post<Item>('/items', itemData);
    return response.data;
  },

  async uploadFile(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    const response = await api.post<{ url: string }>('/items/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.url;
  },

  async updateItem(id: number, itemData: ItemUpdateRequest): Promise<Item> {
    const response = await api.put<Item>(`/items/${id}`, itemData);
    return response.data;
  },

  async deleteItem(id: number): Promise<void> {
    await api.delete(`/items/${id}`);
  },

  async getMyItems(page = 0, size = 12): Promise<PaginatedResponse<Item>> {
    const response = await api.get<PaginatedResponse<Item>>('/items/my-items', {
      params: { page, size }
    });
    return response.data;
  },

  async getAvailableConditions(): Promise<string[]> {
    const response = await api.get<string[]>('/items/conditions');
    return response.data;
  }
};
