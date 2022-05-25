var pool = require('./connection.js')
var pModel = require("../models/playersModel");
var dModel = require("../models/deckModel");

module.exports.change_round_number = async function(room_num,newroundnum,newstate) {
      try{
        sql = `UPDATE room
              SET room_round_number = $1,
              room_state_id = $2
  
              WHERE room_num = $3`;
  
        let result = await pool.query(sql,[newroundnum,newstate,room_num]);
        //console.log(result.rows);
        let round = result.rows[0]
        return { status: 200, result: round};
      } catch(err) {
        console.log(err);
        return { status: 500, result: err};
      }
  }

  module.exports.get_round = async function(playerid) {
    let sql = `select room_num, room_round_number , state_name , room_player_state_id , player_name
    from room , battle_states , player
    where room_player_id = $1 and room_player_state_id = state_id and room_player_id = player_id `  ;
      try{
        let result = await pool.query(sql,[playerid]);
        if(result.rows.length == 0){
          return { status: 400, result: { msg: "That player is not on a match" } };
        }
        return { status: 200, result: result.rows[0]};
      } catch(err) {
        console.log(err);
        return { status: 500, result: err};
      }
  }

  module.exports.change_player_state = async function(player_id,round,new_state){
    try{
      if(round == -1){
        let sql = `UPDATE room
            SET room_player_state_id = $1
            WHERE room_player_id = $2`

        await pool.query(sql,[new_state , player_id]);

      }else{
          let sql = `UPDATE room
            SET room_player_state_id = $1, 
            room_round_number = $2
            WHERE room_player_id = $3`

        await pool.query(sql,[new_state , round, player_id]);
      }
      


    }catch(err){
      console.log(err);
      return { status: 500, result: err};
    }
  }
  
  module.exports.end_round = async function(player_id) {
    try{
      let getsql =`select room_player_id,room_round_number from room
      where room_num = (select room_num as num from room where room_player_id = $1 ) and room_player_id != $1 `;

      let result = await pool.query(getsql,[player_id]);

      result.rows[0].room_round_number += 1

      /* let updatesql = `UPDATE room
                    SET room_player_state_id = 1 , 
                    room_round_number = $1
                    WHERE room_player_id = $2`

      
      let updatesql1 = `UPDATE room
                    SET room_player_state_id = 2 , 
                    room_round_number = $1
                    WHERE room_player_id = $2`
                    
      await pool.query(updatesql,[result.rows[0].room_round_number , player_id]);
      await pool.query(updatesql1,[result.rows[0].room_round_number, result.rows[0].room_player_id]);  */

      this.change_player_state(player_id, result.rows[0].room_round_number, 1)
      this.change_player_state(result.rows[0].room_player_id, result.rows[0].room_round_number, 2)

      let getsql1 = `select player_mana , player_total_mana , player_energy
                      from player where player_id = $1` 

      let player = await pool.query(getsql1,[result.rows[0].room_player_id]);

      if(player.rows[0].player_total_mana >= 10){
        player.rows[0].player_total_mana = 10
      }else{
        player.rows[0].player_total_mana += 1
      } 
      player.rows[0].player_energy = 3

      //pModel.player_information_change()
      let getsql2 = `UPDATE player
                    SET player_total_mana = $2 , 
                    player_mana = $2,
                    player_energy = $3
                    WHERE player_id = $1`

      await pool.query(getsql2,[result.rows[0].room_player_id,player.rows[0].player_total_mana,player.rows[0].player_energy]);
      dModel.drawCard(result.rows[0].room_player_id,false)

      for (var i = 0; i < pModel.activeCards.length; i ++){
        if(pModel.activeCards[i].turn >= 0 ){
          pModel.activeCards[i].turn -= 1

          //Fire Arrow
          if (pModel.activeCards[i].card === 6){
            pModel.enemy.player_health -= 1
          }

          //...

          //Layla Winifred Command
          if (pModel.activeCards[i].card === 12){
            pModel.activeCards[i].used = false
          }


          //REMOVE ROW
          if(pModel.activeCards[i].turn == 0 ){
            pModel.activeCards.slice(i, 1)
          }
        }
      }
      

      return { status: 200, result:{ msg: "Changed turn" }};
    } catch(err) {
      console.log(err);
      return { status: 500, result: err};
    }
}