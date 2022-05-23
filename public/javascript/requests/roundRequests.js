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

async function getBattleRound() {
    try {
        //console.log('request');
        const response = await fetch(`api/round/round_number`);
        if (response.status == 200) {
            
            let battleRound = await response.json();
            
            Round = {
                //State :battleRound.room_state_id , 
                Number : battleRound.room_round_number,
                
                String: {StringNum : 'Turn ' + (battleRound.room_round_number) ,
                        StringState : (battleRound.player_name)  + '  ' +(battleRound.state_name)},

                PlayerState: battleRound.room_player_state_id
            }

            //console.log(StringNum  + ' ' +StringState )
            RoomNum = battleRound.room_num   

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