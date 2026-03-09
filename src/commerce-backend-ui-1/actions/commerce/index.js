/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const { Core } = require("@adobe/aio-sdk");
const { errorResponse, checkMissingRequestInputs } = require("../utils");
const { getCommerceOauthClient } = require("../oauth1a");

/**
 * Executes a Commerce API operation using OAuth 1.0a authentication.
 *
 * @param {object} params - Action input parameters
 * @param {string} params.operation - Commerce API operation/endpoint to call
 * @param {string} params.COMMERCE_BASE_URL - Commerce API base URL
 * @param {string} params.COMMERCE_CONSUMER_KEY - OAuth consumer key
 * @param {string} params.COMMERCE_CONSUMER_SECRET - OAuth consumer secret
 * @param {string} params.COMMERCE_ACCESS_TOKEN - OAuth access token
 * @param {string} params.COMMERCE_ACCESS_TOKEN_SECRET - OAuth access token secret
 * @param {string} params.LOG_LEVEL - Logging level
 * @param {object} params.__ow_headers - OpenWhisk request headers
 * @returns {object} Response object with statusCode and API response body
 */
async function main(params) {
  const logger = Core.Logger("main", { level: params.LOG_LEVEL || "info" });

  try {
    const requiredParams = ["operation", "COMMERCE_BASE_URL"];
    const requiredHeaders = ["Authorization"];
    const errorMessage = checkMissingRequestInputs(
      params,
      requiredParams,
      requiredHeaders
    );
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger);
    }

    const { operation } = params;

    const oauth = getCommerceOauthClient(
      {
        url: params.COMMERCE_BASE_URL,
        consumerKey: params.COMMERCE_CONSUMER_KEY,
        consumerSecret: params.COMMERCE_CONSUMER_SECRET,
        accessToken: params.COMMERCE_ACCESS_TOKEN,
        accessTokenSecret: params.COMMERCE_ACCESS_TOKEN_SECRET,
      },
      logger
    );

    const content = await oauth.get(operation);

    return {
      statusCode: 200,
      body: content,
    };
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, error, logger);
  }
}

exports.main = main;
