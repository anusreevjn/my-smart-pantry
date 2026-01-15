import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, X, ChefHat, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface SuggestedRecipe {
  name: string;
  description: string;
  cuisine: string;
  cookTime: string;
  ingredients: string[];
  instructions: string[];
}

export default function AISuggest() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestedRecipe[]>([]);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const getSuggestions = async () => {
    if (ingredients.length === 0) {
      toast({
        title: 'Add some ingredients',
        description: 'Please add at least one ingredient to get suggestions.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSuggestions([]);

    try {
      const { data, error } = await supabase.functions.invoke('ai-recipe-suggest', {
        body: { ingredients }
      });

      if (error) throw error;

      if (data.recipes) {
        setSuggestions(data.recipes);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to get recipe suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const popularIngredients = ['chicken', 'rice', 'eggs', 'onion', 'garlic', 'tofu', 'noodles', 'soy sauce'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              What's in Your Kitchen?
            </h1>
            <p className="text-muted-foreground text-lg">
              Tell us what ingredients you have and we'll suggest delicious Asian recipes
            </p>
          </div>

          {/* Ingredient Input */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft mb-8">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Type an ingredient (e.g., chicken, rice, tofu)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={addIngredient} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Add */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {popularIngredients.filter(i => !ingredients.includes(i)).map(ing => (
                  <Badge
                    key={ing}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setIngredients([...ingredients, ing])}
                  >
                    + {ing}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Selected Ingredients */}
            {ingredients.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Your ingredients ({ingredients.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map(ing => (
                    <Badge key={ing} className="gap-1 pr-1">
                      {ing}
                      <button
                        onClick={() => removeIngredient(ing)}
                        className="ml-1 p-0.5 rounded hover:bg-primary-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={getSuggestions}
              disabled={loading || ingredients.length === 0}
              className="w-full mt-6"
              size="lg"
              variant="hero"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Finding recipes...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Get Recipe Suggestions
                </>
              )}
            </Button>
          </div>

          {/* Suggestions */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-display font-bold">
                  Suggested Recipes ({suggestions.length})
                </h2>
                
                {suggestions.map((recipe, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border shadow-soft"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <ChefHat className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold">{recipe.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{recipe.cuisine}</Badge>
                          <Badge variant="secondary">{recipe.cookTime}</Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{recipe.description}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Ingredients</h4>
                        <ul className="space-y-1 text-sm">
                          {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-primary shrink-0" />
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Instructions</h4>
                        <ol className="space-y-2 text-sm">
                          {recipe.instructions.map((step, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="font-semibold text-primary">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
