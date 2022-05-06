var express = require('express');
var router = express.Router();
var uModel = require("../models/roundModel.js");

  router.post('/change_round_number', async function( req, res) {
    let newstate = req.body.newstate;
    let newroundnum = req.body.newround
    let room_num = req.body.room_num
    let result = await uModel.change_round_number(room_num,newroundnum,newstate);
    res.status(result.status).send(result.result);
  })  

  router.get('/round_number/:player_id', async function( req, res) {
    console.log('routes');
    let playerid = req.params.player_id
    let result = await uModel.get_round(playerid);
    res.status(result.status).send(result.result);
  })  

  module.exports = router;