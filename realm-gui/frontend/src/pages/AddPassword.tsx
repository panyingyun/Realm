import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Password } from '../types';
import { AddPassword, GeneratePassword } from '../../wailsjs/go/main/App';

interface AddPasswordModalProps {
  onClose: () => void;
}

export const AddPasswordModal: React.FC<AddPasswordModalProps> = ({ onClose }) => {
  const [passwordType, setPasswordType] = useState('Financial');
  const [websiteName, setWebsiteName] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [websiteLinkError, setWebsiteLinkError] = useState('');
  const navigate = useNavigate();

  const generatePassword = async () => {
    setIsGenerating(true);
    try {
      // Call backend GeneratePassword interface
      const generated = await GeneratePassword();
      setPassword(generated);
    } catch (error) {
      console.error('Failed to generate password:', error);
      // Fallback to local generation if backend fails
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let generated = '';
      for (let i = 0; i < 16; i++) {
        generated += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setPassword(generated);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setUsernameError('');
    setWebsiteLinkError('');

    // Validate username field
    if (!username.trim()) {
      setUsernameError('你输入的用户名为空');
      return;
    }

    // Validate website link field
    if (!websiteLink.trim()) {
      setWebsiteLinkError('你输入的webside为空');
      return;
    }

    if (!websiteName.trim() || !password.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const newPassword: Password = {
        id: Date.now().toString(),
        name: websiteName,
        domain: websiteLink,
        username: username,
        password: password,
        category: passwordType,
      };

      const success = await AddPassword(newPassword);
      if (success) {
        onClose();
        navigate('/main');
        // Reload the page to refresh the password list
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to add password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordTypes = [
    { value: 'Financial', icon: 'account_balance', color: '#DAA520' },
    { value: 'Social', icon: 'share', color: '#3B82F6' },
    { value: 'Private', icon: 'description', color: '#A78BFA' },
    { value: 'Work', icon: 'terminal', color: '#4F46E5' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center glass-backdrop px-4">
      <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-[24px] border border-[#E2E8F0] dark:border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-8 pt-8 pb-4 flex justify-between items-start sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="text-[#0e0d1b] dark:text-white text-2xl font-bold leading-tight">Add New Password</h2>
            <p className="text-[#64748B] dark:text-slate-400 text-sm mt-1">Enter details to secure a new account credential.</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0e0d1b] dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-4 space-y-5">
            <div className="flex flex-col gap-3">
              <label className="text-[#64748B] dark:text-slate-400 text-[12px] font-medium uppercase tracking-wider">Password Type</label>
              <div className="grid grid-cols-4 gap-3">
                {passwordTypes.map((type) => (
                  <label key={type.value} className="type-option cursor-pointer group">
                    <input
                      type="radio"
                      name="password_type"
                      value={type.value}
                      checked={passwordType === type.value}
                      onChange={(e) => setPasswordType(e.target.value)}
                      className="hidden"
                    />
                    <div
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E2E8F0] dark:border-slate-700 transition-all hover:border-primary/50 ${
                        passwordType === type.value ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : ''
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ color: type.color }}>
                        {type.icon}
                      </span>
                      <span className="text-[12px] font-medium text-[#64748B] dark:text-slate-400">{type.value}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#64748B] dark:text-slate-400 text-[12px] font-medium uppercase tracking-wider">Website Name</label>
              <div className="relative group">
                <input
                  type="text"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="w-full h-12 bg-background-light dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl px-4 text-[#0e0d1b] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="e.g. Netflix, GitHub"
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">badge</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#64748B] dark:text-slate-400 text-[12px] font-medium uppercase tracking-wider">
                Website Link <span className="normal-case opacity-70">(Optional)</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={websiteLink}
                  onChange={(e) => {
                    setWebsiteLink(e.target.value);
                    // Clear error when user starts typing
                    if (websiteLinkError) {
                      setWebsiteLinkError('');
                    }
                  }}
                  className={`w-full h-12 bg-background-light dark:bg-slate-800 border rounded-xl px-4 text-[#0e0d1b] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${
                    websiteLinkError
                      ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-[#E2E8F0] dark:border-slate-700'
                  }`}
                  placeholder="https://example.com"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">public</span>
              </div>
              {websiteLinkError && (
                <p className="text-red-500 text-sm mt-1 px-1">{websiteLinkError}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#64748B] dark:text-slate-400 text-[12px] font-medium uppercase tracking-wider">Username or Email</label>
              <div className="relative group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    // Clear error when user starts typing
                    if (usernameError) {
                      setUsernameError('');
                    }
                  }}
                  className={`w-full h-12 bg-background-light dark:bg-slate-800 border rounded-xl px-4 text-[#0e0d1b] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${
                    usernameError
                      ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-[#E2E8F0] dark:border-slate-700'
                  }`}
                  placeholder="Enter username or email"
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">person</span>
              </div>
              {usernameError && (
                <p className="text-red-500 text-sm mt-1 px-1">{usernameError}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[#64748B] dark:text-slate-400 text-[12px] font-medium uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={generatePassword}
                  disabled={isGenerating}
                  className="text-primary text-[11px] font-bold hover:underline tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'GENERATE STRONG'}
                </button>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-background-light dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl px-4 text-[#0e0d1b] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="••••••••••••"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#94A3B8] hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 pb-8 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !websiteName.trim() || !username.trim() || !password.trim()}
              className="w-full h-14 bg-primary text-white font-bold rounded-xl active-scale shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">lock</span>
              {isSubmitting ? 'Adding...' : 'Add Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <AddPasswordModal onClose={() => navigate('/main')} />
    </div>
  );
};
