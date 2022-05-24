const canvasWidth = 1920;
const canvasHeight = 1080

var playerInfo
var enemyInfo

var playerDeck = []

var boardTiles = []



var gameState = 0
const basicState = 0
const myRoundState = 1
    const movingState = 1.1
    const playingCardState = 1.2
    const discardCardState = 1.3
const enemyState = 2
    const counterState = 2.1



let selectedCard
let selectedPlayer
let selectedTile

let roundinfo  

let hudTable
let buttonTable


let dogica
let dogicaBold
let dogicaPixel
let dogicaPixelBold

let backgroundImg
let backgroundImgEnemyState

function discardCardTest(){
    requestDiscardCard(selectedCard)
}

function preload() {
    dogica = loadFont('assets/dogica.otf')
    dogicaBold = loadFont('assets/dogicabold.otf')
    dogicaPixel = loadFont('assets/dogicapixel.otf')
    dogicaPixelBold = loadFont('assets/dogicapixelbold.otf')

    backgroundImg = loadImage('assets/images/Backgrounds/Backgroung.png')
    backgroundImgEnemyState = loadImage('assets/images/Backgrounds/basic.png')

    for(i = 1 ; i < 16 ;i++ ){
        let a = loadImage('assets/images/cards/'+i+'.png');
        Card.cardImages.push(a)
    }
    
}


async function Reset(){
    SetInicialState()
}

async function AddMana(){
    ChangePlayerInfo(1,20,4,4,3)
    ChangePlayerInfo(2,20,4,4,3)
}

async function getRoundState(){
    await getBattleRound()
    if(Round.PlayerState == 2){
        if(gameState== myRoundState || gameState == playingCardState ||gameState == movingState || gameState == discardCardState){
            return
        }else{
            gameState = myRoundState
            cursor(ARROW)
            updatePlayers()
        }
        
    }else if (Round.PlayerState == 1){
        gameState =  enemyState
        cursor('not-allowed')
    }

    for(let hud of hudTable){
        hud.update(Round.String) 
    }

}

function SetInicialState() {
    
    ChangePlayerInfo(1,20,0,0,3) //(id,health,total_mana,mana,energy)
    ChangePlayerPosition(1,68) // (id,position)
    ChangeCardState(1,1,1)  // (id,card,newstate)
    ChangeCardState(1,4,1)  // (id,card,newstate)
    
    ChangePlayerInfo(2,20,0,0,3) //(id,health,total_mana,mana,energy)
    ChangePlayerPosition(2,14) // (id,position)
    ChangeCardState(2,2,1)  // (id,card,newstate)
    ChangeCardState(2,3,1)  // (id,card,newstate)
    

    ChangeRound_Num_State(1,7,1)
}

function InicialInformation() {
    getBattleRound() //Gets the round number and state as a nice string
    getplayerinformation(player_id) // gets all the information from one player , 
    getplayerdeck() // gets the deck from one player 
    getplayersposition(player_id) // gets position from both players 
    GameState= MyRoundState

}

async function setup() {
    noLoop();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('game');
    cursor(WAIT)
    textFont(dogicaPixel)  
    createboard()
    await createButtons()
    await createDeck()
    await createPlayers()
    await createHud()
    setInterval(updateGame,1000) 
    loop();

   
}

async function updateGame(){
    await getRoundState()
    await updatePlayers();
    await updateDeck()
    /* if(gameState == enemyState){
       updatePlayers(); 
    }  */
    
    
}

async function createDeck(){
    let deck = await getplayerdeck();
    playerDeck = [];
    for (let row of deck){
        ///if (row.card_state_id == 1)  // posible use to turn a variable (enabled) true 
        playerDeck.push(new Card(row.card_name,row.deck_card_id,
                                false,row.deck_order,
                                row.card_state_id,row.card_mana,
                                row.card_range,row.card_type_range_id
                                ,row.card_type_cast_id))
        
    }
}

