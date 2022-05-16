const tileWidth = 60
const tileHeight = 60
let value = 100
let valueHighlight = 100

class Board {
    constructor(id,selected,highlighted,x,y,row,column) {
        this.width = tileWidth;
        this.height = tileHeight;
        this.x = x;
        this.y = y; 
        this.id = id;
        this.selected = selected;
        this.highlighted = highlighted;
        this.row = row; 
        this.column = column;
        this.valueHighlight = valueHighlight
        this.value = value
    }
    draw(){
        //tiles

        //stroke(0)
        
        strokeWeight(1) 
        stroke(0,0,0)

        if (this.id % 2 == 0){
            fill(0,0,0)
        } else {
            fill(127, 101, 57) 
        }
        rect(this.x , this.y, this.width, this.height)


        //text
        textSize(12)
        if (this.id % 2 == 0){
            fill(127, 101, 57)
        } else {
            fill(0,0,0)
        } 
        text(this.id, this.x +30 - (textWidth(this.id.toString())/2) , this.y + 30 )
        
        //if highlighted
         if (this.highlighted == true){

            this.valueHighlight +=  1.5;
            if (this.valueHighlight > 200) this.valueHighlight = 100;

            stroke(100, 200, 100,/* this.valueHighligh */)
            strokeWeight(4) 
            noFill()
            rect(this.x+5 , this.y + 5 , 50, 50)
            
        }

        if (this.selected == true){

            this.value += 3;
            if (this.value > 200) this.value = 70;
            
            stroke(255, 255, 255/* ,this.value */);
            strokeWeight(4) 
            fill(255,255,255,0)
            rect(this.x+5 , this.y + 5 , 50, 50)
            

        } 

        
    } 
    click(x,y) {
        if(x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height)){
                /* if(this.highlighted){
                    makePlay()  
                } */
                this.selected = true 
            }else{
                this.selected = false
                this.value = 0
            }
    }

}
