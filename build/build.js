var startingYr;
var growth = 0;
var maxSize;
var radius;
var yearSelect;
var dobMonth = 12 * 21 + 8;
var monthsInYear = 12;
var daysInMonth = new Map([[1, 31], [2, 28], [3, 31], [4, 30], [5, 31], [6, 30], [7, 31], [8, 31], [9, 30], [10, 31], [11, 30], [12, 31]]);
var hoursInDay = 24;
var minsInHour = 60;
var secsInMinute = 60;
var winterSwatch;
var springSwatch;
var summerSwatch;
var fallSwatch;
var dummyMonth = 0;
var dummyYr = 0;
function setup() {
    winterSwatch = color(201, 227, 247);
    springSwatch = color(216, 233, 221);
    summerSwatch = color(239, 230, 234);
    fallSwatch = color(240, 225, 209);
    var startYrProgress = calcProgressThruYear();
    var startLerpColor = calcColorLerp(startYrProgress);
    createCanvas(windowWidth, windowHeight);
    maxSize = min(windowWidth, windowHeight);
    colorMode(RGB);
    frameRate(1);
    background(startLerpColor);
    stroke(20);
    strokeWeight(1);
    noFill();
    yearSelect = createSelect();
    yearSelect.position(10, 10);
    for (var i = year() - 100; i <= year(); i++) {
        yearSelect.option(i.toString(), i);
    }
    yearSelect.changed(onYoBSelected);
    startingYr = (year() - 2001);
    radius = startingYr * 5;
    console.log(radius);
    drawRings(startingYr);
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function onYoBSelected() {
    var yearSelected = yearSelect.value();
    startingYr = year() - yearSelected;
    if (startingYr * 5 >= maxSize) {
        radius = startingYr;
    }
    else {
        radius = startingYr * 5;
    }
    drawRings(startingYr);
}
var scaleVar = 50;
var resolution = 0.002;
var numPoints = 500;
function drawRings(numRings) {
    for (var r = 0; r < radius; r += radius / numRings) {
        beginShape();
        for (var a = -TAU / numPoints; a < TAU + TAU / numPoints; a += TAU / numPoints) {
            var x = width / 2 + r * cos(a);
            var y = height / 2 + r * sin(a);
            var n = map(noise(x * resolution, y * resolution), 0, 1, -scaleVar, scaleVar);
            curveVertex(x + n, y + n);
            if (random() > 0.75 - 0.25 * sin(r)) {
                endShape();
                beginShape();
            }
        }
        endShape();
    }
}
function calcProgressThruYear() {
    var minuteProgress = second() / secsInMinute;
    var hourProgress = (minute() + minuteProgress) / minsInHour;
    var dayProgress = (hour() + hourProgress) / hoursInDay;
    return (month() + ((day() + dayProgress) / daysInMonth.get(month()))) / monthsInYear;
}
function calcColorLerp(yearProg) {
    var seasonProg;
    if (yearProg <= 0.25) {
        seasonProg = yearProg / .25;
        return lerpColor(winterSwatch, springSwatch, seasonProg);
    }
    else if (yearProg <= 0.50) {
        seasonProg = (yearProg - 0.25) / .25;
        return lerpColor(springSwatch, summerSwatch, seasonProg);
    }
    else if (yearProg <= 0.75) {
        seasonProg = (yearProg - 0.5) / .25;
        return lerpColor(summerSwatch, fallSwatch, seasonProg);
    }
    else {
        return lerpColor(fallSwatch, winterSwatch, yearProg);
    }
}
function draw() {
    if (!dummyMonth) {
        var yearProg = calcProgressThruYear();
        var seasonProg = calcColorLerp(yearProg);
        background(seasonProg);
    }
    else {
        var seasonProg = calcColorLerp(dummyMonth / 12);
        background(seasonProg);
    }
    if (radius + 3.17057705e-8 * 5 < maxSize) {
        radius += 3.17057705e-8 * 5;
    }
    growth += 3.17057705e-8;
    drawRings(startingYr + growth);
}
function keyPressed() {
    dummyMonth++;
    if (dummyMonth == 12) {
        dummyYr++;
        dummyMonth = 0;
    }
    var seasonProg = calcColorLerp(dummyMonth / 12);
    background(seasonProg);
    growth += (dummyMonth / 12);
    if (radius + (5 / 12) < maxSize) {
        radius += (5 / 12);
    }
    drawRings(startingYr + growth);
}
//# sourceMappingURL=build.js.map