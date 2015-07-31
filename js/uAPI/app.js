'use strict';

function microtime(get_as_float) {
    var now = new Date().getTime() / 1000;
    var s = parseInt(now);

    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

function http_build_query(formdata, numeric_prefix, arg_separator) {
    var value, key, tmp = [],
        that = this;

    var _http_build_query_helper = function(key, val, arg_separator) {
        var k, tmp = [];
        if (val === true) {
            val = '1';
        } else if (val === false) {
            val = '0';
        }
        if (val != null) {
            if (typeof val === 'object') {
                for (k in val) {
                    if (val[k] != null) {
                        tmp.push(_http_build_query_helper(key + '[' + k + ']', val[k], arg_separator));
                    }
                }
                return tmp.join(arg_separator);
            } else if (typeof val !== 'function') {
                return that.urlencode(key) + '=' + that.urlencode(val);
            } else {
                throw new Error('There was an error processing for http_build_query().');
            }
        } else {
            return '';
        }
    };

    if (!arg_separator) {
        arg_separator = '&';
    }
    for (key in formdata) {
        value = formdata[key];
        if (numeric_prefix && !isNaN(key)) {
            key = String(numeric_prefix) + key;
        }
        var query = _http_build_query_helper(key, value, arg_separator);
        if (query !== '') {
            tmp.push(query);
        }
    }

    return tmp.join(arg_separator);
}

var uAPIModule = {
    // uAPIModule info
    oauthNonce: CryptoJS.MD5(microtime() + Math.floor(Math.random() * 999999999)),
    timestamp: Date.now(),
    sigMethod: 'HMAC-SHA1',
    oauthVersion: '1.0',

    // uAPIModule user app info
    consumerKey: 'Nvw3Wm7v1bN8',
    consumerSecret: 'Tu.yUtCw9ygRQPJFrDpgHurMeWn7q7',
    oauthToken: 'Ugqe53bimpieTA4wZoSPPfWgakL.v5zjRREXl4RJ',
    oauthTokenSecret: 'yRylogtLxZ4a0.gSdGRhRhn443ZVH422cqEVuGTx',
    mainUrl: 'http://alphatest-6347.ucoz.ru/uapi',

    // Request
    request: function(requestUrl, method, parametrs) {
        if (method === undefined) {
            method = 'GET';
        }
        if (parametrs === undefined) {
            parametrs = '';
        }

        var me = this,
            requestUrl = me.mainUrl + $.trim(requestUrl).toLowerCase(),
            method = method.toUpperCase(),
            parametrs2 = parametrs,
            basestring = '',
            hashKey = '',
            oauthSignature = '',
            parametrsForUrl = '',
            url = '',
            urlFor = '';

        parametrs = parametrs.replace('@', '');
        basestring = method + '&' + encodeURI(requestUrl) + '&' +
            encodeURI(http_build_query(parametrs).replace('+', '%20'));
        hashKey = me.consumerSecret + '&' + me.oauthTokenSecret;
        oauthSignature = encodeURI( $.trim(btoa( CryptoJS.HmacSHA1(basestring, hashKey) )) );
        parametrsForUrl = http_build_query(parametrs);
        url = requestUrl + '?oauth_signature=' + oauthSignature;
        urlFor = requestUrl + '?' + parametrsForUrl + '&oauth_signature=' + oauthSignature;

        return urlFor;
    }

};
