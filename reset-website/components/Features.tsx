export default function Features() {
  const features = [
    {
      title: "Long-aged brews",
      description: "Patience makes perfect. We never rush our fermentation process, ensuring maximum benefits.",
      icon: "⏳",
    },
    {
      title: "Small batches",
      description: "Crafted with care in limited runs to maintain the highest quality and taste in every sip.",
      icon: "🧪",
    },
    {
      title: "Full of goodness",
      description: "Packed with live cultures and organic ingredients to support your gut health and energy.",
      icon: "✨",
    },
    {
      title: "Zero shortcuts",
      description: "No artificial flavors, no preservatives. Just real, function-first ingredients.",
      icon: "🚫",
    },
  ];

  return (
    <section id="about" className="py-24 bg-brand-dark text-brand-light">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">
            Function shouldn't <span className="text-brand-orange">taste boring</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-medium">
            We brew things the old school way. The tastiest drinks going 'round.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors duration-300 group"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform origin-left">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
