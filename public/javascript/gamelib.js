const canvasWidth = 1920;
const canvasHeight = 1080

var playerInfo
var enemyInfo

var playerDeck = []

var boardTiles = []

var gameState = 1
const basicState = 0
const myRoundState = 1
    const movingState = 1.1
    const playingCardState = 1.2
const enemyState = 2
    const counterState = 2.1

let selectedCard
let selectedPlayer
let selectedTile

function preload() {

}

async function setup() {
    noLoop();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('game');
    textFont('Dogica Pixel')  
    createboard()
    await createDeck()
    await createPlayers()
    loop();
}

async function createDeck(){
    let deck = await getplayerdeck(1);
    playerDeck = [];
    for (let row of deck){
        ///if (row.card_state_id == 1)  // posible use to turn a variable (enabled) true 
        playerDeck.push(new Card(row.card_name,row.deck_card_id,
                                false,row.deck_order,
                                row.card_state_id,row.card_mana,
                                row.card_range,row.card_type_range_id
                                ,row.card_type_cast_id,
                                (row.deck_order*150),400))
        
    }
}

async function createPlayers(){
    let playerif =  (await getplayerinformation()).playerif
    let enemyif =  (await getplayerinformation()).enemyif
    let playerPos = await receiveObject(boardTiles, playerif.position)
    let enemyPos = await receiveObject(boardTiles, enemyif.position)

    playerInfo = []
    playerInfo.push(new Player(playerif.name,playerif.id,
                    false,
                    playerif.position,playerif.mana,
                    playerPos.x,playerPos.y,
                    playerif.health,playerif.mana_total,
                    playerif.energy,playerif.num,true))
    //print('playerInfo'+ JSON.stringify(playerInfo))
    

    enemyInfo = []
    enemyInfo.push(new Player(enemyif.name,enemyif.id,
                                false,
                                enemyif.position,enemyif.mana,
                                enemyPos.x,enemyPos.y,
                                enemyif.health,enemyif.mana_total,
                                enemyif.energy,enemyif.num,false))
    //print('enemyInfo'+ JSON.stringify(enemyInfo))
   
}

function createboard(){
    let YOffSet = 400 
    let XOffSet = ((9*60)/2)+60 // number of columns * width / half of the whole square 
    let i = 1
    boardTiles = []
    if(i < 82){
        for (var r = 1 ; r < 10 ; r= r + 1){
            for (var c = 1 ; c < 10 ; c = c + 1){
                boardTiles.push ( new Board(i,false,
                                        false,
                                        (canvasWidth/2)+(c*60) - XOffSet,
                                        (canvasHeight/2)+(r*60) - YOffSet,
                                        r,c))

                i = i + 1 ;

            }
        }  
    }
}


function draw() {
    background(220); 
    scale(1)
    
    textSize(20)
    fill(0,0,0)
    text(gameState,100,100)


    for(let tile of boardTiles){
        tile.draw()
    }
    for(let card of playerDeck){
        card.draw()
    }
    
    for(let player of playerInfo){
        player.draw()
    }

    for(let enemy of enemyInfo){
        enemy.draw()
    }

}

function mouseClicked(){
    if ( gameState == myRoundState || gameState == movingState || gameState == playingCardState || gameState == counterState ){
       
        /* selectedCard = null
        selectedTile = null 
        selectedPlayer = null 
 */
        let selected = false 

        //let isSelected = 0 

    
        for(let card of playerDeck){

            if( playerInfo[0].mana >= card.mana ) {

                card.click(mouseX,mouseY);
                if (card.selected == true) {
                    selected = true
                    //isSelected =+ 1
                    selectedCard = card
                }

            //}else if ( playerInfo[0].mana <= card.mana){

                //alert('Not enough Mana')

            }
            
        }

    
        for(let player of playerInfo){
            
            //player.click(mouseX,mouseY)
            
            if(player.energy >= 1) {

                player.click(mouseX,mouseY)
                
                if (player.selected == true) {
                    //isSelected =+ 1
                    selected = true
                    selectedPlayer = player
                }
            }

            if(player.energy <= 0){

                if(gameState == movingState) gameState = myRoundState

            }

            
        }
            

        


        for(let tile of boardTiles){
            tile.click(mouseX,mouseY)
            
            if(tile.selected == true){
                selectedTile = tile 
                if(tile.highlighted == true){
                if(tile.id != enemyInfo.tileIndex){
                   makePlay(); 
                }
                (gameState == movingState)? selected = true : null;
               } 
            } 
        }


        //if(isSelected == 0 ) gameState = myRoundState
        (selected == false)? gameState = myRoundState : null;
        //changeGameState()
        highlighingTiles()
    }
    
}

function changeGameState(){

    let isSelected = 0 ;

    for(let card of playerDeck){
        if(card.selected == true) isSelected =+ 1
    }

    for(let player of playerInfo){
        if(player.selected == true) isSelected =+ 1
    }

    if(isSelected == 0 ) gameState = myRoundState

}


function highlighingTiles(){
    
    for(let tile of boardTiles){

        tile.highlighted = false

    }
    
    
    
    if(gameState == playingCardState){
        
        highlightClickable(selectedCard)

    }else if(gameState == movingState){

        highlightClickable(selectedPlayer)

    }
    

}

function highlightClickable(object){
    // get type 
    let type = null 
    let range = null
    
    if (object.player == true){

        type = 4
        range = 1

    } else {

        type = object.type_range
        range = object.range

    }

    //get player position
    let playerTile = receiveObject(boardTiles, playerInfo[0].tileIndex)
    let inicialRow = playerTile.row
    let inicialColumn = playerTile.column


    //creates tables of nº rows and columns where the tiles are clicable
    let rows = []
    let columns = []
    
    
    for (i = range ; i > 0 ; i--){
        rows.push (inicialRow + i)
        rows.push (inicialRow - i)


        columns.push(inicialColumn + i)
        columns.push(inicialColumn - i)
    }

    //set the 'clickcable tiles' as highlighted
    if(type == 4) {
        for(let tile of boardTiles){
            if(tile.column == inicialColumn){
                for(let possibleRow of rows){
                    if(tile.row == possibleRow) tile.highlighted = true 
                }
            }

            if(tile.row == inicialRow){
                for(let possiblecolumn of columns){
                    if(tile.column == possiblecolumn) tile.highlighted = true 
                }
            }
        } 
    }
  
}
    
    

function makePlay() {
    if(gameState == playingCardState){
        //needs to check and change database 
        playerInfo[0].mana -= selectedCard.mana
        selectedCard.x = null 
        selectedCard.y = null 
        selectedCard.state = 2 
    }else if (gameState == movingState){
        if(playerInfo[0].energy > 0 && selectedTile ){
        playerInfo[0].energy -= 1
        playerInfo[0].tileIndex = selectedTile.id
        playerInfo[0].selected = true
        updatePlayers()  
        } else if (playerInfo[0].energy = 0){
            alert('Not enough energy')
        }
        
    }
}

async function updatePlayers(){
    for(let player of playerInfo){
       a = await receiveObject(boardTiles, player.tileIndex)
       player.x = a.x
       player.y = a.y
   }


   for(let enemy of enemyInfo){
       a = await receiveObject(boardTiles, enemy.tileIndex)
       enemy.x = a.x
       enemy.y = a.y
   } 
}

function receiveObject(table, id){
    for(let row of table){
        if(row.id == id) return row 
    }
    return null
}