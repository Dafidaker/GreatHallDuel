async function createRoom(){
    try {
        const response = await fetch(`api/rooms/create_room`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: null
        });
        if (response.status == 200) {
            var  result= await response.json();
            menuState = waitingState
         } else {
             // Treat errors like 404 here
             console.log(response);
         }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function joinRoom(room_num){
    try {
        const response = await fetch(`api/rooms/join_room`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({room_num :room_num })
        });
         if (response.status == 200) {
            var result= await response.json();
            
         } else {
             // Treat errors like 404 here
             console.log(response);
         } 
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function checkRoomFull(){
    try {
        const response = await fetch(`api/rooms/check_room_full`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: null
        });
        let string
        if (response.status == 200) {
            var  result= await response.json();
            if( result.numPlayers == 2 ){
                menuState = fullRoomState
                string = 'In room nº ' +result.room_num + ' with '+ result.numPlayers + '/2'
            }
            if( result.numPlayers == 1 ){
                menuState = waitingState
                string = 'In room nº ' +result.room_num + ' with '+ result.numPlayers + '/2'
            }
            if( result.numPlayers == 0 ){
                menuState = basicState
                string = 'Isn`t in a room'
            }
            return{result , string} 
         } else {
             // Treat errors like 404 here
             console.log(response);
         }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}