'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Bot, Sparkles, Sun, Moon } from 'lucide-react';

export default function AIPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference on mount
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Update document class when dark mode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="p-8 max-w-4xl mx-auto">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-gray-900 dark:text-white">
            AI Assistant <Bot className="inline-block" />
          </h1>
          <div className="relative inline-block">
            <span className="text-xl text-gray-600 dark:text-gray-400">Coming Soon</span>
            <Sparkles className="absolute -right-8 -top-4 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8 transition-colors">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Loader2 className="animate-spin" />
            Features in Development
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 mt-1 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">1</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Advanced Natural Language Processing</h3>
                <p className="text-gray-600 dark:text-gray-400">Understand and respond to complex queries with human-like comprehension</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 mt-1 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">2</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Smart Document Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">Extract insights and analyze documents with advanced AI capabilities</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 mt-1 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">3</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Personalized Learning</h3>
                <p className="text-gray-600 dark:text-gray-400">Adapt to your preferences and provide tailored recommendations</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Stay tuned for updates as we build something amazing!</p>
          <p className="text-sm mt-2">Want to be notified when we launch?</p>
          <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  );
}

