const
    axios = require('axios'),
    config = require('../../configs'),
    showdown = require('showdown'),
    {
        render
    } = require('../../utils');
var converter = new showdown.Converter()

function page(req, res) {
    var {
        category_slug,
        sub_category,
        topic_slug
    } = req.params,
    guide = 'landlords';
    axios.all([
        axios.get('/landlords/tags', config.axios.data),
        axios.get('/landlords/categories', config.axios.data),
        axios.get('/categories/' + sub_category + '/topics', config.axios.data)
    ]).then(axios.spread(function (tagResp, cateResp, topicResp) {
        var tags = tagResp.data.tags,
            categories = cateResp.data.categories,
            topics = topicResp.data.topics,
            main_categories = [],
            // The topic will show
            topic = [],
            topics_withLinks = topics.map(item => (
                Object.assign({
                    "links": guide + '/' + category_slug
                    // "links": a + '/' + b
                }, item)
            ));
        main_categories = categories.filter(function (x) {
            return x.parent_category_id == null;
        })
        topic = topics.filter(function (x) {
            return x.slug == topic_slug
        })
        // console.log(topic)
        let text = topic[0].body,
            str = converter.makeHtml(text);
        topic[0].body = str
        datas = {
            "guide": guide,
            "categories": main_categories,
            "selector": category_slug,
            "topics": topics_withLinks.filter(function (x) {
                return x.slug !== topic_slug
            }),
            "topic": topic[0],
            "tags": tags,
            "category": category_slug
        }
        render(res, 'detail', topic_slug, datas, req.path, {
            title: topic[0].title,
            description: topic[0].body
        })
    })).catch(err => {
        res.send('error:' + err)
    });
}

/*
 * @name routes_new
 * @description: 新路由规则应该是：
 * 1. index:  二级guide_slug/
 * 2. list:   二级guide_slug/category_slug
 * 3. detail: 二级guide_slug/category_slug/topic_slug
 * 4. tag:    二级guide_slug/tags#tag_slug?
 */
function multiGuidePage(req, res, next) {
    const {
        guide,
        category_slug,
        topic_slug
    } = req.params
    axios.all([
        axios.get('/'+guide+'/tags', config.axios.data),
        axios.get('/'+guide+'/categories', config.axios.data),
        axios.get('/topics/' + topic_slug, config.axios.data)
    ]).then(axios.spread(function (tagResp, cateResp, topicResp) {
        var tags = tagResp.data.tags,
            categories = cateResp.data.categories,
            topic = topicResp.data.topic,
            // main-categories & sub-categories
            main_categories = categories.filter(function (x) {
                return x.parent_category_id == null;
            }),
            // find subcategory
            sub_categories = categories.filter(function (x) {
                return x.category_id == topic.category_id;
            }),
            // topic's body => html-code
            text = topic.body,
            str = converter.makeHtml(text)
            topic.body = str,
            console.log(sub_categories)
            b = sub_categories.slug,
            slugs = {};
            categories.forEach(x => {
                slugs[x.id] = x.slug
            })
        // sub-categories's topics
        axios.get('/categories/' + topic.category_id + '/topics', config.axios.data).then(topicsResp => {
            let topics = topicsResp.data.topics,
                topics_withLinks = topics.map(item => (
                    Object.assign({
                        "links": guide + '/' + category_slug
                    }, item)
                ));
            var topics_data = topics_withLinks.filter(function (x) {
                    return x.slug !== topic_slug
                }),
                datas = {
                    "guide": guide,
                    "categories": main_categories,
                    "selector": category_slug,
                    "topics": topics_data,
                    "topic": topic,
                    "tags": tags,
                    "category": category_slug
                }
            render(res, 'detail', topic_slug, datas, req.path, {
                title: topic.title,
                description: topic.body
            })
        }).catch(err => {
            console.log(err)
            res.send('error:' + err)
            res.end
        })
    })).catch(err => {
        res.send('error:' + err)
    });
}

module.exports = {
    page,
    multiGuidePage,
}