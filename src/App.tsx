import React, { useState, useEffect } from 'react';
import { Rocket, Copy, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { ideas } from './data/ideas';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [downloads, setDownloads] = useState<{ [key: number]: number }>({});
  
  const ideasPerPage = 8;
  const totalPages = Math.ceil(ideas.length / ideasPerPage);

  // Load downloads from localStorage on initial render
  useEffect(() => {
    const savedDownloads = localStorage.getItem('ideaDownloads');
    if (savedDownloads) {
      setDownloads(JSON.parse(savedDownloads));
    }
  }, []);
  
  const getCurrentIdeas = () => {
    const startIndex = (currentPage - 1) * ideasPerPage;
    return ideas.slice(startIndex, startIndex + ideasPerPage);
  };

  const handleCopy = async (ideaIndex: number) => {
    const idea = ideas[ideaIndex];
    try {
      await navigator.clipboard.writeText(idea.description);
      const newDownloads = {
        ...downloads,
        [ideaIndex]: (downloads[ideaIndex] || 0) + 1
      };
      setDownloads(newDownloads);
      // Save to localStorage
      localStorage.setItem('ideaDownloads', JSON.stringify(newDownloads));
      toast.success('Prompt copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      // Send email to the specified address
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '65c7f2c4-c9f5-4a6c-9b1d-5e9f8c9f2d1a', // Replace with your Web3Forms access key
          subject: 'New Bolt.new Idea Generator Subscription',
          from_name: 'Bolt.new Subscriber',
          to: 'bandastanley21@gmail.com',
          message: `New subscription request from: ${email}`,
        }),
      });
      
      toast.success('Thanks for subscribing! Check your email for confirmation.');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Rocket className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Adam</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#subscribe" className="hover:text-blue-400 transition-colors">Subscribe</a>
              <a href="https://bolt.new" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Bolt.new</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Generate Your Next Big Idea</h1>
          <p className="text-gray-400">Discover profitable project ideas that can turn into successful businesses</p>
        </div>

        {/* Ideas Grid - Airtable Style */}
        <div className="mb-12">
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-gray-800">
              {/* Header */}
              <div className="grid grid-cols-6 gap-4 p-4 bg-gray-800 text-gray-400 text-sm font-medium">
                <div className="col-span-2">Project Idea</div>
                <div>Revenue Model</div>
                <div>Target Market</div>
                <div>Investment</div>
                <div className="text-right">Actions</div>
              </div>
              
              {/* Rows */}
              {getCurrentIdeas().map((idea, index) => {
                const actualIndex = (currentPage - 1) * ideasPerPage + index;
                return (
                  <div key={actualIndex} className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-800/50 transition-colors items-center">
                    <div className="col-span-2">
                      <div className="font-medium text-white">{idea.title}</div>
                      <div className="text-sm text-gray-400 mt-1">{idea.description}</div>
                    </div>
                    <div className="text-gray-300">{idea.revenueModel}</div>
                    <div className="text-gray-300">{idea.targetMarket}</div>
                    <div className="text-gray-300">{idea.initialInvestment}</div>
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-4">
                        <span className="text-sm text-gray-400">{downloads[actualIndex] || 0} copies</span>
                        <button
                          onClick={() => handleCopy(actualIndex)}
                          className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 mb-12">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Newsletter Subscription */}
        <div id="subscribe" className="max-w-xl mx-auto bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
          <Mail className="h-12 w-12 mx-auto mb-4 text-blue-400" />
          <h2 className="text-2xl font-bold mb-4">Get Weekly Project Ideas</h2>
          <p className="text-gray-400 mb-6">Subscribe to receive curated business ideas and insights directly in your inbox</p>
          <form onSubmit={handleSubscribe} className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;