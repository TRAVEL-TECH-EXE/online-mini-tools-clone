import { useState, useMemo, useEffect } from 'react';
import { Search, Heart, Home as HomeIcon, Grid3X3, List, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

/* Design System: Modern Minimalist with Neon Accents
   - Primary Accent: Cyan (#00D9FF) for main actions
   - Secondary Accent: Magenta (#FF006E) for secondary actions
   - Success Accent: Lime (#39FF14) for positive states
   - Typography: Space Mono for headings, Inter for body
   - Layout: Asymmetric grid with sidebar navigation and masonry tool cards
   - Interactions: Smooth transitions with glow effects on hover
*/

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
}

interface ToolWithRoute extends Tool {
  route?: string;
}

const TOOLS: ToolWithRoute[] = [
  // Text Tools
  { id: '1', name: 'Text Repeater', description: 'Repeat text multiple times with custom separators', category: 'Text Tools', icon: '📝', color: 'from-cyan-400 to-blue-500' },
  { id: '2', name: 'Case Converter', description: 'Convert text to different cases (uppercase, lowercase, title case)', category: 'Text Tools', icon: '🔤', color: 'from-cyan-400 to-blue-500', route: '/tool/case-converter' },
  { id: '3', name: 'Text Flipper', description: 'Invert or reverse text instantly', category: 'Text Tools', icon: '🔄', color: 'from-cyan-400 to-blue-500' },
  { id: '4', name: 'HTML Stripper', description: 'Remove HTML tags from text', category: 'Text Tools', icon: '🏷️', color: 'from-cyan-400 to-blue-500' },
  { id: '21', name: 'Grammar Checker', description: 'Check grammar and spelling with real-time suggestions', category: 'Text Tools', icon: '✍️', color: 'from-cyan-400 to-blue-500', route: '/tool/grammar-checker' },
  { id: '22', name: 'Text Formatter', description: 'Apply formatting transformations to text', category: 'Text Tools', icon: '📐', color: 'from-cyan-400 to-blue-500', route: '/tool/text-formatter' },
  { id: '23', name: 'Word Counter', description: 'Analyze text with detailed statistics and word frequency', category: 'Text Tools', icon: '📊', color: 'from-cyan-400 to-blue-500', route: '/tool/word-counter' },
  { id: '24', name: 'Markdown Converter', description: 'Convert Markdown to HTML with real-time preview', category: 'Text Tools', icon: '📝', color: 'from-cyan-400 to-blue-500', route: '/tool/markdown-converter' },

  // Converters
  { id: '5', name: 'CSV to JSON', description: 'Convert CSV files to JSON format', category: 'Converters', icon: '🔀', color: 'from-magenta-400 to-pink-500', route: '/tool/csv-to-json' },
  { id: '6', name: 'JSON Validator', description: 'Validate and format JSON syntax', category: 'Converters', icon: '✓', color: 'from-magenta-400 to-pink-500', route: '/tool/json-validator' },
  { id: '7', name: 'Base64 Encoder', description: 'Encode and decode Base64 strings', category: 'Converters', icon: '🔐', color: 'from-magenta-400 to-pink-500', route: '/tool/base64' },
  { id: '8', name: 'UTF8 Converter', description: 'Convert UTF8 to multiple formats', category: 'Converters', icon: '🔤', color: 'from-magenta-400 to-pink-500' },

  // Calculators
  { id: '9', name: 'Matrix Calculator', description: 'Perform matrix operations', category: 'Calculators', icon: '📈', color: 'from-lime-400 to-green-500', route: '/tool/matrix-calculator' },
  { id: '10', name: 'Prime Factors', description: 'Calculate prime factorization', category: 'Calculators', icon: '🔢', color: 'from-lime-400 to-green-500', route: '/tool/prime-factors' },
  { id: '11', name: 'Percentage Calculator', description: 'Calculate percentages easily', category: 'Calculators', icon: '%', color: 'from-lime-400 to-green-500', route: '/tool/percentage-calculator' },
  { id: '12', name: 'Tip Calculator', description: 'Calculate tips and split bills', category: 'Calculators', icon: '💰', color: 'from-lime-400 to-green-500', route: '/tool/tip-calculator' },

  // Web Tools
  { id: '13', name: 'QR Code Generator', description: 'Generate QR codes instantly', category: 'Web Tools', icon: '📱', color: 'from-purple-400 to-indigo-500', route: '/tool/qr-code' },
  { id: '14', name: 'Meta Tag Generator', description: 'Generate SEO meta tags', category: 'Web Tools', icon: '🏷️', color: 'from-purple-400 to-indigo-500', route: '/tool/meta-tag-generator' },
  { id: '15', name: 'Favicon Generator', description: 'Create favicons for your website', category: 'Web Tools', icon: '🎨', color: 'from-purple-400 to-indigo-500', route: '/tool/favicon-generator' },
  { id: '16', name: 'URL Slug Generator', description: 'Generate SEO-friendly URL slugs', category: 'Web Tools', icon: '🔗', color: 'from-purple-400 to-indigo-500', route: '/tool/url-slug-generator' },

  // Image Tools
  { id: '17', name: 'Image to Base64', description: 'Convert images to Base64 encoding', category: 'Image Tools', icon: '🖼️', color: 'from-orange-400 to-red-500', route: '/tool/image-to-base64' },
  { id: '18', name: 'Crop Image', description: 'Crop images online with precision', category: 'Image Tools', icon: '✂️', color: 'from-orange-400 to-red-500' },
  { id: '19', name: 'Image Converter', description: 'Convert between image formats', category: 'Image Tools', icon: '🔄', color: 'from-orange-400 to-red-500', route: '/tool/image-converter' },
  { id: '20', name: 'Color Extractor', description: 'Extract colors from images', category: 'Image Tools', icon: '🎨', color: 'from-orange-400 to-red-500', route: '/tool/color-extractor' },

  // AI Tools
  { id: '25', name: 'AI Prompt Generator', description: 'Create and optimize prompts for AI models', category: 'AI Tools', icon: '⚡', color: 'from-cyan-400 to-magenta-500', route: '/tool/ai-prompt-generator' },

  // Additional Converters
  { id: '26', name: 'YAML Converter', description: 'Convert between YAML and JSON formats', category: 'Converters', icon: '📄', color: 'from-magenta-400 to-pink-500', route: '/tool/yaml-converter' },
];

