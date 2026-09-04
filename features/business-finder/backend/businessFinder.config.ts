/**
 * Find Business (Smart Ideator) - Dedicated API Keys & Endpoints Configuration
 */

export const BUSINESS_FINDER_CONFIG = {
  // 1. Ministry of MSME & Udyam Enterprise Classification Endpoints
  msme: {
    udyamEndpoint: 'https://udyamregistration.gov.in',
    msmeGovEndpoint: 'https://msme.gov.in',
    pmegpEndpoint: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
  },

  // 2. National Unified Credit Portal (JanSamarth)
  janSamarth: {
    portalUrl: 'https://www.jansamarth.in',
    schemesListEndpoint: 'https://www.jansamarth.in/schemes',
  },

  // 3. Government of India India Post Postal Zone Lookup
  indiaPost: {
    pincodeEndpoint: 'https://api.postalpincode.in/pincode',
    postOfficeEndpoint: 'https://api.postalpincode.in/postoffice',
  },
};

