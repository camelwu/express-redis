# resource-guide-express
resource-guide use node(express + art-template) technology stack, it is a SSR project, can by route to render html file.
It need node and pm2. please install pm2 at production before publish.  

``` 
{
    framework: express V4.x,  
    template: art-template,  
    nosql: redis V4.0,  
    logger: morgan,  
    router: customFunction
}

```

## Usage
想使用redis，在本地或服务器安装好，再修改配置文件
```
module.exports = {
    dev: {
        **
-        redis: false,
+        redis: true,
        **
    },
    prod: {
        **
-        redis: false,
+        redis: true,
        **
    }
}[process.env.NODE_ENV || 'dev']

```
After setting, run serve and visit localhost:3003/redis to cache all-data.
``` bash
# install dependencies
npm install
or yarn 
# app with hot reload at localhost:3000
npm run start

```

## directory structure

```
.
├── README.md
├── api.js
├── index.js
├── package-lock.json
├── package.json
├── routes
│   └── index.js
├── statics
│   ├── css
│   ├── fonts
│   ├── images
│   ├── js
│   └── stylesheets
├── utils
│   └── index.js
└── views
    ├── 404.html
    ├── 50x.html
    ├── page
    │   └── layout.html
    ├── common
    │   ├── footer.html
    │   ├── header.html
    │   ├── left.html
    │   └── top-search.html
    ├── detail.html
    ├── index.html
    ├── search-result.html
    └── tags.html
```

