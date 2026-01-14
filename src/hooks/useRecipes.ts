import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Recipe, RecipeFilters, CuisineType, MealType, SpiceLevel } from '@/types/recipe';

export function useRecipes(filters?: RecipeFilters) {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: async () => {
      let query = supabase
        .from('recipes')
        .select('*')
        .eq('is_approved', true);

      if (filters?.cuisine && filters.cuisine.length > 0) {
        query = query.in('cuisine', filters.cuisine);
      }

      if (filters?.mealType && filters.mealType.length > 0) {
        query = query.in('meal_type', filters.mealType);
      }

      if (filters?.spiceLevel && filters.spiceLevel.length > 0) {
        query = query.in('spice_level', filters.spiceLevel);
      }

      if (filters?.isVegetarian) {
        query = query.eq('is_vegetarian', true);
      }

      if (filters?.isVegan) {
        query = query.eq('is_vegan', true);
      }

      if (filters?.isHalal) {
        query = query.eq('is_halal', true);
      }

      if (filters?.isGlutenFree) {
        query = query.eq('is_gluten_free', true);
      }

      if (filters?.searchQuery) {
        query = query.ilike('title', `%${filters.searchQuery}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(recipe => ({
        ...recipe,
        cuisine: recipe.cuisine as CuisineType,
        meal_type: recipe.meal_type as MealType,
        spice_level: recipe.spice_level as SpiceLevel,
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
      })) as Recipe[];
    }
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        cuisine: data.cuisine as CuisineType,
        meal_type: data.meal_type as MealType,
        spice_level: data.spice_level as SpiceLevel,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        instructions: Array.isArray(data.instructions) ? data.instructions : [],
      } as Recipe;
    },
    enabled: !!id
  });
}
