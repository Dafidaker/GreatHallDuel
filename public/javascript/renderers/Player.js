const playerWidth = 60
const playerHeight = 60 

class Player {
    constructor(name,id,clicked,tileIndex,mana,x,y,health,totalMana,energy,order) {
        this.width = playerWidth;
        this.height = playerHeight;
        this.x = x;
        this.y = y; 
        this.tileIndex = tileIndex; 
        this.clicked = clicked;
        this.mana = mana;
        this.name = name;
        this.health = health;
        this.totalMana = totalMana;
        this.enegy = energy; 
        this.id = id; 
        this.order = order;

    }
}