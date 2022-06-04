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
}