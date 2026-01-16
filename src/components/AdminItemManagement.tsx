import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { itemService, Item, PaginatedResponse } from '../services/itemService';
import { adminService } from '../services/adminService';
import { ImageWithFallback } from './figma/ImageWithFallback';

const AdminItemManagement: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res: PaginatedResponse<Item> = await itemService.getItems(0, 200);
      setItems(res.content ?? []);
    } catch (e) {
      console.error('Failed to load items', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this item? This action cannot be undone.')) return;
    try {
      await adminService.deleteItem(id);
      setItems((cur) => cur.filter((it) => it.id !== id));
    } catch (e) {
      console.error('Delete failed', e);
      alert('Failed to delete item');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading items...</div>;

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-semibold">Items</h2>
      {items.length === 0 ? (
        <div className="text-muted-foreground">No items found.</div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 border rounded-md bg-card">
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                <ImageWithFallback src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm line-clamp-1">{item.name}</div>
                <div className="text-xs text-muted-foreground">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</div>
              </div>
              <div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  // inline styles to ensure visibility
                  style={{ backgroundColor: '#dc2626', color: 'white', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)', fontSize: 13 }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminItemManagement;
