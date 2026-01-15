import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Category, Password } from '../types';
import { GetPasswordCategories, GetPasswordsByCategory, GetRealmHealth, DeletePassword } from '../../wailsjs/go/main/App';
import { BrowserOpenURL } from '../../wailsjs/runtime/runtime';
import { useI18n } from '../i18n';
import appIcon from '../assets/images/appicon.png';

export const MainPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [activeCategory, setActiveCategory] = useState('Work');
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [realmHealth, setRealmHealth] = useState<number>(100);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState<Password | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const prevLocationRef = useRef<string>('');
  const { setAuthenticated } = useApp();
  const { t } = useI18n();

  useEffect(() => {
    loadCategories();
    loadRealmHealth();
  }, []);

  useEffect(() => {
    loadPasswords(activeCategory);
  }, [activeCategory]);

  // Refresh passwords and health when returning from add password page
  useEffect(() => {
    // Check if we're returning from /add to /main
    const prevPath = prevLocationRef.current;
    prevLocationRef.current = location.pathname;
    
    if (location.pathname === '/main' && prevPath === '/add') {
      // Refresh passwords for the current active category
      loadPasswords(activeCategory);
      // Refresh health after adding password
      loadRealmHealth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const loadCategories = async () => {
    try {
      const cats = await GetPasswordCategories();
      // Convert Wails Category class to frontend Category interface
      const convertedCats: Category[] = cats.map(cat => ({
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
      }));
      // Filter out Dashboard category
      const filteredCats = convertedCats.filter(cat => cat.name !== 'Dashboard');
      // Sort categories: Work, Private, Social, Financial, Settings
      const categoryOrder = ['Work', 'Private', 'Social', 'Financial', 'Settings'];
      const sortedCats = filteredCats.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.name);
        const indexB = categoryOrder.indexOf(b.name);
        // If not found in order, put at the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
      setCategories(sortedCats);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Mock data for development
      setCategories([
        { name: 'Work', icon: 'work', color: 'tech' },
        { name: 'Private', icon: 'description', color: 'private' },
        { name: 'Social', icon: 'share', color: 'social' },
        { name: 'Financial', icon: 'account_balance', color: 'financial' },
        { name: 'Settings', icon: 'settings', color: 'primary' },
      ]);
    }
  };

  const loadPasswords = async (category: string) => {
    try {
      const data = await GetPasswordsByCategory(category);
      // Convert Wails Password class to frontend Password interface
      const convertedPasswords: Password[] = data.map(pw => ({
        id: pw.id,
        name: pw.name,
        domain: pw.domain,
        username: pw.username,
        password: pw.password,
        category: pw.category,
      }));
      setPasswords(convertedPasswords);
    } catch (error) {
      console.error('Failed to load passwords:', error);
      setPasswords([]);
    }
  };

  const loadRealmHealth = async () => {
    try {
      const health = await GetRealmHealth();
      setRealmHealth(Math.round(health));
    } catch (error) {
      console.error('Failed to load realm health:', error);
      // Default to 100% if error
      setRealmHealth(100);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could show a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.name === category);
    return cat?.color || 'primary';
  };

  const getCategoryColorValue = (category: string) => {
    const colorMap: { [key: string]: string } = {
      financial: '#FBBF24',
      social: '#EF4444',
      private: '#A855F7',
      tech: '#6366F1',
      primary: '#6366F1',
    };
    const color = getCategoryColor(category).toLowerCase();
    return colorMap[color] || colorMap.primary;
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.name === category);
    return cat?.icon || 'lock';
  };

  const getCategoryDisplayName = (categoryName: string) => {
    const categoryMap: { [key: string]: string } = {
      'Financial': t.categories.financial,
      'Social': t.categories.social,
      'Private': t.categories.private,
      'Work': t.categories.work,
      'Settings': t.categories.settings,
    };
    return categoryMap[categoryName] || categoryName;
  };

  const filteredPasswords = passwords.filter((pw) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    const name = pw.name.toLowerCase().trim();
    // Match by Website Name: exact match or partial match
    return name === query || name.includes(query);
  });

  const handleCategoryClick = (category: string) => {
    if (category === 'Settings') {
      navigate('/settings');
    } else {
      setActiveCategory(category);
    }
  };

  const handleSignOut = () => {
    setAuthenticated(false);
    navigate('/login');
  };

  const handleOpenWebsite = (password: Password) => {
    // If domain is not empty, open in browser
    if (password.domain && password.domain.trim() !== '') {
      let url = password.domain.trim();
      // Add https:// if no protocol specified
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      try {
        BrowserOpenURL(url);
      } catch (error) {
        console.error('Failed to open URL:', error);
        // Fallback: navigate to main page if browser open fails
        navigate('/main');
      }
    } else {
      // If domain is empty, navigate to main page
      navigate('/main');
    }
  };

  const handleDeleteClick = (password: Password) => {
    setPasswordToDelete(password);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!passwordToDelete) return;

    try {
      const success = await DeletePassword(passwordToDelete.id);
      if (success) {
        // Refresh passwords list
        await loadPasswords(activeCategory);
        // Refresh health
        await loadRealmHealth();
        setDeleteConfirmOpen(false);
        setPasswordToDelete(null);
      } else {
        console.error(t.main.deleteError);
      }
    } catch (error) {
      console.error(t.main.deleteError, error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setPasswordToDelete(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <aside className="w-64 border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="rounded-lg overflow-hidden">
              <img src={appIcon} alt="Realm Logo" className="w-16 h-16 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none dark:text-white">{t.main.title}</h1>
              <p className="text-primary text-xs font-medium">{t.main.subtitle}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1.5">
            {categories.map((category) => (
              <a
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  activeCategory === category.name
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                <span className={`text-sm ${activeCategory === category.name ? 'font-semibold' : 'font-medium'}`}>
                  {getCategoryDisplayName(category.name)}
                </span>
              </a>
            ))}
          </nav>
        </div>
        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary">{t.main.realmHealth}</span>
            <span className="text-xs font-bold text-primary">{realmHealth}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${realmHealth}%` }}></div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6 flex-1">
            <div className="max-w-md w-full">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm dark:text-white"
                  placeholder={t.main.searchPlaceholder}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/add')}
              className="bg-primary hover:bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>{t.main.addNew}</span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background-light dark:bg-background-dark">
          <div className="flex border-b border-slate-200 dark:border-slate-700 gap-8">
            {['Work', 'Private', 'Social', 'Financial'].map((cat) => {
              const categoryName = cat === 'Financial' ? t.categories.financial :
                                   cat === 'Social' ? t.categories.social :
                                   cat === 'Private' ? t.categories.private :
                                   t.categories.work;
              return (
                <a
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`pb-3 font-medium text-sm transition-colors border-b-2 cursor-pointer ${
                    activeCategory === cat
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary'
                  }`}
                >
                  {categoryName}
                </a>
              );
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPasswords.map((password) => {
              const colorValue = getCategoryColorValue(password.category);
              const isVisible = visiblePasswords.has(password.id);
              return (
                <div
                  key={password.id}
                  className="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[240px] shadow-sm"
                  style={{ borderColor: 'inherit' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${colorValue}30`;
                    const title = e.currentTarget.querySelector('h3') as HTMLElement;
                    if (title) title.style.color = colorValue;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '';
                    const title = e.currentTarget.querySelector('h3') as HTMLElement;
                    if (title) title.style.color = '';
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: colorValue }}
                      >
                        <span className="material-symbols-outlined text-[28px]">{getCategoryIcon(password.category)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg transition-colors dark:text-white">{password.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{password.domain}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(password)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-red-500 transition-all"
                      title={t.common.delete}
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                        {password.category === 'Private' ? t.passwordFields.contentPreview : password.category === 'Social' ? t.passwordFields.email : t.passwordFields.username}
                      </span>
                      <div className="flex items-center justify-between group/field">
                        <span className="text-sm font-medium dark:text-slate-300">{password.username}</span>
                        <button
                          onClick={() => copyToClipboard(password.username)}
                          className="opacity-0 group-hover/field:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                        {password.category === 'Private' ? t.passwordFields.masterKey : password.category === 'Work' ? t.passwordFields.accessToken : t.passwordFields.password}
                      </span>
                      <div className="flex items-center justify-between group/field">
                        <span className="text-sm font-mono tracking-widest text-slate-500 dark:text-slate-400">
                          {isVisible ? password.password : '• • • • • • • • • •'}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover/field:opacity-100 transition-all">
                          <button
                            onClick={() => togglePasswordVisibility(password.id)}
                            className="p-1 rounded transition-all"
                            style={{ color: colorValue }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${colorValue}10`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '';
                            }}
                          >
                            <span className="material-symbols-outlined text-sm">{isVisible ? 'visibility_off' : 'visibility'}</span>
                          </button>
                          <button
                            onClick={() => copyToClipboard(password.password)}
                            className="p-1 rounded transition-all"
                            style={{ color: colorValue }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${colorValue}10`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '';
                            }}
                          >
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenWebsite(password)}
                      className="flex-1 bg-slate-50 dark:bg-slate-700 text-sm font-bold py-2 rounded-xl transition-colors dark:text-slate-300"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${colorValue}10`;
                        e.currentTarget.style.color = colorValue;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                      }}
                    >
                      {password.category === 'Private' ? t.main.readNote : password.category === 'Social' ? t.main.viewProfile : password.category === 'Work' ? t.main.openConsole : t.main.viewAccount}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleDeleteCancel}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-2xl">warning</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.main.deleteConfirmTitle}</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{t.main.deleteConfirmMessage}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {t.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
