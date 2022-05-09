const canvasWidth = 1920;
const canvasHeight = 1080

var playerInfo
var enemyInfo

var playerDeck = []

var boardTiles = []

var gameState = 0
var basicState = 0
var myRoundState = 1
    var movingState = 1.1
    var playingCardState = 1.2
var enemyState = 2
    var counterState = 2.1


function preload() {

}

async function setup() {
    noLoop();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('game');
    createboard()
    await createDeck()
    await createPlayers()
    await updatePlayers()
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

    //let playerpos = (await getplayersposition()).player_tile
    //let enemypos = (await getplayersposition()).enemy_tile


    playerInfo = []
    playerInfo.push(new Player(playerif.name,playerif.id,
                    false,
                    playerif.position,playerif.mana,
                    null,null,
                    playerif.health,playerif.mana_total,
                    playerif.energy,playerif.num,true))
    //print('playerInfo'+ JSON.stringify(playerInfo))
    

    enemyInfo = []
    enemyInfo.push(new Player(enemyif.name,enemyif.id,
                                false,
                                enemyif.position,enemyif.mana,
                                null,null,
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

function draw() {
    background(220); 
    scale(1)
    
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
    for(let card of playerDeck){
        card.click(mouseX,mouseY);
    }

    for(let tile of boardTiles){
        tile.click(mouseX,mouseY)
    }

    for(let player of playerInfo){
        player.click(mouseX,mouseY)
    }
}

function receiveObject(table, id){
    for(let row of table){
        if(row.id == id) return row 
    }
    return null
}