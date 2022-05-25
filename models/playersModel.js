var pool = require('./connection.js')

var dModel = require("../models/deckModel");
var rModel = require("../models/roundModel");
    
var activeCards = []
let rows = []
let columns = []
let diagonal = []


module.exports.loginCheck = async function (name,password) {
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

  module.exports.getLoggedUserInfo = async function (playerId) {
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


  module.exports.registerPlayer = async function(player_name, player_password) {
    try  {
      let sql = "insert into player(player_name,player_password) values ($1,$2)";
      let result = await pool.query(sql,[player_name, player_password]); 
      return { status: 200, result:result }
    } catch (err){
      console.log(err);
      return { status: 500, result: err };
    }
  }


  ///////////////////////////////////////////

  module.exports.player_information_change = async function(ply_health,ply_mana,ply_total_mana,ply_energy,ply_id) {
      try{
        console.log('change player model ')
        sql = `UPDATE player
              SET player_health = $1,
              player_mana = $2,
              player_total_mana = $3,
              player_energy = $4
  
              WHERE player_id = $5`;
  
        let result = await pool.query(sql,[ply_health,ply_mana,ply_total_mana,ply_energy,ply_id]);
        //console.log(result.rows);
        return {status:200 , result : result};
      } catch(err) {
        console.log(err);
        return {status:500 , result : err};
      }
  }

//gets information for both player and enemy 
   module.exports.get_player_info =  async function(player_id) {
    let sql = `select distinct(player_name ), player_id  , player_mana , player_total_mana , player_energy , player_health , player_num , player_tile_id
    from player, room  
    where player_room_id = (select room_num  from room where room_player_id = $1)`
      try{
        let result = await pool.query(sql,[player_id])
        //console.log(result.rows);
        
    
        return {status:200 , result: { result:result.rows,  player_id: player_id } };
      } catch(err) {
        console.log(err);
        return {status:500 , result : err};
      }
  } 

//gets information for just the player OR enemy
  module.exports.getPlayerInfo =  async function(player_id) {
    let sql = `select * from player  
    where player_id = $1`
      try{
        let result = await pool.query(sql,[player_id])
        //console.log(result.rows);
        
    
        return {status:200 , result: result.rows} ;
      } catch(err) {
        console.log(err);
        return {status:500 , result : err};
      }
  } 

  module.exports.player_tile = async function(playerid) {
    let sqlPlayer = `select player_tile_id 
                from  player 
                where  player_id = $1`
                

    let sqlEnemy = `select player_tile_id , player_num, player_id
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

  module.exports.getplays = async function(playerid) {
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


module.exports.playCard = async function(player_id,card,tile) {
  try{
   //get enemy id 
   
  let getsql =`select room_player_id from room
  where room_num = (select room_num as num from room where room_player_id = $1 ) and 
  room_player_id != $1 `;

  let result = await pool.query(getsql,[player_id]);
  let enemyId = result.rows[0]

 //gets enemy´s and player's information 
  let result1 = await this.getPlayerInfo(enemyId.room_player_id);
  let enemy = result1.result[0]

  result1 = await this.getPlayerInfo(player_id);
  let player = result1.result[0]

  //get the card
  result = await dModel.get_deck_card(player_id,card.id) 
  let cardPlayed = result.result[0]

  if(cardPlayed.deck_card_state_id == 1 && player.player_mana >= cardPlayed.card_mana){ //checks if card is in the hand and if the player has the energy to play the card 
    if(await this.checkSelectedTile(player.player_tile_id,tile, cardPlayed.card_range, cardPlayed.card_type_range_id)){ //check if he player selected a tile he could 
       await this.card_logic(player,cardPlayed,tile,enemy); //check if the card is in player´s hand 
    }else{  
      return { status: 400, result: {msm:"the player can`t selected that tile"} };
    }
  }else{
    return { status: 400, result: {msm:"the player can`t play a card that isn`t in his hand"} };
  }
  
  return { status: 200, result: {msm:"The card was played"} };
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.card_logic = async function(player,card,tile,enemy){
  //Layla Winifred Help
  
  if(card.card_id == 1){
    card.deck_card_state_id = 3 // state of the card becomes deck
    //Create Card Logic
    activeCards.push({card:card.card_id,turn:-1})
  }

  //Barrel Roll
  if(card.card_id == 2){ 
    
    player.player_tile_id = tile.id // move player to tile
    
    card.deck_card_state_id = 2 // state of the card becomes deck
  }

  //Shot Dart
  if(card.card_id == 3){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 1 // removes health from enemy player
    }
     card.deck_card_state_id = 2 // state of the card becomes deck
  }

  //Dorugham Cobble
  if(card.card_id == 4){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 4 // removes health from enemy player
    } 
    card.deck_card_state_id = 2
  }

  //Thomaz Osric Illusion
  if(card.card_id == 5){
    if(tile.id == enemy.player_tile_id){
      //Create Card Logic
    } 
    card.deck_card_state_id = 3
  }

  //Fire Arrow //
  if(card.card_id == 6){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 2 // removes health from enemy player
      //Create Card Logic
      activeCards.push({card:card.card_id,turn: 3})
    } 
    card.deck_card_state_id = 2 // state of the card becomes deck
  }

  //Rain Song
  if(card.card_id == 7){
    if(tile.id == card.card_range){
      //Create Card Logic
      activeCards.push({card:card.card_id,turn: 3})
    } 
    card.deck_card_state_id = 2 // state of the card becomes deck
  }
   
  //Ice Arrow
  if(card.card_id == 8){
    if(tile.id == enemy.player_tile_id){
      //Create Card Logic
      activeCards.push({card:card.card_id,turn: 2})
    } 
    card.deck_card_state_id = 2 // state of the card becomes deck
  }
  
  //Kazamir's Order
  if(card.card_id == 9){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 2 // removes health from enemy player
      //Create Card Logic
      activeCards.push({card:card.card_id,turn: -1})
    } 
    card.deck_card_state_id = 2 // state of the card becomes deck
  }
  
  //Shield Up
  if(card.card_id == 10){
    //Create Card Logic
    card.deck_card_state_id = 2 // state of the card becomes deck
  }
  
  //Osric's Bow
  if(card.card_id == 11){
    if(tile.id == enemy.player_tile_id){
      if (tile.column == columns[5] || tile.column == columns[6] || tile.row == rows[5] || tile.row == rows[6]){
        enemy.player_health -= 6
      } else {
        enemy.player_health -= 4
      }
    }
    card.deck_card_state_id = 2 // state of the card becomes deck
  }
  
  //Layla Winifred Command
  if(card.card_id == 12){
    //Create Card Logic
    card.deck_card_state_id = 2 // state of the card becomes deck
  }
  
  //Kazamir Blessing
  if(card.card_id == 13){
    //Create Card Logic
    card.deck_card_state_id = 2 // state of the card becomes deck
  }
  
  //Rissingshire Pebble
  if(card.card_id == 14){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 2 // removes health from enemy player
    } 
    card.deck_card_state_id = 2 // state of the card becomes deck
  }
  
  //Bellbroke Boulder
  if(card.card_id == 15){
    if(tile.id == enemy.player_tile_id){
      enemy.player_health -= 8 // removes health from enemy player
    } 
    card.deck_card_state_id = 2 // state of the card becomes deck
  }

  player.player_mana -= card.card_mana // removes the mana from player 
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
                                  
  this.player_location_change(enemy.player_id,enemy.player_tile_id)

}


