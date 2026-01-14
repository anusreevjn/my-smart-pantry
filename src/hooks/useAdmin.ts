import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Recipe, CuisineType, MealType, SpiceLevel } from '@/types/recipe';

export function useIsAdmin() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data === true;
    },
    enabled: !!user
  });
}

export function useAllRecipes() {
  const { data: isAdmin } = useIsAdmin();
  
  return useQuery({
    queryKey: ['admin-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(recipe => ({
        ...recipe,
        cuisine: recipe.cuisine as CuisineType,
        meal_type: recipe.meal_type as MealType,
        spice_level: recipe.spice_level as SpiceLevel,
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
      })) as Recipe[];
    },
    enabled: isAdmin === true
  });
}

export function useAllReviews() {
  const { data: isAdmin } = useIsAdmin();
  
  return useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          recipes!inner(title),
          profiles!reviews_user_id_fkey(username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: isAdmin === true
  });
}

interface RecipeInput {
  title: string;
  description?: string;
  image_url?: string;
  cuisine: CuisineType;
  meal_type: MealType;
  spice_level: SpiceLevel;
  prep_time?: number;
  cook_time?: number;
  servings: number;
  calories?: number;
  ingredients: string[];
  instructions: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_halal?: boolean;
  is_gluten_free?: boolean;
  is_approved?: boolean;
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (recipe: RecipeInput) => {
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          ...recipe,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    }
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...recipe }: RecipeInput & { id: string }) => {
      const { data, error } = await supabase
        .from('recipes')
        .update({
          ...recipe,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    }
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    }
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    }
  });
}
// Add this inside src/hooks/useAdmin.ts

export function useAllUsers() {
  const { data: isAdmin } = useIsAdmin();
  
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Fetch profiles combined with roles
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: isAdmin === true
  });
}
