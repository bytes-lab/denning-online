'use strict';
var rp = require('request-promise');

require('ssl-root-cas').inject();
var gulp = require('gulp');
var Promise = require('bluebird');
var builder = require('xmlbuilder');
var fs = require("fs");
var path = require('path');
gulp.task('gensitemap',  function () {

  let answeruri = 'https://api.rank-x.com/api/v2/mysql/_table/answers?offset=$$offset$$';
  let rankuri = 'https://api.rank-x.com/api/v2/mysql/_table/ranking/?filter=ismp=false&offset=$$offset$$';
  var answerCount = 7;
  var rankCount = 7;
  let option = {
      method: 'GET',
      headers: {
          'X-Dreamfactory-API-Key': 'da4f7e05b7afc5beffe8d9d416abec73cf98ef89e3703beeb5144f325be5decc',
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
      },
      json: true, // Automatically parses the JSON string in the response,
      rejectUnauthorized: false
  };

  let options = [];

  for (let offset = 0; offset < 1000 * answerCount; offset += 1000)
  {
    option.uri = answeruri.replace('$$offset$$', '' + offset);
    options.push(option);
  }

  for (let offset = 0; offset < 1000 * rankCount; offset += 1000)
  {
    option.uri = rankuri.replace('$$offset$$', '' + offset);
    options.push(option);
  }

  Promise.all(options.map(option => rp(option)) )
  .then(data => {
    var answers = [];
    var ranks = [];
    var baseUrl = {
      "loc": "https://rank-x.com/",
      "lastmod": "2013-11-29T22:55:40+00:00"      
    };

    var xmlUrl = [];
    for (var i = 0; i < answerCount; i++) {
      answers = answers.concat(data[i].resource);
    }
    for (i = answerCount; i < rankCount + answerCount; i++) {
      ranks = ranks.concat(data[i].resource);
    }

    var mapxml = {
      urlset: {
        "@xmlns":"http://www.sitemaps.org/schemas/sitemap/0.9",
        "@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",
        "@xsi:schemaLocation":`http://www.sitemaps.org/schemas/sitemap/0.9
                              http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd`,

        "url": [
          {
            "loc": "https://rank-x.com/",
            "lastmod": "2013-11-29T22:55:40+00:00"
          }
        ]
      }
    }
    
    for (i = 0; i < answers.length; i++) {
      xmlUrl.push({
        "loc": "https://rank-x.com/answerDetail/" + answers[i].slug,
        "lastmod": "2013-11-29T22:55:40+00:00"
      })
    }

      
    for (i = 0; i < ranks.length; i++) {
      xmlUrl.push({
        "loc": "https://rank-x.com/rankSummary/" + ranks[i].slug,
        "lastmod": "2013-11-29T22:55:40+00:00"
      })
    }
    mapxml.urlset.url = mapxml.urlset.url.concat(xmlUrl);

    var map = builder.create(mapxml, { encoding: 'utf-8' })
    // console.log(path.join(__dirname, '/../src/sitemap.xml'));
    fs.writeFile(path.join(__dirname, '/../src/sitemap.xml'), map.end({ pretty: true }), function(err){
      if(err)
        console.log("Error writing sitemap.xml", err);
      else
        console.log("sitemap.xml is generated successfully.")
    })
  });
});