// In a production environment, this would connect to a database
// For this demo, we'll use a hardcoded collection of source ratings

// Sample source database
const sources = {
    'nytimes.com': {
      name: 'The New York Times',
      domain: 'nytimes.com',
      logoUrl: 'https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png',
      description: 'The New York Times is an American daily newspaper based in New York City with worldwide influence and readership.',
      reliabilityScore: 4, // 1-5 scale
      biasRating: -30, // -100 (left) to +100 (right) scale
      categories: ['News', 'Journalism', 'Opinion'],
      factualReporting: 'High',
      mediaType: 'Newspaper / News Site',
      transparencyPolicy: true
    },
    'wsj.com': {
      name: 'The Wall Street Journal',
      domain: 'wsj.com',
      logoUrl: 'https://s.wsj.net/media/wsj_apple-touch-icon-180x180.png',
      description: 'The Wall Street Journal is a U.S. business-focused, international daily newspaper.',
      reliabilityScore: 4,
      biasRating: 25,
      categories: ['News', 'Business', 'Finance'],
      factualReporting: 'High',
      mediaType: 'Newspaper / News Site',
      transparencyPolicy: true
    },
    'foxnews.com': {
      name: 'Fox News',
      domain: 'foxnews.com',
      logoUrl: 'https://static.foxnews.com/static/orion/styles/img/fox-news/s/apple-touch-icon-180x180.png',
      description: 'Fox News is an American conservative cable television news channel.',
      reliabilityScore: 3,
      biasRating: 65,
      categories: ['News', 'Opinion', 'Political'],
      factualReporting: 'Mixed',
      mediaType: 'TV / News Site',
      transparencyPolicy: true
    },
    'msnbc.com': {
      name: 'MSNBC',
      domain: 'msnbc.com',
      logoUrl: 'https://msnbcmedia.msn.com/i/MSNBC/Components/App/MSNBC.com/App-Icon-180.png',
      description: 'MSNBC is an American news-based pay television cable channel.',
      reliabilityScore: 3,
      biasRating: -65,
      categories: ['News', 'Opinion', 'Political'],
      factualReporting: 'Mixed',
      mediaType: 'TV / News Site',
      transparencyPolicy: true
    },
    'apnews.com': {
      name: 'Associated Press',
      domain: 'apnews.com',
      logoUrl: 'https://www.ap.org/assets/images/ap-icon.jpg',
      description: 'The Associated Press is an American non-profit news agency headquartered in New York City.',
      reliabilityScore: 5,
      biasRating: 0,
      categories: ['News', 'Journalism'],
      factualReporting: 'Very High',
      mediaType: 'News Agency',
      transparencyPolicy: true
    },
    'reuters.com': {
      name: 'Reuters',
      domain: 'reuters.com',
      logoUrl: 'https://www.reuters.com/pf/resources/images/reuters/logo-vertical-default.svg?d=108',
      description: 'Reuters is an international news organization.',
      reliabilityScore: 5,
      biasRating: 0,
      categories: ['News', 'Journalism', 'Business'],
      factualReporting: 'Very High',
      mediaType: 'News Agency',
      transparencyPolicy: true
    },
    'bbc.com': {
      name: 'BBC News',
      domain: 'bbc.com',
      logoUrl: 'https://m.files.bbci.co.uk/modules/bbc-morph-news-waf-page-meta/5.2.0/apple-touch-icon.png',
      description: 'The British Broadcasting Corporation (BBC) is a British public service broadcaster.',
      reliabilityScore: 4,
      biasRating: -10,
      categories: ['News', 'International'],
      factualReporting: 'High',
      mediaType: 'Public Broadcasting / News Site',
      transparencyPolicy: true
    },
    'cnn.com': {
      name: 'CNN',
      domain: 'cnn.com',
      logoUrl: 'https://cdn.cnn.com/cnn/.e/img/3.0/global/misc/apple-touch-icon.png',
      description: 'Cable News Network (CNN) is an American news-based pay television channel.',
      reliabilityScore: 3,
      biasRating: -40,
      categories: ['News', 'Opinion', 'Political'],
      factualReporting: 'Mixed',
      mediaType: 'TV / News Site',
      transparencyPolicy: true
    },
    'npr.org': {
      name: 'NPR',
      domain: 'npr.org',
      logoUrl: 'https://media.npr.org/assets/img/2019/06/17/nprlogo_rgb_primary-9c376c7a8cd9ad926ad1bebe82f714a5b11a6ecb-s800-c85.webp',
      description: 'National Public Radio (NPR) is an American privately and publicly funded non-profit media organization.',
      reliabilityScore: 4,
      biasRating: -15,
      categories: ['News', 'Public Radio'],
      factualReporting: 'High',
      mediaType: 'Public Radio / News Site',
      transparencyPolicy: true
    },
    'breitbart.com': {
      name: 'Breitbart News',
      domain: 'breitbart.com',
      logoUrl: 'https://media.breitbart.com/favicon-32x32.png',
      description: 'Breitbart News Network is a far-right syndicated American news, opinion and commentary website.',
      reliabilityScore: 2,
      biasRating: 80,
      categories: ['News', 'Opinion', 'Political'],
      factualReporting: 'Mixed',
      mediaType: 'News Site',
      transparencyPolicy: false
    },
    'theguardian.com': {
      name: 'The Guardian',
      domain: 'theguardian.com',
      logoUrl: 'https://assets.guim.co.uk/images/favicon-32x32.ico',
      description: 'The Guardian is a British daily newspaper with an online edition.',
      reliabilityScore: 4,
      biasRating: -25,
      categories: ['News', 'International', 'Opinion'],
      factualReporting: 'High',
      mediaType: 'Newspaper / News Site',
      transparencyPolicy: true
    },
    'economist.com': {
      name: 'The Economist',
      domain: 'economist.com',
      logoUrl: 'https://www.economist.com/sites/default/files/images/2017/05/blogs/prospero/20170527_blp509.jpg',
      description: 'The Economist is an international weekly newspaper focused on current affairs, business, and politics.',
      reliabilityScore: 5,
      biasRating: 5,
      categories: ['News', 'Analysis', 'Economics'],
      factualReporting: 'Very High',
      mediaType: 'News Magazine',
      transparencyPolicy: true
    }
  };
  
  /**
   * Get information about a news source by domain
   * @param {string} domain - The domain name (e.g., 'nytimes.com')
   * @returns {Object|null} Source information or null if not found
   */
  export async function getSourceInfo(domain) {
    // Normalize domain (remove www prefix if present)
    const normalizedDomain = domain.replace(/^www\./, '').toLowerCase();
    
    // Check if the source is in our database
    if (sources[normalizedDomain]) {
      // Convert bias rating to string description for client
      const source = { ...sources[normalizedDomain] };
      source.biasDescription = getBiasDescription(source.biasRating);
      return source;
    }
    
    // If source not in database, attempt to gather basic info
    try {
      return await gatherBasicSourceInfo(normalizedDomain);
    } catch (error) {
      console.error(`Error gathering info for ${normalizedDomain}:`, error);
      return null;
    }
  }
  
  /**
   * Gather basic information about an unknown source
   * @param {string} domain - The domain name
   * @returns {Object} Basic source information
   */
  async function gatherBasicSourceInfo(domain) {
    // In a production environment, this would:
    // 1. Check additional databases or APIs
    // 2. Potentially scrape the source's about page
    // 3. Query third-party services for reputation data
    
    // For demo purposes, return placeholder info
    return {
      name: domain,
      domain: domain,
      logoUrl: null,
      description: `${domain} is a news or information website.`,
      reliabilityScore: 3, // Default neutral score
      biasRating: 0, // Default neutral bias
      biasDescription: "Bias information unavailable",
      categories: ['Unclassified'],
      factualReporting: 'Unknown',
      mediaType: 'Website',
      transparencyPolicy: false,
      note: "This source is not in our database. Limited information available."
    };
  }
  
  /**
   * Get bias description based on numeric value
   * @param {number} value - Bias rating (-100 to +100)
   * @returns {string} Human-readable bias description
   */
  function getBiasDescription(value) {
    if (value < -70) return "Strong Left Bias";
    if (value < -30) return "Left Bias";
    if (value < -10) return "Left-Center Bias";
    if (value <= 10) return "Center Bias";
    if (value <= 30) return "Right-Center Bias";
    if (value <= 70) return "Right Bias";
    return "Strong Right Bias";
  }
  
  /**
   * Get all sources in the database
   * @returns {Array} Array of source objects
   */
  export function getAllSources() {
    return Object.values(sources).map(source => ({
      ...source,
      biasDescription: getBiasDescription(source.biasRating)
    }));
  }
  
  /**
   * Search for sources by name or domain
   * @param {string} query - Search query
   * @returns {Array} Matching sources
   */
  export function searchSources(query) {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return Object.values(sources)
      .filter(source => 
        source.name.toLowerCase().includes(normalizedQuery) || 
        source.domain.toLowerCase().includes(normalizedQuery)
      )
      .map(source => ({
        ...source,
        biasDescription: getBiasDescription(source.biasRating)
      }));
  }