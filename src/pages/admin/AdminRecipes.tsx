import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { RecipeForm, RecipeFormData } from '@/components/admin/RecipeForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAllRecipes, useCreateRecipe, useUpdateRecipe, useDeleteRecipe } from '@/hooks/useAdmin';
import { Recipe } from '@/types/recipe';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRecipes() {
  const { data: recipes, isLoading } = useAllRecipes();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();
  
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const handleCreate = () => {
    setEditingRecipe(null);
    setShowForm(true);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      if (editingRecipe) {
        await updateRecipe.mutateAsync({ id: editingRecipe.id, ...data });
        toast.success('Recipe updated successfully');
      } else {
        await createRecipe.mutateAsync(data);
        toast.success('Recipe created successfully');
      }
      setShowForm(false);
      setEditingRecipe(null);
    } catch (error) {
      toast.error('Failed to save recipe');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRecipe.mutateAsync(id);
      toast.success('Recipe deleted successfully');
    } catch (error) {
      toast.error('Failed to delete recipe');
    }
  };

  if (showForm) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {editingRecipe ? 'Edit Recipe' : 'Create Recipe'}
            </h1>
          </div>
          <RecipeForm
            recipe={editingRecipe}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingRecipe(null);
            }}
            isLoading={createRecipe.isPending || updateRecipe.isPending}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Recipes</h1>
            <p className="text-muted-foreground mt-1">Manage all recipes</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Recipe
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recipes && recipes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Cuisine</TableHead>
                    <TableHead>Meal Type</TableHead>
                    <TableHead>Spice Level</TableHead>
                    <TableHead>Dietary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {recipe.cuisine}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {recipe.meal_type.replace('_', ' ')}
                      </TableCell>
                      <TableCell className="capitalize">
                        {recipe.spice_level.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {recipe.is_vegetarian && <Badge variant="secondary" className="text-xs">Veg</Badge>}
                          {recipe.is_vegan && <Badge variant="secondary" className="text-xs">Vegan</Badge>}
                          {recipe.is_halal && <Badge variant="secondary" className="text-xs">Halal</Badge>}
                          {recipe.is_gluten_free && <Badge variant="secondary" className="text-xs">GF</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(recipe)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(recipe.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No recipes found. Create your first recipe!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
