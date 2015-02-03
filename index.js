'use strict';

/**
 * @file Resource proxy middleware for Connect/Express.
 *
 * @param   {String} resourceUrl - The destination resource to fetch.
 * @param   {Object} resHeaders  - A map of response headers to send with our
 *                                 response. Passing a String is shorthand for
 *                                 specifying the Content-Type header directly.
 * @param   {Object} reqHeaders  - A map of request headers to send along with
 *                                 the request for the resource defined by our
 *                                 `resourceUrl` argument.
 * @returns {Function}           - A Connect/Express compatible middleware Fn.
 */
module.exports = function (resourceUrl, resHeaders, reqHeaders) {
  var contentType;

  // If we pass in a string for the `resHeaders` argument, treat it as a short-
  // hand for specifying the Content-Type header.
  if ('string' === typeof resHeaders) {
    contentType = resHeaders;
  }

  if (!contentType) {
    contentType = resHeaders['Content-Type'] || 'application/octet-stream';
  }

  console.log('Got content-type', contentType);
};
