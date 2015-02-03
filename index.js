'use strict';
/*jshint expr:true, latedef:false, laxcomma:true */

var request = require('request')
  , url = require('url')
  , extend = require('util-extend');

/**
 * @file Resource proxy middleware for Connect/Express.
 *
 * @param   {Mixed}  resourceUrl - The destination resource to fetch. This can
 *                                 be a String, or an Object formatted the same
 *                                 way a return from `url.parse()` might be.
 * @param   {Mixed}  resHeaders  - A map of response headers to send with our
 *                                 response. Passing a String is shorthand for
 *                                 specifying the Content-Type header directly.
 * @param   {Object} reqHeaders  - A map of request headers to send along with
 *                                 the request for the resource defined by our
 *                                 `resourceUrl` argument.
 * @returns {Function}           - A Connect/Express compatible middleware Fn.
 */
module.exports = function (resourceUrl, resHeaders, reqHeaders) {

  if (!resourceUrl) {
    throw new TypeError('You must provide a resourceUrl to proxy to.');
  }
  if ('string' === typeof resourceUrl) {
    resourceUrl = url.parse(resourceUrl);
  }

  // If we pass in a string for the `resHeaders` argument, treat it as a short-
  // hand for specifying the Content-Type header.
  if ('string' === typeof resHeaders) {
    resHeaders = { 'Content-Type': resHeaders };
  }

  resHeaders && (resHeaders = getComparableObj(resHeaders)) || (resHeaders = {});
  reqHeaders && (reqHeaders = getComparableObj(reqHeaders)) || (reqHeaders = {});

  return function (req, res, next) {
    req.reqHeaders = reqHeaders;
    req.resHeaders = resHeaders;

    var options = {
      url: url.format(resourceUrl),
      headers: extend(getComparableObj(req.headers), req.reqHeaders)
    };

    // We must do this to avoid TLS errors with hostname/ip mismatches.
    delete options.headers.host;

    request(options)
      .on('error', RequestErrorHandler.call(null, req, res, next))
      .on('response', RequestResponseHandler.call(null, req, res, next));
  };
};

/**
 * Handle errors from our resource request.
 */
function RequestErrorHandler(req, res, next) {
  return function (err) {
    next(err);
  };
}

/**
 * Handle a successful response from our resource request.
 */
function RequestResponseHandler(req, res, next) {
  return function (response) {

    // Merge and set our user-defined headers and the headers we got from our
    // resource request.
    var responseHeaders = extend(getComparableObj(response.headers), req.resHeaders);
    res.set(responseHeaders);

    response.pipe(res);
  };
}

/**
 * Returns a new copy of an object with all the keys lowercase, primarily
 * used for comparison/extension of objects.
 */
function getComparableObj(obj) {
  var o = {};

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      o[prop.toLowerCase()] = obj[prop];
    }
  }

  return o;
}
