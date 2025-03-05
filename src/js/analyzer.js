/**
 * MediaShield Article Analyzer Script
 * 
 * This script handles the article analysis functionality including:
 * - Validating and processing user-submitted URLs
 * - Making API requests to the backend service
 * - Displaying analysis results to the user
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const analyzeButton = document.getElementById('analyze-button');
    const urlInput = document.getElementById('article-url');
    const resultsContainer = document.getElementById('analyzer-results');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    
    // Initialize event listeners
    initEventListeners();
    
    /**
     * Set up event listeners for user interactions
     */
    function initEventListeners() {
      // Handle analyze button click
      analyzeButton.addEventListener('click', handleAnalyzeClick);
      
      // Allow pressing Enter in the input field to trigger analysis
      urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleAnalyzeClick();
        }
      });
    }
    
    /**
     * Handle the analyze button click event
     */
    function handleAnalyzeClick() {
      const url = urlInput.value.trim();
      
      // Validate URL
      if (!isValidUrl(url)) {
        showError("Please enter a valid URL");
        return;
      }
      
      // Begin analysis process
      analyzeUrl(url);
    }
    
    /**
     * Validate if the string is a proper URL
     * @param {string} url - The URL to validate
     * @return {boolean} - Whether the URL is valid
     */
    function isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    }
    
    /**
     * Process URL and send for analysis
     * @param {string} url - The validated URL to analyze
     */
    function analyzeUrl(url) {
      // Show loading state
      showLoading();
      
      // For demo purposes, we'll simulate an API call with setTimeout
      // In production, this would be an actual fetch() call to your backend
      setTimeout(() => {
        // In a real application, this would be:
        // fetch('/api/articles/analyze', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ url })
        // })
        // .then(response => response.json())
        // .then(data => displayResults(data))
        // .catch(error => showError("Failed to analyze the article. Please try again."));
        
        // For now, we'll use mock data
        const mockData = generateMockResult(url);
        displayResults(mockData);
      }, 2000); // Simulate delay for API response
    }
    
    /**
     * Display loading indicator and hide other elements
     */
    function showLoading() {
      resultsContainer.classList.add('hidden');
      errorMessage.classList.add('hidden');
      loadingIndicator.classList.remove('hidden');
    }
    
    /**
     * Display error message and hide other elements
     * @param {string} message - The error message to display
     */
    function showError(message) {
      const errorText = errorMessage.querySelector('p');
      errorText.textContent = message;
      
      resultsContainer.classList.add('hidden');
      loadingIndicator.classList.add('hidden');
      errorMessage.classList.remove('hidden');
    }
    
    /**
     * Display analysis results
     * @param {Object} data - The analysis result data
     */
    function displayResults(data) {
      // Hide loading indicator
      loadingIndicator.classList.add('hidden');
      errorMessage.classList.add('hidden');
      
      // Populate article meta information
      document.getElementById('article-title').textContent = data.title;
      document.getElementById('source-name').textContent = data.source.name;
      document.getElementById('publish-date').textContent = data.publishDate;
      
      // Add article image if available
      if (data.imageUrl) {
        const imgElement = document.createElement('img');
        imgElement.src = data.imageUrl;
        imgElement.alt = data.title;
        document.getElementById('article-image').innerHTML = '';
        document.getElementById('article-image').appendChild(imgElement);
      }
      
      // Update credibility score
      updateCredibilityScore(data.credibility);
      
      // Update bias analysis
      updateBiasAnalysis(data.bias);
      
      // Update fact check results
      updateFactCheckResults(data.factChecks);
      
      // Update source information
      updateSourceInformation(data.source);
      
      // Update in-depth analysis
      updateInDepthAnalysis(data.analysis);
      
      // Show results container
      resultsContainer.classList.remove('hidden');
    }
    
    /**
     * Update the credibility score visualization
     * @param {Object} credibility - Credibility data
     */
    function updateCredibilityScore(credibility) {
      const scoreElement = document.getElementById('credibility-value');
      scoreElement.textContent = credibility.score;
      
      // Update the circle graph to reflect the score
      const scoreCircle = document.querySelector('.score-circle');
      scoreCircle.style.background = `conic-gradient(
        #${getScoreColor(credibility.score)} 0%, 
        #${getScoreColor(credibility.score)} ${credibility.score}%, 
        #f0f0f0 ${credibility.score}%, 
        #f0f0f0 100%
      )`;
      
      // Add credibility factors
      const detailsElement = document.getElementById('credibility-details');
      detailsElement.innerHTML = '';
      
      credibility.factors.forEach(factor => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        detailItem.innerHTML = `
          <span class="detail-name">${factor.name}</span>
          <span class="detail-value">${factor.value}</span>
        `;
        detailsElement.appendChild(detailItem);
      });
    }
    
    /**
     * Get color for score based on value
     * @param {number} score - The score value
     * @return {string} - Color hex code without #
     */
    function getScoreColor(score) {
      if (score >= 80) return '2ecc71'; // Green
      if (score >= 60) return '3498db'; // Blue
      if (score >= 40) return 'f39c12'; // Orange
      return 'e74c3c'; // Red
    }
    
    /**
     * Update the bias analysis visualization
     * @param {Object} bias - Bias data
     */
    function updateBiasAnalysis(bias) {
      // Position the bias indicator (value ranges from -100 to +100)
      // Convert to 0-100 scale for CSS positioning
      const position = ((bias.value + 100) / 2);
      const indicator = document.getElementById('bias-indicator');
      indicator.style.left = `${position}%`;
      
      // Update bias description
      document.getElementById('bias-description').textContent = bias.description;
    }
    
    /**
     * Update fact check results
     * @param {Array} factChecks - Array of fact check results
     */
    function updateFactCheckResults(factChecks) {
      const factCheckContainer = document.getElementById('fact-check-results');
      factCheckContainer.innerHTML = '';
      
      if (factChecks.length === 0) {
        factCheckContainer.innerHTML = '<p>No specific claims were identified for fact-checking.</p>';
        return;
      }
      
      factChecks.forEach(fact => {
        const factItem = document.createElement('div');
        factItem.className = `fact-item ${fact.verdict.toLowerCase()}`;
        
        factItem.innerHTML = `
          <p class="fact-claim">"${fact.claim}"</p>
          <span class="fact-verdict verdict-${fact.verdict.toLowerCase()}">${fact.verdict}</span>
          <p>${fact.explanation}</p>
        `;
        
        factCheckContainer.appendChild(factItem);
      });
    }
    
    /**
     * Update source information
     * @param {Object} source - Source data
     */
    function updateSourceInformation(source) {
      const sourceDetails = document.getElementById('source-details');
      sourceDetails.innerHTML = '';
      
      // Add source logo if available
      if (source.logoUrl) {
        const logoContainer = document.createElement('div');
        logoContainer.className = 'source-logo';
        logoContainer.innerHTML = `<img src="${source.logoUrl}" alt="${source.name} logo">`;
        sourceDetails.appendChild(logoContainer);
      }
      
      // Add source information
      const sourceInfo = document.createElement('div');
      sourceInfo.className = 'source-info';
      sourceInfo.innerHTML = `
        <h4>${source.name}</h4>
        <p>${source.description}</p>
      `;
      sourceDetails.appendChild(sourceInfo);
      
      // Add reliability rating
      const ratingContainer = document.createElement('div');
      ratingContainer.className = 'source-rating';
      
      // Create star rating based on reliability score (1-5)
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= source.reliabilityScore) {
          stars += '<span class="rating-star">★</span>';
        } else {
          stars += '<span class="rating-star" style="color: #ddd">★</span>';
        }
      }
      
      ratingContainer.innerHTML = stars;
      sourceDetails.appendChild(ratingContainer);
      
      // Add source categories/tags
      if (source.categories && source.categories.length > 0) {
        const categoriesContainer = document.createElement('div');
        categoriesContainer.innerHTML = `<p>Categories: ${source.categories.join(', ')}</p>`;
        sourceDetails.appendChild(categoriesContainer);
      }
    }
    
    /**
     * Update in-depth analysis section
     * @param {Object} analysis - Analysis data
     */
    function updateInDepthAnalysis(analysis) {
      const analysisContent = document.getElementById('analysis-content');
      analysisContent.innerHTML = '';
      
      // Add summary
      const summary = document.createElement('div');
      summary.innerHTML = `<p>${analysis.summary}</p>`;
      analysisContent.appendChild(summary);
      
      // Add key points
      if (analysis.keyPoints && analysis.keyPoints.length > 0) {
        const keyPoints = document.createElement('div');
        keyPoints.innerHTML = `
          <h4>Key Points</h4>
          <ul>
            ${analysis.keyPoints.map(point => `<li>${point}</li>`).join('')}
          </ul>
        `;
        analysisContent.appendChild(keyPoints);
      }
      
      // Add any analysis warnings
      if (analysis.warnings && analysis.warnings.length > 0) {
        const warnings = document.createElement('div');
        warnings.innerHTML = `
          <h4>Potential Issues</h4>
          <ul class="warnings-list">
            ${analysis.warnings.map(warning => `<li>${warning}</li>`).join('')}
          </ul>
        `;
        analysisContent.appendChild(warnings);
      }
      
      // Link to relevant educational content
      if (analysis.warnings && analysis.warnings.length > 0) {
        const learnMoreLinks = document.createElement('div');
        learnMoreLinks.className = 'learn-more';
        learnMoreLinks.innerHTML = `
          <h4>Learn About These Tactics</h4>
          <p>To better understand these potential issues, explore our educational resources:</p>
          <ul>
            <li><a href="pages/denial-of-information.html">Denial of Information</a> - How information gets buried in noise</li>
            <li><a href="pages/countermeasures.html">All Disinformation Tactics</a> - Comprehensive guide to tactics and countermeasures</li>
          </ul>
        `;
        analysisContent.appendChild(learnMoreLinks);
      }
    }
    
    /**
     * Generate mock data for demonstration purposes
     * In a real application, this would be replaced with actual API calls
     * @param {string} url - The URL that was analyzed
     * @return {Object} - Mock analysis results
     */
    function generateMockResult(url) {
      // Extract domain for source name
      let domain = '';
      try {
        domain = new URL(url).hostname.replace('www.', '');
      } catch (e) {
        domain = 'example.com';
      }
      
      // Generate random credibility score
      const credScore = Math.floor(Math.random() * 41) + 60; // 60-100
      
      // Generate random bias value (-100 to +100)
      const biasValue = Math.floor(Math.random() * 140) - 70; // -70 to +70
      
      return {
        title: `Article from ${domain}`,
        url: url,
        imageUrl: 'https://via.placeholder.com/400x240',
        publishDate: '2025-02-15',
        
        source: {
          name: domain,
          logoUrl: 'https://via.placeholder.com/100',
          description: `${domain} is a news publication that covers politics, technology, and culture.`,
          reliabilityScore: Math.floor(Math.random() * 3) + 3, // 3-5 stars
          categories: ['News', 'Politics', 'Opinion']
        },
        
        credibility: {
          score: credScore,
          factors: [
            { name: 'Source Reliability', value: Math.floor(Math.random() * 41) + 60 + '%' },
            { name: 'Factual Reporting', value: Math.floor(Math.random() * 41) + 60 + '%' },
            { name: 'Transparency', value: Math.floor(Math.random() * 41) + 60 + '%' },
            { name: 'Citation Quality', value: Math.floor(Math.random() * 41) + 60 + '%' }
          ]
        },
        
        bias: {
          value: biasValue,
          description: getBiasDescription(biasValue)
        },
        
        factChecks: [
          {
            claim: "The article claims significant changes in economic indicators",
            verdict: getRandomVerdict(),
            explanation: "Our analysis found that this claim is partially supported by current economic data, but omits important context."
          },
          {
            claim: "The article suggests a direct causal relationship between policy and outcome",
            verdict: getRandomVerdict(),
            explanation: "Expert consensus indicates this relationship is more complex than presented in the article."
          }
        ],
        
        analysis: {
          summary: "This article presents a perspective on current events with some factual backing. However, our analysis detected potential issues with context, sourcing, and the presentation of certain claims.",
          keyPoints: [
            "The article cites some verifiable statistics but lacks important context in places",
            "Some claims appear to be opinion presented as fact",
            "Multiple perspectives on the issue are not adequately represented",
            "The tone and language indicate potential bias in the framing of events"
          ],
          warnings: [
            "Contains emotional language that may influence reader perception",
            "Uses incomplete or selective data to support claims",
            "Lacks diverse expert perspectives on the issue"
          ]
        }
      };
    }
    
    /**
     * Get a random verdict for mock fact checks
     * @return {string} - Random verdict
     */
    function getRandomVerdict() {
      const verdicts = ['True', 'False', 'Mixed', 'Unverified'];
      return verdicts[Math.floor(Math.random() * verdicts.length)];
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
  });