async function register(player){
    try {
        const response = await fetch(`/api/players/register`,
        {
            //to do verify user information give erros 

            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({player_name : player.name, player_password : player.password}) 
        });
        var  result= await response.json();
        return {inserted: response.status==200 , result: result };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function getplayerinformation() {
    try {
        const response = await fetch(`/api/players/player_info`);
        if (response.status == 200) {
            
           var playerinfo = await response.json();
           
           if(playerinfo.result[0].player_id == playerinfo.player_id ){
               var playerindex = 0
               var enemyindex = 1
            }else if(playerinfo.result[1].player_id == playerinfo.player_id) {
                var playerindex = 1
                var enemyindex = 0
            }

           
            let playerif = {
                mana:playerinfo.result[playerindex].player_mana,
                mana_total:playerinfo.result[playerindex].player_total_mana,
                health:playerinfo.result[playerindex].player_health,
                energy:playerinfo.result[playerindex].player_energy,
                name:playerinfo.result[playerindex].player_name,
                id:playerinfo.result[playerindex].player_id,
                position:playerinfo.result[playerindex].player_tile_id}

            let enemyif = {
                mana:playerinfo.result[enemyindex].player_mana,
                mana_total:playerinfo.result[enemyindex].player_total_mana,
                health:playerinfo.result[enemyindex].player_health,
                energy:playerinfo.result[enemyindex].player_energy,
                name:playerinfo.result[enemyindex].player_name,
                id:playerinfo.result[enemyindex].player_id,
                position:playerinfo.result[enemyindex].player_tile_id}

            let effects = playerinfo.result_players_effects
            let effectsActive = effects.effects
        
            if(effectsActive == true ){
                let player_effects = []
                let enemy_effects = []

                

                for(let effect of effects.players_effects){
                    if(effect.player_effect_player_id == playerinfo.player_id) {player_effects.push(effect)}
                    if(effect.player_effect_player_id != playerinfo.player_id) {enemy_effects.push(effect)}
                }
                
                let a = 'aaaaa'

                return{ playerif: playerif , enemyif: enemyif, effectsActive: effectsActive , player_effects: player_effects , enemy_effects: enemy_effects};
            
            }else if (effectsActive == false ){
                
                return{ playerif: playerif , enemyif: enemyif, effectsActive: effectsActive };
            } 


        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
} 

/* async function ChangePlayerInfo(id,health,total_mana,mana,energy) {
    try {
        
        const response = await fetch('/api/players/player_information_change',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ ply_id: id, ply_health: health, ply_total_mana: total_mana, ply_mana: mana,ply_energy: energy }) 
        });
        if (response.status == 200) {
           var  result = await response.json();
           console.log('player change' + result);
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
} */

async function getplayersposition() {
    try {
        const response = await fetch(`api/players/player_tile`);
        if (response.status == 200) {
           let result = await response.json();
           
           let player_tile = result.player.resultPlayer.player_tile_id
           let enemy_tile = result.enemy.resultEnemy.player_tile_id

           
           return{player_tile , enemy_tile}
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
} 

/* async function ChangePlayerPosition(id,position) {
    try {
        
        const response = await fetch('api/players/player_location_change',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ply_id: id, player_tile: position}) 
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
} */

/* async function Play(id,room_id,round_number,play_num,play_tp_id,play_tile_id,play_state_id) {
    try {
        
        const response = await fetch('api/players/play',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ player_id: id, room_id: room_id, round_number: round_number, 
                                    play_num: play_num, play_tp_id: play_tp_id, play_tile_id:play_tile_id,
                                    play_state_id:play_state_id}) 
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
} */

/* async function GetPlays(player_id) {
    try {
       const response = await fetch(`api/players/getplays/${player_id}`);
       if (response.status == 200) {
           AllPlays = await response.json();
       

          /* MaxPlays = JSON.stringify(AllPlays[0].play_num)
           for( i = 0 ; i <= MaxPlays-1 ; i++){
             Plays[JSON.stringify(AllPlays[i].play_num)]= {
               type: JSON.stringify(AllPlays[i].play_tp_id),
               player: JSON.stringify(AllPlays[i].play_player_id),
               num: JSON.stringify(AllPlays[i].play_num),
               card: JSON.stringify(AllPlays[i].play_card_id),
               tile: JSON.stringify(AllPlays[i].play_tile_id),
               round: JSON.stringify(AllPlays[i].play_round_number)
           
           } 
           print(Plays[0].type) 
       
           
          
        }else {
           // Treat errors like 404 here
           console.log(response);
       }
   } catch (err) {
       // Treat 500 errors here
       console.log(err);
   } 
}  */

async function login(name, password) {
    try {
        const response = await fetch(`api/players/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ player_name: name, player_password: password}) 
        });
        var  result= await response.json();
        console.log(result)
        return {logged: response.status  , result: result };

    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function reset(){
    try {
        const response = await fetch(`api/players/reset`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: null
        });
        if (response.status == 200) {
            var  result= await response.json();
            //print(result);
         } else {
             // Treat errors like 404 here
             console.log(response);
         }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function requestAction(data) {
    try {
        const response = await fetch(`/api/players/action`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          method: "POST",
          body: JSON.stringify(data)
        });
        var result = await response.json();
        return result;
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function requestEndTurn() {
    return await requestAction({action: "endTurn"});
}

async function requestPlayCard(card,tile) {
    return await requestAction({card: card, tile: tile, action:"playCard"});
}        

async function requestMove(tile) {
    return await requestAction({tile: tile, action: "move"});
}        

async function requestDrawCard() {
    return await requestAction({action: "drawCard"});
}

async function requestDiscardCard(card) {
    return await requestAction({card:card, action: "discardCard"});
}

async function requestBasicAttack(tile) {
    return await requestAction({tile: tile , action: "basicAttack"});
}