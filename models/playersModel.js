var pool = require('./connection.js')

var dModel = require("../models/deckModel");
var rModel = require("../models/roundModel");
const res = require('express/lib/response');
    
var activeCards = []
let rows = []
let columns = []
let diagonal = []

let inicialRow 
let inicialColumn 

module.exports.activeCards = activeCards

module.exports.login_check = async function (name,password) {
  try {
    let sql = `select player_id from player where player_name = $1 and player_password = $2`;
    let result = await pool.query(sql,[name,password]);
    //console.log(name)
    //console.log(password)
    if (result.rows.length == 0) {
        return { status: 401, result: {msg: "Wrong password or username."}}
    }
    let ply_id = result.rows[0].player_id;
    //console.log(ply_id);
    return { status: 200, result: {msg: "Login correct", userId : ply_id} };
  } catch (err) {
    console.log(err);
    return { status: 500, result: err };
  }
}

module.exports.get_logged_user_info = async function (playerId) {
  try {
      let sql = `select player_name from player where player_id = $1`;
      let result = await pool.query(sql, [playerId]);
      if (result.rows.length > 0) {
          let player = result.rows[0];
          return { status: 200, result: player };
      } else {
          return { status: 404, result: { msg: "No user with that id" } };
      }
  } catch (err) {
    console.log(err);
    return { status: 500, result: err };
  }
}

module.exports.register_player = async function(player_name, player_password) {
  try  {
    let checkSql = `select * from player where player_name = $1`
    let result = await pool.query(checkSql,[player_name]); 
    if(result.rows.length == 0) {
      let sql = "insert into player(player_name,player_password) values ($1,$2)";
      result = await pool.query(sql,[player_name.toString(), player_password.toString()]); 
      return { status: 200, result:result }
    }else{
      return { status: 400, result: {msm:"name already taken"} }
    }
    
    
  } catch (err){
    console.log(err);
    return { status: 500, result: err };
  }
}

///////////////////////////////////////////

module.exports.player_information_change = async function(player_health,player_mana,player_total_mana,player_energy,player_id) {
    try{
      console.log('change player model ')
      sql = `UPDATE player
            SET player_health = $1,
            player_mana = $2,
            player_total_mana = $3,
            player_energy = $4

            WHERE player_id = $5`;
      
      let result = await pool.query(sql,[player_health,player_mana,player_total_mana,player_energy,player_id]);
      /* if the player_health >= 0 then player_id and enemy_id states are 4  */
      if(player_health <= 0){
        let getsql =`select room_player_id,room_round_number from room
        where room_num = (select room_num as num from room where room_player_id = $1 ) and room_player_id != $1 `;

        let result = await pool.query(getsql,[player_id]);

        result.rows[0].room_round_number += 1

        rModel.change_player_state(player_id, -1 , 4)
        rModel.change_player_state(result.rows[0].room_player_id, -1 , 4)

      }        
      
      //console.log(result.rows);
      return {status:200 , result : result};
    } catch(err) {
      console.log(err);
      return {status:500 , result : err};
    }
}

//gets information for both player and enemy 
module.exports.get_players_info =  async function(player_id) {
  try{
    let sql = `select player_name , player_id  , player_mana , player_total_mana , player_energy , player_health , player_room_id , player_tile_id
    from player
    where player_room_id = (select room_num  from room where room_player_id = $1) `
    let result = await pool.query(sql,[player_id])
    //console.log(result.rows);
    
    let resultEffects = await this.get_player_effect(player_id)

    return {status:200 , result: { result:result.rows ,player_id: player_id , result_players_effects: resultEffects} };
  } catch(err) {
    console.log(err);
    return {status:500 , result : err};
  }
} 

