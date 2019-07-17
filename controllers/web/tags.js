const
    axios = require('axios'),
    config = require('../../configs'),
    {
        render
    } = require('../../utils');

function page(req, res) {
    var {
        guide,
        tag_slug
    } = req.params
    // categories & tags
    axios.all([
        axios.get('/'+guide+'/tags', config.axios.data),
        axios.get('/'+guide+'/categories', config.axios.data)
    ]).then(axios.spread(function (tagResp, cateResp) {
        const tags = tagResp.data.tags,
            retval = cateResp.data.categories
        var requests = [],
            subcategory_parentId = {},
            category_slugs = {};
        // need add params:links,build guide/main_category_slug
        retval.forEach(x => {
            category_slugs[x.id] = x.slug
            if (x.parent_category_id !== null) {
                subcategory_parentId[x.id] = x.parent_category_id
            }
        })
        tags.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });
        tags.forEach((item) => {
            item.topics = []
            requests.push(axios.get('/tags/' + item.id + '/topics', config.axios.data))
        })
        // request topics
        axios.all(requests).then(axios.spread(function () {
            let args = [].slice.apply(arguments)
            args.forEach((val, i) => {
                let t = val.data.topics,
                    topics_withLinks = t.map(item => (
                        Object.assign({
                            "links": guide + '/' + category_slugs[subcategory_parentId[item.category_id]]
                        }, item)
                    ));
                tags[i].topics = topics_withLinks
            })
            render(res, 'tags', 'tags', {
                "categories": tags
            }, req.path, {
                title: guide + ' tags',
                description: guide + ' tags' + tag_slug
            })
        })).catch((error) => {
            console.log(error)
            res.send('error:' + error)
        })
    })).catch((error) => {
        console.log(error)
        res.send('error:' + error)
    })
}

module.exports = {
    page
}