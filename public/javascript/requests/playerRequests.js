async function getplayerinformation(player_id) {
    try {
        const response = await fetch(`api/players/player_info/${player_id}`);
        if (response.status == 200) {
           var playerinfo = await response.json();
           if(playerinfo[0].player_id == player_id ){
               var playerindex = 0
               var enemyindex = 1
            }else if(playerinfo[1].player_id == player_id) {
                var playerindex = 1
                var enemyindex = 0
            }
                console.log('playerindex' + playerindex)
                console.log('enemyindex' + enemyindex)

           
           playerif = {
            mana:playerinfo[playerindex].player_mana,
            mana_total:playerinfo[playerindex].player_total_mana,
            health:playerinfo[playerindex].player_health,
            energy:playerinfo[playerindex].player_energy,
            num:playerinfo[playerindex].player_num}

            enemyif = {
                mana:playerinfo[enemyindex].player_mana,
                mana_total:playerinfo[enemyindex].player_total_mana,
                health:playerinfo[enemyindex].player_health,
                energy:playerinfo[enemyindex].player_energy,
                num:playerinfo[enemyindex].player_num}
        

           return playerif , enemyif ;
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
} 

async function ChangePlayerInfo(id,health,total_mana,mana,energy) {
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
           var  result= await response.json();
           console.log('player change' + result);
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function getplayersposition(player_id) {
    try {
        const response = await fetch(`api/players/player_tile/${player_id}`);
        if (response.status == 200) {
           playersposition = await response.json();
           if (playerif.num == 1) {
            player_tile = playersposition[0].player_tile_id
            enemy_tile = playersposition[1].player_tile_id

           }else {
            player_tile = playersposition[1].player_tile_id
            enemy_tile = playersposition[0].player_tile_id
           }
           /* print('players position '+ playersposition[0].player_tile_id);
           print('players position '+ playersposition[1].player_tile_id); */
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
} 

async function ChangePlayerPosition(id,position) {
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
}

async function Play(id,room_id,round_number,play_num,play_tp_id,play_tile_id,play_state_id) {
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
}

async function GetPlays(player_id) {
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
           print(Plays[0].type) */
       
           
          
        }else {
           // Treat errors like 404 here
           console.log(response);
       }
   } catch (err) {
       // Treat 500 errors here
       console.log(err);
   } 
} 

async function login(name, password) {
    try {
        const response = await fetch(`/api/players/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ player_name: name, player_password: password}) 
        });
        var  result= await response.json();
        console.log(result)
        return {logged: response.status=200 , result: result };

    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}