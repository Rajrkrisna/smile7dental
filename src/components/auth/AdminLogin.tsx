import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Globe,
  Stethoscope
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const { adminAuth, loginWithPin, loginWithPassword, clinicProfile } = useDental();
  
  const [loginMode, setLoginMode] = useState<'pin' | 'password'>('pin');
  const [pin, setPin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handlePinDigit = (digit: string) => {
    setErrorMsg('');
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      
      // Auto-submit on 4-digit match
      if (nextPin === adminAuth.adminPin) {
        processSuccess('pin', nextPin);
      } else if (nextPin.length === 4 && nextPin !== adminAuth.adminPin) {
        setErrorMsg('Invalid Doctor PIN. Please check and try again.');
      }
    }
  };

  const handlePinBackspace = () => {
    setErrorMsg('');
    setPin(prev => prev.slice(0, -1));
  };

  const handlePinClear = () => {
    setErrorMsg('');
    setPin('');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setErrorMsg('Please enter your 4-digit Doctor PIN.');
      return;
    }
    const success = loginWithPin(pin);
    if (success) {
      processSuccess('pin', pin);
    } else {
      setErrorMsg('Incorrect PIN. Default is 7777.');
      setPin('');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Please enter your administrator password.');
      return;
    }
    const success = loginWithPassword(password);
    if (success) {
      processSuccess('password', password);
    } else {
      setErrorMsg('Incorrect password. Default is Smile7@Admin2026.');
    }
  };

  const processSuccess = (type: 'pin' | 'password', val: string) => {
    if (type === 'pin') loginWithPin(val);
    else loginWithPassword(val);

    setIsSuccess(true);
    setErrorMsg('');
    setTimeout(() => {
      onLoginSuccess();
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="relative z-10 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-teal-700 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-teal-900/40">
            S7
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight">Smile7 Dental Clinic</span>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Admin Restricted
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Practice Management & Billing Subdomain</p>
          </div>
        </div>

        {/* Subdomain Indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <Globe className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-slate-400 font-mono text-[11px]">{adminAuth.subdomainUrl || 'billing.smile7dental.com'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </header>

      {/* Main Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          {/* Practice Badge & Lead Doctor */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Clinician Authentication
            </h1>
            
            <div className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-full text-xs text-slate-300">
              <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
              <span>{clinicProfile.dentistInCharge}</span>
            </div>
          </div>

          {/* Mode Switcher: 4-Digit Quick PIN vs Password */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLoginMode('pin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                loginMode === 'pin'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Doctor PIN (Quick)
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('password');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                loginMode === 'password'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Master Password
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Access Granted. Launching Billing Suite...</span>
            </div>
          )}

          {/* MODE 1: Fast PIN Keypad */}
          {loginMode === 'pin' && (
            <div className="space-y-5">
              {/* PIN Dots Display */}
              <div className="flex justify-center items-center gap-3 py-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      pin.length > idx
                        ? 'bg-teal-400 border-teal-400 scale-110 shadow-sm shadow-teal-400/50'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  />
                ))}
              </div>

              {/* Number Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handlePinDigit(digit)}
                    className="h-12 bg-slate-800/80 hover:bg-slate-700 active:bg-teal-600 active:text-white rounded-xl text-lg font-bold text-slate-100 border border-slate-700/50 transition-all"
                  >
                    {digit}
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={handlePinClear}
                  className="h-12 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold border border-slate-800 transition-all"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => handlePinDigit('0')}
                  className="h-12 bg-slate-800/80 hover:bg-slate-700 active:bg-teal-600 active:text-white rounded-xl text-lg font-bold text-slate-100 border border-slate-700/50 transition-all"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={handlePinBackspace}
                  className="h-12 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold border border-slate-800 transition-all"
                >
                  ⌫
                </button>
              </div>

              {/* Quick Submit button */}
              <button
                type="button"
                onClick={handlePinSubmit}
                className="w-full py-3 bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <span>Unlock Billing Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-500">
                  Default Quick PIN: <code className="text-teal-400 font-mono font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">7777</code>
                </span>
              </div>
            </div>
          )}

          {/* MODE 2: Master Password Form */}
          {loginMode === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Admin Email / Doctor Username
                </label>
                <input
                  type="email"
                  disabled
                  value={adminAuth.adminEmail || 'care@smile7dental.com'}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Master Administrative Password
                </label>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter master password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-500">
                  Default Password: <code className="text-teal-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">Smile7@Admin2026</code>
                </span>
              </div>
            </form>
          )}

          {/* Clinical Privacy Notice */}
          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center space-y-1">
            <p className="flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-teal-500" />
              <span>Restricted Access: Patient Financial & Medical Records</span>
            </p>
            <p className="text-[10px] text-slate-600">
              Smile7 Dental Clinic • Maduravoyal, Chennai - 600095
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Smile7 Dental Clinic. Subdomain billing terminal for authorized clinic operators only.</p>
      </footer>
    </div>
  );
};
