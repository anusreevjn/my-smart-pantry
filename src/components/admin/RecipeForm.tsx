import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { Recipe, CuisineType, MealType, SpiceLevel } from '@/types/recipe';

interface RecipeFormProps {
  recipe?: Recipe | null;
  onSubmit: (data: RecipeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface RecipeFormData {
  title: string;
  description: string;
  image_url: string;
  cuisine: CuisineType;
  meal_type: MealType;
  spice_level: SpiceLevel;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories: number;
  ingredients: string[];
  instructions: string[];
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_halal: boolean;
  is_gluten_free: boolean;
  is_approved: boolean;
}

const cuisineOptions: CuisineType[] = ['malaysian', 'indonesian', 'korean', 'japanese'];
const mealTypeOptions: MealType[] = ['breakfast', 'lunch_dinner', 'snacks', 'desserts', 'drinks'];
const spiceLevelOptions: SpiceLevel[] = ['none', 'mild', 'medium', 'spicy', 'very_spicy'];

export function RecipeForm({ recipe, onSubmit, onCancel, isLoading }: RecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    image_url: '',
    cuisine: 'malaysian',
    meal_type: 'lunch_dinner',
    spice_level: 'none',
    prep_time: 0,
    cook_time: 0,
    servings: 2,
    calories: 0,
    ingredients: [''],
    instructions: [''],
    is_vegetarian: false,
    is_vegan: false,
    is_halal: true,
    is_gluten_free: false,
    is_approved: true,
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        description: recipe.description || '',
        image_url: recipe.image_url || '',
        cuisine: recipe.cuisine,
        meal_type: recipe.meal_type,
        spice_level: recipe.spice_level,
        prep_time: recipe.prep_time || 0,
        cook_time: recipe.cook_time || 0,
        servings: recipe.servings,
        calories: recipe.calories || 0,
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
        instructions: recipe.instructions.length > 0 ? recipe.instructions : [''],
        is_vegetarian: recipe.is_vegetarian,
        is_vegan: recipe.is_vegan,
        is_halal: recipe.is_halal,
        is_gluten_free: recipe.is_gluten_free,
        is_approved: true,
      });
    }
  }, [recipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(i => i.trim() !== ''),
      instructions: formData.instructions.filter(i => i.trim() !== ''),
    };
    onSubmit(cleanedData);
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({ ...prev, instructions: [...prev.instructions, ''] }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Cuisine *</Label>
              <Select
                value={formData.cuisine}
                onValueChange={(value: CuisineType) => setFormData(prev => ({ ...prev, cuisine: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cuisineOptions.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Meal Type *</Label>
              <Select
                value={formData.meal_type}
                onValueChange={(value: MealType) => setFormData(prev => ({ ...prev, meal_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mealTypeOptions.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Spice Level *</Label>
              <Select
                value={formData.spice_level}
                onValueChange={(value: SpiceLevel) => setFormData(prev => ({ ...prev, spice_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {spiceLevelOptions.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="prep_time">Prep Time (min)</Label>
              <Input
                id="prep_time"
                type="number"
                min="0"
                value={formData.prep_time}
                onChange={(e) => setFormData(prev => ({ ...prev, prep_time: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cook_time">Cook Time (min)</Label>
              <Input
                id="cook_time"
                type="number"
                min="0"
                value={formData.cook_time}
                onChange={(e) => setFormData(prev => ({ ...prev, cook_time: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Servings *</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 2 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={formData.calories}
                onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dietary Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_vegetarian">Vegetarian</Label>
              <Switch
                id="is_vegetarian"
                checked={formData.is_vegetarian}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_vegetarian: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_vegan">Vegan</Label>
              <Switch
                id="is_vegan"
                checked={formData.is_vegan}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_vegan: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_halal">Halal</Label>
              <Switch
                id="is_halal"
                checked={formData.is_halal}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_halal: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_gluten_free">Gluten-Free</Label>
              <Switch
                id="is_gluten_free"
                checked={formData.is_gluten_free}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_gluten_free: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ingredients</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
              />
              {formData.ingredients.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Instructions</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex items-center justify-center w-8 h-10 bg-muted rounded text-sm font-medium">
                {index + 1}
              </div>
              <Textarea
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                rows={2}
                className="flex-1"
              />
              {formData.instructions.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeInstruction(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : recipe ? 'Update Recipe' : 'Create Recipe'}
        </Button>
      </div>
    </form>
  );
}
