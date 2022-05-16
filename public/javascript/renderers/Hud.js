class Hud{

    constructor(x,y,width,height,type,click,text){
        this.width = width,
        this.height = height ,
        this.type = type,
        this.click = click , 
        this.text = text

        this.x = x * canvasWidth - width/2 , 
        this.y = y * canvasHeight - height/2 
    }
    draw(){
        fill(200)
        strokeWeight(4) 
        stroke(0,0,0);
        textSize(25)
        rect(this.x , this.y , this.width , this.height)
        text(this.text, this.x + (this.width/2) - (textWidth(this.text.toString())/2) , this.y + (this.height/2) + 10  )

    }
    click(x,y){
        
        if(this.type == 'info') return ;

        if(x > this.x && x < (this.x+this.width) &&
            y > this.y && y < (this.y+this.height)){
                print(this.text + 'clicked')
            }
    }

}