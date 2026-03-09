const { Core } = require("@adobe/aio-sdk");
// eslint-disable-next-line node/no-missing-require
const { getConfigurationByKey } = require("@adobe/aio-commerce-lib-app/config");
const { errorResponse, checkMissingRequestInputs } = require("../utils");
const { getCommerceOauthClient } = require("../oauth1a");
// eslint-disable-next-line node/no-missing-require
const got = require("got");

/**
 * Fetches inventory data for a product SKU from Commerce API.
 * Supports both OAuth 1.0a and IMS authentication methods.
 *
 * @param {object} params - Action input parameters
 * @param {string} params.sku - Product SKU to fetch inventory for
 * @param {string} [params.sourceCode] - Optional source code to filter inventory
 * @param {string} params.COMMERCE_BASE_URL - Commerce API base URL
 * @param {string} params.LOG_LEVEL - Logging level
 * @returns {object} Response object with statusCode and inventory data
 */
async function main(params) {
  const logger = Core.Logger("inventory-proxy", {
    level: params.LOG_LEVEL || "info",
  });

  try {
    const errorMessage = checkMissingRequestInputs(params, ["sku"], []);
    if (errorMessage) {
      return errorResponse(400, errorMessage, logger);
    }

    const { sku, sourceCode } = params;

    const config = {
      baseUrl: await getConfigurationByKey("restApiBaseUrl", params),
      authType: await getConfigurationByKey("authType", params),
    };

    if (!config.baseUrl) {
      return errorResponse(
        400,
        "Commerce API base URL not configured. Please configure in App Management.",
        logger
      );
    }

    let inventoryData;

    if (config.authType === "ims") {
      inventoryData = await fetchWithIms(
        config,
        sku,
        sourceCode,
        logger,
        params
      );
    } else {
      inventoryData = await fetchWithOAuth(
        config,
        sku,
        sourceCode,
        logger,
        params
      );
    }

    return {
      statusCode: 200,
      body: inventoryData,
    };
  } catch (error) {
    logger.error("Inventory proxy error:", error);
    return errorResponse(500, error.message, logger);
  }
}

/**
 * Fetches inventory data using OAuth 1.0a authentication.
 *
 * @param {object} config - Configuration object with baseUrl and authType
 * @param {string} sku - Product SKU to fetch inventory for
 * @param {string} [sourceCode] - Optional source code to filter inventory
 * @param {object} logger - Logger instance
 * @param {object} params - Action input parameters containing OAuth credentials
 * @returns {Promise<object>} Inventory data from Commerce API
 */
async function fetchWithOAuth(config, sku, sourceCode, logger, params) {
  const credentials = {
    consumerKey: await getConfigurationByKey("consumerKey", params),
    consumerSecret: await getConfigurationByKey("consumerSecret", params),
    accessToken: await getConfigurationByKey("accessToken", params),
    accessTokenSecret: await getConfigurationByKey("accessTokenSecret", params),
  };

  if (!credentials.consumerKey || !credentials.accessToken) {
    throw new Error(
      "OAuth credentials not configured. Please configure in App Management."
    );
  }

  const oauth = getCommerceOauthClient(
    {
      url: config.baseUrl,
      consumerKey: credentials.consumerKey,
      consumerSecret: credentials.consumerSecret,
      accessToken: credentials.accessToken,
      accessTokenSecret: credentials.accessTokenSecret,
    },
    logger
  );

  const queryParams = buildSearchQuery(sku, sourceCode);
  return await oauth.get(`inventory/source-items?${queryParams}`);
}

/**
 * Fetches inventory data using IMS (Adobe Identity Management Service) authentication.
 *
 * @param {object} config - Configuration object with baseUrl and authType
 * @param {string} sku - Product SKU to fetch inventory for
 * @param {string} [sourceCode] - Optional source code to filter inventory
 * @param {object} logger - Logger instance
 * @param {object} params - Action input parameters containing IMS token in authorization header
 * @returns {Promise<object>} Inventory data from Commerce API
 */
async function fetchWithIms(config, sku, sourceCode, logger, params) {
  const imsClientId = await getConfigurationByKey("imsClientId", params);
  const imsClientSecret = await getConfigurationByKey(
    "imsClientSecret",
    params
  );

  if (!imsClientId || !imsClientSecret) {
    throw new Error(
      "IMS credentials not configured. Please configure in App Management."
    );
  }

  const imsToken = params.__ow_headers?.authorization?.replace("Bearer ", "");
  if (!imsToken) {
    throw new Error("Missing IMS token in request authorization header");
  }

  const queryParams = buildSearchQuery(sku, sourceCode);
  const url = `${config.baseUrl}/rest/V1/inventory/source-items?${queryParams}`;

  return await got(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${imsToken}`,
      "Content-Type": "application/json",
    },
    responseType: "json",
  }).json();
}

/**
 * Builds a URL search query string for Commerce inventory API filtering.
 *
 * @param {string} sku - Product SKU to filter by
 * @param {string} [sourceCode] - Optional source code to filter by
 * @returns {string} URL-encoded search criteria query string
 */
function buildSearchQuery(sku, sourceCode) {
  const params = new URLSearchParams();
  params.append("searchCriteria[filter_groups][0][filters][0][field]", "sku");
  params.append("searchCriteria[filter_groups][0][filters][0][value]", sku);
  params.append(
    "searchCriteria[filter_groups][0][filters][0][condition_type]",
    "eq"
  );

  if (sourceCode) {
    params.append(
      "searchCriteria[filter_groups][1][filters][0][field]",
      "source_code"
    );
    params.append(
      "searchCriteria[filter_groups][1][filters][0][value]",
      sourceCode
    );
    params.append(
      "searchCriteria[filter_groups][1][filters][0][condition_type]",
      "eq"
    );
  }

  return params.toString();
}

exports.main = main;
