import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Flame, Users, Heart } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useIsBookmarked, useToggleBookmark } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

const cuisineColors: Record<string, string> = {
  malaysian: 'bg-spice-red/10 text-spice-red border-spice-red/20',
  indonesian: 'bg-golden-yellow/10 text-amber-700 border-golden-yellow/20',
  korean: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  japanese: 'bg-herb-green/10 text-herb-green border-herb-green/20',
};

const spiceLevelIcons: Record<string, number> = {
  none: 0,
  mild: 1,
  medium: 2,
  spicy: 3,
  very_spicy: 4,
};

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

export function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const { user } = useAuth();
  const { data: isBookmarked } = useIsBookmarked(recipe.id);
  const toggleBookmark = useToggleBookmark();

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleBookmark.mutate({ recipeId: recipe.id, isBookmarked: !!isBookmarked });
  };

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/recipe/${recipe.id}`} className="block group">
        <article className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-soft hover-lift">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={recipe.image_url || '/placeholder.svg'}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Bookmark Button */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={cn(
                  "absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white",
                  isBookmarked && "text-red-500"
                )}
              >
                <Heart className={cn("h-5 w-5", isBookmarked && "fill-current")} />
              </Button>
            )}

            {/* Cuisine Badge */}
            <Badge 
              variant="outline" 
              className={cn(
                "absolute bottom-3 left-3 capitalize font-medium",
                cuisineColors[recipe.cuisine]
              )}
            >
              {recipe.cuisine}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {recipe.title}
            </h3>
            
            {recipe.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {recipe.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              {totalTime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{totalTime} min</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings}</span>
              </div>

              {spiceLevelIcons[recipe.spice_level] > 0 && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: spiceLevelIcons[recipe.spice_level] }).map((_, i) => (
                    <Flame key={i} className="h-4 w-4 text-spice-red" />
                  ))}
                </div>
              )}
            </div>

            {/* Diet Badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {recipe.is_vegetarian && (
                <Badge variant="secondary" className="text-xs bg-herb-green/10 text-herb-green">
                  Vegetarian
                </Badge>
              )}
              {recipe.is_halal && (
                <Badge variant="secondary" className="text-xs">
                  Halal
                </Badge>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
