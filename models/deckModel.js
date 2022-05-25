var pool = require('./connection.js')
var pModel = require("../models/playersModel");


module.exports.get_deck = async function(playerid){
    let sql = 'select * from deck , card, type_range , type_cast ,card_state  where deck_card_state_id = card_state_id and card_type_range_id = type_range_id and card_type_cast_id = type_cast_id and deck_player_id = $1 and deck_card_id = card_id order by deck_order';
      try{
        let result = await pool.query(sql,[playerid]);
        //console.log(result.rows);
        return { status: 200, result: result.rows }
      } catch(err) {
        console.log(err);
        return { status: 500, result:err }
      }
  }

  module.exports.get_deck_card = async function(playerid,card){
    let sql = `select  *
    from deck ,card  
    where deck_player_id = $1 and 
    deck_card_id = $2 and card_id = deck_card_id  `;
      try{
        let result = await pool.query(sql,[playerid,card]);
        //console.log(result.rows);
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
      //console.log(sql)
      let result = await pool.query(sql,[card_state_id,ply_id,card_id]);
      //console.log(result.rows);
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
          
          //console.log(sql)
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
      //console.log(result.rows);
      return { status: 200, result: result.rows }
    } catch(err) {
      console.log(err);
      return { status: 500, result: err }
    }
}

module.exports.get_a_card = async function(id){
  let sql = 'select * from card where card_id = $1';
    try{
      let result = await pool.query(sql,[id]);
      //console.log(result.rows);
      return { status: 200, result: result.rows }
    } catch(err) {
      console.log(err);
      return { status: 500, result: err }
    }
}

/* module.exports.use_card = async function(player_id,card, tile){
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
} */

module.exports.drawCard = async function(player_id) {
  try{
    let result = await this.get_deck(player_id)
    let deck = result.result

    let result1 = await pModel.getPlayerInfo(player_id);
    let player = result1.result[0]

    if(player.player_mana >= 2 ){
      for(let row of deck){
      if(row.deck_card_state_id == 2 ){
        this.deck_card_state_change(player_id,row.deck_card_id,1)
        player.player_mana -= 2
        pModel.player_information_change(player.player_health,
        player.player_mana,
        player.player_total_mana,
        player.player_energy,
        player.player_id)
        
        return { status: 200, result:{msm : "the player got the card"} } }
      }
      
    }
    
    return { status: 400, result:{msm : "the player doesnt have enough mana"} };
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.discardCard = async function(player_id,card_id) {
  try{
    let result = await this.get_deck(player_id)
    let deck = result.result
    let cardRow

    for(let row of deck){
      if ( row.deck_card_id == card_id && row.deck_card_state_id == 1){
          cardRow = row 
      } 
    }

  let newOrder = Math.floor(Math.random() * (deck.length - 6 + 1) + 6) // deck max is the maximum , 6 is the minimum -- new order for the card in the deck

  //console.log("order" +newOrder +'\n' + 'deck id ' + cardRow.deck_id)

  let sql= `UPDATE deck
            SET deck_order = $1
            WHERE deck_id = $2`
    
  await pool.query(sql,[newOrder,cardRow.deck_id])
  await this.deck_card_state_change(player_id,cardRow.deck_card_id,2)

  for(let row of deck){

    if(row.deck_id != cardRow.deck_id){

      if ( (row.deck_order > cardRow.deck_order) && (row.deck_order <= newOrder)){

      row.deck_order -=1

      }
      await pool.query(sql,[row.deck_order,row.deck_id])
    }
    
  }
  
  return { status: 200, result:{msm : "card was discarded"} } ;
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.destroyDeck = async function(player_id) {
  try{
    let sql = `DELETE FROM deck  WHERE deck_player_id = $1 `
    
    await pool.query(sql,[player_id])

    return { status: 200, result:{msm : "deck was destroyed"} };
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}