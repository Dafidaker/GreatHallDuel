var express = require('express');
var router = express.Router();
var pModel = require("../models/playersModel");
var auth = require("../models/authentication")


router.post('/register', async function(req,res,next) {
    let player_name = req.body.player_name;
    let player_password = req.body.player_password;
    console.log("Register user with info: ");
    //console.log(player);
    let result = await pModel.registerPlayer(player_name, player_password);
    res.status(result.status).send(result.result);
})
            
router.post('/login', async function(req, res, next) {
    console.log("Login")
    let name = req.body.player_name;
    let password = req.body.player_password;
    let result = await pModel.loginCheck(name,password);
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
    let result = await pModel.getLoggedUserInfo(req.userId);
    res.status(result.status).send(result.result);
});

////////////////////////////////////////////////////////

router.post('/player_information_change', async function(req, res, next) {
    console.log("Change Player Info")
    let ply_health = req.body.ply_health;
    let ply_mana = req.body.ply_mana;
    let ply_total_mana = req.body.ply_total_mana;
    let ply_energy = req.body.ply_energy;
    let ply_id = req.body.ply_id
    let result = await pModel.player_information_change(ply_health,ply_mana,ply_total_mana,ply_energy,ply_id);
    console.log('result' + result)
    res.status(result.status).send(result.result);
});

router.get('/player_info',auth.checkAuthentication, async function( req, res) {
  //console.log("Get Player Info") 
  //console.log(req.userId)
    let result = await pModel.get_player_info(req.userId);
    console.log('result' + JSON.stringify(result.result))
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
    console.log('Tile result' + JSON.stringify(result.result.player))
    res.status(result.status).send(result);
  }) 

router.post('/player_location_change', async function( req, res) {
    console.log("Change Player position/tile") 
    let player_tile = req.body.player_tile;
    let ply_id = req.body.ply_id
    let result = await pModel.player_location_change(player_tile,ply_id);
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
    let result = await pModel.getplays(playerid);
    res.status(result.status).send(result.result);
  })

 /*  router.post('/:pId/playermatches/:pmId/actions', async function(req, res, next) {
    let pId = req.params.pId;
    let pmId = req.params.pmId;
    let action = req.body.action;
    console.log("Player action: "+ action);
    let resMatch = await pModel.getMatchOfPlayer(pmId);
    if (resMatch.status != 200)
      res.status(result.status).send(result.result);  
    else if (resMatch.result.mt_finished)
      res.status(423).send({msg: "That match has already finished"});
    else if (action == "endturn" ) {
      let result = await pModel.endTurn(pmId);
      res.status(result.status).send(result.result);
    } else if (action == "attackCard") {
      let dId = req.body.deckId;
      let opDId = req.body.opDeckId;
      let result = await pModel.attackCard(pmId,dId,opDId);
      res.status(result.status).send(result.result);  
    } else if (action == "play") {
      let dId = req.body.deckId;
      let result = await pModel.playCardFromHand(pmId,dId);
      res.status(result.status).send(result.result);
    } else  if (action == "attackPlayer") {
      let dId = req.body.deckId;
      let result = await pModel.attackPlayer(pmId,dId);
      res.status(result.status).send(result.result);
    } else
      res.status(400).send({msg:"Invalid action"}) 
  }); */



module.exports = router;