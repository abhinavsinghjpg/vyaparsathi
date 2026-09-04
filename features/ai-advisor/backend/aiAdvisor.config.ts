/**
 * AI Location Advisor - Dedicated API Keys & Endpoints Configuration
 */

export const AI_ADVISOR_CONFIG = {
  // 1. Google Gemini AI API (Primary LLM Engine for Commercial Feasibility)
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',
  },

  // 2. Government of India India Post Postal Jurisdiction API
  indiaPost: {
    pincodeEndpoint: 'https://api.postalpincode.in/pincode',
    postOfficeEndpoint: 'https://api.postalpincode.in/postoffice',
    isFree: true,
  },

  // 3. Government MSME Credit & Subsidy Gateways
  msmeGov: {
    janSamarthPortal: 'https://www.jansamarth.in',
    pmegpPortal: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    udyamPortal: 'https://udyamregistration.gov.in',
  },

  // 4. OpenStreetMap Overpass Catchment Engine
  osm: {
    overpassEndpoint: 'https://overpass-api.de/api/interpreter',
    nominatimEndpoint: 'https://nominatim.openstreetmap.org/search',
  },
};

