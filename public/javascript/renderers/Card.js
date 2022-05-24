const cardWidth = 140
const cardHeight = 190 
const cardsBox ={
    width: 650,
    height: 300,
    x : 600,
    y:850 ,
    color: 100 
}
let inside = false
const yMax = 1050
const yMin = 880
const spaceBetweenCards = 150 
const cardsXOffset = 500 


const imgCenterVertical = 1; //0.4
const imgRelWidth = 1; //0.6

class Card{
    static cardImages = [];
    constructor(name,id,selected,order,state,mana,range,type_range,type_cast) {
        this.width = cardWidth;
        this.height = cardHeight;
        
        this.id = id;
        this.selected = selected;
        this.state = state;
        this.order = order ;
        this.mana = mana ;
        this.range = range;
        this.type_range = type_range;
        this.type_cast = type_cast;
        this.name = name
        
        if(state == 1){
            this.x = (order * spaceBetweenCards) + cardsXOffset ;
            this.y = yMax;
        }
         
    }
    /* static initImgs(imgHash) {
        Card.cardImages = imgHash;
    }  */
    draw() {
        /* strokeWeight(4) 
        stroke(0,0,0);
        if(this.selected){
            fill(100,200,100);
        }else{
            fill(100,100,100);
        }
        
        if(this.state == 1){
            rect(this.x,this.y,this.width,this.height,5,5,5,5);
            //rect(this.x,this.y,this.width,100,5,5,5,5);
            fill(255,255,255)
            textSize(10)
            text(this.name ,this.x+(this.width/2) - (textWidth(this.name)/2) ,this.y+(this.height/2))
        } */
        
        if (this.id && this.state == 1 ) {
            //imageMode(CENTER);
            let img = Card.cardImages[this.id - 1];
            let ratio = (this.width*imgRelWidth)/img.width;
            /* image(img,this.x+this.width/2,
                  this.y+this.height*imgCenterVertical,
                 this.width*imgRelWidth,img.height*ratio); */
        image(img,this.x,this.y,img.width *ratio,img.height *ratio);
        }  
    }
    getCard() { return this.card; }
    update(state,order){
        
        if(order != this.order ){
            this.y = yMax 
        }

        if(state != 1){
            this.x = null ;
        }else if( state == 1 ){
            this.x = (order * spaceBetweenCards) + cardsXOffset ;
        }
        
        this.state = state;
        this.order = order ;
    }
    click(x,y) {
        if(x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height)){
                
                if(gameState == discardCardState){
                    requestDiscardCard(this)
                }else{
                   this.selected = true
                    gameState = playingCardState  
                }

            }else{
                this.selected = false
                
            }
    }

    static mouseMoved(x,y){ 
        if(x > cardsBox.x && x < (cardsBox.x+cardsBox.width) &&
            y > cardsBox.y && y < (cardsBox.y+cardsBox.height)){
                
                    cardsBox.color = 200

                if(inside == false){
                    for(let card of playerDeck){
                        card.y = yMin
                    }
                    inside = true    
                }
                
        }else{
            if(inside == true){
                
                inside = false

                cardsBox.color = 100

                for(let card of playerDeck){
                    card.y = yMax
                }
            }
                

        }
    }
    static drawCardsBox(){
        //fill(cardsBox.color)
        //rect(cardsBox.x,cardsBox.y,cardsBox.width,cardsBox.height)
    }
}
