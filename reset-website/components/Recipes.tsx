"use client";

import Image from "next/image";

const RECIPES = [
  {
    id: "cranberry-spritz",
    title: "Cranberry Citrus Spritz",
    time: "5 Min",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop",
    ingredients: [
      "1/2 can Cranberry Reset",
      "1 oz Fresh Orange Juice",
      "Rosemary Sprig for garnish",
      "Ice"
    ]
  },
  {
    id: "jamun-mule",
    title: "Spiced Jamun Mule",
    time: "5 Min",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
    ingredients: [
      "1/2 can Spiced Jamun Reset",
      "Squeeze of fresh lime",
      "Mint Leaves",
      "Crushed Ice"
    ]
  },
  {
    id: "peach-morning",
    title: "Morning Peach Glow",
    time: "2 Min",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1621269389926-7f41cd4ba334?q=80&w=800&auto=format&fit=crop",
    ingredients: [
      "1 can Coffee Peach Reset",
      "Splash of Coconut Water",
      "Peach Slice for garnish",
      "Ice"
    ]
  }
];

export default function Recipes() {
  return (
    <section id="recipes" className="py-24 bg-white dark:bg-brand-dark overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black text-brand-dark dark:text-brand-light uppercase tracking-tight mb-4">
              Mix <span className="text-brand-purple">It Up.</span>
            </h2>
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
              Elevate your kombucha routine. Explore our favorite mocktails and perfect pairings crafted for every flavor.
            </p>
          </div>
          <button className="hidden md:block py-3 px-6 rounded-full border-2 border-brand-dark dark:border-brand-light text-brand-dark dark:text-brand-light font-bold hover:bg-brand-dark dark:hover:bg-brand-light hover:text-brand-light dark:hover:text-brand-dark transition-colors">
            View All Recipes
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {RECIPES.map((recipe) => (
            <div key={recipe.id} className="group cursor-pointer">
              <div className="relative h-80 w-full mb-6 rounded-3xl overflow-hidden">
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                 <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-dark dark:text-brand-light uppercase">
                      {recipe.time}
                    </span>
                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-dark dark:text-brand-light uppercase">
                      {recipe.difficulty}
                    </span>
                 </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-brand-dark dark:text-brand-light group-hover:text-brand-purple transition-colors">
                {recipe.title}
              </h3>
              
              <ul className="space-y-2 mb-4">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mr-2 opacity-50"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
