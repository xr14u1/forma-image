import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Layers, 
  Minimize2, 
  Maximize2, 
  Crop, 
  RotateCw, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  Sliders,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  isDarkMode,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Converter', path: '/converter', icon: Layers },
    { label: 'Compress', path: '/compress', icon: Minimize2 },
    { label: 'Resize', path: '/resize', icon: Maximize2 },
    { label: 'Crop', path: '/crop', icon: Crop },
  ];

  const extraTools = [
    { label: 'Rotate & Flip', path: '/rotate', desc: 'Rotate 90°, 180° or mirror', icon: RotateCw },
    { label: 'Color & Exposure', path: '/optimize', desc: 'Fine-tune brightness & filters', icon: Sliders },
    { label: 'EXIF Metadata Cleaner', path: '/strip-metadata', desc: '100% privacy EXIF scrubber', icon: ShieldCheck },
    { label: 'All Format Directory', path: '/tools', desc: 'PNG, SVG, TIFF, HEIC, WebP, ICO', icon: Sparkles },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-black/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo with Qraft Mint Emerald Accent */}
        <button 
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 dark:from-[#00E599] dark:to-[#05DF72] flex items-center justify-center text-black font-extrabold shadow-lg shadow-emerald-500/25 group-hover:scale-105 group-hover:shadow-emerald-500/40 transition-all duration-300">
            <span className="font-extrabold text-lg tracking-tighter">F</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-950 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                Forma
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:inline -mt-0.5 font-medium">
              Client-Side Image Studio
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-white/10 text-zinc-950 dark:text-white shadow-xs border border-zinc-200/80 dark:border-white/10'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500 dark:text-emerald-400' : 'opacity-70'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}

          {/* All Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
              className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-white/5 transition-all"
            >
              <span>More Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0A0A0C]/95 backdrop-blur-2xl shadow-2xl shadow-black/20 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {extraTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.path}
                      onClick={() => handleNav(tool.path)}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-zinc-50 dark:hover:bg-white/5 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 transition-colors mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                          {tool.label}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{tool.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Icons & Privacy Pill */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Developer Link */}
          <a
            href="https://snuffdied.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            title="Developed by snuffdied"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 border border-zinc-200/80 dark:border-white/10 hover:border-emerald-500/40 bg-zinc-50/50 dark:bg-white/5 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>snuffdied</span>
          </a>

          {/* Privacy Pill */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-500/30 px-3 py-1 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Local</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl border border-zinc-200/90 dark:border-white/10 bg-zinc-50 dark:bg-[#0A0A0C] text-zinc-700 dark:text-zinc-200 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/40 hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-2xs cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile navigation"
            className="md:hidden p-2.5 rounded-xl border border-zinc-200/90 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-2 py-1 font-semibold">
            Image Tools & Converters
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[...navLinks, ...extraTools].map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 shadow-xs'
                      : 'bg-zinc-50 dark:bg-[#0A0A0C] text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80 shrink-0 text-emerald-500" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Server Uploads</span>
            </div>
            <button 
              onClick={() => handleNav('/about')} 
              className="underline hover:text-zinc-900 dark:hover:text-white"
            >
              About
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
