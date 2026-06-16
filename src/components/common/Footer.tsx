import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Youtube, Linkedin } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function Footer() {
  const { settings } = useSite();

  const footer = settings.footer;

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
            {footer.description && (
              <p className="text-gray-400 leading-relaxed">
                {footer.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              {footer.facebook && (
                <a href={footer.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] transition-colors group">
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              )}
              {footer.instagram && (
                <a href={footer.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E4405F] transition-colors group">
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              )}
              {footer.twitter && (
                <a href={footer.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1DA1F2] transition-colors group">
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              )}
              {(footer as any).linkedin && (
                <a href={(footer as any).linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0A66C2] transition-colors group">
                  <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              )}
              {(footer as any).youtube && (
                <a href={(footer as any).youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF0000] transition-colors group">
                  <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          {(footer.quickLinksTitle || footer.quickLinks?.length > 0) && (
            <div>
              <h3 className="text-white font-display font-bold text-lg mb-6">{footer.quickLinksTitle || 'Quick Links'}</h3>
              <ul className="space-y-4">
                {footer.quickLinks?.map((link, i) => (
                  <li key={i}><Link to={link.path} className="hover:text-primary transition-colors">{link.name}</Link></li>
                ))}
                <li><Link to="/admin-login" className="text-secondary/60 hover:text-secondary transition-colors font-bold text-[10px] uppercase tracking-widest mt-4 block">Admin Console</Link></li>
              </ul>
            </div>
          )}

          {/* Categories */}
          {(footer.categoriesTitle || footer.categories?.length > 0) && (
            <div>
              <h3 className="text-white font-display font-bold text-lg mb-6">{footer.categoriesTitle || 'Categories'}</h3>
              <ul className="space-y-4">
                {footer.categories?.map((link, i) => (
                  <li key={i}><Link to={link.path} className="hover:text-secondary transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          {(footer.contactTitle || footer.address || footer.phone || footer.email) && (
            <div>
              <h3 className="text-white font-display font-bold text-lg mb-6">{footer.contactTitle || 'Contact Us'}</h3>
              <ul className="space-y-4">
                {footer.address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span>{footer.address}</span>
                  </li>
                )}
                {footer.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <span>{footer.phone}</span>
                  </li>
                )}
                {footer.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <span>{footer.email}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p>{footer.rightsReserved || `© ${new Date().getFullYear()} ${settings.siteName}. All rights reserved.`}</p>
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
