async function ChangeRound_Num_State(room_num,newroundnum,newstate) {
    try {
        
        const response = await fetch('api/round/change_round_number',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({newstate: newstate, newround:newroundnum, room_num:room_num}) 
        });
        if (response.status == 200) {
            //getBattleRound()
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

async function getBattleRound(player_id) {
    try {
        //console.log('request');
        const response = await fetch(`api/round/round_number/${player_id}`);
        if (response.status == 200) {
            //console.log('request 2');
            let battleRound = await response.json();
            //console.log(battleRound)
            
           Round = {
                State :battleRound[0].room_state_id , 
                Number : battleRound[0].room_round_number,
                String : 'Turn ' + (battleRound[0].room_round_number) + ' - '  + (battleRound[0].state_name),
                PlayerState: battleRound[0].room_player_state_id
           }
           RoomNum = battleRound[0].room_num   

           return {Round , RoomNum}; 
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}   

async function nextRound(){
    try {
        const response = await fetch('api/round/next_round',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: null 
        });
        if (response.status == 200) {
            //getBattleRound()
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