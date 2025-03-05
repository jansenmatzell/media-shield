import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import natural from 'natural';
import { getSourceInfo } from './sourceAnalyzer.js';
import { checkFactsInText } from './factChecker.js';

// Initialize natural language processing tools
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

/**
 * Analyze an article at the given URL
 * @param {string} url - The URL of the article to analyze
 * @returns {Object} Analysis results
 */
export async function analyzeArticle(url) {
  try {
    // Extract article content
    const { title, content, author, publishDate, imageUrl, domain } = await extractArticleContent(url);
    
    // Get source information
    const source = await getSourceInfo(domain);
    
    // Analyze for bias
    const biasAnalysis = analyzeBias(content);
    
    // Analyze for credibility factors
    const credibilityAnalysis = analyzeCredibility(content, source);
    
    // Extract and check key claims
    const factChecks = await checkFactsInText(content);
    
    // Perform in-depth analysis
    const inDepthAnalysis = performDeepAnalysis(content, title, source);
    
    // Combine all results
    return {
      title,
      url,
      author,
      publishDate,
      imageUrl,
      domain,
      source,
      credibility: credibilityAnalysis,
      bias: biasAnalysis,
      factChecks,
      analysis: inDepthAnalysis
    };
    
  } catch (error) {
    console.error('Error in article analysis:', error);
    throw error;
  }
}

/**
 * Extract content from an article URL
 * @param {string} url - The URL of the article
 * @returns {Object} Extracted article data
 */
