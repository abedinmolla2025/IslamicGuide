import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-emerald-900 to-emerald-950 border-t border-emerald-700/50 py-6 px-4 mt-auto">
      <div className="max-w-2xl mx-auto text-center space-y-3">
        {/* App Name & Tagline */}
        <div>
          <h3 className="text-emerald-200 font-bold text-lg">Islamic Companion</h3>
          <p className="text-emerald-400 text-sm">আপনার দৈনন্দিন ইসলামিক সঙ্গী</p>
        </div>
        
        {/* Divider */}
        <div className="w-24 h-px bg-emerald-600/50 mx-auto"></div>
        
        {/* Description */}
        <p className="text-emerald-300 text-xs leading-relaxed max-w-md mx-auto">
          কুরআন, হাদিস, দোয়া, নামাজের সময়, ক্বিবলা এবং আরও অনেক কিছু একসাথে
        </p>
        
        {/* Made with Love */}
        <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
          <span>for the Ummah</span>
        </div>
        
        {/* Copyright & Version */}
        <div className="text-emerald-500 text-xs space-y-1">
          <p>© {currentYear} Islamic Companion. All rights reserved.</p>
          <p className="text-emerald-600">Version 1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
