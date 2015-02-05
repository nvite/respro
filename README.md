# respro
Resource proxy middleware for Connect/Express servers.

## Installation/usage
Install using `npm`:
``` bash
$ npm i --save respro
```

Use this just like any other middleware:
``` javascript
var proxy = require('respro');
...
app.use('/my-cat-photo.gif', proxy('http://example.com/my-cat-photo.gif'));
```

## Options/configuration
`respro` takes 3 arguments:
* `resourceUrl` - The external URL to the resource we are proxying to.
* `resHeaders` - An object map of response headers to send with the response after the resource is fetched.
* `reqHeaders` - An object map of request headers to send with the request to our resource.

## Examples
``` javascript
var proxy = require('respro');
...
app.use('/favicon.ico', proxy(
  'http://example.com/path/to/favicon.ico',         // Proxy our favicon to an external resource
  { 'Cache-control': 'public, max-age=31536000' }   // ... and set the `Cache-Control` header on its response
));
...
app.use('/example', proxy(
  'http://example.com/example.js',    // Request a javascript file
  'text/plain'                        // ... but use a shorthand to explicitly set Content-Type.
));
```
