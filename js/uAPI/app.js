'use strict';

function microtime(get_as_float) {
    var now = new Date().getTime() / 1000;
    var s = parseInt(now);

    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

function http_build_query( formdata, numeric_prefix, arg_separator ) {	// Generate URL-encoded query string
    var key, use_val, use_key, i = 0, tmp_arr = [];

    if(!arg_separator){
        arg_separator = '&';
    }

    for(key in formdata){
        use_key = escape(key);
        use_val = escape((formdata[key].toString()));
        use_val = use_val.replace(/%20/g, '+');

        if(numeric_prefix && !isNaN(key)){
            use_key = numeric_prefix + i;
        }
        tmp_arr[i] = use_key + '=' + use_val;
        i++;
    }

    return tmp_arr.join(arg_separator);
}


var uAPIModule = {
    // uAPIModule info
    oauthNonce: CryptoJS.MD5(microtime().toString() + Math.floor(Math.random() * 999999999).toString()),
    timestamp: new Date() / 1000,
    sigMethod: 'HMAC-SHA1',
    oauthVersion: '1.0',

    // uAPIModule user app info
    consumerKey: 'Nvw3Wm7v1bN8',
    consumerSecret: 'Tu.yUtCw9ygRQPJFrDpgHurMeWn7q7',
    oauthToken: 'Ugqe53bimpieTA4wZoSPPfWgakL.v5zjRREXl4RJ',
    oauthTokenSecret: 'yRylogtLxZ4a0.gSdGRhRhn443ZVH422cqEVuGTx',
    mainUrl: 'http://alphatest-6347.ucoz.ru/uapi',

    init: function() {
        var me = this;
        me.addListeners();
    },

    addListeners: function() {
        var me = this;
        $(document)
            .on('click', '.js-uapi-request', function () {
                // uAPIModule user app info
                var parametrs = {
                    oauth_consumer_key: me.consumerKey,
                    oauth_nonce: me.oauthNonce,
                    oauth_signature_method: me.sigMethod,
                    oauth_timestamp: me.timestamp,
                    oauth_token: me.oauthToken,
                    oauth_version: me.oauthVersion,
                };
                me.request('/users/', 'GET', parametrs);
            });
    },

    // Request
    request: function(requestUrl, method, parametrs) {
        if (method === undefined) {
            method = 'GET';
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

        //parametrs = parametrs.replace('@', '');
        basestring = method + '&' + encodeURIComponent(requestUrl) + '&' +
            encodeURIComponent(http_build_query(parametrs).replace('+', '%20'));
        hashKey = me.consumerSecret + '&' + me.oauthTokenSecret;
        oauthSignature = encodeURIComponent($.trim(CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(basestring, hashKey))));
        parametrsForUrl = http_build_query(parametrs);

        url = (method === 'GET' || method === 'DELETE')
            ? requestUrl + '?' + parametrsForUrl + '&oauth_signature=' + oauthSignature
            : requestUrl + '?oauth_signature=' + oauthSignature;

        $.ajax({
            method: method,
            url: url,
            dataType: "json",
            //data: parametrs2,
        }).done(function( data ) {
            console.log(data);
        });
    }
};

uAPIModule.init();