//gets information for just the player OR enemy
module.exports.get_player_info =  async function(player_id,type) {
    try{
      let result

      if(type == 1){ //gets the player's information
        let sql = `select * from player  
                  where player_id = $1`

        result = await pool.query(sql,[player_id])
        
      } else if (type == 2){ //gets the enemy's information
        let getsql =`select room_player_id from room
                    where room_num = (select room_num as num from room where room_player_id = $1 ) and 
                    room_player_id != $1`;

        let resultEnemyId = await pool.query(getsql,[player_id]);
        let enemyId = resultEnemyId.rows[0]

        let sql = `select * from player  
                  where player_id = $1`

        result = await pool.query(sql,[enemyId.room_player_id])
      }

      if(result.rows.length == 1){
        let player = result.rows[0]
        let enemy = result.rows[0]
        if(type == 1) return player ;
        if(type == 2) return enemy ;
      }else{
        if(result.rows.length == 0) return {status:401 , result: {msm:"there isn`t a player with that id "}} ;
        if(result.rows.length > 1) return {status:400 , result: {msm:"there is more than 1 player with that id"}} ;
      }
      
      
    } catch(err) {
      console.log(err);
      return {status:500 , result : err};
    }
} 

module.exports.get_player_effect =  async function(player_id) {
  try{
    let result

      let getsql =`select room_player_id from room
                  where room_num = (select room_num as num from room where room_player_id = $1 ) and 
                  room_player_id != $1`;

      let resultEnemyId = await pool.query(getsql,[player_id]);
      let enemyId = resultEnemyId.rows[0]

      let sqlEffects = `select * from player_effect 
                where player_effect_player_id = $1 or player_effect_player_id = $2 `

      result = await pool.query(sqlEffects,[player_id,enemyId.room_player_id])
    

    if(result.rows.length >= 1){
      return {players_effects:result.rows , effects: true };
    }else{
      if(result.rows.length == 0) return { result: {msm:"the player doesnt have effects"}, effects: false};
    }
    
    
  } catch(err) {
    console.log(err);
    return {status:500 , result : err};
  }
} 

module.exports.player_tile = async function(playerid) {
  let sqlPlayer = `select player_tile_id 
              from  player 
              where  player_id = $1`
              

  let sqlEnemy = `select player_tile_id ,  player_id
                  from room , player ,
                  (select room_num as the_room from room where room_player_id = $1 ) temptable1
                  where room_num = the_room and player_id = room_player_id and player_id != $1`
    try{
      let resultPlayer = await pool.query(sqlPlayer,[playerid])
      
      let resultEnemy = await pool.query(sqlEnemy,[playerid])

      return {status:200 , result:{ player : resultPlayer.rows , enemy : resultEnemy.rows , playerid:playerid }};
    } catch(err) {
      console.log(err);
      return {status:500 , result : err};
    }
}

module.exports.player_location_change = async function(player_id,player_tile) {
  sql = `UPDATE player
          SET player_tile_id = $1
          WHERE player_id = $2`;
  try{
    let result = await pool.query(sql,[player_tile,player_id]);
    return {status:200 , result : result};
  } catch(err) {
    console.log(err);
    return {status:500 , result : err};
  }
}

module.exports.player_room_change = async function(player_id,room_num) {
  try{
    sql = `UPDATE player
          SET player_room_id = $1
          WHERE player_id = $2`;
  
    let result = await pool.query(sql,[room_num,player_id]);
    return {status:200 , result : result};
  } catch(err) {
    console.log(err);
    return {status:500 , result : err};
  }
}

module.exports.play = async function(play_player_id,room_id,round_number,play_num,play_tp_id,play_tile_id,play_state_id) {
  try{
      
    sql = `insert into play (play_room_id, play_round_number, play_state_id, play_num, play_tp_id, play_tile_id, play_player_id) values`;
    sql += `(${room_id}, ${round_number},${play_state_id}, ${play_num}, ${play_tp_id}, ${play_tile_id}, ${play_player_id});`;
    

  result = await pool.query(sql);
  return {status:200 , result : result};
  }catch(err) {
  console.log(err);
  return {status:500 , result : err};
  }
}

module.exports.get_plays = async function(playerid) {
  let sql = 'select * from (select room_num as thenum from room where room_player_id = $1)temptable , play where play_room_id = thenum order by play_num Desc ';

  try{
    let result = await pool.query(sql,[playerid]);
    //console.log(result.rows);
    return {status:200 , result : result};
  } catch(err) {
    console.log(err);
    return {status:500 , result : err};
  }
}



