const tileWidth = 60
const tileHeight = 60


class Board {
    constructor(id,clicked,highlighted,x,y,letter,number) {
        this.width = tileWidth;
        this.height = tileHeight;
        this.x = x;
        this.y = y; 
        this.id = id;
        this.clicked = clicked;
        this.highlighted = highlighted;
        this.letter = letter; 
        this.number = number;
    }
    draw(){
        //tiles
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
            fill(0,0,0)
            text(this.id, this.x +30 , this.y + 30 )
        }
    } 
    click(x,y) {
        if(x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height)){
                this.clicked = true 
                this.highlighted = true;
            }else{
                this.clicked = false
                this.highlighted = false;
            }
    }

    getTile(id){return }
}
