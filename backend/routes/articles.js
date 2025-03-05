import express from 'express';
import { analyzeArticle } from '../services/article-analyzer.js';
import { validateUrl } from '../utils/validator.js';

const router = express.Router();

/**
 * @route POST /api/articles/analyze
 * @desc Analyze an article URL for credibility, bias, and facts
 * @access Public
 */
router.post('/analyze', async (req, res, next) => {
  try {
    const { url } = req.body;
    
    // Validate URL
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!validateUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Process the URL and analyze the article
    const result = await analyzeArticle(url);
    
    // Return the analysis results
    res.json(result);
    
  } catch (error) {
    console.error('Error analyzing article:', error);
    
    // Handle specific error types
    if (error.name === 'FetchError') {
      return res.status(400).json({ 
        error: 'Failed to fetch article',
        message: 'Could not retrieve content from the provided URL'
      });
    }
    
    if (error.name === 'TimeoutError') {
      return res.status(408).json({
        error: 'Request timeout',
        message: 'The analysis took too long to complete'
      });
    }
    
    // Pass to global error handler for unexpected errors
    next(error);
  }
});

/**
 * @route GET /api/articles/recent
 * @desc Get recently analyzed articles
 * @access Public
 */
router.get('/recent', async (req, res, next) => {
  try {
    // This would normally fetch from a database
    // For demo purposes, we'll return mock data
    
    const recentArticles = [
      {
        id: 'art1',
        title: 'Understanding the Economic Impact of New Policies',
        url: 'https://example-news.com/economics/policy-impact',
        source: 'example-news.com',
        credibilityScore: 78,
        biasValue: -15,
        analysisDate: '2025-02-28T14:25:31Z'
      },
      {
        id: 'art2',
        title: 'Climate Change Report Shows Alarming Trends',
        url: 'https://science-daily.com/climate/new-report',
        source: 'science-daily.com',
        credibilityScore: 92,
        biasValue: 5,
        analysisDate: '2025-02-27T09:14:22Z'
      },
      {
        id: 'art3',
        title: 'Tech Giants Announce New AI Regulations',
        url: 'https://tech-insider.org/ai-regulation',
        source: 'tech-insider.org',
        credibilityScore: 84,
        biasValue: -8,
        analysisDate: '2025-02-26T16:42:18Z'
      }
    ];
    
    res.json(recentArticles);
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/articles/:id
 * @desc Get a specific article analysis by ID
 * @access Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // This would normally fetch from a database
    // For demo purposes, we'll return mock data or 404
    
    if (id === 'art1') {
      return res.json({
        id: 'art1',
        title: 'Understanding the Economic Impact of New Policies',
        url: 'https://example-news.com/economics/policy-impact',
        source: {
          name: 'example-news.com',
          logoUrl: 'https://via.placeholder.com/100',
          reliabilityScore: 4
        },
        credibility: {
          score: 78,
          factors: [
            { name: 'Source Reliability', value: '80%' },
            { name: 'Factual Reporting', value: '85%' },
            { name: 'Transparency', value: '75%' },
            { name: 'Citation Quality', value: '72%' }
          ]
        },
        bias: {
          value: -15,
          description: 'Slight left-leaning bias detected'
        },
        analysisDate: '2025-02-28T14:25:31Z'
      });
    }
    
    // If not found
    res.status(404).json({ error: 'Article analysis not found' });
    
  } catch (error) {
    next(error);
  }
});

export default router;