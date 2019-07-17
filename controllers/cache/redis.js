const
    axios = require('axios'),
    config = require('../../configs'),
    redis = require('redis'),
    {
        parse,
        stringify
    } = require('flatted/cjs'),
    {
        concatArray,
        cleanObjRepeat
    } = require('../../utils');

function clear(req, res) {
    if (!config.redis.enabled) return
    const client = redis.createClient(config.redis.port, config.redis.url)
    client.flushdb()
    res.end('Redis cleared!')
}

function warm(req, res, next) {
    if (!config.redis.enabled) return
    handle_landlords(req, res, next)
    handle_tags(req, res, next)
    handle_categories_topics(req, res, next)
}

function handle_tags(req, res, next) {
    const client = redis.createClient(config.redis.port, config.redis.url)
    var key = "tags",
        val = null
    res.write('Begin: tags caching\n')
    client.get(key, function (err, v) {
        if (!!err || v === null) {
            res.write("API: requestng tags\n")
            axios.get('/landlords/tags', config.axios.api).then(function (Resp) {
                val = Resp.data
                res.write('Cached: newly requested tags\n')
                client.set("tags", stringify(val))
                next()
            })
        } else {
            val = parse(v)
            res.write('Cached: tags\n')
            next()
        }
    })
}

function handle_categories_topics(req, res, next) {
    const client = redis.createClient(config.redis.port, config.redis.url)
    var key = "categories",
        val = null
    res.write('Begin: categories caching\n')
    client.get(key, function (err, v) {
        if (!!err || v === null) {
            res.write('API: requesting categories\n')
            axios.get('/landlords/categories', config.axios.api).then(function (Resp) {
                val = Resp.data
                res.write('Cached: newly requested categories\n')
                client.set("categories", stringify(val))
                handle_topics(val, res, next)
            }).catch(function (error) {
                res.end(error)
            })
        } else {
            val = parse(v)
            res.write('Cached: categories\n')
            handle_topics(val, res, next)
        }
    })
}

function handle_topics(c, res, next) {
    const client = redis.createClient(config.redis.port, config.redis.url)
    var key = "topics",
        val = null
    res.write('Begin: topics caching\n')
    client.get(key, function (err, v) {
        if (!!err || v === null) {
            res.write('API: requesting topics\n')
            let ary = c.categories,
                sub_c = ary.filter(function (x) {
                    return x.parent_category_id != null;
                }),
                requests = []
            sub_c.forEach((item) => {
                requests.push(axios.get('/categories/' + item.id + '/topics', config.axios.api))
            });
            axios.all(requests).then(axios.spread(function () {
                var args = [].slice.apply(arguments),
                    topic = []
                args.forEach((val, i) => {
                    topic = concatArray(topic, val.data.topics)
                })
                let result = cleanObjRepeat(topic)
                res.write('Cached: newly requested topics\n')
                client.set("topics", stringify(result))
                res.end('Redis finished!')
            }))
        } else {
            val = parse(v)
            res.write('Cached: topics\n')
            res.end('Redis finished!')
        }
    })
}

function handle_landlords(req, res, next) {
    const client = redis.createClient(config.redis.port, config.redis.url)
    var key = "landlords",
        val = null
    res.write('Begin: landlord data caching\n')
    client.get(key, function (err, v) {
        if (!!err || v === null) {
            res.write('API: requesting landlord data\n')
            axios.get('/landlords', config.axios.api).then(function (Resp) {
                val = Resp.data
                client.set("landlords", stringify(Resp.data))
                res.write('Cached: newly requested landlord data\n')
            }).catch(function (error) {
                res.end(error)
            })
        } else {
            val = parse(v)
            res.write('Cached: landlords data\n')
        }
    })
    next()
}

module.exports = {
    clear,
    warm
}