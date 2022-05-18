var express = require('express');
var router = express.Router();
var rModel = require("../models/roundModel.js");
var auth = require("../models/authentication")

  router.post('/change_round_number', async function( req, res) {
    let newstate = req.body.newstate;
    let newroundnum = req.body.newround
    let room_num = req.body.room_num
    let result = await rModel.change_round_number(room_num,newroundnum,newstate);
    res.status(result.status).send(result.result);
  })  

  router.get('/round_number',  auth.checkAuthentication,  async function( req, res) {
    let result = await rModel.get_round(req.userId);
    res.status(result.status).send(result.result);
  })  

  router.post('/next_round',  auth.checkAuthentication,  async function( req, res) {    
    let result = await rModel.next_round(req.userId);
    res.status(result.status).send(result.result);
  })  

  module.exports = router;