'use strict';

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

    function _request(requestUrl, method, parametrs) {
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

        console.log(parametrs);

        $.ajax({
            method: method,
            url: url,
            data: (method === 'POST') ? parametrs : '',
        }).done(function (data) {
            console.log(data);
        });
    };

    function getModules() {
        if (!_isInit) throw new Error('not init');

        var
            modules = {
                blog:   { name: "Блог" },
                board:  { name: "Доска объявлений" },
                dir:    { name: "Каталог сайтов" },
                publ:   { name: "Каталог статей" },
                news:   { name: "Новости сайта" }
            },
            parametrs = {
                oauth_consumer_key: _options.consumerKey,
                oauth_nonce: _options.oauthNonce,
                oauth_signature_method: _options.sigMethod,
                oauth_timestamp: _options.timestamp,
                oauth_token: _options.oauthToken,
                oauth_version: _options.oauthVersion
            };

        _request('/publ/', 'get', parametrs);

        for(var module in modules) {
            console.log( module );
        }
    };

    function createPost(module, parametrs) {
        if (!_isInit) throw new Error('not init');
    };

    return {
        init: init,
        getModules: getModules,
        createPost: createPost
    };
})();

var test_uAPI = {
    test1 : function () {
        uAPI.init({
            consumerKey: 'Nvw3Wm7v1bN8',
            consumerSecret: 'Tu.yUtCw9ygRQPJFrDpgHurMeWn7q7',
            oauthToken: 'Ugqe53bimpieTA4wZoSPPfWgakL.v5zjRREXl4RJ',
            oauthTokenSecret: 'yRylogtLxZ4a0.gSdGRhRhn443ZVH422cqEVuGTx',
            mainUrl: 'http://alphatest-6347.ucoz.ru/uapi'
        });
        uAPI.getModules();
    }
};
