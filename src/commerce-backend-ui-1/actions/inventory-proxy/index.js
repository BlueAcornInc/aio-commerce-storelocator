const { Core } = require('@adobe/aio-sdk')
const { getConfigurationByKey } = require('@adobe/aio-commerce-lib-app/config')
const { errorResponse, checkMissingRequestInputs } = require('../utils')
const { getCommerceOauthClient } = require('../oauth1a')
const got = require('got')

async function main(params) {
  const logger = Core.Logger('inventory-proxy', { level: params.LOG_LEVEL || 'info' })

  try {
    const errorMessage = checkMissingRequestInputs(params, ['sku'], [])
    if (errorMessage) {
      return errorResponse(400, errorMessage, logger)
    }

    const { sku, sourceCode } = params
    
    const config = {
      baseUrl: await getConfigurationByKey('restApiBaseUrl', params),
      authType: await getConfigurationByKey('authType', params)
    }

    if (!config.baseUrl) {
      return errorResponse(400, 'Commerce API base URL not configured. Please configure in App Management.', logger)
    }

    let inventoryData

    if (config.authType === 'ims') {
      inventoryData = await fetchWithIms(config, sku, sourceCode, logger, params)
    } else {
      inventoryData = await fetchWithOAuth(config, sku, sourceCode, logger, params)
    }

    return {
      statusCode: 200,
      body: inventoryData
    }
  } catch (error) {
    logger.error('Inventory proxy error:', error)
    return errorResponse(500, error.message, logger)
  }
}

async function fetchWithOAuth(config, sku, sourceCode, logger, params) {
  const credentials = {
    consumerKey: await getConfigurationByKey('consumerKey', params),
    consumerSecret: await getConfigurationByKey('consumerSecret', params),
    accessToken: await getConfigurationByKey('accessToken', params),
    accessTokenSecret: await getConfigurationByKey('accessTokenSecret', params)
  }

  if (!credentials.consumerKey || !credentials.accessToken) {
    throw new Error('OAuth credentials not configured. Please configure in App Management.')
  }

  const oauth = getCommerceOauthClient(
    {
      url: config.baseUrl,
      consumerKey: credentials.consumerKey,
      consumerSecret: credentials.consumerSecret,
      accessToken: credentials.accessToken,
      accessTokenSecret: credentials.accessTokenSecret
    },
    logger
  )

  const queryParams = buildSearchQuery(sku, sourceCode)
  return await oauth.get(`inventory/source-items?${queryParams}`)
}

async function fetchWithIms(config, sku, sourceCode, logger, params) {
  const imsClientId = await getConfigurationByKey('imsClientId', params)
  const imsClientSecret = await getConfigurationByKey('imsClientSecret', params)

  if (!imsClientId || !imsClientSecret) {
    throw new Error('IMS credentials not configured. Please configure in App Management.')
  }

  const imsToken = params.__ow_headers?.authorization?.replace('Bearer ', '')
  if (!imsToken) {
    throw new Error('Missing IMS token in request authorization header')
  }

  const queryParams = buildSearchQuery(sku, sourceCode)
  const url = `${config.baseUrl}/rest/V1/inventory/source-items?${queryParams}`

  return await got(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${imsToken}`,
      'Content-Type': 'application/json'
    },
    responseType: 'json'
  }).json()
}

function buildSearchQuery(sku, sourceCode) {
  const params = new URLSearchParams()
  params.append('searchCriteria[filter_groups][0][filters][0][field]', 'sku')
  params.append('searchCriteria[filter_groups][0][filters][0][value]', sku)
  params.append('searchCriteria[filter_groups][0][filters][0][condition_type]', 'eq')

  if (sourceCode) {
    params.append('searchCriteria[filter_groups][1][filters][0][field]', 'source_code')
    params.append('searchCriteria[filter_groups][1][filters][0][value]', sourceCode)
    params.append('searchCriteria[filter_groups][1][filters][0][condition_type]', 'eq')
  }

  return params.toString()
}

exports.main = main
