class Hud{

    constructor(id,x,y,width,height,type,click,text){
        this.id = id,
        this.width = width,
        this.height = height ,
        this.type = type,
        this.click = click , 
        this.text = text.toString()

        this.x = x * canvasWidth - width/2 , 
        this.y = y * canvasHeight - height/2 

        if(id == 1){
        this.text = text.StringNum
        } else if (id == 2){
            this.text = text.StringState
        }
    }
    draw(){
        if(this.id == 2){
            textSize(18)
        }
        textSize(24)
        fill(200)
        strokeWeight(4) 
        stroke(0,0,0);
        //textSize(18)
        rect(this.x , this.y , this.width , this.height)
        //print(this.text)
        fill(255)
        text(this.text, this.x + (this.width/2) - (textWidth((this.text)/* .toString() */)/2) , this.y + (this.height/2) + 10  )
        


    }
    static drawState(){

        if(gameState == discardCardState){
           let discardScreenText = 'Select a card to discard'
            textSize(55)
            fill(0,0,0,90)
            strokeWeight(4) 
            stroke(0,0,0);
            rect(0 , 0 , canvasWidth , canvasHeight)
            fill(255)
            text(discardScreenText, (0.5*canvasWidth) /* + (this.width/2) */ - (textWidth((discardScreenText))/2) , (0.5*canvasHeight)  + 10 ) 
        }
        


    }
    update(String){
        if(this.id == 1){
            this.text = String.StringNum
        } else if (this.id  == 2){
            this.text = String.StringState
        }
    }
    click(x,y){
        
        if(this.type == 'info') return ;

        if(x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height)){
                print(this.text + 'clicked')
            }
    }
    

}