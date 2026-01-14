import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { RecipeFilters } from '@/components/recipe/RecipeFilters';
import { Input } from '@/components/ui/input';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeFilters as FilterType, CuisineType } from '@/types/recipe';

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterType>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const cuisine = searchParams.get('cuisine');
    const search = searchParams.get('search');
    
    if (cuisine) {
      setFilters(prev => ({ ...prev, cuisine: [cuisine as CuisineType] }));
    }
    if (search) {
      setSearchQuery(search);
      setFilters(prev => ({ ...prev, searchQuery: search }));
    }
  }, [searchParams]);

  const { data: recipes, isLoading } = useRecipes({
    ...filters,
    searchQuery: searchQuery || undefined
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, searchQuery }));
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Browse Recipes
          </h1>
          <p className="text-muted-foreground">
            Discover authentic Asian dishes for every occasion
          </p>
        </motion.div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Filters */}
        <RecipeFilters filters={filters} onChange={setFilters} />

        {/* Recipe Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : recipes && recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No recipes found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