module.exports.play_card = async function(player_id,card,tile) {
  try{

  //gets enemy´s and player's information 
    let enemy = await this.get_player_info(player_id,2);
    
    let player = await this.get_player_info(player_id,1);
    
    //get the card
    result = await dModel.get_deck_card(player_id,card.id) 
    let cardPlayed = result.result[0]

    

//apply the active effects
    cardPlayed = await dModel.change_card_with_active_cards(player_id,cardPlayed)

//check if the player can use it
    if(cardPlayed.deck_card_state_id == 1 && player.player_mana >= cardPlayed.card_mana){ //checks if card is in the hand and if the player has the energy to play the card 

      if(await this.check_selected_tile(player.player_tile_id,tile, cardPlayed.card_range, cardPlayed.card_type_range_id)){ //check if he player selected a tile he could 

//Update the active cards usage
        await dModel.update_active_cards_information(player_id,cardPlayed)

//Use it
        await this.card_logic(player,cardPlayed,tile,enemy); //check if the card is in player´s hand 

        return { status: 200, result: {msm:"The card was played"} };
      }else{  
        return { status: 400, result: {msm:"the player can`t select that tile"} };
      }
    }else{
      return { status: 400, result: {msm:"the player can`t play a card that isn`t in his hand"} };
    }
  
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.card_logic = async function(player,card,tile,enemy){
  
  //get enemy's effect
  let result = await this.get_player_effect(player.player_id)
  let playersEffects = result.players_effects
  let enemyEffects = []
  let enemyshielded = false 

  if(result.effects == true){
    for(let effect of playersEffects){
      if(effect.player_effect_player_id != player.player_id) {
        enemyEffects.push(playersEffects)
        if(effect.player_effect_effect_id == 4) enemyshielded = true ;
      }
    }
  }
  //this.active_logic(card)
  
  //add this if card isnt working
    /* player.player_mana += card.card_mana 
    dModel.draw_card(player.player_id,false) */
  let enemyInicialHealth = enemy.player_health

  //Layla Winifred Help
  if(card.card_id == 1){
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
    await dModel.activate_card(player.player_id,card.card_id)
  }

  //Barrel Roll
  if(card.card_id == 2){ 
    
    player.player_tile_id = tile.id // move player to tile
    await dModel.discard_card(player.player_id,card.card_id)
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }

  //Shot Dart
  if(card.card_id == 3){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 1 // removes health from enemy player
      dModel.draw_card(player.player_id,false)
    }
    await dModel.discard_card(player.player_id,card.card_id)

     /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }

  //Dorugham Cobble
  if(card.card_id == 4){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 4 // removes health from enemy player
    } 
    await dModel.discard_card(player.player_id,card.card_id)

    /*card.deck_card_state_id = 2 */
  }

  //Thomaz Osric Illusion
  if(card.card_id == 5){
    if(tile.id == enemy.player_tile_id){
      //Create Card Logic
      await dModel.activate_card(player.player_id,card.card_id)
      await this.add_player_effect(player.player_id,3,card.deck_id,'enemy')
    }else{
      await dModel.discard_card(player.player_id,card.card_id)
    }
    /* player.player_mana += card.card_mana 
    dModel.draw_card(player.player_id,false) */
    /*card.deck_card_state_id = 2 */
  }

  //Fire Arrow //
  if(card.card_id == 6){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 2 // removes health from enemy player
      await dModel.activate_card(player.player_id,card.card_id)
      await this.add_player_effect(player.player_id,2,card.deck_id,'enemy')
    }else{
      await dModel.discard_card(player.player_id,card.card_id)
    }
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }

  //Rain Song
  if(card.card_id == 7){
    player.player_mana += card.card_mana 
    dModel.draw_card(player.player_id,false) 
    await dModel.discard_card(player.player_id,card.card_id)
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }
   
  //Ice Arrow
  if(card.card_id == 8){
    if(tile.id == enemy.player_tile_id){
      await dModel.activate_card(player.player_id,card.card_id)
      await this.add_player_effect(player.player_id,1,card.deck_id,'enemy')
    }else{
      await dModel.discard_card(player.player_id,card.card_id)
    }
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }
  
  //Kazamir's Order
  if(card.card_id == 9){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 2 // removes health from enemy player
    } 
    await dModel.activate_card(player.player_id,card.card_id)
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }
  
  //Shield Up
  if(card.card_id == 10){
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
    await dModel.activate_card(player.player_id,card.card_id)
    await this.add_player_effect(player.player_id,4,card.deck_id,'player')
  }
  
  //Osric's Bow
  if(card.card_id == 11){
    if(tile.id == enemy.player_tile_id){
      if (tile.column == (inicialColumn + 3) || tile.column == (inicialColumn - 3) || tile.row == (inicialRow - 3) || tile.row == (inicialRow + 3)){
        enemy.player_health -= 6
      } else {
        enemy.player_health -= 4
      }
    }
    await dModel.discard_card(player.player_id,card.card_id)
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }
  
  //Layla Winifred Command
  if(card.card_id == 12){
    await dModel.activate_card(player.player_id,card.card_id)
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }
  
  //Kazamir Blessing
  if(card.card_id == 13){
    await dModel.activate_card(player.player_id,card.card_id)
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }
  
  //Rissingshire Pebble
  if(card.card_id == 14){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 2 // removes health from enemy player
    } 
    await dModel.discard_card(player.player_id,card.card_id)

    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }
  
  //Bellbroke Boulder
  if(card.card_id == 15){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 8 // removes health from enemy player
    } 
    await dModel.discard_card(player.player_id,card.card_id)
    /*card.deck_card_state_id = 2 */ // state of the card becomes deck
  }

  player.player_mana -= card.card_mana // removes the mana from player 

  if(enemyshielded == true && enemy.player_health != enemyInicialHealth){ 
    //discard and remove thing :)
    enemy.player_health = enemyInicialHealth
    for(let effect of enemyEffects){
      if(effect.players_effect_effect_id ==4){
        //this.remove_player_effect(effect.player_effect_deck_id)
        dModel.discard_active_card(effect.player_effect_player_id,10)
      }
    }
    
  }

  // updating the players enemys and cards information  
  this.player_information_change(player.player_health,
                                  player.player_mana,
                                  player.player_total_mana,
                                  player.player_energy,
                                  player.player_id)

  this.player_location_change(player.player_id,player.player_tile_id)

  this.player_information_change(enemy.player_health,
                                  enemy.player_mana,
                                  enemy.player_total_mana,
                                  enemy.player_energy,
                                  enemy.player_id)
                                  
  //this.player_location_change(enemy.player_id,enemy.player_tile_id)

}

