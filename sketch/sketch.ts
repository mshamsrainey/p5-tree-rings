// Starting point/reference: https://gorillasun.de/blog/radial-perlin-noise-and-generative-tree-rings

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  stroke(20);
  strokeWeight(1);
  noFill();
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
}

let scaleVar = 50;
let resolution = 0.002;
let numPoints = 500;

let radius = 150;
let numRings = 40;
function draw() {
  for (let r = 0; r < radius; r += radius / numRings) {
    beginShape();
    for (let a = -TAU/numPoints; a < TAU+TAU/numPoints; a += TAU / numPoints) {
      var x = width/2 + r * cos(a);
      var y = height/2 + r * sin(a);

      var n = map(noise(x * resolution, y * resolution), 0, 1, -scaleVar, scaleVar);

      curveVertex(x + n, y + n);

      if(random()>0.75-0.25*sin(r)){
        endShape();
        beginShape();
      }
    }
    endShape();
  }
  noLoop();
}