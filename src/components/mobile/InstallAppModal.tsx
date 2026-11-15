import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Share, 
  PlusSquare, 
  X, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import logoIcon from '../../assets/smile7-logo-icon.png';

interface InstallAppModalProps {
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    const isAndroidDevice = /android/.test(ua);

    if (isIOSDevice) {
      setActiveTab('ios');
    } else if (isAndroidDevice) {
      setActiveTab('android');
    } else {
      setActiveTab('android');
    }

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event (Chrome/Edge on Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions for Android Chrome / Samsung Internet
      alert('On Android Chrome:\n1. Tap the 3 dots (⋮) in the top-right corner.\n2. Tap "Install app" or "Add to Home screen".');
    }
  };

  const portalUrl = 'https://smile7dental.com/#billing';

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 max-h-[95vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8">
          <img 
            src={logoIcon} 
            alt="Smile7 Dental" 
            className="w-12 h-12 rounded-2xl object-contain shadow-xs border border-slate-100"
          />
          <div>
            <h2 className="text-base font-extrabold text-[#002244] leading-tight">
              Install Smile7 Mobile App
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Install directly onto your Android phone or iPhone
            </p>
          </div>
        </div>

        {/* Platform Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'android'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Android (APK / WebAPK)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ios'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="font-bold text-slate-800 text-xs">🍎</span>
            <span>iPhone (iOS)</span>
          </button>
        </div>

        {/* Tab 1: Android Instructions & 1-Tap Install */}
        {activeTab === 'android' && (
          <div className="space-y-4 text-xs">
            {isInstalled ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold">Smile7 Dental is already installed as a standalone app!</span>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                  <span className="font-extrabold text-emerald-950 block text-xs">
                    Android Installation:
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Installs as a native standalone app with full-screen experience, offline billing capabilities, and the official Smile7 icon in your phone's app drawer.
                  </p>
                  
                  <button
                    type="button"
                    onClick={handleInstallAndroid}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all mt-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Install on Android (1-Tap)</span>
                  </button>
                </div>

                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-700 block text-[11px]">
                    If the 1-Tap button didn't appear on your Android:
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>Open <strong>Chrome</strong> on your Android phone.</li>
                    <li>Go to: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#004884] font-mono">smile7dental.com/#billing</code></li>
                    <li>Tap the <strong>3 dots (⋮)</strong> in the top-right corner.</li>
                    <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  </ol>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: iPhone (iOS) Instructions */}
        {activeTab === 'ios' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2.5">
              <span className="font-extrabold text-sky-950 block text-xs">
                Install on iPhone in 3 Quick Steps:
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Apple requires installing directly from Safari without needing the App Store:
              </p>

              <div className="space-y-2.5 pt-1 text-[11px] text-slate-700">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-sky-100">
                  <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center shrink-0">1</div>
                  <div>
                    Open <strong className="text-sky-950">Safari</strong> on your iPhone and visit:
                    <div className="font-mono text-[#004884] font-bold mt-0.5">smile7dental.com/#billing</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-sky-100">
                  <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center shrink-0">2</div>
                  <div className="flex-1">
                    Tap the <strong>Share</strong> button at the bottom of Safari:
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-bold ml-1.5 text-[10px]">
                      <Share className="w-3.5 h-3.5 text-[#004884]" /> Share Icon
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-sky-100">
                  <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center shrink-0">3</div>
                  <div>
                    Scroll down and tap <strong>"Add to Home Screen"</strong>:
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-bold ml-1.5 text-[10px]">
                      <PlusSquare className="w-3.5 h-3.5 text-slate-700" /> Add to Home Screen
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-[11px] text-center">
              The official <strong>Smile7 Dental</strong> app icon will now appear on your iPhone home screen!
            </p>
          </div>
        )}

        {/* Quick Phone Access Link & Copy */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">App Link for Phone:</span>
            <span className="font-mono text-slate-700 text-xs truncate block">{portalUrl}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ExternalLink className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy URL'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
