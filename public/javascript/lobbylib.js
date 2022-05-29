/* const canvasWidth = 1920;
const canvasHeight = 1080 */


function preload() {
    dogica = loadFont('assets/dogica.otf')
    dogicaBold = loadFont('assets/dogicabold.otf')
    dogicaPixel = loadFont('assets/dogicapixel.otf')
    dogicaPixelBold = loadFont('assets/dogicapixelbold.otf')

    //BACKGROUND
    backgroundImg = loadImage('assets/images/Backgrounds/Backgroung.png')
    backgroundImgEnemyState = loadImage('assets/images/Backgrounds/basic.png')

}



async function setup() {
    noLoop();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('lobby');
    loop();
}


function draw() {
    background(200)
}