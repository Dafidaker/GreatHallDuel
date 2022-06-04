var pool = require('./connection.js')
var pModel = require("../models/playersModel");


module.exports.get_deck = async function(playerid,type_of_deck){
      try{
        let sql = `select * from deck , card, type_range , type_cast ,card_state  
                    where deck_card_state_id = card_state_id and
                    card_type_range_id = type_range_id and 
                    card_type_cast_id = type_cast_id and 
                    deck_player_id = $1 and 
                    deck_card_id = card_id order by deck_order`;
        
        let result = await pool.query(sql,[playerid]);

        //all
        if(type_of_deck == 'all'){
          let deck = result.rows
          return { status: 200, result: deck }
        }
      
        //not_active 
        if(type_of_deck == 'non_active'){
          let deck_not_actives = result.rows
          for(i=0 ; i < deck_not_actives.length ; i++){
            if(deck_not_actives[i].deck_card_state_id == 3){
              deck_not_actives.splice(i,1)
              i--
            }
          }
          return { status: 200, result: deck_not_actives }
        }

        //active
        if(type_of_deck == 'active'){
          let deck_actives = result.rows
          for(i=0 ; i < deck_actives.length ; i++){
            if(deck_actives[i].deck_card_state_id != 3){
              deck_actives.splice(i,1)
              i--
            }
          }
          return { status: 200, result: deck_actives }
        }
        

        //console.log(result.rows);
        
      } catch(err) {
        console.log(err);
        return { status: 500, result:err }
      }
  }

module.exports.get_deck_card = async function(playerid,card){
    try{
      let sql = `select  *
                from deck ,card  
                where deck_player_id = $1 and 
                deck_card_id = $2 and card_id = deck_card_id  `;
      let result = await pool.query(sql,[playerid,card]);
      return { status: 200, result: result.rows }

    } catch(err) {
      console.log(err);
      return { status: 500, result:err }
    }
}

module.exports.change_deck_card_information = async function(card_state_id,card_order,card_turns,card_enable, player_id, card_id ) {
  try{
    sql = `UPDATE deck
          SET deck_card_state_id = $1,
          deck_order = $2,
          deck_card_turns = $3, 
          deck_card_enable = $4
          WHERE deck_player_id = $5 and deck_card_id = $6`;

    await pool.query(sql,[card_state_id,card_order,card_turns,card_enable,player_id,card_id]);

    return { status: 200, result:{msm : "the card" +{card_id}+" information was updated"} };
  } catch(err) {
    console.log(err);
    return { status: 500, result:err };
  }
}

