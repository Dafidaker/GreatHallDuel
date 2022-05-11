//const { all } = require("express/lib/application");


var Cards 

class GameManager {
    constructor(cards){
        this.cards = [] 
        this.cards = cards 
    }

    static async createcards(){
        //const card1 = new Card('aaaa',1);

        
        let playerdeck = null;
        playerdeck = await getplayerdeck(1);
       
        for (let row of playerdeck){
            this.cards.push (new Card(row.card_name,row.deck_card_id,false,row.deck_order,row.card_state_id,row.card_mana,row.card_range,row.card_type_range,row.card_type_cast))
            print('card_id'+ row.card_id)
        }
        
    }
    static draw(){
        //print('Cards' + JSON.stringify(Cards[1]))
        /* if(Cards){
                for(let card of this.cards){
                print(card.state)
            card.draw()
                } 
        }  */
    }
}