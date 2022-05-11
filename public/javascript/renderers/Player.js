const playerWidth = 60
const playerHeight = 60 

class Player {
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

    }
    draw(){
        
        if(this.player == true){
            fill(255,255,255)
            strokeWeight(1)
            rect((canvasWidth * 0.8) ,(canvasHeight * 0.79),(canvasWidth * 0.18),(canvasHeight * 0.18))
            noStroke()
            textSize(30)
            fill(0, 153, 15)
            text('HEALTH : ' + this.health + ' /20',(canvasWidth * 0.8) +10 ,(canvasHeight * 0.84) )
            fill(0, 175, 235)
            text('MANA : ' + this.mana + '/' + this.totalMana,(canvasWidth * 0.8) +10 ,(canvasHeight * 0.89) )
            fill(228, 164, 7)
            text('ENERGY : ' + this.energy +' /3',(canvasWidth * 0.8) +10 ,(canvasHeight * 0.94) )
        
            fill(239, 87, 87)
            //if(GameState == MovingState){fill(200, 20, 20)}
            if(this.selected == true){fill(200, 20, 20)}
            circle(this.x + 30 ,this.y + 30,60)
            textSize(15)
            fill(255,255,255)
            text('Player',this.x + 30 - textWidth('Player') / 2 ,this.y + 30)


        }

        if(this.player == false){
            fill(255,255,255)
            stroke(51)
            strokeWeight(1)
            rect((canvasWidth * 0.1) ,(canvasHeight * 0.05),(canvasWidth * 0.18),(canvasHeight * 0.18))
            noStroke()
            textSize(30)
            fill(0, 153, 15)
            text('HEALTH : ' + this.health + ' /20',(canvasWidth * 0.1) +10 ,(canvasHeight * 0.09) )
            fill(0, 175, 235)
            text('MANA : ' + this.mana + '/' + this.totalMana,(canvasWidth * 0.1) +10 ,(canvasHeight * 0.14) )
            fill(228, 164, 7)
            text('ENERGY : ' + this.energy +' /3',(canvasWidth * 0.1) +10 ,(canvasHeight * 0.19) )
       
            fill(87, 135, 239)
            circle(this.x + 30 ,this.y + 30,60)
            fill(255,255,255)
            textSize(15)
            text('enemy',this.x + 30 - textWidth('Enemy') / 2 ,this.y + 30)
        }
    }
    click(x,y) {
        if(x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height)){
                this.selected = true 
                gameState = movingState 
                return true 
            }else{
                this.selected = false
                return false 
            }
    }
}