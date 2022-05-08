const width = 1300;
const height = (width*0.1)*5

/* var playerId;
var scoreBoard;

const CARDSPACE = 100;
var hand = [];
const HANDX = 50;
const HANDY = 250;
var table = [];
const TABLEX = 400;
const TABLEY = 250;
var opponent = [];
const OPX = 400;
const OPY = 50; */

var playerInfo
var enemyInfo

var playerDeck = []
//var enemyDeck = [] // dont need enemy deck 

function preload() {

}

async function setup() {
    noLoop();
    let canvas = createCanvas(width, height);
    canvas.parent('game');
    //getplayerinformation()
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
        //print('card_id'+ row.card_id)
    }
   // print('deck'+ JSON.stringify(playerDeck))
}

async function createPlayers(){
    let playerif =  (await getplayerinformation()).playerif
    let enemyif =  (await getplayerinformation()).enemyif

    playerInfo = []
    //for (let row of playerif){
        playerInfo.push(new Player(playerif.name,playerif.id,
                        false,
                        null,playerif.mana,
                        null,null,
                        playerif.health,playerif.mana_total,
                        playerif.energy,playerif.num))
        print('playerInfo'+ JSON.stringify(playerInfo))
    //}

    enemyInfo = []
    //for (let row of enemyif){
        enemyInfo.push(new Player(enemyif.name,enemyif.id,
                                    false,
                                    null,enemyif.mana,
                                    null,null,
                                    enemyif.health,enemyif.mana_total,
                                    enemyif.energy,enemyif.num))
        print('enemyInfo'+ JSON.stringify(enemyInfo))
    //}
}



function draw() {
    background(220);
    for(let card of playerDeck){
        card.draw()
    }
   

}

function mouseClicked(){

    for(let card of playerDeck){
        if(card) card.click(mouseX,mouseY);
    }
}