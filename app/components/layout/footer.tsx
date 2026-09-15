import { Utensils, Instagram, Facebook, Twitter } from 'lucide-react';
import NewsletterForm from './newsletterform';

const SOCIALS = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Twitter, label: 'Twitter' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/80 pt-16 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Taste<span className="text-brand-500">Craft</span>
              </span>
            </a>
            <p className="text-sm text-gray-400 max-w-sm">
              Crafting exceptional culinary experiences delivered straight to your home. Fresh,
              organic, and always delicious.
            </p>
            <div className="flex space-x-3 text-gray-400">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-gray-900 hover:bg-brand-500 hover:text-white flex items-center justify-center transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#hero" className="hover:text-brand-500 transition">Home</a></li>
              <li><a href="#menu" className="hover:text-brand-500 transition">Menu</a></li>
              <li><a href="#offers" className="hover:text-brand-500 transition">Offers</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Opening Hours</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Mon - Thu: 10:00 AM - 11:00 PM</li>
              <li>Fri - Sat: 10:00 AM - 01:00 AM</li>
              <li>Sunday: 11:00 AM - 11:00 PM</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Subscribe</h4>
            <p className="text-xs text-gray-400">Get 10% off coupon code directly to your inbox.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>&copy; 2026 TasteCraft Restaurant Inc. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            <a href="#" className="hover:text-gray-400">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}