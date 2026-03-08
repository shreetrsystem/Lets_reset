export default function Testimonials() {
  const testimonials = [
    {
      quote: "Never knew something so healthy can be so delicious!! No more sugary sodas for me...!",
      author: "Verified Customer",
    },
    {
      quote: "The Spiced Jamun is a revelation. It feels like a premium cocktail but leaves me feeling light.",
      author: "Wellness Enthusiast",
    },
    {
      quote: "Finally a kombucha that doesn't taste like vinegar. Coffee Peach is my new morning go-to!",
      author: "Early Riser",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-black text-center mb-16 text-brand-dark">
          HEAR FROM OUR <span className="text-brand-purple">COMMUNITY</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#fcfaf8] p-10 rounded-[2rem] border border-gray-100 shadow-sm relative"
            >
              <div className="text-6xl text-brand-orange absolute -top-4 left-6 opacity-40 font-serif">"</div>
              <div className="flex mb-6 text-brand-orange">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-xl font-medium text-gray-800 mb-8 leading-relaxed relative z-10">
                {item.quote}
              </p>
              <p className="font-bold text-sm tracking-widest text-gray-500 uppercase">
                {item.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
