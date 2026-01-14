export type CuisineType = 'malaysian' | 'indonesian' | 'korean' | 'japanese';
export type MealType = 'breakfast' | 'lunch_dinner' | 'snacks' | 'desserts' | 'drinks';
export type SpiceLevel = 'none' | 'mild' | 'medium' | 'spicy' | 'very_spicy';

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  cuisine: CuisineType;
  meal_type: MealType;
  spice_level: SpiceLevel;
  prep_time: number | null;
  cook_time: number | null;
  servings: number;
  calories: number | null;
  ingredients: string[];
  instructions: string[];
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_halal: boolean;
  is_gluten_free: boolean;
  created_at: string;
  average_rating?: number;
  review_count?: number;
}

export interface Review {
  id: string;
  recipe_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface Bookmark {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface RecipeFilters {
  cuisine?: CuisineType[];
  mealType?: MealType[];
  spiceLevel?: SpiceLevel[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isHalal?: boolean;
  isGlutenFree?: boolean;
  searchQuery?: string;
}
