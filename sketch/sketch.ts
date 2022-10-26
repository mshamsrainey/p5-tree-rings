// Starting point/reference: https://gorillasun.de/blog/radial-perlin-noise-and-generative-tree-rings

let startingYr : number
let growth : number = 0
let maxSize : number
//let radius : number
let yearSelect : p5.Element
const monthsInYear = 12
const daysInMonth : Map<number, number> = new Map<number, number>([[1, 31], [2, 28], [3, 31], [4, 30], [5, 31], [6, 30], [7, 31], [8, 31], [9, 30], [10, 31], [11, 30], [12, 31]])
const hoursInDay = 24
const minsInHour = 60
const secsInMinute = 60
let winterSwatch: p5.Color
let springSwatch: p5.Color
let summerSwatch: p5.Color
let fallSwatch: p5.Color
let dummyMonth = 0

interface Ring {
  shapeXs: Array<number>
  shapeYs: Array<number>
  shapeNs: Array<number>
}

interface Tree {
  rings: Array<Ring>
  startingYr: number
  radius: number
}

let tree: Tree = {rings: new Array<Ring>(), startingYr: 2001, radius: 0}

function calcRadiusPerRing() {
  return tree.radius / tree.rings.length
}

function drawRingsViaInterface() {
  let r = 0
  let radiusPerRing = calcRadiusPerRing()
  tree.rings.forEach(ring => {
    //console.log(ring)
    beginShape()
    r += radiusPerRing
    for (let i = 0; i < ring.shapeNs.length; i++) {
      //console.log(ring)
      curveVertex(ring.shapeXs[i] + ring.shapeNs[i], ring.shapeYs[i] + ring.shapeNs[i])
      endShape()
  }
})
}

function setup() {
  winterSwatch = color(201, 227, 247)
  springSwatch = color(216, 233, 221)
  summerSwatch = color(239, 230, 234)
  fallSwatch = color(240, 225, 209)
  const startYrProgress = calcProgressThruYear()
  const startLerpColor = calcColorLerp(startYrProgress)
  createCanvas(windowWidth, windowHeight)
  maxSize = min(windowWidth, windowHeight)
  colorMode(RGB)
  frameRate(1)
  background(startLerpColor)
  stroke(20)
  strokeWeight(1)
  noFill()
  yearSelect = createSelect()
  yearSelect.position(10,10)
  for (let i = year() - 100; i <= year(); i++) {
    yearSelect.option(i.toString(), i)
  }
  yearSelect.changed(onYoBSelected)
  startingYr = (year() - 2001) 
  let foo = startingYr * 5
  //console.log(radius)
  calcRings(startingYr, foo)
  drawRingsViaInterface()
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
}

function onYoBSelected() {
  let yearSelected = yearSelect.value() as number
  startingYr = year() - yearSelected
  if (startingYr * 5 >= maxSize / 2) {
    let foo = startingYr * 3
    calcRings(startingYr, foo)
  } else {
    let foo = startingYr * 5
    calcRings(startingYr, foo)
  }
  drawRingsViaInterface()
}


let scaleVar = 50
let resolution = 0.002
let numPoints = 500

function calcRings(numNewRings : number, newRadius: number) {
  for (let r = tree.radius; r < tree.radius + newRadius; r += newRadius / numNewRings) {
    let shapeXs = Array<number>()
    let shapeYs = Array<number>()
    let shapeNs = Array<number>()
    for (let a = -TAU / numPoints; a < TAU + TAU / numPoints; a += TAU / numPoints) {
      let x = width / 2 + r * cos(a)
      let y = height / 2 + r * sin(a)
      let n = map(noise(x * resolution, y * resolution), 0, 1, -scaleVar, scaleVar)
      shapeXs.push(x)
      shapeYs.push(y)
      shapeNs.push(n)
      if(random() > 0.75 - 0.25 * sin(r)){
        tree.rings.push({ shapeXs: shapeXs, shapeYs:shapeYs, shapeNs:shapeNs })
        shapeXs = Array<number>()
        shapeYs = Array<number>()
        shapeNs = Array<number>()
      }
    }
    tree.rings.push({ shapeXs: shapeXs, shapeYs:shapeYs, shapeNs:shapeNs })
  }
  tree.radius += newRadius
  growth = 0
}

function calcProgressThruYear() {
  let minuteProgress = second() / secsInMinute
  let hourProgress = (minute() + minuteProgress) / minsInHour
  let dayProgress = (hour() + hourProgress) / hoursInDay
  return (month() + ((day() + dayProgress) / daysInMonth.get(month()))) / monthsInYear
}

function calcColorLerp(yearProg: number) {
  let seasonProg : number
  if (yearProg <= 0.25) {
    seasonProg = yearProg / .25
    return lerpColor(winterSwatch, springSwatch, seasonProg)
  } else if (yearProg <= 0.50) {
    seasonProg = (yearProg-0.25) / .25
    return lerpColor(springSwatch, summerSwatch, seasonProg)
  } else if (yearProg <= 0.75) {
    seasonProg = (yearProg-0.5) / .25
    return lerpColor(summerSwatch, fallSwatch, seasonProg)
  } else {
    return lerpColor(fallSwatch, winterSwatch, yearProg)
  }
}
 
function draw() {
  if (!dummyMonth) {
    let yearProg = calcProgressThruYear()
    let seasonProg = calcColorLerp(yearProg)
    background(seasonProg)
  } else {
    let seasonProg = calcColorLerp(dummyMonth / monthsInYear)
    background(seasonProg)
  }
  growth += 3.17057705e-8
  if (growth >= 1) {
    // TODO: adjust to account for max size on screen
    calcRings(growth, growth * 5)
  }
  drawRingsViaInterface()
}

function keyPressed() {
  dummyMonth ++
  if (dummyMonth == monthsInYear) {
    dummyMonth = 0
  }
  let seasonProg = calcColorLerp(dummyMonth / monthsInYear)
  background(seasonProg)
  growth += (1 / monthsInYear)
  console.log(growth)
  if (growth >= 1) {
    calcRings(growth, growth * 5)
  }
  drawRingsViaInterface()
}