import { useState } from 'react';
import { helpContent, searchHelpContent } from '../data/helpContent';

// Simple icon components
function SearchIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ChevronRightIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function BookIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      const results = searchHelpContent(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedArticle(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleArticleClick = (article, category = null) => {
    setSelectedArticle(article);
    if (category) {
      setSelectedCategory(category);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedArticle(null);
  };

  const handleBackToArticles = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600">
          Everything you need to know about PushToolkit
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm max-w-2xl">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const category = helpContent.categories.find(c => c.title === result.category);
                    handleArticleClick(result, category);
                  }}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{result.categoryIcon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{result.title}</h4>
                      <p className="text-sm text-gray-600">
                        {result.category} • {result.content.substring(0, 100)}...
                      </p>
                    </div>
                    <ChevronRightIcon className="text-gray-400 flex-shrink-0" size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Show Categories */}
        {!selectedCategory && !selectedArticle && searchResults.length === 0 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {helpContent.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="text-left p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.articles.length} article{category.articles.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <ChevronRightIcon className="text-gray-400 group-hover:text-blue-600" size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show Articles in Category */}
        {selectedCategory && !selectedArticle && (
          <div className="p-6">
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
            >
              <ChevronRightIcon className="rotate-180" size={20} />
              Back to all topics
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{selectedCategory.icon}</span>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.title}</h2>
            </div>

            <div className="space-y-3">
              {selectedCategory.articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookIcon className="text-gray-400 group-hover:text-blue-600" size={20} />
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {article.title}
                      </h3>
                    </div>
                    <ChevronRightIcon className="text-gray-400 group-hover:text-blue-600" size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show Article Content */}
        {selectedArticle && (
          <div className="p-6">
            <button
              onClick={handleBackToArticles}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
            >
              <ChevronRightIcon className="rotate-180" size={20} />
              Back to {selectedCategory?.title || 'articles'}
            </button>

            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedArticle.title}</h1>
              <div className="prose prose-blue max-w-none">
                <ArticleContent content={selectedArticle.content} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component to render article content with markdown-like formatting
function ArticleContent({ content }) {
  const renderContent = () => {
    const lines = content.trim().split('\n');
    const elements = [];
    let currentList = [];
    let currentListType = null;
    let inCodeBlock = false;
    let codeBlockContent = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={elements.length} className="list-disc pl-6 mb-4 space-y-2">
            {currentList.map((item, i) => (
              <li key={i} className="text-gray-700">{item}</li>
            ))}
          </ul>
        );
        currentList = [];
        currentListType = null;
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <pre key={elements.length} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
      }
    };

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Empty lines
      if (!line.trim()) {
        flushList();
        return;
      }

      // Headers
      if (line.startsWith('**') && line.endsWith('**')) {
        flushList();
        const text = line.slice(2, -2);
        elements.push(
          <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
            {text}
          </h3>
        );
        return;
      }

      // List items
      if (line.trim().startsWith('- ')) {
        const text = line.trim().slice(2);
        currentList.push(text);
        return;
      }

      // Checkmarks and X marks
      if (line.trim().startsWith('✅') || line.trim().startsWith('❌')) {
        flushList();
        const icon = line.trim().startsWith('✅') ? '✅' : '❌';
        const text = line.trim().substring(2).trim();

        // If it's a header-style item (bold)
        if (text.startsWith('**') && text.includes('**')) {
          const headerEnd = text.indexOf('**', 2);
          const header = text.slice(2, headerEnd);
          const rest = text.slice(headerEnd + 2);
          elements.push(
            <div key={index} className="flex items-start gap-3 mb-3">
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <h4 className="font-bold text-gray-900">{header}</h4>
                {rest && <p className="text-gray-700">{rest}</p>}
              </div>
            </div>
          );
        } else {
          elements.push(
            <div key={index} className="flex items-start gap-3 mb-2">
              <span className="text-xl flex-shrink-0">{icon}</span>
              <p className="text-gray-700">{text}</p>
            </div>
          );
        }
        return;
      }

      // Regular paragraphs
      flushList();
      if (line.trim()) {
        elements.push(
          <p key={index} className="text-gray-700 mb-4 leading-relaxed">
            {line.trim()}
          </p>
        );
      }
    });

    flushList();
    flushCodeBlock();

    return elements;
  };

  return <div>{renderContent()}</div>;
}
