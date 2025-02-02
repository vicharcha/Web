'use client';

import React from 'react';
import { Loader2, Bot, Sparkles } from 'lucide-react';

export default function AIPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 ease-in-out">
      <div className="p-8 max-w-4xl mx-auto">
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