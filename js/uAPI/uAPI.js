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
            oauthVersion: '1.0',
            mainUrl: 'http://urepost.ucoz.net/uapi'
        },
        _allowedModules = ['blog', 'board', 'dir', 'publ', 'load', 'news'],
        modulesRels = {
            blog: {
                category: "category",
                title: "title",
                content: "message"
            },
            board: {
                category: "category",
                title: "title",
                content: "message"
            },
            dir: {
                category: "category",
                title: "title",
                content: "description"
            },
            publ: {
                category: "category",
                title: "title",
                content: "message"
            },
            load: {
                category: "category",
                title: "title",
                content: "message"
            },
            news: {
                category: "category",
                title: "title",
                content: "message"
            }
        };

    function http_build_query(formdata, numeric_prefix, arg_separator) {
        var key, use_val, use_key, i = 0, tmp_arr = [], tmp_formdata = [], ret = '';

        for (key in formdata) {
            tmp_formdata.push({ name: key, value: formdata[key] });
        }

        tmp_formdata.sort(function(obj1, obj2) {
            return obj1.name > obj2.name;
        });

        for(var i = 0; i < tmp_formdata.length; i++) {
            ret = ret + escape(tmp_formdata[i].name) + "=" + escape(tmp_formdata[i].value) + "&";
        }

        ret = ret.slice(0, -1);

        return ret;
    }

    function init(options) {
        _isInit = true;
        _options = _.defaults(options, _options);
    };

    function _request(requestUrl, method, parametrs, _options, cb) {
        if (method === undefined) {
            method = 'GET';
        }

        var
            requestUrl = _options.mainUrl + requestUrl.toLowerCase(),
            method = method.toUpperCase(),
            parametrsForUrl = http_build_query(parametrs),
            //parametrs2 = parametrs,
            basestring = '',
            hashKey = '',
            oauthSignature = '',
            url = '',
            urlFor = '';

        console.log(parametrsForUrl);

        //parametrs = parametrs.replace('@', '');
        basestring = method + '&' + encodeURIComponent(requestUrl) + '&' +
            encodeURIComponent(parametrsForUrl.replace('+', '%20'));

        hashKey = _options.consumerSecret + '&' + _options.oauthTokenSecret;
        oauthSignature = encodeURIComponent($.trim(CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(basestring, hashKey))));


        url = (method === 'GET' || method === 'DELETE')
            ? requestUrl + '?' + parametrsForUrl + '&oauth_signature=' + oauthSignature
            : requestUrl + '?oauth_signature=' + oauthSignature;

        $.ajax({
            method: method,
            url: url,
            data: (method === 'POST') ? parametrsForUrl : '',
        }).error(function (err) {
            cb(err);
        }).success(function (data) {
            cb(null, data);
        });
    };

    function getModules(cb) {
        if (!_isInit) return cb(new Error('not init'));

        var
            modules = [
                {
                    code: "blog",
                    name: "Блог"
                },
                {
                    code: "board",
                    name: "Доска объявлений"
                },
                {
                    code: "dir",
                    name: "Каталог сайтов"
                },
                {
                    code: "publ",
                    name: "Каталог статей"
                },
                {
                    code: "load",
                    name: "Каталог файлов"
                },
                {
                    code: "news",
                    name: "Новости сайта"
                }
            ],
            parametrs = {
                oauth_consumer_key:     _options.consumerKey,
                oauth_nonce:            _options.oauthNonce,
                oauth_signature_method: _options.sigMethod,
                oauth_timestamp:        _options.timestamp,
                oauth_token:            _options.oauthToken,
                oauth_version:          _options.oauthVersion,
            };

        async.forEachOf(modules,
            // Iterator
            function (item, key, cb) {

                _request('/' + item.code +  '/', 'get', parametrs, _options, function (err, data) {
                    if (err) {
                        return cb(err);
                    }

                    if (data.error && data.error.code) {
                        modules[key].error = data.error;
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

    function getCategories(module, cb) {
        if (!_isInit) return cb(new Error('not init'));

        if ( _allowedModules.indexOf(module) !== -1 ) {
            var parametrs = {
                oauth_consumer_key:     _options.consumerKey,
                oauth_nonce:            _options.oauthNonce,
                oauth_signature_method: _options.sigMethod,
                oauth_timestamp:        _options.timestamp,
                oauth_token:            _options.oauthToken,
                oauth_version:          _options.oauthVersion
            };

            _request('/' + module +  '/category', 'get', parametrs, _options, function (err, data) {
                if (err) {
                    return cb(err);
                }

                var categories = data
                    .filter(function(item) {
                        return item.type === 'category';
                    })
                    .map(function (category) {
                        return {
                            id: category.id,
                            name: category.name
                        };
                    });

                cb(null, categories);
            });
        }
        else {
            cb('undefined_module_name');
        }
    }

    function createPost(module, _parametrs, cb) {
        if (!_isInit) return cb(new Error('not init'));

        if ( _allowedModules.indexOf(module) !== -1 ) {
            var parametrs = {
                    oauth_consumer_key:     _options.consumerKey,
                    oauth_nonce:            _options.oauthNonce,
                    oauth_signature_method: _options.sigMethod,
                    oauth_timestamp:        _options.timestamp,
                    oauth_token:            _options.oauthToken,
                    oauth_version:          _options.oauthVersion,
                },
                __parametrs = {};

            if(_parametrs.category) {
                __parametrs[modulesRels[module].category] = _parametrs.category;
            }
            if(_parametrs.title) {
                __parametrs[modulesRels[module].title] = _parametrs.title;
            }
            if(_parametrs.content) {
                __parametrs[modulesRels[module].content] = _parametrs.content;
            }

            parametrs = _.defaults(parametrs, __parametrs);

            console.log(parametrs);

            _request('/' + module +  '/', 'POST', parametrs, _options, function (err, data) {
                if (err) {
                    return cb(err);
                }

                cb(null, data);
            });
        }
        else {
            cb('undefined_module_name');
        }
    };

    function validateOptions(options, cb) {

        var parametrs = {
            oauth_consumer_key:     options.consumerKey,
            oauth_nonce:            CryptoJS.enc.Base64.stringify(CryptoJS.MD5(Date.now().toString())),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp:        Math.floor(Date.now() / 1000),
            oauth_token:            options.oauthToken,
            oauth_version:          '1.0'
        };

        _request('/users/', 'get', parametrs, options, function(err, data) {
            if (err) {
                cb(err);
            }
            cb(null, data);
        });
    };

    return {
        init: init,
        getModules: getModules,
        getCategories: getCategories,
        createPost: createPost,
        validateOptions: validateOptions
    };
})();

var test_uAPI = {
    test1: function () {
        /*uAPI.validateOptions({
            consumerKey: 'fgswGdw4ts35dsgQQQ',
            consumerSecret: 'tWVu5BxwnOCD44eWqMZJPUq3q5iycM',
            oauthToken: '1 1Jj3BeBE4ZVesZ2jj4deztNiX3C93juh52RNSCss',
            oauthTokenSecret: '2Nnhxzybl4vJISVZtDpdbzEfEMGV23wL9.3wSrxj',
            mainUrl: 'http://uapi.ucoz.com/accounts/GetUserInfo'
        }, function(err, data) {
            console.log(err);
            console.log(data);
        });*/
        uAPI.createPost('board', {
            category: "2",
            title: "yo",
            content: "yoyo222"
        }, function(err, data) {
            console.log(err);
            console.log(data);
        })
    }
};
