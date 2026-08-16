import React, { useState, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle, 
  CheckCircle2, 
  Globe,
  Stethoscope,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import logoIcon from '../../assets/smile7-logo-icon.png';
import logoText from '../../assets/smile7-logo-text.jpg';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToWebsite?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const { adminAuth, loginWithPin, loginWithPassword, setupMasterCredentials, clinicProfile } = useDental();
  
  // Check if credentials are set up
  const isFirstTimeSetup = !adminAuth.isConfigured || (!adminAuth.adminPassword && !adminAuth.adminPin);

  // Setup Form State
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupPin, setSetupPin] = useState('');
  const [setupConfirmPin, setSetupConfirmPin] = useState('');
  const [setupEmail, setSetupEmail] = useState(adminAuth.adminEmail || 'care@smile7dental.com');
  const [showSetupPassword, setShowSetupPassword] = useState(false);

  // Regular Login State
  const [loginMode, setLoginMode] = useState<'pin' | 'password'>('pin');
  const [pin, setPin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [failedCount, setFailedCount] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Lockout countdown effect
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handlePinDigit = (digit: string) => {
    if (lockoutSeconds > 0) return;
    setErrorMsg('');
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      
      // Auto-submit on 4-digit entry
      if (nextPin.length === 4) {
        verifyPin(nextPin);
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

  const verifyPin = (pinToTest: string) => {
    const success = loginWithPin(pinToTest);
    if (success) {
      processSuccess();
    } else {
      const nextFailed = failedCount + 1;
      setFailedCount(nextFailed);
      setPin('');
      if (nextFailed >= 5) {
        setLockoutSeconds(60);
        setErrorMsg('Too many failed attempts. Terminal locked for 60 seconds.');
      } else {
        setErrorMsg(`Incorrect Doctor PIN. (${5 - nextFailed} attempts remaining)`);
      }
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    if (!pin || pin.length !== 4) {
      setErrorMsg('Please enter your 4-digit Doctor PIN.');
      return;
    }
    verifyPin(pin);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    if (!password) {
      setErrorMsg('Please enter your master administrator password.');
      return;
    }
    const success = loginWithPassword(password);
    if (success) {
      processSuccess();
    } else {
      const nextFailed = failedCount + 1;
      setFailedCount(nextFailed);
      if (nextFailed >= 5) {
        setLockoutSeconds(60);
        setErrorMsg('Too many failed attempts. Terminal locked for 60 seconds.');
      } else {
        setErrorMsg(`Incorrect Password. (${5 - nextFailed} attempts remaining)`);
      }
    }
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!setupPassword || setupPassword.length < 6) {
      setErrorMsg('Master Password must be at least 6 characters.');
      return;
    }
    if (setupPassword !== setupConfirmPassword) {
      setErrorMsg('Master Passwords do not match. Please verify.');
      return;
    }
    if (!setupPin || setupPin.length !== 4 || !/^\d{4}$/.test(setupPin)) {
      setErrorMsg('Doctor PIN must be exactly 4 digits (numbers only).');
      return;
    }
    if (setupPin !== setupConfirmPin) {
      setErrorMsg('Doctor PINs do not match. Please verify.');
      return;
    }

    setupMasterCredentials(setupPassword, setupPin, setupEmail);
    setIsSuccess(true);
    setTimeout(() => {
      onLoginSuccess();
    }, 450);
  };

  const processSuccess = () => {
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
      <header className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-xl flex items-center gap-2 shadow-md">
            <img 
              src={logoIcon} 
              alt="Smile7 Logo Icon" 
              className="h-8 w-auto object-contain"
            />
            <img 
              src={logoText} 
              alt="Smile7 Dental Clinic" 
              className="h-6 w-auto object-contain"
            />
          </div>
          <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Admin Restricted
          </span>
        </div>

        {/* Subdomain Indicator & Back Button */}
        <div className="flex items-center gap-3">
          {onBackToWebsite && (
            <button
              type="button"
              onClick={onBackToWebsite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Main Website</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-slate-400 font-mono text-[11px]">{adminAuth.subdomainUrl || 'billing.smile7dental.com'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>
      </header>

      {/* Main Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          {/* Official Clinic Logo Centerpiece */}
          <div className="text-center space-y-2.5">
            <div className="bg-white/95 p-3 rounded-2xl inline-flex items-center justify-center gap-2.5 shadow-lg border border-white/20 mx-auto">
              <img 
                src={logoIcon} 
                alt="Smile7 Icon" 
                className="h-9 w-auto object-contain"
              />
              <img 
                src={logoText} 
                alt="Smile7 Dental Clinic" 
                className="h-7 w-auto object-contain"
              />
            </div>
            
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isFirstTimeSetup ? 'Create Master Password' : 'Doctor Authentication'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {isFirstTimeSetup 
                  ? 'Set your private password & PIN to protect billing data' 
                  : 'Authorized Practice Billing & Records Gate'}
              </p>
            </div>
            
            <div className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-full text-xs text-slate-300">
              <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
              <span>{clinicProfile.dentistInCharge}</span>
            </div>
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

          {/* FIRST TIME SETUP FLOW: Only the doctor sets the password */}
          {isFirstTimeSetup ? (
            <form onSubmit={handleSetupSubmit} className="space-y-4 text-left">
              <div className="p-3 bg-teal-950/40 border border-teal-800/50 rounded-xl text-[11px] text-teal-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  Welcome, <strong>Dr. Manickapriya</strong>. Please create your private master password and PIN. Only you will be able to log in or change credentials.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Create Master Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showSetupPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 6 characters..."
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl text-white text-xs font-mono pr-10 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSetupPassword(!showSetupPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showSetupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Confirm Master Password <span className="text-rose-400">*</span>
                </label>
                <input
                  type={showSetupPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter master password..."
                  value={setupConfirmPassword}
                  onChange={(e) => setSetupConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    4-Digit Quick PIN <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="4 digits"
                    value={setupPin}
                    onChange={(e) => setSetupPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl text-white text-center text-sm font-mono tracking-widest font-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Confirm PIN <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="4 digits"
                    value={setupConfirmPin}
                    onChange={(e) => setSetupConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl text-white text-center text-sm font-mono tracking-widest font-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Doctor Recovery Email
                </label>
                <input
                  type="email"
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  placeholder="care@smile7dental.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl text-slate-300 text-xs font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all cursor-pointer mt-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Save Credentials & Open Billing</span>
              </button>
            </form>
          ) : (
            <>
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

              {/* MODE 1: Fast PIN Keypad (Zero hints shown) */}
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
                        disabled={lockoutSeconds > 0}
                        onClick={() => handlePinDigit(digit)}
                        className="h-12 bg-slate-800/80 hover:bg-slate-700 active:bg-teal-600 active:text-white disabled:opacity-40 rounded-xl text-lg font-bold text-slate-100 border border-slate-700/50 transition-all cursor-pointer"
                      >
                        {digit}
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={handlePinClear}
                      className="h-12 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold border border-slate-800 transition-all cursor-pointer"
                    >
                      Clear
                    </button>

                    <button
                      type="button"
                      disabled={lockoutSeconds > 0}
                      onClick={() => handlePinDigit('0')}
                      className="h-12 bg-slate-800/80 hover:bg-slate-700 active:bg-teal-600 active:text-white disabled:opacity-40 rounded-xl text-lg font-bold text-slate-100 border border-slate-700/50 transition-all cursor-pointer"
                    >
                      0
                    </button>

                    <button
                      type="button"
                      onClick={handlePinBackspace}
                      className="h-12 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold border border-slate-800 transition-all cursor-pointer"
                    >
                      ⌫
                    </button>
                  </div>

                  {/* Quick Submit button */}
                  <button
                    type="button"
                    disabled={lockoutSeconds > 0}
                    onClick={handlePinSubmit}
                    className="w-full py-3 bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                  >
                    <span>{lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : 'Unlock Billing Terminal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* MODE 2: Master Password Form (Zero hints shown) */}
              {loginMode === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                      Doctor Admin Account
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
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoFocus
                        disabled={lockoutSeconds > 0}
                        placeholder="Enter master password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl text-white text-xs font-mono focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={lockoutSeconds > 0}
                    className="w-full py-3 bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                  >
                    <span>{lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : 'Sign In to Admin Console'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </>
          )}

          {/* Clinical Privacy Notice */}
          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center space-y-2.5">
            {onBackToWebsite && (
              <button
                type="button"
                onClick={onBackToWebsite}
                className="w-full py-2 px-3 bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Clinic Main Page</span>
              </button>
            )}

            <p className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-teal-500" />
              <span>Encrypted Access: Patient Financial & Medical Records</span>
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
