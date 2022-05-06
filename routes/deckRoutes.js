var express = require('express');
var router = express.Router();
var uModel = require("../models/deckModel");
var auth = require("../models/authentication")

router.get('/get_deck/:player_id',  async function(req, res, next) {
    console.log("Get deck of player ");
    let result = await uModel.get_deck(req.params.player_id);
    res.status(result.status).send(result.result);
});

router.post('/deck_card_state_change', async function( req, res, next) {
    console.log("change state of card  ");
    let ply_id = req.body.ply_id;
    let card_id = req.body.card_id;
    let card_state_id = req.body.card_state_id;
    let result = await uModel.deck_card_state_change(ply_id, card_id, card_state_id);
    res.status(result.status).send(result.result);
});

router.post('/makedeck/:player_id', async function( req, res, next) {
    let player_id = req.params.player_id
    console.log("create deck ");
    let result = await uModel.make_deck(player_id);
    res.status(result.status).send(result.result);
});

router.get('/get_cards', async function( req, res, next) {
    console.log("Get all card");
    let result = await uModel.get_cards();
    res.status(result.status).send(result.result);
    
});

module.exports = router;