module.exports.active_logic = async function(card){
  for (let row of activeCards){
    //Layla Winifred Help
    if (card.card_id == 1){

    }
    
    //Fire Arrow //
    if(card.card_id == 6){

    }

    //Rain Song
    if(card.card_id == 7){

    }

    //Ice Arrow
    if(card.card_id == 8){

    }

    //Kazamir's Order
    if(card.card_id == 9){

    }

    //Osric's Bow
    if(card.card_id == 11){

    }

    //Layla Winifred Command
    if(card.card_id == 12){

    }

    //Kazamir Blessing
    if(card.card_id == 13){

    }
    
  }
}


module.exports.checkSelectedTile = async function(playerTile  , selectedTile ,range ,type){
  //get player position
  let getSql = `select * from tile`
    let result= await pool.query(getSql)
    let boardTiles = result.rows

  for(let tile of boardTiles){
    if(tile.tile_id == playerTile) playerTile = tile 
  }

  let inicialRow = playerTile.tile_row
  let inicialColumn = playerTile.tile_column


  //creates tables of nº rows and columns where the tiles are clicable
  
  for (i = 1 ; i < range+1 ; i++){
      rows.push (inicialRow + i)
      rows.push (inicialRow - i)


      columns.push(inicialColumn + i)
      columns.push(inicialColumn - i)

      if(range == 8){
        diagonal.push({row: inicialRow + i , column: inicialColumn + i})
        diagonal.push({row: inicialRow + i , column: inicialColumn - i })


        diagonal.push({row: inicialRow - i , column: inicialColumn + i })
        diagonal.push({row: inicialRow - i , column: inicialColumn - i })
      }
      

  }

  //see if the tile is 'permited'
  if(type == 4) {
      if(selectedTile.column == inicialColumn){
          for(let possibleRow of rows){
              if(selectedTile.row == possibleRow) return true
          }
      }

      if(selectedTile.row == inicialRow){
          for(let possiblecolumn of columns){
              if(selectedTile.column == possiblecolumn)  return true
          }
      }
  }

  if(type == 8){
     
      for(let possiblediagonal of diagonal){
          if((selectedTile.row == possiblediagonal.row) && (selectedTile.column == possiblediagonal.column)) return true
      }

      if(selectedTile.column == inicialColumn){
          for(let possibleRow of rows){
              if(selectedTile.row == possibleRow) return true
          }
      }

      if(selectedTile.row == inicialRow){
          for(let possiblecolumn of columns){
              if(selectedTile.column == possiblecolumn) return true
          }
      }
  } 

    if(type == 0){
      return true
  }

  if(type == 10){
      
      let areaRange = (range-1)/2

      if( (selectedTile.row >= (inicialRow - areaRange)) && (selectedTile.row <= (inicialRow + areaRange)) ){
          if((selectedTile.column >= (inicialColumn - areaRange)) && (selectedTile.column <= (inicialColumn + areaRange))){
              tile.highlighted = true 
          } 
      }

  }
  
}


