import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Flame, Heart, Star, Leaf, Wheat } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useRecipe } from '@/hooks/useRecipes';
import { useReviews, useAddReview } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';
import { useIsBookmarked, useToggleBookmark } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

const spiceLevelLabels: Record<string, string> = {
  none: 'No Spice',
  mild: 'Mild',
  medium: 'Medium',
  spicy: 'Spicy',
  very_spicy: 'Very Spicy',
};

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: recipe, isLoading } = useRecipe(id || '');
  const { data: reviews } = useReviews(id || '');
  const { data: isBookmarked } = useIsBookmarked(id || '');
  const toggleBookmark = useToggleBookmark();
  const addReview = useAddReview();

  const [servings, setServings] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="aspect-video w-full max-w-3xl bg-muted rounded-2xl" />
            <div className="h-10 w-3/4 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
          <Button asChild>
            <Link to="/recipes">Browse Recipes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentServings = servings || recipe.servings;
  const servingRatio = currentServings / recipe.servings;
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const avgRating = reviews?.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const handleBookmark = () => {
    if (!user) return;
    toggleBookmark.mutate({ recipeId: recipe.id, isBookmarked: !!isBookmarked });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addReview.mutate({ recipeId: recipe.id, rating, comment });
    setComment('');
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <Link to="/recipes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Recipes
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image & Basic Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
              <img
                src={recipe.image_url || '/placeholder.svg'}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              {user && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleBookmark}
                  className={cn(
                    "absolute top-4 right-4 rounded-full",
                    isBookmarked && "text-red-500"
                  )}
                >
                  <Heart className={cn("h-5 w-5", isBookmarked && "fill-current")} />
                </Button>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              {totalTime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{totalTime} min</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              {recipe.spice_level !== 'none' && (
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-red-500" />
                  <span>{spiceLevelLabels[recipe.spice_level]}</span>
                </div>
              )}
              {avgRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>{avgRating.toFixed(1)} ({reviews?.length} reviews)</span>
                </div>
              )}
            </div>

            {/* Diet Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">{recipe.cuisine}</Badge>
              {recipe.is_vegetarian && (
                <Badge variant="secondary" className="gap-1">
                  <Leaf className="h-3 w-3" /> Vegetarian
                </Badge>
              )}
              {recipe.is_halal && <Badge variant="secondary">Halal</Badge>}
              {recipe.is_gluten_free && (
                <Badge variant="secondary" className="gap-1">
                  <Wheat className="h-3 w-3" /> Gluten Free
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Recipe Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="text-muted-foreground text-lg">{recipe.description}</p>
              )}
            </div>

            {/* Portion Adjuster */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <label className="text-sm font-medium mb-2 block">Adjust Servings</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setServings(Math.max(1, currentServings - 1))}
                >
                  -
                </Button>
                <span className="font-semibold text-lg w-8 text-center">{currentServings}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setServings(currentServings + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h2 className="text-xl font-display font-bold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-xl font-display font-bold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      {i + 1}
                    </span>
                    <p className="pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-display font-bold mb-6">Reviews</h2>
          
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
                      )}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Share your thoughts about this recipe..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-4"
              />
              <Button type="submit" disabled={addReview.isPending}>
                Submit Review
              </Button>
            </form>
          )}

          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {review.profiles?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="font-medium">{review.profiles?.username || 'Anonymous'}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-3 w-3",
                              star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          )}
        </section>
      </main>
    </div>
  );
}
