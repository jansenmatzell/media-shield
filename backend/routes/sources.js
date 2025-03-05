import express from 'express';
import { getSourceInfo } from '../services/source-analyzer.js';

const router = express.Router();

/**
 * @route GET /api/sources/:domain
 * @desc Get information about a news source by domain
 * @access Public
 */
router.get('/:domain', async (req, res, next) => {
  try {
    const { domain } = req.params;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain parameter is required' });
    }
    
    // Get source information
    const sourceInfo = await getSourceInfo(domain);
    
    // If source not found in our database
    if (!sourceInfo) {
      return res.status(404).json({ 
        error: 'Source not found',
        message: 'This source is not in our database. We\'ll add it to our analysis queue.'
      });
    }
    
    // Return the source information
    res.json(sourceInfo);
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/sources
 * @desc Get a list of top news sources and their reliability ratings
 * @access Public
 */
router.get('/', async (req, res, next) => {
  try {
    // This would normally fetch from a database
    // For demo purposes, we'll return mock data
    
    const sources = [
      {
        name: 'Associated Press',
        domain: 'apnews.com',
        reliabilityScore: 5,
        biasRating: 'Minimal Bias',
        categories: ['News', 'Journalism']
      },
      {
        name: 'Reuters',
        domain: 'reuters.com',
        reliabilityScore: 5,
        biasRating: 'Minimal Bias',
        categories: ['News', 'Journalism']
      },
      {
        name: 'BBC News',
        domain: 'bbc.com',
        reliabilityScore: 4,
        biasRating: 'Slight Center-Left Bias',
        categories: ['News', 'International']
      },
      {
        name: 'The New York Times',
        domain: 'nytimes.com',
        reliabilityScore: 4,
        biasRating: 'Moderate Left-Center Bias',
        categories: ['News', 'Journalism', 'Opinion']
      },
      {
        name: 'The Wall Street Journal',
        domain: 'wsj.com',
        reliabilityScore: 4,
        biasRating: 'Moderate Right-Center Bias',
        categories: ['News', 'Business', 'Finance']
      },
      {
        name: 'Fox News',
        domain: 'foxnews.com',
        reliabilityScore: 3,
        biasRating: 'Right Bias',
        categories: ['News', 'Opinion']
      },
      {
        name: 'MSNBC',
        domain: 'msnbc.com',
        reliabilityScore: 3,
        biasRating: 'Left Bias',
        categories: ['News', 'Opinion']
      },
      {
        name: 'NPR',
        domain: 'npr.org',
        reliabilityScore: 4,
        biasRating: 'Slight Left-Center Bias',
        categories: ['News', 'Public Radio']
      },
      {
        name: 'The Guardian',
        domain: 'theguardian.com',
        reliabilityScore: 4,
        biasRating: 'Left-Center Bias',
        categories: ['News', 'International']
      },
      {
        name: 'The Economist',
        domain: 'economist.com',
        reliabilityScore: 5,
        biasRating: 'Center Bias',
        categories: ['News', 'Analysis', 'Economics']
      }
    ];
    
    res.json(sources);
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/sources/categories
 * @desc Get list of source categories
 * @access Public
 */
router.get('/categories', (req, res) => {
  const categories = [
    'News',
    'Journalism',
    'Opinion',
    'Analysis',
    'International',
    'Business',
    'Finance',
    'Technology',
    'Science',
    'Health',
    'Politics',
    'Entertainment',
    'Sports'
  ];
  
  res.json(categories);
});

export default router;