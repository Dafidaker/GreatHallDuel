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


function preload() {

}

async function setup() {
    noLoop();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('game');
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
                                row.card_range,row.card_type_range
                                ,row.card_type_cast,
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
       
        for(let card of playerDeck){
        card.click(mouseX,mouseY);
        }

        for(let tile of boardTiles){
            tile.click(mouseX,mouseY)
        }

        for(let player of playerInfo){
            player.click(mouseX,mouseY)
        } 

        changeGameState()
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
    let selectedCard
    let selectedPlayer
    
    if(gameState == playingCardState){


        for(let card of playerDeck){
            if(card.selected == true) selectedCard = card
        }


    }else if(gameState == movingState){


        for(let player of playerInfo){
            if(player.selected == true) selectedPlayer = player
        }

        
    }
    

}


function receiveObject(table, id){
    for(let row of table){
        if(row.id == id) return row 
    }
    return null
}