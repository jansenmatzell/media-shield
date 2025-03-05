import natural from 'natural';
import axios from 'axios';

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const sentenceTokenizer = new natural.SentenceTokenizer();

// Sample database of previously fact-checked claims
// In a production environment, this would be a database connection
const factCheckedClaims = [
  {
    claim: "The Earth is flat",
    normalizedClaim: "the earth is flat",
    verdict: "False",
    explanation: "Scientific evidence conclusively shows the Earth is roughly spherical, including satellite imagery, physics calculations, and direct observation.",
    sources: [
      "NASA Earth Observatory",
      "National Geographic",
      "National Oceanic and Atmospheric Administration"
    ]
  },
  {
    claim: "Vaccines cause autism",
    normalizedClaim: "vaccines cause autism",
    verdict: "False",
    explanation: "Extensive scientific research has found no link between vaccines and autism, including multiple large-scale studies covering millions of children.",
    sources: [
      "Centers for Disease Control and Prevention",
      "World Health Organization",
      "Multiple peer-reviewed studies in medical journals"
    ]
  },
  {
    claim: "Global temperatures have risen over the past century",
    normalizedClaim: "global temperatures have risen over the past century",
    verdict: "True",
    explanation: "Temperature records from multiple independent organizations confirm global temperatures have risen approximately 1°C (1.8°F) since the pre-industrial era.",
    sources: [
      "NASA Goddard Institute for Space Studies",
      "NOAA National Centers for Environmental Information",
      "UK Met Office Hadley Centre",
      "Intergovernmental Panel on Climate Change"
    ]
  },
  {
    claim: "2023 was the hottest year on record",
    normalizedClaim: "2023 was the hottest year on record",
    verdict: "True",
    explanation: "According to NASA, NOAA, and other climate monitoring organizations, 2023 was the hottest year in recorded history, exceeding previous records by a significant margin.",
    sources: [
      "NASA GISS Surface Temperature Analysis",
      "NOAA Global Climate Report",
      "World Meteorological Organization"
    ]
  },
  {
    claim: "Drinking lemon water in the morning cures cancer",
    normalizedClaim: "drinking lemon water in the morning cures cancer",
    verdict: "False",
    explanation: "There is no scientific evidence that lemon water can cure cancer. Cancer treatments require medical intervention based on scientific research.",
    sources: [
      "American Cancer Society",
      "National Cancer Institute",
      "Mayo Clinic"
    ]
  }
];

/**
 * Check a specific claim for factual accuracy
 * @param {string} claim - The claim to check
 * @param {string} context - Optional context for the claim
 * @returns {Object} Fact check result
 */
export async function checkClaim(claim, context = '') {
  try {
    // Normalize claim for comparison
    const normalizedClaim = normalizeText(claim);
    
    // First check our internal database for exact or similar matches
    const internalResult = checkInternalDatabase(normalizedClaim);
    if (internalResult) {
      return internalResult;
    }
    
    // If not found internally, check external fact-checking APIs
    // In a real application, this would call actual fact-checking APIs
    const externalResult = await checkExternalApis(claim, context);
    if (externalResult) {
      return externalResult;
    }
    
    // If no matches found, perform basic analysis and return uncertain result
    return analyzeUnverifiedClaim(claim, context);
    
  } catch (error) {
    console.error('Error checking claim:', error);
    throw error;
  }
}

/**
 * Extract and check factual claims from a text
 * @param {string} text - The text to analyze for claims
 * @returns {Array} Array of fact check results
 */
