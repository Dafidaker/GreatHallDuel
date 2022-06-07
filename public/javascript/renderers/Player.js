//const { get } = require("express/lib/response");

const playerWidth = 60
const playerHeight = 60 

class Player {
    static effects = [];
    constructor(name,id,selected,tileIndex,mana,x,y,health,totalMana,energy,order,player) {
        this.width = playerWidth;
        this.height = playerHeight;
        this.x = x;
        this.y = y; 
        this.tileIndex = tileIndex; 
        this.selected = selected;
        this.mana = mana;
        this.name = name;
        this.health = health;
        this.totalMana = totalMana;
        this.energy = energy; 
        this.id = id; 
        this.order = order;
        this.player = player;

        this.burn= false;
        this.polymorph = false;
        this.shield = false;
        this.slow = false;

        this.effects = [];

    }
    draw(){
        
        if(this.player == true){
            fill(Color.white)
            strokeWeight(1)
            rect((canvasWidth * 0.8) ,(canvasHeight * 0.79),(canvasWidth * 0.18),(canvasHeight * 0.18))
            noStroke()
            textSize(20)
            fill(Color.white)
            text(this.name,(canvasWidth * 0.8)  ,(canvasHeight * 0.78))
            fill(Color.green)
            text('HEALTH : ' + this.health + ' /20',(canvasWidth * 0.8) +10 ,(canvasHeight * 0.84) )
            fill(Color.blue)
            text('MANA : ' + this.mana + '/' + this.totalMana,(canvasWidth * 0.8) +10 ,(canvasHeight * 0.89) )
            fill(Color.orange)
            text('ENERGY : ' + this.energy +' /3',(canvasWidth * 0.8) +10 ,(canvasHeight * 0.94) )
        
            
            fill(Color.blue)
            //if(GameState == MovingState){fill(200, 20, 20)}
            //if(this.selected == true){fill(200, 20, 20)}
            circle(this.x + 30 ,this.y + 30,60)
            textSize(10)
            fill(Color.white)
            text('Player',this.x + 30 - textWidth('Player') / 2 ,this.y + 30)


            if(this.effects.length > 0) {
                for( i = 0 ; i < this.effects.length ; i++){
                    textSize(25)
                    fill(Color.black)
                    let a = 70
                    //text(this.effects[i].player_effect_effect_id,(canvasWidth * 0.75),(canvasHeight * 0.78)+(a*i))
                    image(Player.effects[this.effects[i].player_effect_effect_id - 1 ],(canvasWidth * 0.75),(canvasHeight * 0.78)+(a*i))


                    //fill(Color.orange)
                    /* rect((canvasWidth * 0.8)+(70*1),(canvasHeight * 0.7),60,60)
                    rect((canvasWidth * 0.8)+(70*2),(canvasHeight * 0.7),60,60)
                    rect((canvasWidth * 0.8)+(70*3),(canvasHeight * 0.7),60,60)  */
                    
                    /*  rect((canvasWidth * 0.75),(canvasHeight * 0.78)+(a*0),60,60)
                    rect((canvasWidth * 0.75),(canvasHeight * 0.78)+(a*1),60,60)
                    rect((canvasWidth * 0.75),(canvasHeight * 0.78)+(a*2),60,60)   */
                }
            }

        }

        if(this.player == false){
            fill(Color.white)
            stroke(51)
            strokeWeight(1)
            rect((canvasWidth * 0.1) ,(canvasHeight * 0.05),(canvasWidth * 0.18),(canvasHeight * 0.18))
            noStroke()
            textSize(20)
            fill(Color.black)
            text(this.name,(canvasWidth * 0.1)  ,(canvasHeight * 0.04))
            fill(Color.green)
            text('HEALTH : ' + this.health + ' /20',(canvasWidth * 0.1) +10 ,(canvasHeight * 0.09) )
            fill(Color.blue)
            text('MANA : ' + this.mana + '/' + this.totalMana,(canvasWidth * 0.1) +10 ,(canvasHeight * 0.14) )
            fill(Color.orange)
            text('ENERGY : ' + this.energy +' /3',(canvasWidth * 0.1) +10 ,(canvasHeight * 0.19) )
       
            fill(Color.red)
            circle(this.x + 30 ,this.y + 30,60)
            fill(Color.white)
            textSize(10)
            text('enemy',this.x + 30 - textWidth('Enemy') / 2 ,this.y + 30)


            if(this.effects.length > 0) {
                for( i = 0 ; i < this.effects.length ; i++){
                    textSize(25)
                    fill(Color.black)
                    let a = 70
                    //text(this.effects[i].player_effect_effect_id,(canvasWidth * 0.3),(canvasHeight * 0.06)+(a*i))
                    image(Player.effects[this.effects[i].player_effect_effect_id - 1 ],(canvasWidth * 0.3),(canvasHeight * 0.06)+(a*i))
                }
            }
        }
    }
    click(x,y) {
        if(x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height)){
                this.selected = true 
                gameState = movingState 
                //return true 
            }else{
                this.selected = false
                //return false 
            }
    }
    updateInfo(mana,health,totalMana,energy){
        this.mana = mana;
        this.health = health;
        this.totalMana = totalMana;
        this.energy = energy;

    }
    updatePosition(position,x,y){
        this.tileIndex = position ;
        this.x = x ;
        this.y = y ;
    }
    burned(){
        this.burn = true;
    }
    polymorphed(){
        this.polymorph = true;
    }
    slowed(){
        this.slow = true;
    }
    shielded(){
        this.shield = true;
    }
    resetEffects(){
        this.burn= false;
        this.polymorph = false;
        this.shield = false;
        this.slow = false;
    }
    /* updateInfo(table ){
        this.mana = mana;
        this.health = health;
        this.totalMana = totalMana;
        this.energy = energy;

    } */
}