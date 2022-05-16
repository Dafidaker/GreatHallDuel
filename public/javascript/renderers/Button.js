let buttonColor = 100

class Button{
    constructor(x,y,width,height,click,text){
        this.width = width,
        this.height = height ,
        this.clicking = click , 
        this.text = text

        this.x = x * canvasWidth - width/2 , 
        this.y = y * canvasHeight - height/2,

        this.inside = false
        this.color = 100
    }
    draw(){
        textSize(10)
        strokeWeight(4) 
        stroke(0,0,0);
        fill(this.color)
        if(this.width == this.height){
            circle(this.x,this.y,this.width)
            fill(255)
            text(this.text, this.x  - (textWidth(this.text.toString())/2) , this.y /* + (this.height/2) */ )
            
        }else{
            rect(this.x , this.y , this.width , this.height)
            fill(255)
            text(this.text, this.x + (this.width/2) - (textWidth(this.text.toString())/2) , this.y + (this.height/2) )
        } 

        //text(this.text, this.x + (this.width/2) - (textWidth(this.text.toString())/2) , this.y + (this.height/2) )

        

    }
    click(x,y){
        
        //if(this.type == 'info') return ;
        if(this.width == this.height){
           if(x > (this.x - this.width/2) && x < (this.x + this.width/2) &&
            y > (this.y - this.height/2) && y < (this.y + this.height/2)){
                print(this.text + 'clicked')
                if(this.text == 'End Turn'){
                    ChangeRound_Num_State(RoomNum,Round.Number + 1 ,Round.State)
                }
            } 
        }else{
            if(x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height)){
                print(this.text + 'clicked')
            }
        }
        
    }

    mouseMoved(x,y){ 
        if(this.width == this.height){
            if(x > (this.x - this.width/2) && x < (this.x + this.width/2) &&
            y > (this.y - this.height/2) && y < (this.y + this.height/2)){
                    this.color = 200
                    if(this.inside == false){
                        this.inside = true    
                    }
                    
            }else{
                if(this.inside == true ){
                    this.inside = false
                    this.color = 100
                    
                }
            }
        }else{
            if(x > this.x && x < (this.x+this.width) &&
                y > this.y && y < (this.y+this.height)){
                this.color = 200
                if(this.inside == false){
                    this.inside = true    
                }
                
            }else{
                if(this.inside == true  ){
                    this.inside = false
                    this.color = 100
                }
                    

            }
        }
    }

}