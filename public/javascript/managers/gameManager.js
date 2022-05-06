//const { all } = require("express/lib/application");


var Cards 

class GameManager {

    static async createcards(){
        //const card1 = new Card('aaaa',1);

        var Cards = []
        let playerdeck = null;
        playerdeck = await getplayerdeck(1);
       
        for (let row of playerdeck){
            let a = row.card_id
            a = new Card(row.card_name,row.deck_card_id,false,row.deck_order,row.card_state_id,row.card_mana,row.card_range,row.card_type_range,row.card_type_cast)
            print('card_id'+ row.card_id)
            Cards.push(a)

        }

        print('Cards' + JSON.stringify(Cards[1]))
        /* for(let card of Cards){
            card.draw()
        }  */ 
    }
}