/* module.exports.chance_card_with_active_cards = async function(card){

  //console.log( "AAAAA" + activeCards)
  //Layla Winifred Help
  for (var i = 0; i < activeCards.length; i ++){
    if (activeCards[i].card === 1) {
      card.card_mana -= 2
      //activeCards.splice(i, 1);
      return card
    }
    if (activeCards[i].card === 2){
      
    }
    if (activeCards[i].card === 3){
      
    }
    if (activeCards[i].card === 4){
      
    }
    if (activeCards[i].card === 5){
      
    }
    if (activeCards[i].card === 6){
      
    }
    if (activeCards[i].card === 7){

    }
    if (activeCards[i].card === 8){
      
    }
    if (activeCards[i].card === 9){
      
    }
    if (activeCards[i].card === 10){
      
    }
    if (activeCards[i].card === 11){
      
    }
    //Layla Winifred Command
    if (activeCards[i].card === 12){
      if (activeCards[i].used === false){
        card.card_mana -= 1
        activeCards[i].used = true
        return card
      }
    }
    if (activeCards[i].card === 13){
      
    }
    if (activeCards[i].card === 14){
      
    }
    if (activeCards[i].card === 15){
      
    }
  } 
} */

module.exports.check_selected_tile = async function(playerTile  , selectedTile ,range ,type){
  //get player position
  let getSql = `select * from tile`
    let result= await pool.query(getSql)
    let boardTiles = result.rows

  for(let tile of boardTiles){
    if(tile.tile_id == playerTile) playerTile = tile 
  }

  inicialRow = playerTile.tile_row
  inicialColumn = playerTile.tile_column


  //creates tables of nº rows and columns where the tiles are clicable
  
  for (i = 1 ; i < range+1 ; i++){
      /* rows.push (inicialRow + i)
      rows.push (inicialRow - i)


      columns.push(inicialColumn + i)
      columns.push(inicialColumn - i) */

      if(type == 8){
        diagonal.push({row: inicialRow + i , column: inicialColumn + i})
        diagonal.push({row: inicialRow + i , column: inicialColumn - i })


        diagonal.push({row: inicialRow - i , column: inicialColumn + i })
        diagonal.push({row: inicialRow - i , column: inicialColumn - i })
      }
      

  }

  //see if the tile is 'permited'
  if(type == 4) {
      if(selectedTile.column == inicialColumn){
        if((selectedTile.row >= inicialRow - range) &&(selectedTile.row <= inicialRow + range)) return true
      }

      if(selectedTile.row == inicialRow){
        if((selectedTile.column >= inicialColumn - range) &&(selectedTile.column <= inicialColumn + range)) return true
      }
  }

  if(type == 8){
     
      for(let possiblediagonal of diagonal){
          if((selectedTile.row == possiblediagonal.row) && (selectedTile.column == possiblediagonal.column)) return true
      }

      if(selectedTile.column == inicialColumn){
        if((selectedTile.row >= inicialRow - range) &&(selectedTile.row <= inicialRow + range)) return true
      }

      if(selectedTile.row == inicialRow){
        if((selectedTile.column >= inicialColumn - range) &&(selectedTile.column <= inicialColumn + range)) return true
      }
  } 

    if(type == 0){
      return true
  }

  if(type == 10){
      
      let areaRange = (range-1)/2

      if( (selectedTile.row >= (inicialRow - areaRange)) && (selectedTile.row <= (inicialRow + areaRange)) ){
          if((selectedTile.column >= (inicialColumn - areaRange)) && (selectedTile.column <= (inicialColumn + areaRange))){
              return true
          } 
      }

  }
  
}