async function updateDeck(){
    let numCardsHand = 0
    let deck = await getplayerdeck()
    for(let row of deck){
        for(let card of playerDeck){
            if(row.deck_card_id == card.id){
                card.update(row.deck_card_state_id , row.deck_order)
                if (row.deck_card_state_id == 1) numCardsHand +=1 ;
            }
            
            
        }
    }
    if (numCardsHand >= 5) gameState = discardCardState;
    if(gameState == discardCardState && numCardsHand <= 4 ){
        gameState = myRoundState
    }
    
}

async function createHud(){
    roundinfo = await getBattleRound()

    hudTable=[]
    hudTable.push(new Hud(2 ,0.5 , 0.08 , 600 , 100,'info' ,'placeholder',roundinfo.Round.String))
    hudTable.push(new Hud(1 ,0.5 , 0.14 , 400 , 50,'info' ,'placeholder',roundinfo.Round.String))


}


async function createButtons(){
    buttonTable =[]

    buttonTable.push ( new Button (0.1,0.75,120,120,'a','Get Card'))
    buttonTable.push ( new Button (0.2,0.85,120,120,'a','Basic Attack'))
    buttonTable.push ( new Button (0.75,0.45,300,100,'a','End Turn'))


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

async function updatePlayers(){
    let playerif =  (await getplayerinformation()).playerif
    let enemyif =  (await getplayerinformation()).enemyif
    let playerPos = await receiveObject(boardTiles, playerif.position)
    let enemyPos = await receiveObject(boardTiles, enemyif.position)

    print('update players ')
    for(let player of playerInfo){
        player.updateInfo(playerif.mana,
                        playerif.health,playerif.mana_total,
                        playerif.energy)

        if(gameState != movingState){
            player.updatePosition(playerif.position,
                                    playerPos.x , playerPos.y) 
        }
    

    }

    
    for(let enemy of enemyInfo){
        enemy.updateInfo(enemyif.mana,
                        enemyif.health,enemyif.mana_total,
                        enemyif.energy)


    if(gameState != movingState){
            enemy.updatePosition(enemyif.position,
                                    enemyPos.x , enemyPos.y) 
        }
    }
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
    if(gameState == enemyState){
        image(backgroundImgEnemyState,0,0)
    }else{
      image(backgroundImg,0,0)  
    }
    
    scale(1)
    
    textSize(20)
    fill(0,0,0)
    text(gameState,100,100)
    //text(Round.PlayerState,100,200)

    Card.drawCardsBox()

    for(let tile of boardTiles){
        tile.draw()
    }
    
    //playerInfo[0].draw()
    for(let player of playerInfo){
        player.draw()
    }

    for(let enemy of enemyInfo){
        enemy.draw()
    }

    for(let hudelement of hudTable){
        hudelement.draw()
    }

    for(let button of buttonTable){
        button.draw()
    }


    Hud.drawState()


    for(let card of playerDeck){
            card.draw()
        }

    
}

function mouseMoved(){
    if ( gameState == myRoundState || gameState == movingState || gameState == playingCardState || gameState == counterState || gameState == enemyState || gameState == discardCardState ){
        Card.mouseMoved(mouseX,mouseY)

        for(let button of buttonTable){
            button.mouseMoved(mouseX,mouseY)
        }
    }
}

function mouseClicked(){
    if ( gameState == myRoundState || gameState == movingState || gameState == playingCardState || gameState == counterState ){
       
        for(let button of buttonTable){
            button.click(mouseX,mouseY);
        }
        
        let selected = false 


        for(let card of playerDeck){


            card.click(mouseX,mouseY);
            
            if (card.selected == true) {
                selected = true
                //isSelected =+ 1
                selectedCard = card

                if (playerInfo[0].mana < selectedCard.mana ){
                    alert('Not enough mana')
                    selectedCard = null
                    card.selected = false
                    gameState = myRoundState
        
                }
            }
            
        }

    
        for(let player of playerInfo){

            if(gameState != movingState){

                player.click(mouseX,mouseY) ;
                    
                if (player.selected == true) {

                    selected = true
                    selectedPlayer = player
                
                     if(player.energy <= 0){
                        selectedPlayer = null
                        if(gameState == movingState) gameState = myRoundState
                        alert('Not enough energy')
                        
                    }  
                }
            }
            
        }
            

        


        for(let tile of boardTiles){

            tile.click(mouseX,mouseY)
            
            if(tile.selected == true){

                selectedTile = tile 
                if(tile.highlighted == true){
                    (gameState == movingState)? selected = true : null;
                    makePlay(); 
                }

            } 

        } 
        

        //if(isSelected == 0 ) gameState = myRoundState
        (selected == false)? gameState = myRoundState : null;
        //changeGameState()
        highlighingTiles()
    }
    if(gameState == discardCardState){
        for(let card of playerDeck){

            card.click(mouseX,mouseY);
            
        }
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
        tile.valueHighlight = 0 
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
    let diagonal = []
    
    
    for (i = 1 ; i < range+1 ; i++){
        rows.push (inicialRow + i)
        rows.push (inicialRow - i)


        columns.push(inicialColumn + i)
        columns.push(inicialColumn - i)

        
        diagonal.push({row: inicialRow + i , column: inicialColumn + i})
        diagonal.push({row: inicialRow + i , column: inicialColumn - i })

        diagonal.push({row: inicialRow - i , column: inicialColumn + i })
        diagonal.push({row: inicialRow - i , column: inicialColumn - i })


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

    if(type == 8){
        for(let tile of boardTiles){

            for(let possiblediagonal of diagonal){
                if((tile.row == possiblediagonal.row) && (tile.column == possiblediagonal.column)) tile.highlighted = true 
            }

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

    if(type == 0){
        for(let tile of boardTiles){
            tile.highlighted = true 
        }
    }
    if(type == 10){
        for(let tile of boardTiles){
            let areaRange = (range-1)/2

            if( (tile.row >= (inicialRow - areaRange)) && (tile.row <= (inicialRow + areaRange)) ){
                if((tile.column >= (inicialColumn - areaRange)) && (tile.column <= (inicialColumn + areaRange))){
                    tile.highlighted = true 
                } 
            }




        }

    }
            
}

    
    
    
    

function makePlay() {
    if(gameState == playingCardState){
        //needs to check and change database 
        if(playerInfo[0].mana >= selectedCard.mana){
            playerInfo[0].mana -= selectedCard.mana
            /* selectedCard.x = null 
            selectedCard.y = null 
            selectedCard.state = 2  */ 
            /* ChangeCardState(playerInfo[0].id,selectedCard.id,selectedCard.state)
            ChangePlayerInfo(playerInfo[0].id,
                playerInfo[0].health,
                playerInfo[0].totalMana,
                playerInfo[0].mana,
                playerInfo[0].energy) */
            //useCard(selectedCard,selectedTile)
            requestPlayCard(selectedCard,selectedTile)
            updatePosPlayers()  
        
        }

    }else if (gameState == movingState){
        if(selectedTile.id == enemyInfo[0].tileIndex ){
            alert('Can`t move into the enemy')
            playerInfo[0].selected = false
            gameState = myRoundState

        }else if(playerInfo[0].energy > 0){
            playerInfo[0].energy -= 1
            playerInfo[0].tileIndex = selectedTile.id
            playerInfo[0].selected = true
            /* ChangePlayerInfo(playerInfo[0].id,
                            playerInfo[0].health,
                            playerInfo[0].totalMana,
                            playerInfo[0].mana,
                            playerInfo[0].energy)
            ChangePlayerPosition(playerInfo[0].id,selectedTile.id) */
            updatePosPlayers()  
            requestMove(selectedTile)

        }  else if (playerInfo[0].energy == 0){
            alert('Not enough energy')
            playerInfo[0].selected = false
            gameState= myRoundState

        } 
        
    }
}

async function updatePosPlayers(){
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