module.exports.move = async function(player_id,tile) {
  try{
    
    //check the energy and tile of the player 

    let resultplayer = await this.getPlayerInfo(player_id)

    let player = resultplayer.result[0]

    //check if the tile that is passed is possible
    if( (this.checkSelectedTile(player.player_tile_id,tile,1,4))  && player.player_energy > 0 ){
      //If everthing is correct 
      await this.player_location_change(player_id,tile.id)
      player.player_energy -= 1
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


module.exports.basicAttack = async function(player_id,tile) {
  try{
    //get enemy id 
   
    let getsql =`select room_player_id from room
    where room_num = (select room_num as num from room where room_player_id = $1 ) and 
    room_player_id != $1 `;

    let result = await pool.query(getsql,[player_id]);
    let enemyId = result.rows[0]

  //gets enemy´s and player's information 
    let result1 = await this.getPlayerInfo(enemyId.room_player_id);
    let enemy = result1.result[0]

    result1 = await this.getPlayerInfo(player_id);
    let player = result1.result[0]

    if(player.player_energy >= 1){
      if(await this.checkSelectedTile(player.player_tile_id,tile, 1, 4)){  //check if he player selected a tile he could 
        player.player_energy -= 1
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
      return { status: 200, result:result }
    }

   
 return { status: 200, result:result };
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}