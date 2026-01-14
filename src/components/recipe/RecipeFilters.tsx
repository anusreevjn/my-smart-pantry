import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RecipeFilters as FilterType, CuisineType, MealType, SpiceLevel } from '@/types/recipe';
import { cn } from '@/lib/utils';

const cuisines: { value: CuisineType; label: string }[] = [
  { value: 'malaysian', label: 'Malaysian' },
  { value: 'indonesian', label: 'Indonesian' },
  { value: 'korean', label: 'Korean' },
  { value: 'japanese', label: 'Japanese' },
];

const mealTypes: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch_dinner', label: 'Lunch/Dinner' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'drinks', label: 'Drinks' },
];

const spiceLevels: { value: SpiceLevel; label: string }[] = [
  { value: 'none', label: 'No Spice' },
  { value: 'mild', label: 'Mild' },
  { value: 'medium', label: 'Medium' },
  { value: 'spicy', label: 'Spicy' },
  { value: 'very_spicy', label: 'Very Spicy' },
];

interface RecipeFiltersProps {
  filters: FilterType;
  onChange: (filters: FilterType) => void;
}

export function RecipeFilters({ filters, onChange }: RecipeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = 
    (filters.cuisine?.length || 0) +
    (filters.mealType?.length || 0) +
    (filters.spiceLevel?.length || 0) +
    (filters.isVegetarian ? 1 : 0) +
    (filters.isVegan ? 1 : 0) +
    (filters.isHalal ? 1 : 0) +
    (filters.isGlutenFree ? 1 : 0);

  const toggleCuisine = (cuisine: CuisineType) => {
    const current = filters.cuisine || [];
    const updated = current.includes(cuisine)
      ? current.filter(c => c !== cuisine)
      : [...current, cuisine];
    onChange({ ...filters, cuisine: updated.length ? updated : undefined });
  };

  const toggleMealType = (mealType: MealType) => {
    const current = filters.mealType || [];
    const updated = current.includes(mealType)
      ? current.filter(m => m !== mealType)
      : [...current, mealType];
    onChange({ ...filters, mealType: updated.length ? updated : undefined });
  };

  const toggleSpiceLevel = (spiceLevel: SpiceLevel) => {
    const current = filters.spiceLevel || [];
    const updated = current.includes(spiceLevel)
      ? current.filter(s => s !== spiceLevel)
      : [...current, spiceLevel];
    onChange({ ...filters, spiceLevel: updated.length ? updated : undefined });
  };

  const clearFilters = () => {
    onChange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-1 rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
              {/* Cuisine */}
              <div>
                <h4 className="font-semibold mb-3">Cuisine</h4>
                <div className="flex flex-wrap gap-2">
                  {cuisines.map(cuisine => (
                    <Badge
                      key={cuisine.value}
                      variant={filters.cuisine?.includes(cuisine.value) ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => toggleCuisine(cuisine.value)}
                    >
                      {cuisine.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Meal Type */}
              <div>
                <h4 className="font-semibold mb-3">Meal Type</h4>
                <div className="flex flex-wrap gap-2">
                  {mealTypes.map(mealType => (
                    <Badge
                      key={mealType.value}
                      variant={filters.mealType?.includes(mealType.value) ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => toggleMealType(mealType.value)}
                    >
                      {mealType.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Spice Level */}
              <div>
                <h4 className="font-semibold mb-3">Spice Level</h4>
                <div className="flex flex-wrap gap-2">
                  {spiceLevels.map(level => (
                    <Badge
                      key={level.value}
                      variant={filters.spiceLevel?.includes(level.value) ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => toggleSpiceLevel(level.value)}
                    >
                      {level.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Diet Preferences */}
              <div>
                <h4 className="font-semibold mb-3">Diet Preferences</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.isVegetarian || false}
                      onCheckedChange={(checked) => onChange({ ...filters, isVegetarian: checked === true ? true : undefined })}
                    />
                    <span className="text-sm">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.isVegan || false}
                      onCheckedChange={(checked) => onChange({ ...filters, isVegan: checked === true ? true : undefined })}
                    />
                    <span className="text-sm">Vegan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.isHalal || false}
                      onCheckedChange={(checked) => onChange({ ...filters, isHalal: checked === true ? true : undefined })}
                    />
                    <span className="text-sm">Halal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.isGlutenFree || false}
                      onCheckedChange={(checked) => onChange({ ...filters, isGlutenFree: checked === true ? true : undefined })}
                    />
                    <span className="text-sm">Gluten Free</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
