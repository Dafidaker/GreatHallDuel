const tileWidth = 60
const tileHeight = 60 

class Board {
    constructor(index,clicked,highlighted,x,y) {
        this.width = tileWidth;
        this.height = tileHeight;
        this.x = x;
        this.y = y; 
        this.index = index;
        this.clicked = clicked;
        this.highlighted = highlighted;
        
    }
}