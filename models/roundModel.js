var pool = require('./connection.js')

module.exports.change_round_number = async function(room_num,newroundnum,newstate) {
      try{
        sql = `UPDATE room
              SET room_round_number = $1,
              room_state_id = $2
  
              WHERE room_num = $3`;
  
        let result = await pool.query(sql,[newroundnum,newstate,room_num]);
        console.log(result.rows);
        let round = result.rows[0]
        return { status: 200, result: round};
      } catch(err) {
        console.log(err);
        return { status: 500, result: err};
      }
  }

  module.exports.get_round = async function(playerid) {
    let sql = `select room_state_id ,room_num, room_round_number , state_name , room_player_state_id
                from room , battle_states
                where room_player_id = $1 and room_state_id = state_id `  ;
      try{
        console.log('model');
        let result = await pool.query(sql,[playerid]);
        console.log(result.rows);
        return { status: 200, result: result.rows};
      } catch(err) {
        console.log(err);
        return { status: 500, result: err};
      }
  }

  module.exports.next_round = async function(player_id) {
    try{
      let getsql =`select room_player_id,room_round_number from room
      where room_num = (select room_num as num from room where room_player_id = $1 ) and room_player_id != $1 `;

      let result = await pool.query(getsql,[player_id]);

      result.rows[0].room_round_number += 1

      console.log(' 1111' + result.rows[0].room_round_number)

      let updatesql=`UPDATE room
                    SET room_player_state_id = 1 , 
                    room_round_number = $2
                    WHERE room_player_id = $1`

      
      let updatesql1 =`UPDATE room
                    SET room_player_state_id = 2 , 
                    room_round_number = $1
                    WHERE room_player_id = $2`
                    
      /* let result1 =  */await pool.query(updatesql,[player_id,result.rows[0].room_round_number]);
      /* let result2 =  */await pool.query(updatesql1,[result.rows[0].room_round_number,result.rows[0].room_player_id]); 



      let getsql1 = `select player_mana , player_total_mana , player_energy
                      from player where player_id = $1` 

      let player = await pool.query(getsql1,[result.rows[0].room_player_id]);

      player.rows[0].player_total_mana += 1
      player.rows[0].player_energy = 3

      console.log('aaaaaaaaaaaaaaa ' + JSON.stringify(player.rows))

      let getsql2 = `UPDATE player
                    SET player_total_mana = $2 , 
                    player_mana = $2,
                    player_energy = $3
                    WHERE player_id = $1`

      /* let player1 =  */await pool.query(getsql2,[result.rows[0].room_player_id,player.rows[0].player_total_mana,player.rows[0].player_energy]);

      

      //console.log(result.rows);
      return { status: 200, result:{ msg: "Changed turn" }};
    } catch(err) {
      console.log(err);
      return { status: 500, result: err};
    }
}