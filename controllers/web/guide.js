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
        category_slug
    } = req.params
    axios.all([
        axios.get('/'+guide, config.axios.data),
        axios.get('/'+guide+'/categories', config.axios.data)
    ]).then(axios.spread(function (topResp, cateResp) {
        var retval = cateResp.data.categories,
            main_categories = [],
            all_subcategories = [],
            subcategories = [],
            requests = [],
            subcategory_parentId = {},
            category_slugs = {};
        retval.forEach(x => {
            category_slugs[x.id] = x.slug
            if (x.parent_category_id == null) {
                main_categories.push(x)
            } else {
                all_subcategories.push(x)
                subcategory_parentId[x.id] = x.parent_category_id
            }
        })
        console.log(config.axios.data)
        var selected_category_slug = main_categories[0].slug
        if (category_slug && main_categories.some(function (x) {
                return x.slug == category_slug
            })) {
            selected_category_slug = category_slug
        }
        // on-demand
        let selected_category_id = main_categories.filter(function (x) {
            return x.slug == selected_category_slug
        })[0].id
        subcategories = all_subcategories.filter(function (x) {
            return x.parent_category_id == selected_category_id
        });
        subcategories.forEach((item, index) => {
            subcategories[index].topics = []
        });
        // In order to ensure all articles can be searched, need to get all
        var cache_c = []
        all_subcategories.forEach((item, index) => {
            cache_c[index] = item.parent_category_id
            requests.push(axios.get('/categories/' + item.id + '/topics', config.axios.data))
        })
        console.log(subcategories)
        // request all topics
        axios.all(requests).then(axios.spread(function () {
            var args = [].slice.apply(arguments),
                c = 0,
                all_topics = [];
            args.forEach((val, i) => {
                let topics = val.data.topics,
                    topics_withLinks = topics.map(item => (
                        Object.assign({
                            "links": guide + '/' + category_slugs[subcategory_parentId[item.category_id]]
                        }, item)
                    ));
                if (cache_c[i] == selected_category_id) {
                    subcategories[c].topics = topics_withLinks
                    c++
                }
                all_topics = concatArray(all_topics, topics_withLinks)
            })
            render(res, 'index', selected_category_slug, {
                "resource_guide": topResp.data.resource_guide,
                "guide": guide,
                "selector": selected_category_slug,
                "categories": main_categories,
                "categories2": subcategories,
                "topics": all_topics
            }, url = '')
        })).catch((error) => {
            console.log(error)
            res.send('error:' + error)
        })
    }))
}

module.exports = {
    page
}