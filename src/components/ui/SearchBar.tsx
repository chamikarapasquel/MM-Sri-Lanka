'use client';

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search products...',
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample suggestions — in production, replace with API call
  const generateSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const allSuggestions = [
      'Gaming Laptop',
      'Mechanical Keyboard',
      'Graphics Card RTX 4090',
      'Gaming Monitor 144Hz',
      'DDR5 RAM 32GB',
      'NVMe SSD 1TB',
      'CPU Cooler AIO',
      'Gaming Mouse',
      'Power Supply 850W',
      'PC Case ATX',
      'Motherboard AM5',
      'AMD Ryzen 9',
      'Intel Core i9',
      'Webcam 4K',
      'USB Hub',
    ];
    const filtered = allSuggestions.filter((s) =>
      s.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSuggestions(filtered.slice(0, 6));
  }, []);

  // Debounced input handler
  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      generateSuggestions(value);
    }, 250);
  };

  // Submit
  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const finalQuery = selectedIndex >= 0 ? suggestions[selectedIndex] : query;
    if (!finalQuery.trim()) return;
    onSearch?.(finalQuery.trim());
    router.push(`/search?q=${encodeURIComponent(finalQuery.trim())}`);
    setIsExpanded(false);
    setSuggestions([]);
    setQuery('');
  };

  // Select a suggestion
  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    onSearch?.(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setIsExpanded(false);
    setQuery('');
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setSuggestions([]);
      inputRef.current?.blur();
    }
  };

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handleGlobalKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    document.addEventListener('keydown', handleGlobalKey);
    return () => document.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false);
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* Collapsed trigger */
          <motion.button
            key="search-trigger"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              setIsExpanded(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className={[
              'flex items-center gap-2 px-3.5 py-2 rounded-xl',
              'bg-white/[0.06] backdrop-blur-md',
              'border border-white/[0.1]',
              'text-gray-400 hover:text-gray-300',
              'hover:bg-white/[0.1] hover:border-white/[0.2]',
              'transition-all duration-300 cursor-pointer',
            ].join(' ')}
            aria-label="Open search"
          >
            <Search size={16} />
            <span className="text-sm hidden sm:inline">Search</span>
            <kbd
              className={[
                'hidden sm:inline-flex items-center gap-0.5',
                'px-1.5 py-0.5 rounded text-[10px]',
                'bg-white/[0.08] text-gray-500 border border-white/[0.08]',
                'font-mono',
              ].join(' ')}
            >
              <Command size={10} />K
            </kbd>
          </motion.button>
        ) : (
          /* Expanded search */
          <motion.form
            key="search-expanded"
            initial={{ opacity: 0, width: 200 }}
            animate={{ opacity: 1, width: 380 }}
            exit={{ opacity: 0, width: 200 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <div
              className={[
                'flex items-center gap-2 px-3.5 py-2 rounded-xl',
                'bg-white/[0.08] backdrop-blur-xl',
                'border border-[#00d4ff]/40',
                'shadow-[0_0_20px_rgba(0,212,255,0.1)]',
                'transition-all duration-300',
              ].join(' ')}
            >
              <Search size={16} className="text-[#00d4ff] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={[
                  'flex-1 bg-transparent text-sm text-white',
                  'placeholder:text-gray-500 outline-none',
                  'min-w-0',
                ].join(' ')}
                aria-label="Search products"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                    inputRef.current?.focus();
                  }}
                  className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setSuggestions([]);
                  setQuery('');
                }}
                className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">
                  ESC
                </kbd>
              </button>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className={[
                    'absolute top-full left-0 right-0 mt-2 z-50',
                    'bg-[#111827]/95 backdrop-blur-xl',
                    'border border-white/[0.1] rounded-xl',
                    'shadow-2xl shadow-black/40',
                    'overflow-hidden',
                  ].join(' ')}
                >
                  <ul className="py-1.5">
                    {suggestions.map((suggestion, i) => (
                      <li key={suggestion}>
                        <button
                          type="button"
                          onClick={() => selectSuggestion(suggestion)}
                          onMouseEnter={() => setSelectedIndex(i)}
                          className={[
                            'w-full flex items-center gap-3 px-4 py-2.5 text-left',
                            'text-sm transition-colors duration-150 cursor-pointer',
                            i === selectedIndex
                              ? 'bg-[#00d4ff]/10 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-white/[0.05]',
                          ].join(' ')}
                        >
                          <Search
                            size={14}
                            className={
                              i === selectedIndex
                                ? 'text-[#00d4ff]'
                                : 'text-gray-600'
                            }
                          />
                          <span>{suggestion}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-white/[0.06] px-4 py-2 flex items-center justify-between text-[10px] text-gray-600">
                    <span>
                      <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.06] font-mono mr-1">
                        ↑↓
                      </kbd>
                      Navigate
                    </span>
                    <span>
                      <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.06] font-mono mr-1">
                        ↵
                      </kbd>
                      Select
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
