import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const cuisines = [
  {
    name: 'Malaysian',
    value: 'malaysian',
    emoji: '🇲🇾',
    description: 'Rich, aromatic dishes with bold spices',
    color: 'from-amber-500/20 to-red-500/20',
  },
  {
    name: 'Indonesian',
    value: 'indonesian',
    emoji: '🇮🇩',
    description: 'Flavorful recipes with sweet and savory blends',
    color: 'from-red-500/20 to-amber-500/20',
  },
  {
    name: 'Korean',
    value: 'korean',
    emoji: '🇰🇷',
    description: 'Vibrant flavors with fermented delights',
    color: 'from-rose-500/20 to-pink-500/20',
  },
  {
    name: 'Japanese',
    value: 'japanese',
    emoji: '🇯🇵',
    description: 'Elegant simplicity and umami perfection',
    color: 'from-emerald-500/20 to-teal-500/20',
  },
];

export function CuisineSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Explore by Cuisine
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Journey through the flavors of Southeast and East Asia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cuisines.map((cuisine, index) => (
            <motion.div
              key={cuisine.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                to={`/recipes?cuisine=${cuisine.value}`}
                className="block group"
              >
                <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${cuisine.color} border border-border hover-lift`}>
                  <div className="text-5xl mb-4">{cuisine.emoji}</div>
                  <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                    {cuisine.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cuisine.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
