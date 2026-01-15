import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export function useBookmarks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*, recipes(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });
}

export function useIsBookmarked(recipeId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookmark', user?.id, recipeId],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!recipeId
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ recipeId, isBookmarked }: { recipeId: string; isBookmarked: boolean }) => {
      if (!user) throw new Error('Must be logged in');

      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, recipe_id: recipeId });
        if (error) throw error;
      }
    },
    onSuccess: (_, { recipeId, isBookmarked }) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmark', user?.id, recipeId] });
      toast({
        title: isBookmarked ? 'Removed from favorites' : 'Added to favorites',
        description: isBookmarked ? 'Recipe removed from your collection' : 'Recipe saved to your collection'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update bookmark',
        variant: 'destructive'
      });
    }
  });
}
