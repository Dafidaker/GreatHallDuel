var express = require('express');
var router = express.Router();
var dModel = require("../models/deckModel");
var auth = require("../models/authentication")

router.get('/get_deck',auth.checkAuthentication,  async function(req, res, next) {
    console.log("Get deck of player ");
    let result = await dModel.get_deck(req.userId);
    res.status(result.status).send(result.result);
});

router.post('/deck_card_state_change', async function( req, res, next) {
    console.log("change state of card  ");
    let ply_id = req.body.ply_id;
    let card_id = req.body.card_id;
    let card_state_id = req.body.card_state_id;
    let result = await dModel.deck_card_state_change(ply_id, card_id, card_state_id);
    res.status(result.status).send(result.result);
});

router.post('/make_deck', auth.checkAuthentication,async function( req, res, next) {
    console.log("create deck ");
    let result = await dModel.make_deck(req.userId);
    res.status(result.status).send(result.result);
});

router.get('/get_cards', async function( req, res, next) {
    console.log("Get all card");
    let result = await dModel.get_cards();
    res.status(result.status).send(result.result);
    
});

router.post('/use_card',auth.checkAuthentication, async function( req, res, next) {
    console.log("change state of card ");
    let card = req.body.card;
    let tile = req.body.tile;
    let result = await dModel.use_card(req.userId,card, tile);
    res.status(result.status).send(result.result);
});

router.post('/destroy_deck',auth.checkAuthentication, async function( req, res, next) {
    console.log("destroy player`s deck");
    let result = await dModel.destroyDeck(req.userId);
    res.status(result.status).send(result.result);
});

module.exports = router;