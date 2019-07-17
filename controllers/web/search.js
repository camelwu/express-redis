const
    axios = require('axios'),
    config = require('../../configs'),
    {
        render,
        concatArray
    } = require('../../utils');

function page(req, res) {
    var {
        guide,
        key
    } = req.params
    axios.all([
        axios.get('/'+guide, config.axios.data),
        axios.get('/'+guide+'/categories', config.axios.data)
    ]).then(axios.spread(function (topResp, cateResp) {
        key = key.toLowerCase()
        var categories = cateResp.data.categories,
            subcategories = [],
            requests = [],
            category_slugs = {};
        categories.forEach(x => {
            category_slugs[x.id] = x.slug
            if (x.parent_category_id !== null) {
                subcategories.push(x)
            }
        })
        var cache_c = []
        subcategories.forEach((item, index) => {
            cache_c[index] = item.parent_category_id
            requests.push(axios.get('/categories/' + item.id + '/topics', config.axios.data))
        })
        // request all topics
        axios.all(requests).then(axios.spread(function () {
            var args = [].slice.apply(arguments),
                all_topics = [];
            args.forEach((x, i) => {
                let topics = x.data.topics,
                    topics_withLinks = topics.map(item => (
                        Object.assign({
                            "links": guide + '/' + category_slugs[cache_c[i]]
                        }, item)
                    ))
                    all_topics = concatArray(all_topics, topics_withLinks)
            })
            var result = all_topics.filter(x => {
                return x.title.toLowerCase().indexOf(key) > -1
            })
            render(res, 'search-result', 'search: ' + key, {
                "resource_guide": topResp.data.resource_guide,
                "keyword": key,
                "result": result,
                "topics": all_topics
            }, req.path, {
                title: 'search-result:' + key,
                description: result.length + ' article for ' + key
            })
        })).catch((error) => {
            console.log(error)
            res.send('error:' + error)
        })
    }))
}

module.exports = {
    page
}