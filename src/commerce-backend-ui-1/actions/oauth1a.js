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
const Oauth1a = require("oauth-1.0a");
const crypto = require("crypto");
// eslint-disable-next-line node/no-missing-require
const got = require("got");

/**
 * Creates an OAuth 1.0a client for Commerce API requests.
 *
 * @param {object} options - OAuth configuration options
 * @param {string} options.url - Commerce API base URL
 * @param {string} options.version - API version (e.g., 'V1')
 * @param {string} options.consumerKey - OAuth consumer key
 * @param {string} options.consumerSecret - OAuth consumer secret
 * @param {string} options.accessToken - OAuth access token
 * @param {string} options.accessTokenSecret - OAuth access token secret
 * @param {object} logger - Logger instance
 * @returns {object} OAuth client instance with get, post, put, delete methods
 */
function getOauthClient(options, logger) {
  const instance = {};

  // Remove trailing slash if any
  const serverUrl = options.url;
  const apiVersion = options.version;
  const oauth = Oauth1a({
    consumer: {
      key: options.consumerKey,
      secret: options.consumerSecret,
    },
    signature_method: "HMAC-SHA256",
    hash_function: hashFunctionSha256,
  });
  const token = {
    key: options.accessToken,
    secret: options.accessTokenSecret,
  };

  /**
   * Computes HMAC-SHA256 hash for OAuth signature generation.
   *
   * @param {string} baseString - The base string to hash
   * @param {string} key - The secret key for HMAC
   * @returns {string} Base64-encoded HMAC-SHA256 hash
   */
  function hashFunctionSha256(baseString, key) {
    return crypto.createHmac("sha256", key).update(baseString).digest("base64");
  }

  /**
   * Makes an authenticated API call to Commerce API.
   *
   * @param {object} requestData - Request configuration
   * @param {string} requestData.url - API endpoint URL
   * @param {string} requestData.method - HTTP method (GET, POST, PUT, DELETE)
   * @param {*} [requestData.body] - Request body for POST/PUT requests
   * @param {string} [requestToken] - Optional bearer token for IMS authentication
   * @param {object} [customHeaders] - Optional custom headers to include
   * @returns {Promise<object>} Parsed JSON response from API
   */
  async function apiCall(requestData, requestToken = "", customHeaders = {}) {
    try {
      logger.info(
        "Fetching URL: " +
          requestData.url +
          " with method: " +
          requestData.method
      );

      const headers = {
        ...(requestToken
          ? { Authorization: "Bearer " + requestToken }
          : oauth.toHeader(oauth.authorize(requestData, token))),
        ...customHeaders,
      };

      return await got(requestData.url, {
        method: requestData.method,
        headers,
        body: requestData.body,
        responseType: "json",
      }).json();
    } catch (error) {
      logger.error(error);

      throw error;
    }
  }

  instance.consumerToken = async function (loginData) {
    return apiCall({
      url: createUrl("integration/customer/token"),
      method: "POST",
      body: loginData,
    });
  };

  instance.get = async function (resourceUrl, requestToken = "") {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "GET",
    };
    return apiCall(requestData, requestToken);
  };

  /**
   * Constructs a full API URL from a resource path.
   *
   * @param {string} resourceUrl - Relative resource path
   * @returns {string} Full API URL with base URL and version
   */
  function createUrl(resourceUrl) {
    return serverUrl + apiVersion + "/" + resourceUrl;
  }

  instance.post = async function (
    resourceUrl,
    data,
    requestToken = "",
    customHeaders = {}
  ) {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "POST",
      body: data,
    };
    return apiCall(requestData, requestToken, customHeaders);
  };

  instance.put = async function (resourceUrl, data, requestToken = "") {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "PUT",
      body: data,
    };
    return apiCall(requestData, requestToken);
  };

  instance.delete = async function (resourceUrl, requestToken = "") {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "DELETE",
    };
    return apiCall(requestData, requestToken);
  };

  return instance;
}

/**
 * Creates an OAuth 1.0a client specifically configured for Commerce API.
 *
 * @param {object} options - OAuth configuration options
 * @param {string} options.url - Commerce base URL
 * @param {string} options.consumerKey - OAuth consumer key
 * @param {string} options.consumerSecret - OAuth consumer secret
 * @param {string} options.accessToken - OAuth access token
 * @param {string} options.accessTokenSecret - OAuth access token secret
 * @param {object} logger - Logger instance
 * @returns {object} OAuth client instance configured for Commerce REST API
 */
function getCommerceOauthClient(options, logger) {
  options.version = "V1";
  options.url = options.url + "rest/";
  return getOauthClient(options, logger);
}

module.exports = {
  getOauthClient,
  getCommerceOauthClient,
};
