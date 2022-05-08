var pool = require('./connection.js')
    
module.exports.loginCheck = async function (name,password) {
    try {
      let sql = `select player_id from player where player_name = $1 and player_password = $2`;
      let result = await pool.query(sql,[name,password]);
      console.log(name)
      console.log(password)
      if (result.rows.length == 0) {
          return { status: 401, result: {msg: "Wrong password or username."}}
      }
      let ply_id = result.rows[0].player_id;
      console.log(ply_id);
      return { status: 200, result: {msg: "Login correct", userId : ply_id} };
    } catch (err) {
      console.log(err);
      return { status: 500, result: err };
    }
  }

  module.exports.getLoggedUserInfo = async function (playerId) {
    try {
        let sql = `select player_name from player where ply_id = $1`;
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


  module.exports.registerPlayer = async function(player) {
    try  {
      let sql = "insert into player(player_name,player_password) values ($1,$2)";
      let result = await pool.query(sql,[player.name, player.password]); 
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
        console.log(result.rows);
        return {status:200 , result : result};
      } catch(err) {
        console.log(err);
        return {status:500 , result : err};
      }
  }


   module.exports.get_player_info =  async function(player_id) {
    let sql = 'select * from player, room  where room_player_id = $1  order by player_num asc'
      try{
        let result = await pool.query(sql,[player_id])
        console.log(result.rows);
        


        return {status:200 , result: { result:result.rows,  player_id: player_id } };
      } catch(err) {
        console.log(err);
        return {status:500 , result : err};
      }
  } 

  module.exports.player_tile = async function(playerid) {
    let sql = `select player_tile_id , player_num
                from room , player ,
                (select room_num as the_room from room where room_player_id = $1 ) temptable1
                where room_num = the_room and player_id = room_player_id
                order by player_num asc`
      try{
        let result = await pool.query(sql,[playerid])
        console.log(result.rows);
        return {status:200 , result : result.rows};
      } catch(err) {
        console.log(err);
        return {status:500 , result : err};
      }
  }

  module.exports.player_location_change = async function(player_tile, ply_id) {
    sql = `UPDATE player
           SET player_tile_id = $1
           WHERE player_id = $2`;
    try{
      let result = await pool.query(sql,[player_tile,ply_id]);
      console.log(result.rows);
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
      console.log(result.rows);
      return {status:200 , result : result};
    } catch(err) {
      console.log(err);
      return {status:500 , result : err};
    }
}