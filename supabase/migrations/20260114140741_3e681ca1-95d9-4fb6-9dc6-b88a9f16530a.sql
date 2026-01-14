-- Create enum types
CREATE TYPE public.cuisine_type AS ENUM ('malaysian', 'indonesian', 'korean', 'japanese');
CREATE TYPE public.meal_type AS ENUM ('breakfast', 'lunch_dinner', 'snacks', 'desserts', 'drinks');
CREATE TYPE public.spice_level AS ENUM ('none', 'mild', 'medium', 'spicy', 'very_spicy');
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    UNIQUE (user_id, role)
);

-- Recipes table
CREATE TABLE public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    cuisine cuisine_type NOT NULL,
    meal_type meal_type NOT NULL,
    spice_level spice_level NOT NULL DEFAULT 'none',
    prep_time INTEGER, -- in minutes
    cook_time INTEGER, -- in minutes
    servings INTEGER NOT NULL DEFAULT 2,
    calories INTEGER,
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_halal BOOLEAN DEFAULT true,
    is_gluten_free BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (recipe_id, user_id)
);

-- Bookmarks table
CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, recipe_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies (only admins can manage roles)
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Recipes policies
CREATE POLICY "Anyone can view approved recipes" ON public.recipes FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins can view all recipes" ON public.recipes FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert recipes" ON public.recipes FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update recipes" ON public.recipes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete recipes" ON public.recipes FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, username, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample recipes
INSERT INTO public.recipes (title, description, image_url, cuisine, meal_type, spice_level, prep_time, cook_time, servings, calories, ingredients, instructions, is_vegetarian, is_halal) VALUES
('Nasi Lemak', 'Malaysia''s national dish - fragrant coconut rice served with sambal, anchovies, peanuts, egg, and cucumber', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', 'malaysian', 'breakfast', 'spicy', 30, 45, 4, 650, '["2 cups jasmine rice", "400ml coconut milk", "Pandan leaves", "Anchovies", "Roasted peanuts", "Hard-boiled eggs", "Cucumber slices", "Sambal paste"]'::jsonb, '["Wash rice and drain", "Cook rice with coconut milk and pandan leaves", "Fry anchovies until crispy", "Prepare sambal", "Serve rice with all condiments"]'::jsonb, false, true),
('Rendang', 'Slow-cooked beef in rich coconut and spice gravy - a festive favorite', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800', 'malaysian', 'lunch_dinner', 'spicy', 45, 180, 6, 480, '["1kg beef chunks", "400ml coconut milk", "Lemongrass", "Galangal", "Dried chilies", "Kerisik (toasted coconut)", "Kaffir lime leaves"]'::jsonb, '["Blend spice paste", "Sear beef in pan", "Add coconut milk and spices", "Slow cook until dry and tender", "Stir occasionally"]'::jsonb, false, true),
('Bibimbap', 'Korean mixed rice bowl with vegetables, meat, egg, and gochujang sauce', 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800', 'korean', 'lunch_dinner', 'medium', 30, 20, 2, 550, '["Steamed rice", "Beef bulgogi", "Spinach", "Bean sprouts", "Carrots", "Zucchini", "Fried egg", "Gochujang sauce", "Sesame oil"]'::jsonb, '["Prepare rice in hot stone bowl", "Arrange vegetables and meat", "Top with fried egg", "Drizzle sesame oil and gochujang", "Mix before eating"]'::jsonb, false, true),
('Ramen', 'Japanese noodle soup with rich pork broth, chashu, and soft-boiled egg', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', 'japanese', 'lunch_dinner', 'mild', 60, 480, 4, 620, '["Ramen noodles", "Pork bones", "Chashu pork belly", "Soft-boiled eggs", "Nori seaweed", "Green onions", "Bamboo shoots", "Sesame seeds"]'::jsonb, '["Simmer pork bones for 8 hours", "Prepare chashu pork", "Marinate soft-boiled eggs", "Cook noodles", "Assemble bowl with toppings"]'::jsonb, false, false),
('Nasi Goreng', 'Indonesian fried rice with sweet soy sauce, shrimp paste, and fried egg', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800', 'indonesian', 'lunch_dinner', 'medium', 15, 15, 2, 480, '["Day-old rice", "Kecap manis", "Shrimp paste", "Garlic", "Shallots", "Chicken or shrimp", "Fried egg", "Cucumber", "Kerupuk"]'::jsonb, '["Saute garlic and shallots", "Add shrimp paste and protein", "Add rice and kecap manis", "Stir-fry until fragrant", "Serve with fried egg"]'::jsonb, false, true),
('Matcha Cheesecake', 'Creamy Japanese cheesecake with earthy matcha green tea flavor', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800', 'japanese', 'desserts', 'none', 30, 60, 8, 380, '["Cream cheese", "Heavy cream", "Sugar", "Eggs", "Matcha powder", "Digestive biscuits", "Butter"]'::jsonb, '["Make biscuit base", "Blend cream cheese mixture", "Fold in matcha", "Bake in water bath", "Chill overnight"]'::jsonb, true, true),
('Tteokbokki', 'Spicy Korean rice cakes in gochujang sauce - popular street food snack', 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800', 'korean', 'snacks', 'very_spicy', 10, 20, 3, 350, '["Rice cakes", "Gochujang paste", "Gochugaru flakes", "Fish cakes", "Cabbage", "Green onions", "Sugar", "Soy sauce"]'::jsonb, '["Soak rice cakes", "Make sauce with gochujang", "Simmer rice cakes in sauce", "Add fish cakes and vegetables", "Cook until thickened"]'::jsonb, false, true),
('Es Cendol', 'Indonesian iced dessert with pandan jelly, coconut milk, and palm sugar', 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=800', 'indonesian', 'drinks', 'none', 20, 30, 4, 280, '["Rice flour", "Pandan extract", "Coconut milk", "Palm sugar syrup", "Shaved ice", "Red beans"]'::jsonb, '["Make cendol from rice flour and pandan", "Prepare palm sugar syrup", "Layer ice, cendol, and coconut milk", "Drizzle palm sugar", "Add red beans"]'::jsonb, true, true);
