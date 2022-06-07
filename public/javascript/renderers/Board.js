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
        stroke(Color.black)

        if (this.id % 2 == 0){
            fill(Color.black)
        } else {
            fill(Color.brown) 
        }
        rect(this.x , this.y, this.width, this.height)


        //text
        textSize(12)
        if (this.id % 2 == 0){
            fill(Color.brown)
        } else {
            fill(Color.black)
        } 
       // text(this.id, this.x +30 - (textWidth(this.id.toString())/2) , this.y + 30 )
        
        //if highlighted
         if (this.highlighted == true){

            this.valueHighlight +=  1.5;
            if (this.valueHighlight > 200) this.valueHighlight = 100;

            stroke(Color.green)
            strokeWeight(4) 
            noFill()
            rect(this.x+5 , this.y + 5 , 50, 50)
            
        }

        if (this.selected == true){

            this.value += 3;
            if (this.value > 200) this.value = 70;
            
            stroke(Color.white);
            strokeWeight(4) 
            noFill()
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
