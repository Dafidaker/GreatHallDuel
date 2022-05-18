var pool = require('./connection.js')


module.exports.get_deck = async function(playerid){
    let sql = 'select * from deck , card, type_range , type_cast ,card_state  where deck_card_state_id = card_state_id and card_type_range_id = type_range_id and card_type_cast_id = type_cast_id and deck_player_id = $1 and deck_card_id = card_id order by deck_order';
      try{
        let result = await pool.query(sql,[playerid]);
        console.log(result.rows);
        return { status: 200, result: result.rows }
      } catch(err) {
        console.log(err);
        return { status: 500, result:err }
      }
  }

  module.exports.deck_card_state_change = async function(ply_id, card_id, card_state_id) {
    try{
      sql = `UPDATE deck
            SET deck_card_state_id = $1
            WHERE deck_player_id = $2 and deck_card_id = $3`;
      console.log(sql)
      let result = await pool.query(sql,[card_state_id,ply_id,card_id]);
      console.log(result.rows);
      return { status: 200, result:result };
    } catch(err) {
      console.log(err);
      return { status: 500, result:err };
    }
}

module.exports.make_deck = async function(plyId) {
  let sql = 'select card_id from card';
    try{
      let result = await pool.query(sql);
      if(result.rows.length > 0){
        sql = `insert into deck (deck_player_id, deck_order, deck_card_id, deck_card_state_id) values`;

        for(let i = 0; i < result.rows.length; i++){
          if(i <= 3){
            sql += `($1, ${i+1}, ${result.rows[i].card_id},1)`;
          }else if (i > 3){
            sql += `($1, ${i+1}, ${result.rows[i].card_id},2)`;
          }
          
          console.log(sql)
          if(result.rows.length -1 == i){
            sql += `;`;
          } else{
            sql += `,`;
          }
        }
      }

      result = await pool.query(sql,[plyId]);
      return { status: 200, result: result };
    } catch(err) {
      console.log(err);
      return { status: 500, result:err };
    }
}

module.exports.get_cards = async function(){
  let sql = 'select * from card';
    try{
      let result = await pool.query(sql);
      console.log(result.rows);
      return { status: 200, result: result.rows }
    } catch(err) {
      console.log(err);
      return { status: 500, result: err }
    }
}

module.exports.use_card = async function(player_id,card, tile){
    try{
      //get enemy id 
      let getsql =`select room_player_id from room
      where room_num = (select room_num as num from room where room_player_id = $1 ) and room_player_id != $1 `;

      let result = await pool.query(getsql,[player_id]);

      let getsql1 = `select player_tile_id , player_health from player
      where player_id = $1 `;

      let result1 = await pool.query(getsql1,[result.rows[0].room_player_id]);

      if(card.id == 4 && tile.id == [result1.rows[0].player_tile_id]){
        result1.rows[0].player_health -= 4
      }

       let getsql2 = `UPDATE player
                    SET player_health = $1 
                    WHERE player_id = $2`

      await pool.query(getsql2,[result1.rows[0].player_health,result.rows[0].room_player_id]); 

    return { status: 200, result:result };
  } catch(err) {
    console.log(err);
    return { status: 500, result:err };
  }


}