var request = require('request');
const fs = require('fs');
var path = require("path");
var express = require('express');
var dbHelper = require('./db-helper');

module.exports = function(app) {

    app.use(express.static('public'));

    app.get('/home', function(req, res){

        //get links from db
        dbHelper.getHomePageLinks('trending', function(err, data){
            if(err){
                console.log('some error!!');
                res.render('home.ejs', {'homePageContent': 'hahahahahaha'})

            }else{
                res.render('home.ejs', {'homePageContent': JSON.stringify(data)})
            }
        });
    });

    app.get('/page/:link', function(req, res){

        var linkTitle = req.params.link;
        console.log('link title -->' +linkTitle)

        res.render(linkTitle + ".ejs")

    });

}