import express from 'express';
import { checkClaim } from '../services/fact-checker.js';

const router = express.Router();

/**
 * @route POST /api/fact-checks
 * @desc Check a specific claim for factual accuracy
 * @access Public
 */
router.post('/', async (req, res, next) => {
  try {
    const { claim, context } = req.body;
    
    if (!claim) {
      return res.status(400).json({ error: 'Claim text is required' });
    }
    
    // Check the claim
    const result = await checkClaim(claim, context);
    
    // Return the fact check result
    res.json(result);
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/fact-checks
 * @desc Get recent fact check results
 * @access Public
 */
router.get('/', async (req, res, next) => {
  try {
    // This would normally fetch from a database
    // For demo purposes, we'll return mock data
    
    const recentFactChecks = [
      {
        id: 'fc1',
        claim: "Global temperatures have risen by 10 degrees in the last decade",
        verdict: "False",
        explanation: "According to NASA and NOAA data, global temperatures have risen by approximately 0.18°C (0.32°F) over the last decade, not 10 degrees.",
        sources: ["nasa.gov", "noaa.gov", "ipcc.ch"],
        checkDate: "2025-02-15T10:24:16Z"
      },
      {
        id: 'fc2',
        claim: "The average household income increased by 3% in 2024",
        verdict: "True",
        explanation: "According to the Bureau of Labor Statistics, average household income did increase by 3.1% in 2024, adjusted for inflation.",
        sources: ["bls.gov", "census.gov"],
        checkDate: "2025-02-10T14:36:45Z"
      },
      {
        id: 'fc3',
        claim: "New study shows coffee extends lifespan by 5 years",
        verdict: "Mixed",
        explanation: "Recent studies have shown some correlation between moderate coffee consumption and longevity, but no credible research supports a specific 5-year extension of lifespan.",
        sources: ["nih.gov", "jamanetwork.com"],
        checkDate: "2025-02-05T09:12:30Z"
      }
    ];
    
    res.json(recentFactChecks);
    
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/fact-checks/:id
 * @desc Get a specific fact check by ID
 * @access Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // This would normally fetch from a database
    // For demo purposes, we'll return mock data or 404
    
    if (id === 'fc1') {
      return res.json({
        id: 'fc1',
        claim: "Global temperatures have risen by 10 degrees in the last decade",
        verdict: "False",
        explanation: "According to NASA and NOAA data, global temperatures have risen by approximately 0.18°C (0.32°F) over the last decade, not 10 degrees.",
        sources: ["nasa.gov", "noaa.gov", "ipcc.ch"],
        relatedClaims: [
          {
            claim: "2023 was the hottest year on record",
            verdict: "True"
          },
          {
            claim: "Climate change is primarily caused by human activities",
            verdict: "True"
          }
        ],
        sourceLinks: [
          {
            name: "NASA Global Climate Change",
            url: "https://climate.nasa.gov/vital-signs/global-temperature/"
          },
          {
            name: "NOAA Climate Data",
            url: "https://www.ncei.noaa.gov/access/monitoring/monthly-report/global/"
          }
        ],
        checkDate: "2025-02-15T10:24:16Z"
      });
    }
    
    // If not found
    res.status(404).json({ error: 'Fact check not found' });
    
  } catch (error) {
    next(error);
  }
});

export default router;