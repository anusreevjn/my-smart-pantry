import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedRecipes } from '@/components/home/FeaturedRecipes';
import { CuisineSection } from '@/components/home/CuisineSection';
import { ChefHat, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedRecipes />
      <CuisineSection />
      
      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why OurDapur?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your ultimate companion for Asian home cooking
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Suggestions',
                description: 'Tell us what ingredients you have and get personalized recipe recommendations',
              },
              {
                icon: ChefHat,
                title: 'Authentic Recipes',
                description: 'Curated collection of traditional Malaysian, Indonesian, Korean, and Japanese dishes',
              },
              {
                icon: Heart,
                title: 'Save Your Favorites',
                description: 'Bookmark recipes you love and build your personal cookbook collection',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border shadow-soft"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-secondary/30">
        <div className="container text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ChefHat className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground">OurDapur</span>
          </div>
          <p className="text-sm">Your Asian Kitchen Companion</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
