import Image from "next/image";

export default function Products() {
  const products = [
    {
      id: "cranberry",
      name: "Cranberry",
      description: "Crisp, tart, and wildly refreshing.",
      image: "/cranberry.png",
      color: "bg-brand-red",
      textColor: "text-brand-red",
      nutrition: {
        calories: 35,
        sugar: "7g",
        cultures: "2 Billion CFUs",
        ingredients: "Filtered water, kombucha culture (yeast and bacteria cultures), organic black tea, organic cane sugar, organic cold-pressed cranberry juice."
      }
    },
    {
      id: "jamun",
      name: "Spiced Jamun",
      description: "Deep, earthy, with a familiar kick.",
      image: "/jamun.png",
      color: "bg-brand-purple",
      textColor: "text-brand-purple",
      nutrition: {
        calories: 40,
        sugar: "9g",
        cultures: "2 Billion CFUs",
        ingredients: "Filtered water, kombucha culture, organic green tea, organic cane sugar, organic jamun puree, organic cinnamon, organic clove."
      }
    },
    {
      id: "peach",
      name: "Coffee Peach",
      description: "An unexpected spark to start your day.",
      image: "/peach.png",
      color: "bg-brand-orange",
      textColor: "text-brand-orange",
      nutrition: {
        calories: 45,
        sugar: "11g",
        cultures: "2 Billion CFUs",
        ingredients: "Filtered water, kombucha culture, organic fair-trade coffee beans, organic cane sugar, organic cold-pressed peach juice."
      }
    },
  ];

  const packs = [
    "Variety Pack (Pack of 6)",
    "Combo Pack - Spiced Jamun/Coffee Peach (Pack of 6)",
    "Combo Pack - Spiced Jamun/Cranberry (Pack of 6)",
    "Combo Pack - Coffee Peach/Cranberry (Pack of 6)",
  ];

  return (
    <section id="products" className="py-24 bg-[#fff3f3]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-brand-dark uppercase tracking-tight mb-4">
            Ready to <span className="text-brand-red">Reset?</span>
          </h2>
          <p className="text-xl font-medium text-gray-600">Choose your flavor profile or grab a pack.</p>
        </div>

        {/* Single Cans */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {products.map((product) => (
             <div key={product.id} className="relative w-full h-[32rem] group cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-[#1a1515] shadow-xl shadow-gray-200/50 dark:shadow-none border dark:border-white/5 transition-transform duration-500 hover:-translate-y-2">
                
                {/* Top Border Bar */}
                <div className={`absolute top-0 left-0 w-full h-1 ${product.color} opacity-100 group-hover:opacity-0 transition-opacity duration-300 z-30`}></div>

                {/* Liquid Pour Background Overlay */}
                <div className={`absolute bottom-0 left-0 w-full h-0 group-hover:h-full transition-all duration-[600ms] ease-out ${product.color} opacity-100 z-10 blur-[1px]`}></div>
                
                {/* CSS Bubbles */}
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen">
                  <div className="absolute bottom-[-20px] left-[20%] w-3 h-3 rounded-full bg-white/40 animate-bubble-1"></div>
                  <div className="absolute bottom-[-20px] left-[50%] w-5 h-5 rounded-full bg-white/30 animate-bubble-2"></div>
                  <div className="absolute bottom-[-20px] left-[75%] w-2 h-2 rounded-full bg-white/50 animate-bubble-3"></div>
                  <div className="absolute bottom-[-20px] right-[10%] w-4 h-4 rounded-full bg-white/30 animate-bubble-1" style={{ animationDelay: '0.5s' }}></div>
                </div>

                {/* Content Container */}
                <div className="relative z-30 w-full h-full p-8 flex flex-col items-center text-center">
                  
                  {/* Bottle Image */}
                  <div className="relative h-64 w-full mb-6 transform transition-all duration-[600ms] ease-out group-hover:scale-110 group-hover:-translate-y-4 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-xl"
                    />
                  </div>

                  {/* Front Text (Hides on Hover) */}
                  <div className="absolute bottom-8 left-8 right-8 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                     <h3 className={`text-3xl font-bold mb-2 ${product.textColor}`}>{product.name}</h3>
                     <p className="text-gray-500 dark:text-gray-400">{product.description}</p>
                  </div>

                  {/* Hover Overlay Content (Nutrition & Cart) */}
                  <div className="absolute inset-x-8 bottom-8 flex flex-col justify-end opacity-0 transform translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 text-white antialiased">
                    <h3 className="text-2xl font-black mb-1 drop-shadow-md">{product.name}</h3>
                    <p className="text-xs opacity-90 mb-4 drop-shadow-md">{product.nutrition.calories} Cal | {product.nutrition.sugar} Sugar | {product.nutrition.cultures}</p>
                    
                    <button className="w-full py-4 rounded-xl font-black text-brand-dark bg-white shadow-lg shadow-black/20 hover:scale-[1.03] active:scale-95 active:animate-pop transition-all duration-200">
                      Add to Cart
                    </button>
                  </div>

                </div>
             </div>
          ))}
        </div>

        {/* Packs section */}
        <div className="bg-brand-dark rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-red rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-purple rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          
          <h3 className="text-4xl font-black mb-8 relative z-10">THE BUNDLES</h3>
          <div className="grid sm:grid-cols-2 gap-4 relative z-10 max-w-4xl mx-auto">
            {packs.map((pack, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-white/20 transition-colors">
                <span className="font-medium text-left pr-4">{pack}</span>
                <span className="text-brand-orange group-hover:translate-x-1 transition-transform">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
