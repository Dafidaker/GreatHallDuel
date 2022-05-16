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

  module.exports.next_round = async function(room_num,newroundnum,newstate) {
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