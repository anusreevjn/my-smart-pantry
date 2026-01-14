import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { Review } from '@/types/recipe';

export function useReviews(recipeId: string) {
  return useQuery({
    queryKey: ['reviews', recipeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles(username, avatar_url)
        `)
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!recipeId
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ recipeId, rating, comment }: { recipeId: string; rating: number; comment: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('reviews')
        .upsert({
          recipe_id: recipeId,
          user_id: user.id,
          rating,
          comment
        }, {
          onConflict: 'recipe_id,user_id'
        });

      if (error) throw error;
    },
    onSuccess: (_, { recipeId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', recipeId] });
      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive'
      });
    }
  });
}
