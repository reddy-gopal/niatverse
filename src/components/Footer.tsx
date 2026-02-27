import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and tagline */}
          <div>
            <div className="flex items-center mb-3">
              <span className="font-display text-2xl font-bold text-white">NIAT</span>
              <span className="font-body text-xl font-medium text-white/80 ml-1">Verse</span>
            </div>
            <p className="text-white/60 text-sm">
              Every NIAT campus. Mapped by students.
            </p>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap gap-4 md:justify-center">
            <Link to="/about" className="text-white/60 hover:text-white text-sm transition-colors">
              About
            </Link>
            <Link to="/guidelines" className="text-white/60 hover:text-white text-sm transition-colors">
              Guidelines
            </Link>
            <Link to="/code-of-conduct" className="text-white/60 hover:text-white text-sm transition-colors">
              Code of Conduct
            </Link>
            <Link to="/contact" className="text-white/60 hover:text-white text-sm transition-colors">
              Contact
            </Link>
          </div>
          
          {/* Empty column for balance */}
          <div className="hidden md:block" />
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            Built by NIAT students, for NIAT students. 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
