var express = require('express');
var router = express.Router();
var pModel = require("../models/playersModel");
var rModel = require("../models/roundModel");
var dModel = require("../models/deckModel");
var auth = require("../models/authentication")


router.post('/register', async function(req,res,next) {
    let player_name = req.body.player_name;
    let player_password = req.body.player_password;
    console.log("Register user with info: ");
    //console.log(player);
    let result = await pModel.register_player(player_name, player_password);
    res.status(result.status).send(result.result);
})
            
router.post('/login', async function(req, res, next) {
    console.log("Login")
    let name = req.body.player_name;
    let password = req.body.player_password;
    let result = await pModel.login_check(name,password);
    if (result.status == 200) {
        auth.saveUserId(res,result.result.userId); 
        res.status(result.status).send({msg:"User logged in"});
    } else  res.status(result.status).send(result.result);
});

router.post('/logout', auth.checkAuthentication, async function(req, res, next) {
    console.log("Logout")
    auth.logout(res);    
    res.status(200).send({msg:"User logged out"});
});

router.get('/profile', auth.checkAuthentication, async function(req, res, next) {
    console.log("Get profile of logged user ");
    let result = await pModel.get_logged_user_info(req.userId);
    res.status(result.status).send(result.result);
});

////////////////////////////////////////////////////////

router.post('/reset',auth.checkAuthentication, async function(req,res,next) {
  console.log("reset game information");
  let result = await pModel.reset(req.userId);
  res.status(result.status).send(result.result);
})

router.post('/player_information_change', async function(req, res, next) {
    console.log("Change Player Info")
    let ply_health = req.body.ply_health;
    let ply_mana = req.body.ply_mana;
    let ply_total_mana = req.body.ply_total_mana;
    let ply_energy = req.body.ply_energy;
    let ply_id = req.body.ply_id
    let result = await pModel.player_information_change(ply_health,ply_mana,ply_total_mana,ply_energy,ply_id);
    //console.log('result' + result)
    res.status(result.status).send(result.result);
});

router.get('/player_info',auth.checkAuthentication, async function( req, res) {
  //console.log("Get Player Info") 
  //console.log(req.userId)
    let result = await pModel.get_players_info(req.userId);
    //console.log('result' + JSON.stringify(result.result))
    res.status(result.status).send(result.result);
  })

/* router.get('/player_tile/:playerid', async function( req, res) {
    console.log("Get Player position/tile") 
    let playerid = req.params.playerid
    let result = await pModel.player_tile(playerid);
    res.status(result.status).send(result.result);
  })  */

router.get('/player_tile',auth.checkAuthentication, async function( req, res) {
    console.log("Get Player position/tile") 
    let result = await pModel.player_tile(req.userId);
    //console.log('Tile result' + JSON.stringify(result.result.player))
    res.status(result.status).send(result);
  }) 

router.post('/player_location_change', async function( req, res) {
    console.log("Change Player position/tile") 
    let player_tile = req.body.player_tile;
    let ply_id = req.body.ply_id
    let result = await pModel.player_location_change(ply_id,player_tile);
    res.status(result.status).send(result.result);
  }) 

router.post('/play', async function( req, res) {
    console.log("Created a Play") 
    let room_id = req.body.room_id
    let round_number = req.body.round_number
    let play_num = req.body.play_num
    let play_tp_id = req.body.play_tp_id
    let play_tile_id = req.body.play_tile_id
    let play_player_id = req.body.player_id
    let play_state_id = req.body.play_state_id
    let result = await pModel.play(play_player_id,room_id,round_number,play_num,play_tp_id,play_tile_id,play_state_id);
    res.status(result.status).send(result.result);
  }) 

router.get('/getplays/:playerid', async function( req, res) {
    console.log("Gets the plays") 
    let playerid = req.params.playerid;
    let result = await pModel.get_plays(playerid);
    res.status(result.status).send(result.result);
  })

router.post('/action',auth.checkAuthentication, async function(req, res, next) {
    let action = req.body.action;
    let player_id = req.userId
    console.log("Player action: "+ action);
    let resMatch = await rModel.get_round(req.userId);
    if (resMatch.status != 200)
      res.status(result.status).send(result.result);  
    else if (resMatch.result.room_player_state_id == 4)
      res.status(423).send({msg: "That match has already finished"});
    else if (resMatch.result.room_player_state_id == 1){
      res.status(400).send({msg: "It isn`t the player`s turn"});
    
    }else if (action == "endTurn"){
      let result = await rModel.end_round(req.userId);
      res.status(result.status).send(result.result);
    
    } else if (action == "playCard"){
      let card = req.body.card;
      let tile = req.body.tile;
      let result = await pModel.play_card(player_id,card,tile);
      /* if(result.status == 200){
        result = await dModel.discard_card(player_id,card.id);
      } */
      res.status(result.status).send(result.result);  
    
    } else if (action == "move") {
      let tile = req.body.tile;
      let result = await pModel.move(player_id,tile);
      res.status(result.status).send(result.result);
    
    } else  if (action == "drawCard") {
      let result = await dModel.draw_card(player_id,true);
      res.status(result.status).send(result.result);

    } else  if (action == "discardCard") {
      let card = req.body.card;
      let result = await dModel.discard_card(player_id,card.id);
      res.status(result.status).send(result.result);

    } else  if (action == "basicAttack") {
      let tile = req.body.tile;
      let result = await pModel.basic_attack(player_id,tile);
      res.status(result.status).send(result.result);

    } else
      res.status(400).send({msg:"Invalid action"}) 
  }); 



module.exports = router;