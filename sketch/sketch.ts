// Starting point/reference: https://gorillasun.de/blog/radial-perlin-noise-and-generative-tree-rings

let startingYr : number
let growth : number = 0
let maxSize : number
let radius : number
let yearSelect : p5.Element
let dobMonth = 12 * 21 + 8
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
let dummyYr = 0


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
  radius = startingYr * 5
  console.log(radius)
  drawRings(startingYr)
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
}

function onYoBSelected() {
  let yearSelected = yearSelect.value() as number
  startingYr = year() - yearSelected
  if (startingYr * 5 >= maxSize) {
    radius = startingYr
  } else {
    radius = startingYr * 5
  }
  drawRings(startingYr)
}


let scaleVar = 50
let resolution = 0.002
let numPoints = 500

function drawRings(numRings : number) {
  for (let r = 0; r < radius; r += radius / numRings) {
    beginShape()
    for (let a = -TAU / numPoints; a < TAU + TAU / numPoints; a += TAU / numPoints) {
      let x = width / 2 + r * cos(a)
      let y = height / 2 + r * sin(a)
      let n = map(noise(x * resolution, y * resolution), 0, 1, -scaleVar, scaleVar)

      curveVertex(x + n, y + n)

      if(random() > 0.75 - 0.25 * sin(r)){
        endShape()
        beginShape()
      }
    }
    endShape()
  }
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
    // console.log("winter")
    seasonProg = yearProg / .25
    return lerpColor(winterSwatch, springSwatch, seasonProg)
  } else if (yearProg <= 0.50) {
    // console.log("spring")
    seasonProg = (yearProg-0.25) / .25
    return lerpColor(springSwatch, summerSwatch, seasonProg)
  } else if (yearProg <= 0.75) {
    // console.log("summer")
    seasonProg = (yearProg-0.5) / .25
    return lerpColor(summerSwatch, fallSwatch, seasonProg)
  } else {
    // console.log("fall")
    return lerpColor(fallSwatch, winterSwatch, yearProg)
  }
}
 
function draw() {
  if (!dummyMonth) {
    let yearProg = calcProgressThruYear()
    let seasonProg = calcColorLerp(yearProg)
    background(seasonProg)
  } else {
    let seasonProg = calcColorLerp(dummyMonth / 12)
    background(seasonProg)
  }
  if (radius + 3.17057705e-8 * 5 < maxSize) {
    radius += 3.17057705e-8 * 5
  }
  growth += 3.17057705e-8
  drawRings(startingYr + growth)
}

function keyPressed() {
  dummyMonth ++
  if (dummyMonth == 12) {
    dummyYr++
    dummyMonth = 0
  }
  let seasonProg = calcColorLerp(dummyMonth / 12)
  background(seasonProg)
  growth += (dummyMonth / 12)
  if (radius +  (5 / 12) < maxSize) {
    radius += (5 / 12)
  }
  drawRings(startingYr + growth)
}