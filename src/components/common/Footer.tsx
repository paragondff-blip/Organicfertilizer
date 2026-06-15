import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function Footer() {
  const { settings } = useSite();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className={`flex items-center justify-center shrink-0 ${!settings.logo ? 'w-10 h-10 bg-primary rounded-xl' : ''}`}>
                {settings.logo ? (
                  <img src={settings.logo} alt={settings.siteName} className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-white font-display font-bold text-xl">
                    {settings.siteName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xl font-display font-bold tracking-tight flex flex-wrap">
                {settings.siteName.split(' ').map((word, i) => (
                  <span key={i} className={i === 0 ? 'text-green-500' : 'text-orange-500 ml-1'}>
                    {word}
                  </span>
                ))}
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Experience the true taste of nature with our premium collection of handcrafted {settings.siteName.toLowerCase()}. Made with love and the finest ingredients.
            </p>
            <div className="flex space-x-4">
              <a href={settings.footer.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a href={settings.footer.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-secondary transition-colors">
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a href={settings.footer.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {settings.navigation.headerLinks.map((link, i) => (
                <li key={i}><Link to={link.path} className="hover:text-primary transition-colors">{link.name}</Link></li>
              ))}
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/admin-login" className="text-secondary/60 hover:text-secondary transition-colors font-bold text-[10px] uppercase tracking-widest mt-4 block">Admin Console</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-display font-bold text-lg mb-6">Categories</h3>
            <ul className="space-y-4">
              <li><Link to="/shop" className="hover:text-secondary transition-colors">Featured</Link></li>
              <li><Link to="/shop" className="hover:text-secondary transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop" className="hover:text-secondary transition-colors">Organic Mix</Link></li>
              <li><Link to="/shop" className="hover:text-secondary transition-colors">Special Offers</Link></li>
              <li><Link to="/shop" className="hover:text-secondary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-display font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                <span>{settings.footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>{settings.footer.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>{settings.footer.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p>© 2026 {settings.siteName}. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs grayscale opacity-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
