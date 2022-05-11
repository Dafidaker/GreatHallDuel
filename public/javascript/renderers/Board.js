const tileWidth = 60
const tileHeight = 60


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
    }
    draw(){
        //tiles

        //stroke(0)
        

        if (this.id % 2 == 0){
            fill(0,0,0)
            rect(this.x , this.y, this.width, this.height)

        } else {
            fill(127, 101, 57)
            rect(this.x , this.y, this.width, this.height)
        }

        //text
        textSize(15)
        if (this.id % 2 == 0){
            fill(0,0,0)
            rect(this.x , this.y, this.width, this.height)
            fill(127, 101, 57)
            text(this.id, this.x +30 , this.y + 30 ); 

        } else {
            fill(127, 101, 57)
            rect(this.x , this.y, this.width, this.height)
            fill(0,0,0)
            text(this.id, this.x +30 , this.y + 30 );

        } 

        //if highlighted
        if (this.highlighted == true){
            fill(100, 200, 100)
            rect(this.x , this.y, this.width, this.height)
            //fill(0,0,0)
            //text(this.id, this.x +30 , this.y + 30 )
        }

        if (this.selected == true){
            fill(255, 255, 255)
            rect(this.x , this.y, this.width, this.height)
           // fill(0,0,0)
           // text(this.id, this.x +30 , this.y + 30 )
        }

        
    } 
    click(x,y) {
        if(x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height)){
                if(this.highlighted){

                }
                this.selected = true 
            }else{
                this.selected = false
            }
    }

}
