'use strict';

// var utils = require('axios/lib/utils');
var settle = require('axios/lib/core/settle');
// var buildURL = require('axios/lib/helpers/buildURL');
// var parseHeaders = require('axios/lib/helpers/parseHeaders');
// var isURLSameOrigin = require('axios/lib/helpers/isURLSameOrigin');
// var createError = require('axios/lib/core/createError');

// https://docs.microsoft.com/ja-jp/office/vba/language/reference/user-interface-help/filesystemobject-object
// https://docs.microsoft.com/en-us/previous-versions//ms537505(v=vs.85)

module.exports = function fsoAdapter(config) {

  const iomode = { ForReading: 1, ForWriting: 2, ForAppending: 8 }
  const format = { Default: -2, Unicode: -1, ASCII: 0 }
  const notexist = { ThenCreate: true, ThenError: false }
  var fso = new ActiveXObject("Scripting.FileSystemObject");

  return new Promise(function (resolve, reject) {
    var requestData = config.data || null;
    // var requestHeaders = config.headers;

    // TODO: handle whether config.url is absolute or relative

    if (document.location.protocol !== 'file:') { reject('source origin protocol must be "file:".'); return; }

    if (config.auth) { reject('config.auth Not Supported.'); return; }
    if (config.withCredentials) { reject('config.withCredentials Not Supported.'); return; }
    if (typeof config.onDownloadProgress === 'function') { reject('config.onDownloadProgress Not Supported.'); return; }
    if (config.cancelToken) { reject('config.cancelToken Not Supported.'); return; }

    var folder = fso.getFolder(document.location.href.slice('file:'.length, document.location.href.lastIndexOf('/') + 1))
    var path = fso.buildPath(folder, config.url); // FIXME: Directory Traversal vulnerability

    switch (config.method.toUpperCase()) {
      case 'GET':
        var textStream = fso.OpenTextFile(path, iomode.ForReading, notexist.ThenError, format.ASCII);
        var responseText = textStream.readAll();
        // console.log(issue)

        // Prepare the response
        var responseData = !config.responseType || config.responseType === 'text' ? responseText : JSON.parse(responseText); // FIXME: if parse error

        var request = {
          status: 200,
          statusText: 'OK',
          response: responseData,
          responseText: responseText,
        };

        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: {},
          config: config,
          request: request
        };

        settle(resolve, reject, response);
        break;
      case 'DELETE':
      case 'HEAD':
      case 'POST':
      case 'PUT':
      case 'PATCH':
      default:
        reject('method' + config.method + ' is Not Implemented yet.');
        return;
        break;
    }
  });
};