async function extractArticleContent(url) {
  // In a production environment, we'd use more sophisticated extraction
  // For demo purposes, we'll use a simplified approach with Puppeteer
  
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new'
    });
    
    const page = await browser.newPage();
    
    // Set timeout for navigation
    await page.setDefaultNavigationTimeout(30000);
    
    // Go to URL
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Get page content
    const html = await page.content();
    
    // Parse with Cheerio
    const $ = cheerio.load(html);
    
    // Extract domain from URL
    const domain = new URL(url).hostname.replace('www.', '');
    
    // Extract article elements
    // This is simplified; real implementation would have more robust extraction logic
    const title = $('h1').first().text().trim() || $('title').text().trim();
    
    // Get meta tags
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaAuthor = $('meta[name="author"]').attr('content') || '';
    const metaDate = $('meta[property="article:published_time"]').attr('content') || 
                    $('meta[name="publication_date"]').attr('content') || '';
    
    // Get main content (this is simplified)
    let content = '';
    
    // Try various selectors that often contain main content
    const contentSelectors = [
      'article', 
      '[role="main"]', 
      '.article-content', 
      '.post-content', 
      '.entry-content', 
      '#content', 
      '.content',
      'main'
    ];
    
    for (const selector of contentSelectors) {
      const el = $(selector);
      if (el.length) {
        content = el.text().trim();
        if (content.length > 200) break; // Found substantial content
      }
    }
    
    // If no content found with selectors, get body text
    if (content.length < 200) {
      content = $('body').text().trim();
    }
    
    // Extract author
    const author = metaAuthor || $('.author').first().text().trim() || 'Unknown';
    
    // Extract publish date
    const publishDate = metaDate || $('.date').first().text().trim() || new Date().toISOString();
    
    // Extract main image
    const image = $('meta[property="og:image"]').attr('content') || 
                 $('article img').first().attr('src') || 
                 null;
    
    // Resolve relative image URL if needed
    let imageUrl = null;
    if (image) {
      imageUrl = image.startsWith('http') ? image : new URL(image, url).href;
    }
    
    return {
      title,
      content,
      author,
      publishDate,
      imageUrl,
      domain
    };
    
  } catch (error) {
    console.error('Error extracting article:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Analyze article text for political bias
 * @param {string} text - Article text content
 * @returns {Object} Bias analysis results
 */
function analyzeBias(text) {
  // This is a simplified demo implementation
  // In a real system, we would use a trained model with a comprehensive lexicon
  
  // Sample bias indicators (very simplified)
  const liberalTerms = [
    'progressive', 'equality', 'climate crisis', 'reproductive rights', 
    'gun control', 'social justice', 'universal healthcare', 'workers rights'
  ];
  
  const conservativeTerms = [
    'traditional', 'freedom', 'individual liberty', 'free market', 
    'second amendment', 'family values', 'law and order', 'fiscal responsibility'
  ];
  
  // Tokenize text
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  // Count bias indicators
  let liberalCount = 0;
  let conservativeCount = 0;
  
  liberalTerms.forEach(term => {
    const regex = new RegExp('\\b' + term + '\\b', 'gi');
    const matches = text.match(regex);
    if (matches) liberalCount += matches.length;
  });
  
  conservativeTerms.forEach(term => {
    const regex = new RegExp('\\b' + term + '\\b', 'gi');
    const matches = text.match(regex);
    if (matches) conservativeCount += matches.length;
  });
  
  // Calculate bias score (-100 to +100)
  // Negative is liberal, positive is conservative
  let biasValue = 0;
  
  if (liberalCount > 0 || conservativeCount > 0) {
    const total = liberalCount + conservativeCount;
    biasValue = Math.round(((conservativeCount - liberalCount) / total) * 100);
  }
  
  // Get description based on value
  let description = getBiasDescription(biasValue);
  
  return {
    value: biasValue,
    description,
    indicators: {
      liberal: liberalCount,
      conservative: conservativeCount
    }
  };
}

/**
 * Get bias description based on value
 * @param {number} value - Bias value (-100 to +100)
 * @return {string} - Description of bias
 */
function getBiasDescription(value) {
  if (value < -70) return "Strong left-leaning bias detected in language and framing";
  if (value < -30) return "Moderate left-leaning bias detected";
  if (value < -10) return "Slight left-leaning bias detected";
  if (value <= 10) return "Minimal political bias detected";
  if (value <= 30) return "Slight right-leaning bias detected";
  if (value <= 70) return "Moderate right-leaning bias detected";
  return "Strong right-leaning bias detected in language and framing";
}

/**
 * Analyze article for credibility factors
 * @param {string} text - Article text content
 * @param {Object} source - Information about the article source
 * @returns {Object} Credibility analysis results
 */
function analyzeCredibility(text, source) {
  // This is a simplified demo implementation
  // In a real system, we would use more sophisticated NLP and ML techniques
  
  // Calculate source reliability (0-100)
  // Convert 1-5 star rating to percentage
  const sourceReliability = source ? (source.reliabilityScore / 5) * 100 : 50;
  
  // Analyze factual reporting (simplified)
  const factualReporting = analyzeFactualReporting(text);
  
  // Analyze transparency (simplified)
  const transparency = analyzeTransparency(text);
  
  // Analyze citation quality (simplified)
  const citationQuality = analyzeCitations(text);
  
  // Calculate overall credibility score (weighted average)
  const credibilityScore = Math.round(
    (sourceReliability * 0.4) +
    (factualReporting * 0.3) +
    (transparency * 0.15) +
    (citationQuality * 0.15)
  );
  
  return {
    score: credibilityScore,
    factors: [
      { name: 'Source Reliability', value: `${Math.round(sourceReliability)}%` },
      { name: 'Factual Reporting', value: `${factualReporting}%` },
      { name: 'Transparency', value: `${transparency}%` },
      { name: 'Citation Quality', value: `${citationQuality}%` }
    ]
  };
}

/**
 * Analyze factual reporting in text
 * @param {string} text - Article text
 * @returns {number} Score (0-100)
 */
function analyzeFactualReporting(text) {
  // This is a simplified implementation
  
  // Check for weasel words (indicates uncertain facts)
  const weaselWords = [
    'reportedly', 'allegedly', 'some say', 'critics claim',
    'could be', 'might be', 'possibly', 'perhaps'
  ];
  
  // Check for extreme words (sensationalism)
  const extremeWords = [
    'shocking', 'bombshell', 'outrageous', 'explosive',
    'stunning', 'massive', 'disaster', 'catastrophe'
  ];
  
  let weaselCount = 0;
  let extremeCount = 0;
  
  weaselWords.forEach(word => {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    const matches = text.match(regex);
    if (matches) weaselCount += matches.length;
  });
  
  extremeWords.forEach(word => {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    const matches = text.match(regex);
    if (matches) extremeCount += matches.length;
  });
  
  // Adjust score based on text length (normalize)
  const words = text.split(/\s+/).length;
  const weaselRatio = (weaselCount / words) * 1000;
  const extremeRatio = (extremeCount / words) * 1000;
  
  // Base score
  let score = 80;
  
  // Reduce score for weasel words and extreme language
  score -= Math.min(30, weaselRatio * 20);
  score -= Math.min(30, extremeRatio * 15);
  
  // Ensure score is within bounds
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Analyze transparency in text
 * @param {string} text - Article text
 * @returns {number} Score (0-100)
 */
function analyzeTransparency(text) {
  // This is a simplified implementation
  
  // Check for source attribution
  const attributionPhrases = [
    'according to', 'said by', 'reported by', 'stated by',
    'conducted by', 'study by', 'research by', 'data from'
  ];
  
  let attributionCount = 0;
  
  attributionPhrases.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi');
    const matches = text.match(regex);
    if (matches) attributionCount += matches.length;
  });
  
  // Check for quotes
  const quoteCount = (text.match(/["''].+?["'']/g) || []).length;
  
  // Base score
  let score = 70;
  
  // Adjust score based on attribution and quotes
  if (attributionCount > 3) score += 15;
  else if (attributionCount > 1) score += 10;
  else if (attributionCount === 0) score -= 20;
  
  if (quoteCount > 5) score += 15;
  else if (quoteCount > 2) score += 10;
  else if (quoteCount === 0) score -= 10;
  
  // Ensure score is within bounds
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Analyze citations in text
 * @param {string} text - Article text
 * @returns {number} Score (0-100)
 */
function analyzeCitations(text) {
  // This is a simplified implementation
  
  // Look for patterns that suggest citations
  const hasLinks = text.includes('http') || text.includes('www.');
  const hasReferences = /\(\d{4}\)/.test(text); // Year in parentheses
  const hasFootnotes = /\[\d+\]/.test(text) || /\(\d+\)/.test(text);
  
  // Base score
  let score = 60;
  
  // Adjust based on citation indicators
  if (hasLinks) score += 15;
  if (hasReferences) score += 20;
  if (hasFootnotes) score += 15;
  
  // Check for specific types of credible sources mentioned
  const credibleSourceTypes = [
    'study', 'research', 'survey', 'analysis',
    'report', 'data', 'statistics', 'publication'
  ];
  
  let credibleSourceCount = 0;
  
  credibleSourceTypes.forEach(source => {
    const regex = new RegExp('\\b' + source + '\\b', 'gi');
    const matches = text.match(regex);
    if (matches) credibleSourceCount += matches.length;
  });
  
  if (credibleSourceCount > 5) score += 20;
  else if (credibleSourceCount > 2) score += 10;
  
  // Ensure score is within bounds
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Perform deep analysis of article content
 * @param {string} text - Article text content
 * @param {string} title - Article title
 * @param {Object} source - Source information
 * @returns {Object} In-depth analysis results
 */
function performDeepAnalysis(text, title, source) {
  // This is a simplified demo implementation
  
  // Extract key themes using TF-IDF
  tfidf.addDocument(text);
  const terms = tfidf.listTerms(0);
  
  // Get top keywords
  const keywords = terms.slice(0, 5).map(term => term.term);
  
  // Look for potential issues (simplified)
  const warnings = [];
  
  // Check for clickbait title
  if (/^(Top|This|[0-9]+|How|Why).+[\?!]$/.test(title)) {
    warnings.push('Title may use clickbait techniques');
  }
  
  // Check for excessive emotional language
  const emotionalWords = [
    'devastating', 'incredible', 'amazing', 'terrible', 
    'wonderful', 'awful', 'shocking', 'stunning'
  ];
  
  let emotionalCount = 0;
  emotionalWords.forEach(word => {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    const matches = text.match(regex);
    if (matches) emotionalCount += matches.length;
  });
  
  if (emotionalCount > 5) {
    warnings.push('Contains emotional language that may influence reader perception');
  }
  
  // Check for data citation
  if (!/(percent|%|\d+\.\d+).*according to|data from/i.test(text)) {
    warnings.push('Uses incomplete or selective data to support claims');
  }
  
  // Check for balanced perspective indicators
  const balancingPhrases = [
    'on the other hand', 'however', 'conversely', 'alternatively',
    'other perspectives', 'some argue', 'others believe'
  ];
  
  let balancedPerspectiveCount = 0;
  balancingPhrases.forEach(phrase => {
    if (text.toLowerCase().includes(phrase)) {
      balancedPerspectiveCount++;
    }
  });
  
  if (balancedPerspectiveCount < 2) {
    warnings.push('Lacks diverse expert perspectives on the issue');
  }
  
  // Generate summary (simplified)
  const summary = `This article presents a perspective on ${keywords.join(', ')}. ${
    source ? `It comes from ${source.name}, which has a reliability rating of ${source.reliabilityScore}/5 stars.` : ''
  } Our analysis has identified ${warnings.length} potential issues with the presentation of information.`;
  
  // Generate key points (simplified)
  const keyPoints = [
    keywords.length > 0 ? `The article focuses on topics including ${keywords.join(', ')}` : null,
    source ? `Published by ${source.name}, which has a ${getBiasDescription(source.biasRating)}` : null,
    warnings.length > 0 ? `Contains ${warnings.length} potential issues in its presentation of information` : null,
    balancedPerspectiveCount > 2 ? 'Presents multiple perspectives on the topic' : 'May not present a balanced view of the topic'
  ].filter(Boolean);
  
  return {
    summary,
    keyPoints,
    keywords,
    warnings
  };
}