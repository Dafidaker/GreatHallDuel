let buttonColor = 100
let realWidthButtonsImage = 1

class Button{
    static buttonsImages = [];
    constructor(x,y,width,height,text,imgIndex){
        this.width = width,
        this.height = height ,
        this.text = text
        this.selected = false ,
        this.img = imgIndex ,

        this.x = x * canvasWidth - width/2 , 
        this.y = y * canvasHeight - height/2,

        this.inside = false
        this.color = Color.darkGrey
    }
    draw(){
        if(this.img != -1){
            /* let img = Button.buttonsImages[this.img-1]
            let ratio = (this.width*realWidthButtonsImage)/img.width;
            image(img,this.x,this.y,img.width *ratio,img.height *ratio); */

            //fill(this.color)
            //rect(this.x , this.y , this.width , this.height)
        }else{
          textSize(10)
        strokeWeight(4) 
        stroke(Color.black);
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
        }
         

        //text(this.text, this.x + (this.width/2) - (textWidth(this.text.toString())/2) , this.y + (this.height/2) )

        

    }
    click(x,y){
        
        //if(this.type == 'info') return ;
        if(this.width == this.height){
           if(x > (this.x - this.width/2) && x < (this.x + this.width/2) &&
            y > (this.y - this.height/2) && y < (this.y + this.height/2)){
                print(this.text + 'clicked')
                if(this.text == 'Get Card'){
                    if(playerInfo[0].mana < 2){
                        alert('Not enough mana')
                    }else{
                       requestDrawCard()  
                    }
                   
                    
                }
                if(this.text == 'Basic Attack'){
                    if(playerInfo[0].polymorph == true){
                        alert('While polymorphed the player cant play cards or do basic attacks')
                    }else{
                        this.selected = true
                        gameState = basicAttackState
                        highlighingTiles()
                    }
                }

                if(this.text == 'End Turn'){
                    //nextRound()
                    requestEndTurn()
                }
                
            }else{
                this.selected = false
            }
        }else{
            if(x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height)){
                if(this.text == 'End Turn'){
                    //nextRound()
                    requestEndTurn()
                }
                if(menuState == basicState){
                    if(this.text == 'play'){
                        alert(this.text)
                    }

                    if(this.text == 'quickMatch'){
                        joinRoom(-1)
                    }

                    if(this.text == 'joinRoom'){
                        if(roomNumInput.elt.value != ''){
                            joinRoom(int(roomNumInput.elt.value))
                        }else{
                            alert('insert a room number')
                        } 
                    }

                    if(this.text == 'createRoom'){
                        createRoom()
                        //alert('tried to create room')
                    }
                }
                
                if(this.text == 'enter room' && menuState == fullRoomState){
                    startGame()
                    window.location='./game.html'
                }
                
            }else{
                this.selected = false
            }
        }
        
    }

    mouseMoved(x,y){ 
        if(this.width == this.height){
            if(x > (this.x - this.width/2) && x < (this.x + this.width/2) &&
            y > (this.y - this.height/2) && y < (this.y + this.height/2)){

                if (gameState == enemyState || gameState == discardCardState){ 
                    this.color = Color.red 
                }else {
                    this.color = Color.grey
                }
                
                
                    if(this.inside == false){
                        this.inside = true    
                    }
                    
            }else{
                if(this.inside == true ){
                    this.inside = false
                    this.color = Color.darkGrey
                    
                }
            }
        }else{
            if(x > this.x && x < (this.x+this.width) &&
                y > this.y && y < (this.y+this.height)){
                        if(window.location.href == "http://localhost:3000/game.html"){
                            if (gameState == enemyState || gameState == discardCardState){ 
                                this.color = Color.red 
                            }else {
                                this.color = Color.grey
                            } 
                        }
                       
                    
                        if(window.location.href == "http://localhost:3000/lobby.html"){
                            if (menuState == waitingState ){ 
                                this.color = Color.red 
                                if(this.text =='enter room') this.color = Color.red;
                            }else if(menuState == basicState){
                                this.color = Color.grey
                                if(this.text =='enter room') this.color = Color.red;
                            } else if (menuState == fullRoomState){
                                this.color = Color.red ;
                                if(this.text =='enter room') this.color = Color.grey;
                            }
                        }
                
                if(this.inside == false){
                    this.inside = true    
                }
                
            }else{
                if(this.inside == true  ){
                    this.inside = false
                    this.color = Color.darkGrey
                }
                    

            }
        }
    }

}