module.exports.move = async function(player_id,tile) {
  try{
    
    //check the energy and tile of the player 

    let player = await this.get_player_info(player_id,1)

    let result = await this.get_player_effect(player_id)
    let playersEffects = result.players_effects
    let playerEffects =[]
    let playerSlowed = false 

    if(result.effects == true){
      for(let effect of playersEffects){
        if(effect.player_effect_player_id == player_id) {
          playerEffects.push(effect)
          if(effect.player_effect_effect_id == 1) playerSlowed = true ;
        }
      }
    }


    //let player = resultplayer.result[0]

    //check if the tile that is passed is possible
    let requireEnergy

    if(playerSlowed == true){
      requireEnergy = 2
    }else if(playerSlowed == false){
      requireEnergy = 1
    }
  
    

    if( (this.check_selected_tile(player.player_tile_id,tile,1,4))  && player.player_energy >= requireEnergy ){
      //If everthing is correct 
      await this.player_location_change(player_id,tile.id)
      player.player_energy -= requireEnergy
      await this.player_information_change(player.player_health,player.player_mana,player.player_total_mana,player.player_energy,player.player_id)
      return { status: 200, result : { msg:"Player moved" } };

    }else{
      return { status: 400, result : { msg:"Player isnt able to move there" }};
    }

  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.basic_attack = async function(player_id,tile) {
  try{
    //get enemy id 
   
    /* let getsql =`select room_player_id from room
    where room_num = (select room_num as num from room where room_player_id = $1 ) and 
    room_player_id != $1 `;

    let result = await pool.query(getsql,[player_id]);
    let enemyId = result.rows[0] */

  //gets enemy´s and player's information 
    let enemy = await this.get_player_info(player_id,2);
    //let enemy = result1.result[0]

    let player = await this.get_player_info(player_id,1);
    //let player = result1.result[0]

    let result = await this.get_player_effect(player_id)
    let playersEffects = result.players_effects
    let playerEffects =[]
    let playerSlowed = false 

    if(result.effects == true){
      for(let effect of playersEffects){
        if(effect.player_effect_player_id == player_id) {
          playerEffects.push(effect)
          if(effect.player_effect_effect_id == 1) playerSlowed = true ;
        }
      }
    }


    //let player = resultplayer.result[0]

    //check if the tile that is passed is possible
    let requireEnergy
    let costEnergy
    
    if(playerSlowed == true){
      requireEnergy = 2
    }else if(playerSlowed == false){
      requireEnergy = 1
    }

    if(player.player_energy >= requireEnergy){
      if(await this.check_selected_tile(player.player_tile_id,tile, 1, 4)){  //check if he player selected a tile he could 
        player.player_energy -= requireEnergy
        if(tile.id == enemy.player_tile_id){
          enemy.player_health -= 1 // removes health from enemy player
        } 
      }
      
    this.player_information_change(player.player_health,
      player.player_mana,
      player.player_total_mana,
      player.player_energy,
      player.player_id)


    this.player_information_change(enemy.player_health,
      enemy.player_mana,
      enemy.player_total_mana,
      enemy.player_energy,
      enemy.player_id)
      return { status: 200, result:{ msg:"the player performed a basic attack" } }
    }

   
 //return { status: 200, result:result };
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.reset = async function(player_id){
  try{
    //get enemy id 
   
    /* let getsql =`select room_player_id from room
    where room_num = (select room_num as num from room where room_player_id = $1 ) and 
    room_player_id != $1 `;

    let result = await pool.query(getsql,[player_id]);
    let enemyId = result.rows[0] */

  //gets enemy´s and player's information 
     let enemy  = await this.get_player_info(player_id,2);
    //let enemy = result1.result[0]

    let player = await this.get_player_info(player_id,1);
    //let player = result1.result[0]

    player.player_health = 20
    player.player_mana = 5
    player.player_total_mana = 5
    player.player_energy = 3
    
    enemy.player_health = 20
    enemy.player_mana = 6
    enemy.player_total_mana = 6
    enemy.player_energy = 3
      
    this.player_information_change(player.player_health,
      player.player_mana,
      player.player_total_mana,
      player.player_energy,
      player.player_id)


    this.player_information_change(enemy.player_health,
      enemy.player_mana,
      enemy.player_total_mana,
      enemy.player_energy,
      enemy.player_id)

    await dModel.destroy_deck(player_id)
    await dModel.destroy_deck(enemyId.room_player_id)

    dModel.make_deck(player_id)
    dModel.make_deck(enemyId.room_player_id)
    
    rModel.change_player_state(player_id,1,1)
    rModel.change_player_state(enemyId.room_player_id,1,2)

    this.player_location_change(player_id,14)
    this.player_location_change(enemyId.room_player_id,68)

   
   return { status: 200, result : { msg:"game reset" } };
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.add_player_effect =  async function(player_id,effect_id,deck_id,type) {
  try{
    let ply_id 
    if(type == 'player'){ //gets the player's information
      ply_id = player_id

    } else if (type == 'enemy'){ //gets the enemy's information
      let getsql =`select room_player_id from room
                  where room_num = (select room_num from room where room_player_id = $1 ) and 
                  room_player_id != $1`;

      let resultEnemyId = await pool.query(getsql,[player_id]);
      let enemyId = resultEnemyId.rows[0]

      ply_id = enemyId.room_player_id
    }

    let sql = `insert into player_effect(player_effect_player_id,player_effect_effect_id,player_effect_deck_id) values($1,$2,$3) `
    let result = await pool.query(sql,[ply_id,effect_id,deck_id])
    console.log('aabb');
    

    return {status:200 , result: {msm:"a effect was added"} };
  } catch(err) {
    console.log(err);
    return {status:500 , result : err};
  }
} 

module.exports.remove_player_effect =  async function(deck_id) {
  try{
    let sql = `DELETE FROM player_effect  WHERE player_effect_deck_id = $1; `
    let result = await pool.query(sql,[deck_id])
    //console.log(result.rows);
    

    return {status:200 , result: {msm:"a effect was removed"} };
  } catch(err) {
    console.log(err);
    return {status:500 , result : err};
  }
} 