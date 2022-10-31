// Starting point/reference: https://gorillasun.de/blog/radial-perlin-noise-and-generative-tree-rings

let growth : number = 0
let maxSize : number
let story: p5.Table
let timing: p5.Table
let yearSelect : p5.Element
let font : p5.Font
let userPromptedInputButton: p5.Element
let completedUserPromptedInput : p5.Element
const inputOptions: Array<string> = new Array<string>("The seasons have not been kind; the tree's limbs ache under their own weight", "The sky seems closer lately", "Can you hear the birds roosting in the branches?", "Look how the wind plucks the leaves from their branches")
let inputOptionsCheckBoxes: Array<p5.Element> = new Array<p5.Element>()
let givenUserInput: Array<boolean> = new Array<boolean>()
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

interface Story {
  name: string
  numYrsPerCycle: number
  text: Array<string>
}

interface Ring {
  shapeXs: Array<number>
  shapeYs: Array<number>
  shapeNs: Array<number>
}

interface Tree {
  rings: Array<Ring>
  age: number
  radius: number
}

let tree: Tree = {rings: new Array<Ring>(), age: 21, radius: 0}
let stories = new Array<Story>()

function preload() {
  story = loadTable('../tree_story.csv', 'header') as p5.Table
  timing = loadTable('../tree_story_timing.csv', 'header') as p5.Table
  font = loadFont('../IMFellDWPica-Italic.ttf')
}

function setupStory(story: p5.Table, timing: p5.Table){
  story.columns.forEach((value) => {
    let col = story.getColumn(value)
    let filteredCol = col.filter(i => i)
    let numYrs = parseInt(timing.getColumn(value)[0])
    stories.push({ name: value, text: filteredCol, numYrsPerCycle: numYrs })
  })
  console.log(stories)
}

function setup() {
  setupStory(story, timing)
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
  textAlign(CENTER, TOP)
  textSize(maxSize/40)
  textFont(font)
  userPromptedInputButton = createButton("Share something with the tree...", "checkboxes hidden")
  userPromptedInputButton.position(10, 30)
  userPromptedInputButton.mousePressed(onInputButtonPressed)
  yearSelect = createSelect()
  yearSelect.position(10,10)
  for (let i = year() - 100; i <= year(); i++) {
    yearSelect.option(i.toString(), i)
  }
  yearSelect.changed(onYoBSelected)
  let foo = tree.age * 5
  //console.log(radius)
  calcRings(tree.age, foo)
  drawRingsViaInterface()
  handleStory()
}

function windowResized() { 
  // resizeCanvas(windowWidth, windowHeight)
  // TODO: make tree ring positioning responsive? store canvas dims and w new window sz?
}

function calcRadiusPerRing() {
  return tree.radius / tree.rings.length
}

function drawRingsViaInterface() {
  tree.rings.forEach(ring => {
    //console.log(ring)
    beginShape()
    for (let i = 0; i < ring.shapeNs.length; i++) {
      //console.log(ring)
      curveVertex(ring.shapeXs[i] + ring.shapeNs[i], ring.shapeYs[i] + ring.shapeNs[i])
      endShape()
  }
})
}

function handleStory() {
  let minAbsVal = Infinity
  let display : string
  stories.forEach(value => {
    let storyByMonths = value.text.length / (value.numYrsPerCycle * 12)
    let storyIdx = (((tree.age + growth) * 12) * storyByMonths) % (value.numYrsPerCycle * 12)
    let dist = Math.abs(Math.round(storyIdx) - storyIdx)
    if (dist < minAbsVal) {
      minAbsVal = dist
      display = value.text[Math.round(storyIdx)]
    }
  })
  fill(20)
  text(display, width/4, height/20, width/2)
  noFill()
}

function setupCheckboxes() {
  userPromptedInputButton.hide()
  if (inputOptionsCheckBoxes.length == inputOptions.length) {
    inputOptionsCheckBoxes.forEach((value) => {
      value.show()
    })
    completedUserPromptedInput.show()
    return
  }
  let pos = 50
  inputOptions.forEach((value, index) => {
    console.log(value)
    inputOptionsCheckBoxes.push(createCheckbox(value))
    inputOptionsCheckBoxes[index].position(10, pos)
    pos += 20
  })
  completedUserPromptedInput = createButton("All done for now")
    completedUserPromptedInput.mousePressed(onInputButtonPressed)
    completedUserPromptedInput.position(10, pos)
}

function hideCheckboxes() {
  inputOptionsCheckBoxes.forEach((value) => {
    value.hide()
  })
  completedUserPromptedInput.hide()
  userPromptedInputButton.show()
}

function onYoBSelected() {
  let yearSelected = yearSelect.value() as number
  yearSelect.remove()
  tree.age = year() - yearSelected
  tree.rings = Array<Ring>()
  tree.radius = 0
  // TODO: how can I calculate radius as a ratio of both age and maxSize?
  if (tree.age * 5 >= maxSize / 2) {
    let newRadius = tree.age * 4
    calcRings(tree.age, newRadius)
  } else {
    let newRadius = tree.age * 5
    calcRings(tree.age, newRadius)
  }
  drawRingsViaInterface()
}

function onInputButtonPressed() {
  console.log(userPromptedInputButton)
  if (userPromptedInputButton.value() == "checkboxes hidden") {
    setupCheckboxes()
    userPromptedInputButton.value("checkboxes shown")
  } else {
    hideCheckboxes()
    userPromptedInputButton.value("checkboxes hidden")
  }
}

function parseUserInputFromCheckboxes() {
 // TODO
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
  handleStory()
}

function keyPressed() {
  dummyMonth ++
  if (dummyMonth == monthsInYear) {
    dummyMonth = 0
  }
  let seasonProg = calcColorLerp(dummyMonth / monthsInYear)
  background(seasonProg)
  growth += (1 / monthsInYear)
  if (growth >= 1) {
    calcRings(growth, growth * 5)
  }
  drawRingsViaInterface()
  handleStory()
}