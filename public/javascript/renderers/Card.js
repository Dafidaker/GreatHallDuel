/* const width = 120
const height = 170 
const y = canvasy*0.8;
const x = canvasx*0.5; */

class Card{
    static cardImages = {};
    constructor(name,card,clicked,order,state,mana,range,type_range,type_cast) {
        this.width = 120;
        this.height = 170;
        this.x = canvasx*0.5;
        this.y = canvasy*0.8; 
        this.card = card;
        this.clicked = clicked;
        this.state = state;
        this.order = order ;
        this.mana = mana ;
        this.range = range;
        this.type_range = type_range;
        this.type_cast = type_cast;
        this.name = name
    }
    /*constructor(name,state){
        this.x = canvasx*0.5 ;
        this.y = canvasy*0.8;
        this.name = name
        this.state = state;
    }*/
    /* static initImgs(imgHash) {
        Card.cardImages = imgHash;
    }  */
    draw() {
        fill(100,100,100);
        stroke(0,0,0);
        if(this.state == 1){
            //rect(this.x,this.y,this.width,this.height,5,5,5,5);
            rect(10,10,100,100,5,5,5,5);
            fill(0,0,0)
            text(this.name ,this.x+(this.width/2),this.y+(this.height/2))
        }
        
        /* if (this.card) {
            imageMode(CENTER);
            let img = Card.cardImages[this.card];
            let ratio = (this.width*imgRelWidth)/img.width;
            image(img,this.x+this.width/2,
                  this.y+this.height*imgCenterVertical,
                 this.width*imgRelWidth,img.height*ratio);
            fill(0,0,0);
            textAlign(CENTER,CENTER);
            text(this.card,this.x+this.width/2,this.y+this.height*textCenterVertical);
        } */
    }
    getCard() { return this.card; }
    clicked(x,y) {
        return (x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height));
    }
}