export async function checkFactsInText(text) {
  try {
    // Extract potential factual claims from text
    const claims = extractFactualClaims(text);
    
    // Check each claim
    const results = [];
    
    // Limit to the most significant claims to avoid overwhelming
    const topClaims = claims.slice(0, 3);
    
    for (const claim of topClaims) {
      try {
        const result = await checkClaim(claim);
        results.push(result);
      } catch (error) {
        console.error(`Error checking claim "${claim}":`, error);
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('Error checking facts in text:', error);
    return [];
  }
}

/**
 * Normalize text for comparison
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
function normalizeText(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
}

/**
 * Check internal database for matching claims
 * @param {string} normalizedClaim - Normalized claim text
 * @returns {Object|null} Fact check result or null if not found
 */
function checkInternalDatabase(normalizedClaim) {
  // First try exact match
  const exactMatch = factCheckedClaims.find(
    item => item.normalizedClaim === normalizedClaim
  );
  
  if (exactMatch) {
    return {
      claim: exactMatch.claim,
      verdict: exactMatch.verdict,
      explanation: exactMatch.explanation,
      sources: exactMatch.sources,
      matchType: 'exact'
    };
  }
  
  // If no exact match, try fuzzy matching
  // This is a simplified implementation
  for (const item of factCheckedClaims) {
    const similarity = calculateJaccardSimilarity(
      new Set(tokenizer.tokenize(normalizedClaim)),
      new Set(tokenizer.tokenize(item.normalizedClaim))
    );
    
    // If similarity is high enough, consider it a match
    if (similarity > 0.8) {
      return {
        claim: item.claim,
        verdict: item.verdict,
        explanation: item.explanation,
        sources: item.sources,
        matchType: 'similar',
        similarTo: item.claim
      };
    }
  }
  
  return null;
}

/**
 * Calculate Jaccard similarity between two sets
 * @param {Set} set1 - First set
 * @param {Set} set2 - Second set
 * @returns {number} Similarity score (0-1)
 */
function calculateJaccardSimilarity(set1, set2) {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Check external fact-checking APIs
 * @param {string} claim - The claim to check
 * @param {string} context - Context for the claim
 * @returns {Object|null} Fact check result or null if not found
 */
async function checkExternalApis(claim, context) {
  // In a real application, this would call actual external APIs
  // For demo purposes, we'll simulate a delayed response with mock data
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if the claim contains any keywords that we can use for mock results
  const claimLower = claim.toLowerCase();
  
  if (claimLower.includes('covid') || claimLower.includes('vaccine')) {
    return {
      claim,
      verdict: 'Check Source',
      explanation: 'This claim discusses COVID-19 or vaccines. Please verify with authoritative health sources like the CDC or WHO.',
      sources: [
        'Centers for Disease Control and Prevention',
        'World Health Organization'
      ],
      matchType: 'external'
    };
  }
  
  if (claimLower.includes('election') || claimLower.includes('vote')) {
    return {
      claim,
      verdict: 'Check Official Sources',
      explanation: 'This claim discusses election or voting. Verify with official election authorities or government sources.',
      sources: [
        'Federal Election Commission',
        'State Election Boards'
      ],
      matchType: 'external'
    };
  }
  
  // No specific match found
  return null;
}

/**
 * Analyze an unverified claim
 * @param {string} claim - The claim to analyze
 * @param {string} context - Context for the claim
 * @returns {Object} Analysis result
 */
function analyzeUnverifiedClaim(claim, context) {
  // This is a simplified implementation for demo purposes
  // In production, more sophisticated NLP would be used
  
  // Check for indicators of factual nature vs. opinion
  const factualIndicators = [
    'percent', '%', 'study', 'research', 'found', 'showed',
    'according to', 'survey', 'data', 'statistics', 'evidence'
  ];
  
  const opinionIndicators = [
    'believe', 'think', 'feel', 'suggest', 'consider',
    'best', 'worst', 'should', 'could', 'would', 'may', 'might'
  ];
  
  let factualScore = 0;
  let opinionScore = 0;
  
  // Count indicators
  factualIndicators.forEach(indicator => {
    if (claim.toLowerCase().includes(indicator)) {
      factualScore++;
    }
  });
  
  opinionIndicators.forEach(indicator => {
    if (claim.toLowerCase().includes(indicator)) {
      opinionScore++;
    }
  });
  
  // Check for specific quantities, dates, or names
  if (/\d+%|\d+\.\d+|\d{4}|January|February|March|April|May|June|July|August|September|October|November|December/i.test(claim)) {
    factualScore += 2;
  }
  
  // Determine if it's more factual or opinion
  let explanation = '';
  let verdict = 'Unverified';
  
  if (factualScore > opinionScore * 2) {
    explanation = 'This appears to be a factual claim that contains specific data or references to research. While we could not verify it against our database, you should check authoritative sources relevant to the topic.';
  } else if (opinionScore > factualScore) {
    explanation = 'This appears to be more of an opinion or subjective assessment rather than a purely factual claim.';
    verdict = 'Opinion';
  } else {
    explanation = 'This claim could not be verified against our fact-checking database. Consider checking specialized sources relevant to the topic.';
  }
  
  return {
    claim,
    verdict,
    explanation,
    sources: [],
    matchType: 'analysis'
  };
}

/**
 * Extract potential factual claims from text
 * @param {string} text - Text to analyze
 * @returns {Array} Array of potential factual claims
 */
function extractFactualClaims(text) {
  try {
    // This is a simplified implementation
    // In production, more sophisticated NLP would be used
    
    // Split text into sentences
    const sentences = sentenceTokenizer.tokenize(text);
    
    // Filter for sentences that look like factual claims
    const factualSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      
      // Skip very short sentences
      if (sentence.length < 20) return false;
      
      // Look for factual indicators
      const hasFactualIndicator = [
        'is', 'are', 'was', 'were', 'will be', 'has', 'have',
        'increased', 'decreased', 'caused', 'showed', 'demonstrated',
        'according to', 'percent', '%', 'study found', 'research'
      ].some(indicator => lowerSentence.includes(indicator));
      
      // Look for numbers or statistics
      const hasNumbers = /\d+%|[0-9]+\.?[0-9]*/.test(lowerSentence);
      
      // Check for quoted sources or attributions
      const hasAttribution = lowerSentence.includes('said') || 
                            lowerSentence.includes('says') ||
                            lowerSentence.includes('according to') ||
                            lowerSentence.includes('reported');
      
      // Combine signals
      return (hasFactualIndicator && (hasNumbers || hasAttribution)) ||
             (hasNumbers && hasAttribution);
    });
    
    // Return the filtered sentences, prioritizing those with stronger indicators
    return factualSentences.sort((a, b) => {
      // Prioritize sentences with numbers
      const aHasNumbers = /\d+/.test(a);
      const bHasNumbers = /\d+/.test(b);
      
      if (aHasNumbers && !bHasNumbers) return -1;
      if (!aHasNumbers && bHasNumbers) return 1;
      
      // Then prioritize by length (more detailed claims tend to be longer)
      return b.length - a.length;
    });
    
  } catch (error) {
    console.error('Error extracting factual claims:', error);
    return [];
  }
}