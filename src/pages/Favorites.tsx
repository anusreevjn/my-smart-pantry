import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useBookmarks } from '@/hooks/useBookmarks';
import { CuisineType, MealType, SpiceLevel } from '@/types/recipe';

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const { data: bookmarks, isLoading } = useBookmarks();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-4">Sign in to see your favorites</h1>
            <p className="text-muted-foreground mb-6">
              Create an account to save and organize your favorite recipes
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const recipes = bookmarks?.map(b => ({
    ...b.recipes,
    cuisine: b.recipes.cuisine as CuisineType,
    meal_type: b.recipes.meal_type as MealType,
    spice_level: b.recipes.spice_level as SpiceLevel,
    ingredients: Array.isArray(b.recipes.ingredients) 
      ? (b.recipes.ingredients as unknown as string[]) 
      : [],
    instructions: Array.isArray(b.recipes.instructions) 
      ? (b.recipes.instructions as unknown as string[]) 
      : [],
  })) || [];

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
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            Your saved recipes collection
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring recipes and save your favorites here
            </p>
            <Button asChild>
              <Link to="/recipes">Browse Recipes</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
