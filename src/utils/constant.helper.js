/**
 * Roles
 */
const ROLES = {
  admin: "Admin",
  traveller: "Traveller",
  agent: "Agent",
  user: "User",
};

/**
 * bus status
 */
const BUS = {
  active: "Activated",
  deactive: "Deactivated",
  delete: "Deleted"
}


/**
 * TRAVELLER
 */
const TRAVELLER = {
  documentnotupload: "DocumentNotUploaded",
  active: "Activated",
  blocked: "Blocked",
}


/**
 * AGENT
 */
const AGENT = {
  documentnotupload: "DocumentNotUploaded",
  notVerify: "NotVerify",
  active: "Activated",
  invaliddocument: "InvalidDocument",
  blocked: "Blocked",
}

/**
 * LANGUAGE
 */
const LANGUAGE = {
  english: "en",
  gujrati: "gu"
}


/**
 * travelleragent
 */
const TRAVELLERAGENT = {
  active: "Activated",
  block: "Blocked"
}


/**
 * agent request
 */
const AGENTREQUEST = {
  pending: 'Pending',
  active: 'Activated',
  reject: 'Rejected',
  block: 'Blocked'
}

/**
 * filter
 */
const BUSFILTER = {
  // boarding_point
}

module.exports = {
  ROLES,
  BUS,
  TRAVELLER,
  AGENT,
  LANGUAGE,
  TRAVELLERAGENT,
  AGENTREQUEST,
  BUSFILTER
};
