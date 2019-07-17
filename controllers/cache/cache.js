const
    config = require('../../configs'),
    redis = require('redis'),
    {
        parse
    } = require('flatted/cjs');

function searchTopics(req, res) {
    if (! config.redis.enabled) return
    const client = redis.createClient(config.redis.port, config.redis.url)
    var {
        key
    } = req.params
    client.get('topics', function (e, v) {
        if (v === null) {
            res.send("null")
            res.end
        } else {
            key = key.toLowerCase()
            var val = parse(v),
                ary = val.filter(x => {
                    return x.title.toLowerCase().indexOf(key) > -1
                })
            // console.log(val.length, ary.length)
            res.send(ary)
        }
    })
}

function landlord(req, res) {
    if (! config.redis.enabled) return
    const client = redis.createClient(config.redis.port, config.redis.url)
    client.get('landlords', function (e, v) {
        if (v === null) {
            res.status(404).send("Sorry! I can't find that.")
            res.end
        } else {
            var val = parse(v)
            res.send(val)
        }
    })
}

function landlordData(req, res) {
    if (! config.redis.enabled) return
    const client = redis.createClient(config.redis.port, config.redis.url)
    var type = req.params.type
    client.get(type, function (e, v) {
        if (v === null) {
            res.status(404).send("Sorry! I can't find " + type + ".")
            res.end
        } else {
            var val = parse(v)
            res.send(val)
        }
    })
}

function categoriesByType(req, res) {
    if (! config.redis.enabled) return
    const client = redis.createClient(config.redis.port, config.redis.url)
    var type = req.params.type,
        id = req.params.id,
        result
    client.get('topics', function (e, v) {
        if (v === null) {
            res.status(404).send("Sorry! It can't find topics.")
            res.end
        } else {
            val = parse(v)
            if ('tags' == type) {
                result = val.filter(function (x) {
                    return x.tag_ids.indexOf(id) > -1;
                })
                res.send({
                    "topics": result
                })
            } else { //categories
                if (id.indexOf('-') > -1 || !/^\d*$/.test(id)) { //slug=>id
                    client.get('categories', function (err, rep) {
                        if (!!err) {
                            res.send('need cache categories!')
                        } else {
                            let category = parse(rep)
                            let arr = category.categories
                            let cache = arr.filter(function (x) {
                                return x.slug == id
                            })
                            result = val.filter(function (x) {
                                return x.category_id == cache[0].id;
                            })
                            res.send({
                                "topics": result
                            })
                        }
                    })

                } else {
                    result = val.filter(function (x) {
                        return x.category_id == id;
                    })
                    // res.send(result)
                    res.send({
                        "topics": result
                    })
                }
            }
        }
    })
}

function topics(req, res) {
    if (! config.redis.enabled) return
    const client = redis.createClient(config.redis.port, config.redis.url)
    var slug = req.params.slug
    client.get('topics', function (e, v) {
        if (v === null) {
            res.status(404).send("Sorry! I can't find topics.")
            res.end
        } else {
            var ary = parse(v),
                val = ary.filter(function (x) {
                    return x.slug == slug;
                })
            // res.send(val)
            res.send({
                "topic": val[0]
            })
        }
    })
}

module.exports = {
    searchTopics,
    landlord,
    landlordData,
    categoriesByType,
    topics,
}