const canvasWidth = 1920;
const canvasHeight = 1080 
let buttonTable
let backgroundImg

let roomNumInput

let gameState = 0

var menuState = 0
const basicState = 0
const waitingState = 1
const fullRoomState = 2

let string = "[waiting for information...]"

function preload() {
    dogica = loadFont('assets/dogica.otf')
    dogicaBold = loadFont('assets/dogicabold.otf')
    dogicaPixel = loadFont('assets/dogicapixel.otf')
    dogicaPixelBold = loadFont('assets/dogicapixelbold.otf')

    //BACKGROUND
    backgroundImg = loadImage('assets/images/Backgrounds/Backgroung.png')
    
    //BUTTONS
    for(i = 1 ; i <= 4 ;i++ ){
        let a = loadImage('assets/images/menu/'+i+'.png');
        Button.buttonsImages.push(a)
    }
    
}

async function setup() {
    noLoop();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('lobby');
    textFont(dogicaPixel)
    updateMenu()
    await createButtons()
    roomNumInput = createInput('')
    roomNumInput.position(0.55*canvasWidth,0.4*canvasHeight)
    roomNumInput.attribute('placeholder', 'room number');
    setInterval(updateMenu,1500) 
    //roomNumInput.placeholder("room number")
    loop();
}

function draw() {
    background(200)
    image(backgroundImg,0,0)
    fill(Color.white)
    stroke(Color.black)
    textSize(25)
    text(menuState,10,100)

    text(string,(0.5 * canvasWidth) - (textWidth((string))/2) ,200)
    for(let button of buttonTable){
        button.draw()
    }
}

async function createButtons(){
    buttonTable = []

    //buttonTable.push ( new Button (0.2,0.3,300,70,'play',-1))
    buttonTable.push ( new Button (0.4,0.3,300,70,'quickMatch',-1))
    buttonTable.push ( new Button (0.6,0.3,300,70,'joinRoom',-1))
    buttonTable.push ( new Button (0.8,0.3,300,70,'createRoom',-1))
    buttonTable.push ( new Button (0.5,0.5,300,70,'enter room',-1))

   
}

async function updateMenu(){
    result = await checkRoomFull()
    string = result.string
}


function toGame(){
    window.location='./game.html'
}

function mouseClicked(){

    for(let button of buttonTable){
        button.click(mouseX,mouseY)
    }
}

function mouseMoved(){

    for(let button of buttonTable){
        button.mouseMoved(mouseX,mouseY)
    }
}

   

    