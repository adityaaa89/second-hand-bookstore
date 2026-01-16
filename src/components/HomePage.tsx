import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">📚</span>
            </div>
            <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to BookSwap
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your trusted marketplace for second-hand books and stationery. 
              Find great deals on textbooks, novels, and school supplies from fellow students and book lovers.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('items')}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg"
            >
              Browse Items
            </button>
            <button
              onClick={() => onNavigate('add-item')}
              className="bg-accent text-accent-foreground px-8 py-4 rounded-xl hover:bg-accent/80 transition-all transform hover:scale-105 border border-border"
            >
              Sell Your Books
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
            <div className="w-12 h-12 bg-gradient-to-br from-chart-1 to-chart-1/80 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">💰</span>
            </div>
            <h3 className="text-lg mb-2">Great Prices</h3>
            <p className="text-muted-foreground">
              Save up to 70% on textbooks and get the best deals on quality second-hand books.
            </p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
            <div className="w-12 h-12 bg-gradient-to-br from-chart-2 to-chart-2/80 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">🌱</span>
            </div>
            <h3 className="text-lg mb-2">Sustainable</h3>
            <p className="text-muted-foreground">
              Give books a second life and reduce waste by buying and selling pre-owned items.
            </p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
            <div className="w-12 h-12 bg-gradient-to-br from-chart-3 to-chart-3/80 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">🤝</span>
            </div>
            <h3 className="text-lg mb-2">Community</h3>
            <p className="text-muted-foreground">
              Connect with local students and book enthusiasts in your area.
            </p>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="text-center">
          <h2 className="text-3xl mb-8">What We Offer</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">📖</div>
              <h4 className="mb-2">Textbooks</h4>
              <p className="text-sm text-muted-foreground">Academic books for all subjects</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">📝</div>
              <h4 className="mb-2">Stationery</h4>
              <p className="text-sm text-muted-foreground">Pens, notebooks, and supplies</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">📚</div>
              <h4 className="mb-2">Novels</h4>
              <p className="text-sm text-muted-foreground">Fiction and non-fiction books</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🎓</div>
              <h4 className="mb-2">References</h4>
              <p className="text-sm text-muted-foreground">Guides and reference materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}