async function getplayerdeck(player_id) {
    try {
        const response = await fetch(`/api/deck/get_deck/${player_id}`);
        if (response.status == 200) {
           var playerdeck = await response.json();
           //print(playerdeck);
           //print(playerdeck.length)
           for(i = 0; i < playerdeck.length; i++){
                playerdk[i] = {
                    card_id: playerdeck[i].deck_card_id,
                    card_name : playerdeck[i].card_name,
                    card_state: playerdeck[i].card_state_name,
                    card_state_id: playerdeck[i].deck_card_state_id,
                    card_mana_cost: playerdeck[i].card_mana,
                    card_range: playerdeck[i].card_range,
                    card_type_range_id: playerdeck[i].card_type_range_id,
                    card_type_range: playerdeck[i].type_range_name,
                    card_cast : playerdeck[i].type_cast_name
                    
                }
           }
           print(playerdk)
           return playerdeck ;
           //print('num of cards per deck' + Object.keys(playerdk).length)
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
} 

async function ChangeCardState(id,card,newstate) {
    try {
        
        const response = await fetch('api/deck/deck_card_state_change',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ply_id: id, card_id:card, card_state_id:newstate}) 
        });
        if (response.status == 200) {
           var  result= await response.json();
           print(result);
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function MakeDeck(player_id) {
    try {
        const response = await fetch(`api/deck/makedeck/${player_id}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            //body: JSON.stringify({ plyId: player_id}) 
        });
        if (response.status == 200) {
           var  result= await response.json();
           print(result);
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function getallcards() {
    try {
        const response = await fetch(`/api/deck/get_cards`);
        if (response.status == 200) {
           var allcards = await response.json();
           
           print(allcards)
           return allcards ;
           //print('num of cards per deck' + Object.keys(playerdk).length)
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
} 