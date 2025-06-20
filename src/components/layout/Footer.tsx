
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { WHATSAPP_LINK_BASE, WHATSAPP_NUMBER, EMAIL_ADDRESS, PHYSICAL_ADDRESS } from '@/lib/constants';
import Logo from '@/components/icons/Logo';

const Footer = () => {
  const whatsappDirectLink = `${WHATSAPP_LINK_BASE}${WHATSAPP_NUMBER.replace('+', '')}`;
  return (
    <footer className="bg-card text-card-foreground border-t mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted source for quality laptops.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">Your Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary" />
                <a href={whatsappDirectLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {WHATSAPP_NUMBER} (WhatsApp)
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary" />
                <a href={`mailto:${EMAIL_ADDRESS}`} className="hover:text-primary transition-colors">
                  {EMAIL_ADDRESS}
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-primary" />
                <span>{PHYSICAL_ADDRESS}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Lapzen. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