const CATEGORIES = ['All', 'Text Tools', 'Converters', 'Calculators', 'Web Tools', 'Image Tools', 'AI Tools'];

export default function Home() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const favoriteTools = filteredTools.filter(tool => favorites.includes(tool.id));
  const regularTools = filteredTools.filter(tool => !favorites.includes(tool.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm transition-colors duration-300">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-magenta-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚙️</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">OnlineMiniTools</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 neon-glow border-cyan-400 text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950"
                onClick={() => setSelectedCategory('All')}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Favorites ({favorites.length})</span>
                <span className="sm:hidden">{favorites.length}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 neon-glow border-cyan-400 text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-b from-background via-background to-muted/20 py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              400+ Free Online Tools
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Simple and straightforward tools for your daily needs
            </p>

            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-magenta-400 to-lime-400 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-300" />
              <div className="relative bg-card rounded-full flex items-center px-6 py-3 shadow-lg transition-colors duration-300">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <div className="flex gap-2 flex-wrap justify-center">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-cyan-400 to-magenta-500 text-white shadow-lg neon-glow'
                      : 'bg-card text-foreground border border-border hover:border-cyan-400 hover:text-cyan-600 dark:hover:border-cyan-500'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-end gap-2 mb-6">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Grid/List */}
      <section className="container py-12">
        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No tools found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filters</p>
          </div>
        ) : (
          <>
            {/* Favorites Section */}
            {favoriteTools.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-magenta-500 fill-magenta-500" />
                  Your Favorites
                </h3>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {favoriteTools.map(tool => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                      viewMode={viewMode}
                      onNavigate={navigate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Tools Section */}
            {regularTools.length > 0 && (
              <div>
                {favoriteTools.length > 0 && (
                  <h3 className="text-2xl font-bold text-foreground mb-6">All Tools</h3>
                )}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {regularTools.map(tool => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isFavorite={false}
                      onToggleFavorite={toggleFavorite}
                      viewMode={viewMode}
                      onNavigate={navigate}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 text-lg">OnlineMiniTools</h4>
              <p className="text-sm opacity-80">Your go-to resource for 400+ free online tools</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Categories</h5>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-cyan-400 transition">Text Tools</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Converters</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Calculators</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Connect</h5>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-cyan-400 transition">Twitter</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">GitHub</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-60">
            <p>© 2026 OnlineMiniTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface ToolCardProps {
  tool: ToolWithRoute;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  viewMode: 'grid' | 'list';
  onNavigate: (path: string) => void;
}

function ToolCard({ tool, isFavorite, onToggleFavorite, viewMode, onNavigate }: ToolCardProps) {
  return (
    <div
      className={`tool-card group ${
        viewMode === 'list' ? 'flex items-center gap-4 p-4' : ''
      }`}
    >
      <Card className={`h-full border-border hover:border-cyan-400 transition-all duration-200 ${
        viewMode === 'list' ? 'flex-1' : ''
      }`}>
        <CardHeader className={viewMode === 'list' ? 'pb-2' : ''}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className={`text-4xl mb-2 ${viewMode === 'list' ? 'hidden' : ''}`}>
                {tool.icon}
              </div>
              <CardTitle className={`text-lg ${viewMode === 'list' ? 'text-base' : ''}`}>
                {tool.name}
              </CardTitle>
              <CardDescription className={viewMode === 'list' ? 'text-sm' : ''}>
                {tool.description}
              </CardDescription>
            </div>
            <button
              onClick={() => onToggleFavorite(tool.id)}
              className="flex-shrink-0 p-2 rounded-lg transition-all duration-200 hover:bg-muted"
            >
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${
                  isFavorite
                    ? 'fill-magenta-500 text-magenta-500'
                    : 'text-muted-foreground hover:text-magenta-500'
                }`}
              />
            </button>
          </div>
        </CardHeader>
        {viewMode === 'grid' && (
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {tool.category}
              </span>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-400 to-magenta-500 text-white hover:shadow-lg neon-glow"
                onClick={() => tool.route ? onNavigate(tool.route) : toast.info('Tool coming soon!')}
              >
                Open Tool
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
