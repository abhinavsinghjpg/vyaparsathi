/**
 * Market Analytics - Dedicated API Keys & Endpoints Configuration
 */

export const ANALYTICS_CONFIG = {
  // 1. Department of Posts (India Post) Pincode & Catchment API
  indiaPost: {
    pincodeEndpoint: 'https://api.postalpincode.in/pincode',
    postOfficeEndpoint: 'https://api.postalpincode.in/postoffice',
  },

  // 2. Ministry of MSME & Udyam Portal Data Services
  msmeGov: {
    dashboardEndpoint: 'https://udyamregistration.gov.in/Government/Government_Dashboard.aspx',
    schemesEndpoint: 'https://msme.gov.in/all-schemes',
  },

  // 3. Ministry of Statistics and Programme Implementation (MoSPI)
  mospi: {
    cpiDataEndpoint: 'https://www.mospi.gov.in/consumer-price-index',
    mpceReportEndpoint: 'https://www.mospi.gov.in/all-publications',
  },

  // 4. Reserve Bank of India Priority Sector Lending (PSL)
  rbi: {
    pslCircularEndpoint: 'https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12144',
  },
};