module.exports.make_deck = async function(player_id) {
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

      result = await pool.query(sql,[player_id]);
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

module.exports.draw_card = async function(player_id,manaNeeded) {
  try{
    let result = await this.get_deck(player_id,'all')
    let deck = result.result

    let player = await pModel.get_player_info(player_id,1);
    //let player = result1.result[0]

    if(manaNeeded == true){
      if(player.player_mana >= 2 ){
        for(let row of deck){
          if(row.deck_card_state_id == 2 ){
            //this.deck_card_state_change(player_id,row.deck_card_id,1)
            this.change_deck_card_information(1,row.deck_order,row.deck_card_turns,row.deck_card_enable,player_id,row.deck_card_id)

            player.player_mana -= 2
            pModel.player_information_change(player.player_health,
            player.player_mana,
            player.player_total_mana,
            player.player_energy,
            player.player_id)
            
            return { status: 200, result:{msm : "the player got the card"} } }
        }
      
      }
    }else if (manaNeeded == false){
      for(let row of deck){
        if(row.deck_card_state_id == 2 ){
          this.change_deck_card_information(1,row.deck_order,row.deck_card_turns,row.deck_card_enable,player_id,row.deck_card_id)
          return { status: 200, result:{msm : "the player got the card"} }
        }      
      }
    }
    
    
    return { status: 400, result:{msm : "the player doesnt have enough mana"} };
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.discard_card = async function(player_id,card_id) {
  try{
    console.log(` \\\\\\\\\\\\\ \n CARD DISCARDED \n \\\\\\\\\\\\\ `);
    let result = await this.get_deck(player_id,'non_active')
    let deck = result.result
    let cardRow

    for(i=0 ; i < deck.length ; i++){
      if ( deck[i].deck_card_id == card_id && deck[i].deck_card_state_id == 1){
        cardRow = deck[i] 
      } 
      /* if(deck[i].deck_card_state_id == 3){
        deck.splice(i,1)
        i--
      } */
    }

  let newOrder = Math.floor(Math.random() * (deck.length - 7 + 1) + 7) // deck max is the maximum , 6 is the minimum -- new order for the card in the deck

  //console.log("order" +newOrder +'\n' + 'deck id ' + cardRow.deck_id)

 /*  let sql= `UPDATE deck
            SET deck_order = $1
            WHERE deck_id = $2`
    
  await pool.query(sql,[newOrder,cardRow.deck_id]) */
  //await this.deck_card_state_change(player_id,cardRow.deck_card_id,2)
  await this.change_deck_card_information(2,newOrder,cardRow.deck_card_turns,cardRow.deck_card_enable,player_id,cardRow.deck_card_id)


  for(let row of deck){

    if(row.deck_id != cardRow.deck_id){

      if ( (row.deck_order > cardRow.deck_order) && (row.deck_order <= newOrder)){

      row.deck_order -=1

      }
      await this.change_deck_card_information(row.deck_card_state_id,
                                              row.deck_order,
                                              row.deck_card_turns,
                                              row.deck_card_enable,
                                              player_id,
                                              row.deck_card_id)
    }
    
  }
  
return { status: 200, result:{msm : "card was discarded"} } ;
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.discard_active_card = async function(player_id,card_id) {
  try{
    console.log(` \\\\\\\\\\\\\ \n ACTIVE CARD DISCARDED \n \\\\\\\\\\\\\ `);
    let result = await this.get_deck(player_id,'all')  //because i grab the active that im discading then remove all the other actives 
    let deck = result.result
    let cardRow

    for(let row of deck){
      if ( row.deck_card_id == card_id && row.deck_card_state_id == 3){
          cardRow = row 
      } 
      if(row.deck_card_state_id == 3 ){
        deck.splice(deck.indexOf(row),1) // see if it works
      }
    }

    let newOrder = Math.floor(Math.random() * (deck.length - 6 + 1) + 6) // deck max is the maximum , 6 is the minimum -- new order for the card in the deck


    await this.change_deck_card_information(2,
                                            newOrder,
                                            cardRow.deck_card_turns,
                                            cardRow.deck_card_enable,
                                            player_id,
                                            cardRow.deck_card_id)


    for(let row of deck){

      if(row.deck_id != cardRow.deck_id){

        if ( (row.deck_order >= newOrder) ){

        row.deck_order +=1

        }
        await this.change_deck_card_information(row.deck_card_state_id,
                                                row.deck_order,
                                                cardRow.deck_card_turns,
                                                cardRow.deck_card_enable,
                                                player_id,
                                                cardRow.deck_card_id)
      }
      
    }
    
    return { status: 200, result:{msm : "active card was discarded"} } ;
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.activate_card = async function(player_id,card_id) {
  try{
    console.log(` \\\\\\\\\\\\\ \n CARD ACTIVATED \n \\\\\\\\\\\\\ `);
    let result = await this.get_deck(player_id,'all')
    let deck = result.result
    let cardRow
    let lowestCardOrder = 0

    for(let row of deck){
      if ( row.deck_card_id == card_id && row.deck_card_state_id == 1){
          cardRow = row 
      } 
      if(row.deck_order < lowestCardOrder){lowestCardOrder = row.deck_order } 
    }

    cardRow = await this.active_card_information(cardRow) //will add the information depending on the active card 
  
    await this.change_deck_card_information(3,lowestCardOrder-1,cardRow.deck_card_turns,cardRow.deck_card_enable,player_id,cardRow.deck_card_id) // see if it works
  


    for(let row of deck){

      if(row.deck_id != cardRow.deck_id){

        if ( (row.deck_order > cardRow.deck_order) ){

        row.deck_order -=1

        }
        await this.change_deck_card_information(row.deck_card_state_id,row.deck_order,row.deck_card_turns,row.deck_card_enable,player_id,row.deck_card_id) // see if it work
      }
      
    }
    
    return { status: 200, result:{msm : "card was activated"} } ;

  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }

}

module.exports.active_card_information = async function(card){ 
  //used to add to the cards the information to be activated
  if(card.card_id == 1){
    card.deck_card_turns = -1
  }

  if(card.card_id == 5){
    card.deck_card_turns = 1
  }

  if(card.card_id == 6){
    card.deck_card_turns = 3
  }

  /* if(card.card_id == 7){ //Rain Song
    card.deck_card_turns = -1
    
  } */

  if(card.card_id == 8){
    card.deck_card_turns = 3
  }

  if(card.card_id == 9){
    card.deck_card_turns = -1
  }

  if(card.card_id == 10){
    card.deck_card_turns = -1
  }

  if(card.card_id == 12){
    card.deck_card_turns = 4
  }

  if(card.card_id == 13){
    card.deck_card_turns = -1
  }

  card.deck_card_enable = true 
  return card

}

module.exports.change_card_with_active_cards =async function(player_id,card){
//just change the card information and return it 

  let result = await this.get_deck(player_id,'active')
  let deck =  result.result
 /*  for(i=0 ; i < deck.length ; i++){
    if(deck[i].deck_card_state_id != 3){
      deck.splice(i,1)
      i--
    }
  } */

  for (var i = 0; i < deck.length; i ++){
    if(deck[i].deck_card_enable == true){

      //Layla Winifred Help
      if (deck[i].deck_card_id === 1) {
        card.card_mana -= 2
      }

      //Kazamir’s order
      if (deck[i].deck_card_id === 9){
        card.card_dam += 2
      }

      //Layla Winifred Command
      if (deck[i].deck_card_id === 12){
          card.card_mana -= 1
      }

      //Kazamir Blessing 
      if (deck[i].deck_card_id === 13){
        card.card_dam += 1
      }
      
    }
    
  } 

  return card

}

module.exports.update_active_cards_information =async function(player_id,card){
  //change the information of the active cards and upadating the database
  
    let deck = await this.get_deck(player_id,'active')
  
    /* for(i=0 ; i < deck.length ; i++){
      if(deck[i].deck_card_state_id != 3){
        deck.splice(i,1)
        i--
      }
    } */
  
    for (var i = 0; i < deck.length; i ++){
      if(deck[i].deck_card_enable == true){
  
        //Layla Winifred Help
        if (deck[i].deck_card_id === 1) {
          this.discard_active_card(player_id,deck[i].deck_card_id)
        }

        //Layla Winifred Command
        if (deck[i].deck_card_id === 12){
          deck[i].deck_card_enable = false
        }
        
        //if the card is a ability
        if(card.card_id == 3 || card.card_id == 4 
          || card.card_id == 6 || card.card_id == 9
          || card.card_id == 11 || card.card_id == 14
          || card.card_id == 15){

          //Kazamir’s order
          if (deck[i].deck_card_id === 9){
            this.discard_active_card(player_id,deck[i].deck_card_id)

          }

          //Kazamir Blessing 
          if (deck[i].deck_card_id === 13){
            //nothing
          }

        }

        this.change_deck_card_information(deck[i].deck_card_state_id,
                                          deck[i].deck_order,
                                          deck[i].deck_card_turns,
                                          deck[i].deck_card_enable,
                                          player_id,
                                          card.card_id)
        
      }
      
    } 
  
    
  
  }

module.exports.destroy_deck = async function(player_id) {
  try{
    let sql = `DELETE FROM deck  WHERE deck_player_id = $1 `
    
    await pool.query(sql,[player_id])

    return { status: 200, result:{msm : "deck was destroyed"} };
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.update_information_of_deck_card = async function(player_id,deck_id,) {
  try{
    let sql = `DELETE FROM deck  WHERE deck_player_id = $1 `
    
    await pool.query(sql,[player_id])

    return { status: 200, result:{msm : "deck was destroyed"} };
  } catch(err) {
    console.log(err);
    return { status: 500, result: err};
  }
}