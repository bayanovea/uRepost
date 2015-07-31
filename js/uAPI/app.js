'use strict';

/**
 * uAPI
 * @namespace
 */
var uAPI = (function () {
    //Global settings
    var
        _isInit = false,
        _options = {
            oauthNonce: CryptoJS.enc.Base64.stringify(CryptoJS.MD5(Date.now().toString())),
            timestamp: Math.floor(Date.now() / 1000),
            sigMethod: 'HMAC-SHA1',
            oauthVersion: '1.0'
        };

    function http_build_query(formdata, numeric_prefix, arg_separator) {
        var key, use_val, use_key, i = 0, tmp_arr = [];

        if (!arg_separator) {
            arg_separator = '&';
        }

        for (key in formdata) {
            use_key = escape(key);
            use_val = escape((formdata[key].toString()));
            use_val = use_val.replace(/%20/g, '+');

            if (numeric_prefix && !isNaN(key)) {
                use_key = numeric_prefix + i;
            }
            tmp_arr[i] = use_key + '=' + use_val;
            i++;
        }

        return tmp_arr.join(arg_separator);
    }

    function init(options) {
        _isInit = true;
        _options = _.defaults(options, _options);
    };

    function _request(requestUrl, method, parametrs, cb) {
        if (!_isInit) throw new Error('not init');

        if (method === undefined) {
            method = 'GET';
        }

        var
            requestUrl = _options.mainUrl + requestUrl.toLowerCase(),
            method = method.toUpperCase(),
        //parametrs2 = parametrs,
            basestring = '',
            hashKey = '',
            oauthSignature = '',
            parametrsForUrl = '',
            url = '',
            urlFor = '';

        //parametrs = parametrs.replace('@', '');
        basestring = method + '&' + encodeURIComponent(requestUrl) + '&' +
            encodeURIComponent(http_build_query(parametrs).replace('+', '%20'));

        hashKey = _options.consumerSecret + '&' + _options.oauthTokenSecret;
        oauthSignature = encodeURIComponent($.trim(CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(basestring, hashKey))));
        parametrsForUrl = http_build_query(parametrs);

        url = (method === 'GET' || method === 'DELETE')
            ? requestUrl + '?' + parametrsForUrl + '&oauth_signature=' + oauthSignature
            : requestUrl + '?oauth_signature=' + oauthSignature;

        $.ajax({
            method: method,
            url: url,
            data: (method === 'POST') ? parametrs : '',
        }).error(function (err) {
            cb(err);
        }).success(function (data) {
            cb(null, data);
        });
    };

    function getModules(cb) {
        if (!_isInit) throw new Error('not init');

        var
            modules = {
                blog:   { name: "Блог", enable: 0 },
                board:  { name: "Доска объявлений", enable: 0 },
                dir:    { name: "Каталог сайтов", enable: 0 },
                publ:   { name: "Каталог статей", enable: 0 },
                news:   { name: "Новости сайта", enable: 0 }
            },
            parametrs = {
                oauth_consumer_key:     _options.consumerKey,
                oauth_nonce:            _options.oauthNonce,
                oauth_signature_method: _options.sigMethod,
                oauth_timestamp:        _options.timestamp,
                oauth_token:            _options.oauthToken,
                oauth_version:          _options.oauthVersion
            };

        async.forEachOf(modules,
            // Iterator
            function (item, key, cb) {

                _request('/' + key +  '/', 'get', parametrs, function (err, data) {
                    if (err) {
                        return cb(err);
                    }

                    console.log( key );
                    console.log( data );

                    if( data.error.code !== "MODULE_NOT_ACTIVATED" && data.error.code !== "API_ACCESS_DENY") {
                        modules[key].enable = 1;
                    }

                    cb(null, modules);
                });

            },
            // Callback
            function (err) {
                if (err) {
                    console.log( err );
                }

                cb(null, modules);
            }
        );

        return;
    };

    function createPost(module, parametrs) {
        if (!_isInit) throw new Error('not init');
    };

    function validateOptions(_options, cb) {
        //TODO:
    };

    return {
        init: init,
        getModules: getModules,
        createPost: createPost
    };
})();

var test_uAPI = {
    test1: function () {
        uAPI.init({
            consumerKey: 'fgswGdw4ts35dsgQQQ',
            consumerSecret: 'tWVu5BxwnOCD44eWqMZJPUq3q5iycM',
            oauthToken: '1Jj3BeBE4ZVesZ2jj4deztNiX3C93juh52RNSCss',
            oauthTokenSecret: '2Nnhxzybl4vJISVZtDpdbzEfEMGV23wL9.3wSrxj',
            mainUrl: 'http://urepost.ucoz.net/uapi'
        });
        uAPI.getModules(function(err, data) {
            console.log(data);
        });
    }
};
