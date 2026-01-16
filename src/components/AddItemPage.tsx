import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { itemService, ItemCreateRequest } from '../services/itemService';
import { categoryService, Category } from '../services/categoryService';

export function AddItemPage() {
  const { isAuthenticated } = useAuth();
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState('GOOD');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Always load categories so the select is populated even when the user isn't signed in.
    // Keep the login prompt, but don't prevent categories from loading.
    loadCategories();
    if (!isAuthenticated) {
      setError('Please log in to add items');
    }
  }, [isAuthenticated]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
      if (response.length > 0) setCategoryId(response[0].id.toString());
    } catch (err: any) {
      setError('Failed to load categories: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validations
    setError('');
    setSuccess('');

    const parsedPrice = Number(price);
    if (!isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price greater than 0');
      return;
    }

    if (!categoryId || isNaN(parseInt(categoryId))) {
      setError('Please select a valid category');
      return;
    }

    // Require either a selected file or a non-empty image URL
    if (!selectedFile && (!imageUrl || imageUrl.trim().length === 0)) {
      setError('Please provide an image by URL or upload one from your computer');
      return;
    }

    // If an image URL was provided, validate its length
    if (imageUrl && imageUrl.length > 500) {
      setError('Image URL is too long (max 500 characters). Use a shorter URL or upload the image to a hosting service.');
      return;
    }

    if (!isAuthenticated) {
      setError('Please log in to add items');
      return;
    }

    setLoading(true);

    try {
      // If a local file is selected, upload it first and use returned URL
      let finalImageUrl = imageUrl.trim();
      if (selectedFile) {
        try {
          finalImageUrl = await itemService.uploadFile(selectedFile);
        } catch (uploadErr: any) {
          console.error('Upload failed', uploadErr);
          setError('Image upload failed: ' + (uploadErr.response?.data?.error || uploadErr.message));
          setLoading(false);
          return;
        }
      }

      const itemData: ItemCreateRequest = {
        name: itemName.trim(),
        price: parsedPrice,
        imageUrl: finalImageUrl,
        condition: condition as any,
        description: description?.trim(),
        categoryId: parseInt(categoryId)
      };

      await itemService.createItem(itemData);
      setSuccess('Item added successfully!');

      setItemName('');
      setPrice('');
      setImageUrl('');
      setCategoryId(categories[0]?.id.toString() || '');
      setCondition('GOOD');
      setDescription('');
    } catch (err: any) {
      console.error('Create item error:', err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError('You must be logged in to add items. Please log in and try again.');
      } else if (status === 400) {
        // Try to surface backend validation message if available
        const backendMsg = err.response?.data || err.response?.data?.error;
        setError('Failed to add item: ' + (backendMsg || err.message));
      } else {
        setError('Failed to add item: ' + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (previewUrl) {
      try { URL.revokeObjectURL(previewUrl); } catch { /* ignore */ }
    }
    setPreviewError(false);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // clear the typed imageUrl when a file is chosen to avoid confusion
      setImageUrl('');
    } else {
      setPreviewUrl('');
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Sell Your Item</h1>
          <p className="text-muted-foreground">List your books and stationery for sale</p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="itemName" className="block text-sm mb-2">
                Item Name *
              </label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                placeholder="e.g., Introduction to Computer Science Textbook"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm mb-2">
                  Condition *
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  required
                >
                  <option value="NEW">New</option>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="VERY_GOOD">Very Good</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm mb-2">
                Price (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm mb-2">
                Image URL *
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                placeholder="https://example.com/image.jpg"
                // required when no file is selected
              />
              <p className="text-sm text-muted-foreground mt-2">
                Provide a URL to an image of your item
              </p>

              <div className="mt-3 flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: '#000', color: '#fff' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 5 17 10" />
                    <line x1="12" y1="5" x2="12" y2="19" />
                  </svg>
                  <span style={{ color: '#fff' }}>Upload from computer</span>
                </button>
                {selectedFile && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectedFile.name}</span>
                    <button type="button" onClick={() => { URL.revokeObjectURL(previewUrl); setSelectedFile(null); setPreviewUrl(''); }} className="text-sm text-destructive underline">Remove</button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
                placeholder="Describe the item's condition, features, and any other relevant details..."
              />
            </div>

            {/* Preview (either uploaded file preview or image URL) */}
            {(previewUrl || imageUrl) && (
              <div className="border border-border rounded-xl p-4 bg-accent/20">
                <h3 className="text-sm mb-3">Preview</h3>
                <div className="flex space-x-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {!previewError ? (
                      <img
                        src={previewUrl || imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground bg-muted">
                        Preview not available
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{itemName || 'Item Name'}</h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      {categories.find(c => c.id.toString() === categoryId)?.name || 'Category'}
                    </p>
                    <p className="text-lg text-primary">₹{price ? Number(price).toLocaleString('en-IN') : '0'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !isAuthenticated}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Item...' : 'List Item for Sale'}
              </button>
              <button
                type="button"
                onClick={() => {
                      setItemName('');
                      setPrice('');
                      setImageUrl('');
                      if (previewUrl) { try { URL.revokeObjectURL(previewUrl); } catch {} }
                      setSelectedFile(null);
                      setPreviewUrl('');
                      setPreviewError(false);
                      setCategoryId(categories[0]?.id.toString() || '');
                      setCondition('GOOD');
                      setDescription('');
                }}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/80 transition-colors"
              >
                Clear
              </button>
            </div>
          </form>

          {!isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                🔒 Please log in to add items for sale.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}