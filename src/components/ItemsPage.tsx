import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { itemService, Item, PaginatedResponse } from '../services/itemService';
import { categoryService, Category } from '../services/categoryService';
import { adminService } from '../services/adminService';

export function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  type Filters = {
    category: string;
    condition: string;
    sortBy: string;
    sortDir: 'asc' | 'desc';
  };

  const [filters, setFilters] = useState<Filters>({
    category: '',
    condition: '',
    sortBy: 'createdAt',
    sortDir: 'desc'
  });

  // Contact modal state
  const [contactEmail, setContactEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const { user } = useAuth();

  const loadItems = async (page = 0, appliedFilters = filters) => {
    try {
      setLoading(true);
      // Debug: log the exact params we will send to the backend
      console.debug('Loading items with params:', { ...appliedFilters, page, size: 12 });
      const response: PaginatedResponse<Item> = await itemService.searchItems({
        ...appliedFilters,
        page,
        size: 12
      });
      setItems(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (err: any) {
      setError('Failed to load items: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadItems(0);
  }, [filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev: Filters) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    loadItems(page);
  };

  const handleCloseModal = () => {
    setContactEmail(null);
    setCopied(false);
  };

  const handleCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg">📚</span>
          </div>
          <p className="text-muted-foreground">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Browse Items</h1>
          <p className="text-muted-foreground">Discover great deals on books and stationery</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select 
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg"
          >
            <option value="">All Conditions</option>
            <option value="NEW">New</option>
            <option value="EXCELLENT">Excellent</option>
            <option value="VERY_GOOD">Very Good</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
          </select>
          <select 
            value={`${filters.sortBy}-${filters.sortDir}`}
            onChange={(e) => {
              const [sortBy, sortDir] = e.target.value.split('-');
              setFilters(prev => ({ ...prev, sortBy, sortDir: sortDir as 'asc' | 'desc' }));
            }}
            className="px-4 py-2 bg-card border border-border rounded-lg"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 text-xs px-2 py-1 rounded-full">
                      {item.condition.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {item.categoryName}
                    </span>
                  </div>
                  <h3 className="text-lg mb-2 line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sold by {item.sellerName}
                  </p>
                  <div className="flex items-center justify-between">
                     <span className="text-2xl text-primary">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // open contact modal only if seller email exists
                          setContactEmail(item.sellerEmail || null);
                          setCopied(false);
                        }}
                        aria-controls="contact-seller-modal"
                        aria-expanded={!!contactEmail}
                        // inline styles to ensure visibility and compact size
                        style={{ backgroundColor: 'black', color: 'white', padding: '6px 10px', borderRadius: 8, fontSize: 13 }}
                        className="hover:bg-primary/90 transition-colors"
                      >
                        Contact Seller
                      </button>

                      {(user?.id === item.sellerId || user?.role === 'ADMIN') && (
                        <button
                          onClick={async () => {
                            const isAdmin = user?.role === 'ADMIN';
                            const confirmMessage = isAdmin 
                              ? `Delete "${item.name}"? This action cannot be undone. (Admin Action)`
                              : 'Delete this item? This action cannot be undone.';
                            const ok = window.confirm(confirmMessage);
                            if (!ok) return;
                            try {
                              setDeletingIds((s) => [...s, item.id]);
                              if (isAdmin) {
                                await adminService.deleteItem(item.id);
                              } else {
                                await itemService.deleteItem(item.id);
                              }
                              // reload current page
                              loadItems(currentPage);
                            } catch (e: any) {
                              console.error('Delete failed', e);
                              setError('Failed to delete item: ' + (e.response?.data?.error || e.message));
                            } finally {
                              setDeletingIds((s) => s.filter((id) => id !== item.id));
                            }
                          }}
                          disabled={deletingIds.includes(item.id)}
                          // inline styles for smaller admin delete button and consistent look
                          style={user?.role === 'ADMIN' ? {
                            backgroundColor: '#dc2626', color: 'white', padding: '6px 8px', borderRadius: 8, fontSize: 13, border: '1px solid rgba(0,0,0,0.05)'
                          } : {
                            backgroundColor: 'transparent', color: 'inherit', padding: '6px 8px', borderRadius: 8, fontSize: 13, border: '1px solid rgba(0,0,0,0.06)'
                          }}
                          className="hover:brightness-90 transition-colors disabled:opacity-50"
                        >
                          {deletingIds.includes(item.id) ? 'Deleting...' : 
                           user?.role === 'ADMIN' ? 'Admin Delete' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* Contact modal */}
      {contactEmail && (
        <ContactModal email={contactEmail} onClose={handleCloseModal} copied={copied} onCopy={handleCopied} />
      )}
    </div>
  );
}

  // Render contact modal at root of component
  // (note: this will not render if contactEmail is null)
  // eslint-disable-next-line no-unreachable


// Contact Modal (rendered at bottom of file)
function ContactModal({ email, onClose, copied, onCopy }: { email: string | null; onClose: () => void; copied: boolean; onCopy: () => void; }) {
  if (!email) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      onCopy();
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  };

    // accessibility: trap focus within modal and close on ESC, overlay click
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    const previouslyFocused = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.[0]?.focus();

      function onKey(e: KeyboardEvent) {
        if (e.key === 'Escape') onClose();
        if (e.key === 'Tab') {
          // basic focus trap
          if (!modalRef.current) return;
          const nodes = Array.from(modalRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
          ));
          if (nodes.length === 0) return;
          const first = nodes[0];
          const last = nodes[nodes.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('keydown', onKey);
        // restore focus
        previouslyFocused.current?.focus();
      };
    }, [onClose]);

    const modalContent = (
      <div
        id="contact-seller-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-seller-title"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={modalRef}
          className="relative bg-card rounded-2xl shadow-xl border border-border p-6 w-full max-w-md mx-auto"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Close X button */}
          <button
            aria-label="Close contact modal"
            onClick={onClose}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>

          <h3 id="contact-seller-title" className="text-lg mb-2">Contact Seller</h3>
          <p className="text-sm text-muted-foreground mb-4">Email to contact the seller:</p>

          <div className="flex items-center justify-between border border-border rounded-lg px-4 py-3 mb-4 bg-input-background">
            <span className="truncate">{email}</span>
            <button onClick={handleCopy} className="ml-4 text-sm text-primary">{copied ? 'Copied' : 'Copy'}</button>
          </div>

          <div className="flex justify-end gap-3">
            <a href={`mailto:${email}`} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Open Email</a>
            <button onClick={onClose} className="px-4 py-2 bg-accent text-accent-foreground rounded-lg">Close</button>
          </div>
        </div>
      </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}