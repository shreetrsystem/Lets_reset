import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-light pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-black mb-6 uppercase">Let's Reset</h2>
            <p className="text-gray-400 max-w-sm font-medium leading-relaxed">
              Naturally fermented kombucha with live cultures and zero shortcuts.
              Tastes amazing. Feels even better.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-lg">Keep up to date</h4>
            <ul className="space-y-4 text-gray-400 font-medium font-medium">
              <li>
                <Link href="#shop" className="hover:text-brand-orange transition-colors">Shop</Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-brand-orange transition-colors">Find your Reset</Link>
              </li>
              <li>
                <Link href="#journal" className="hover:text-brand-orange transition-colors">Reset Journal</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-lg">Say Hello</h4>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
              <span className="text-white/20">•</span>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} Let's Reset. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
