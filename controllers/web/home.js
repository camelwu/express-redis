const
    axios = require('axios'),
    config = require('../../configs'),
    {
        render,
        concatArray
    } = require('../../utils');

function page(req, res) {
    
    render(res, 'home', 'home-page', {}, url = '')
}

module.exports = {
    page
}