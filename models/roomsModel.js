var pool = require('./connection.js')
var pModel = require("../models/playersModel");
var rModel = require("../models/roundModel");

module.exports.getAllRooms = async function() {
  try {
    let sql = "Select * from room";
    let result = await pool.query(sql);
    let rooms = result.rows;
    return { status: 200, result: rooms};
  } catch (err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.create_room = async function(player_id){
  try{
    //check if player is in a room 
    let checkSql = `select * from room where room_player_id = $1`
    let result = await pool.query(checkSql,[player_id]); 

    if(result.rows.length == 0){
        //see the highest room number
      let checkSql1 = `select max(room_num) from room`
      let checkResult = await pool.query(checkSql1); 

      let nextRoomNum = checkResult.rows[0].max + 1

      let state = Math.floor(Math.random() * (2 - 1 + 1) + 1) // deck max is the maximum , 6 is the minimum -- new order for the card in the deck


      //create the new room 
      
      let insertSql = `insert into room (room_full,room_player_id,room_num,room_round_number,room_player_state_id) values (false,$1,$2,1,$3)`
      await pool.query(insertSql,[player_id,nextRoomNum,state]); 
      await rModel.start_game(player_id)
      pModel.player_room_change(player_id,nextRoomNum)
      return { status: 200, result:{ msg: "Room created" }}; 
    }else{
      return { status: 400, result:{ msg: "player is in a room already" }};
    }
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.join_room = async function(player_id,room_num){
  try{
    //check if player is in a room 
    let checkSql = `select * from room where room_player_id = $1`
    let result = await pool.query(checkSql,[player_id]); 

    if(result.rows.length == 0){
      //see the lowest room number
      let room

      if(room_num == -1 ){
        let checkSql1 = `select * from room where room_num = (select min(room_num)from room where room_full is false)`
        result = await pool.query(checkSql1); 
        room = result.rows[0]
        if(result.rows.length > 1){
          return{status: 400, result:{ msg: "the selected room is already full " }}
        }
      }else{
        let checkSql1 = `select * from room where room_num = $1`
        result = await pool.query(checkSql1,[room_num]); 
        room = result.rows[0]
        if(result.rows.length > 1){
          return{status: 400, result:{ msg: "the selected room is already full " }}
        }else if (result.rows.length == 0){
          return{status: 400, result:{ msg: "the room doesnt exist " }}
        }
      }
      
      
      if(result.rows.length == 1){
        let state
        if(room.room_player_state_id == 1){
          state = 2
        }else if (room.room_player_state_id == 2){
          state = 1
        }

        //join the room 
        
        let insertSql = `insert into room (room_full, room_player_id, room_num, room_round_number, room_player_state_id) values (false,$1,$2,1,$3)`
        await pool.query(insertSql,[player_id,room.room_num,state]); 
        await rModel.start_game(player_id)
        pModel.player_room_change(player_id,room.room_num)
        return { status: 200, result:{ msg: "Room created" }};
      }else{
        return { status: 200, result:{ msg: "Room has more than 1 player already" }};
      }
      
    }else{
      return { status: 400, result:{ msg: "there isnt a room avaliable " }};
    }
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.check_room_full = async function(player_id){
  try{
    //check if player is in a room 
    let getsql =`select *from room
    where room_num = (select room_num as num from room where room_player_id = $1 ) `;

    let result = await pool.query(getsql,[player_id]);
    let room = result.rows[0]
    
    if(result.rows.length == 2){
      let updateSql = `Update room
                        SET room_full = true,
                        room_round_number = 1
                        WHERE room_num = $1`
     await pool.query(updateSql,[room.room_num]);
     return { status: 200, result:{ msg: "the room is full", numPlayers: 2, room_num : room.room_num }};
    }else if(result.rows.length == 1){
      return { status: 200, result:{ msg: "the room isnt full", numPlayers: 1, room_num : room.room_num }};
    }else if(result.rows.length == 0){
      return { status: 200, result:{ msg: "player isnt in a room", numPlayers: 0}};
    }
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}