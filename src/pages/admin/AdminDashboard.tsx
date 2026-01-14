import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllRecipes, useAllReviews } from '@/hooks/useAdmin';
import { UtensilsCrossed, MessageSquare, Star, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { data: recipes } = useAllRecipes();
  const { data: reviews } = useAllReviews();

  const totalRecipes = recipes?.length || 0;
  const totalReviews = reviews?.length || 0;
  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const cuisineCounts = recipes?.reduce((acc, recipe) => {
    acc[recipe.cuisine] = (acc[recipe.cuisine] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to OurDapur Admin Panel</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Recipes
              </CardTitle>
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalRecipes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reviews
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalReviews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Rating
              </CardTitle>
              <Star className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageRating}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cuisines
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Object.keys(cuisineCounts).length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recipes by Cuisine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {Object.entries(cuisineCounts).map(([cuisine, count]) => (
                <div key={cuisine} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium capitalize">{cuisine}</span>
                  <span className="text-2xl font-bold text-primary">{count}</span>
                </div>
              ))}
              {Object.keys(cuisineCounts).length === 0 && (
                <p className="text-muted-foreground col-span-4 text-center py-8">
                  No recipes yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
