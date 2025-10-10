import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const handleClose = () => {
    setShowInstallBanner(false);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-4 rounded-lg shadow-2xl border border-emerald-500 relative">
        <div className="flex items-start gap-3">
          <Download className="w-6 h-6 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Islamic Companion App ইনস্টল করুন</h3>
            <p className="text-sm text-emerald-50 mb-3">
              Chrome থেকে সরাসরি আপনার ফোনে app install করুন - কোনো APK download লাগবে না!
            </p>
            <div className="flex gap-2 relative">
              <Button
                onClick={handleInstallClick}
                data-testid="button-install-app"
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold relative"
              >
                <Download className="w-4 h-4 mr-2" />
                Install করুন
              </Button>
              
              {/* Animated Hand Pointer */}
              <div className="absolute -bottom-14 left-8 animate-bounce pointer-events-none">
                <div className="text-5xl animate-pulse">👆</div>
              </div>
              
              <Button
                onClick={handleClose}
                data-testid="button-close-install"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                পরে করব
              </Button>
            </div>
          </div>
          <button
            onClick={handleClose}
            data-testid="button-dismiss-install"
            className="text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
