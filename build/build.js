var startingYr;
var growth = 0;
var maxSize;
var yearSelect;
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
var tree = { rings: new Array(), startingYr: 2001, radius: 0 };
function calcRadiusPerRing() {
    return tree.radius / tree.rings.length;
}
function drawRingsViaInterface() {
    var r = 0;
    var radiusPerRing = calcRadiusPerRing();
    tree.rings.forEach(function (ring) {
        beginShape();
        r += radiusPerRing;
        for (var i = 0; i < ring.shapeNs.length; i++) {
            curveVertex(ring.shapeXs[i] + ring.shapeNs[i], ring.shapeYs[i] + ring.shapeNs[i]);
            endShape();
        }
    });
}
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
    var foo = startingYr * 5;
    calcRings(startingYr, foo);
    drawRingsViaInterface();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function onYoBSelected() {
    var yearSelected = yearSelect.value();
    startingYr = year() - yearSelected;
    if (startingYr * 5 >= maxSize / 2) {
        var foo = startingYr * 3;
        calcRings(startingYr, foo);
    }
    else {
        var foo = startingYr * 5;
        calcRings(startingYr, foo);
    }
    drawRingsViaInterface();
}
var scaleVar = 50;
var resolution = 0.002;
var numPoints = 500;
function calcRings(numNewRings, newRadius) {
    console.log(tree.radius);
    console.log(newRadius);
    for (var r = tree.radius; r < tree.radius + newRadius; r += newRadius / numNewRings) {
        var shapeXs = Array();
        var shapeYs = Array();
        var shapeNs = Array();
        for (var a = -TAU / numPoints; a < TAU + TAU / numPoints; a += TAU / numPoints) {
            var x = width / 2 + r * cos(a);
            var y = height / 2 + r * sin(a);
            var n = map(noise(x * resolution, y * resolution), 0, 1, -scaleVar, scaleVar);
            shapeXs.push(x);
            shapeYs.push(y);
            shapeNs.push(n);
            if (random() > 0.75 - 0.25 * sin(r)) {
                tree.rings.push({ shapeXs: shapeXs, shapeYs: shapeYs, shapeNs: shapeNs });
                shapeXs = Array();
                shapeYs = Array();
                shapeNs = Array();
            }
        }
        tree.rings.push({ shapeXs: shapeXs, shapeYs: shapeYs, shapeNs: shapeNs });
    }
    tree.radius += newRadius;
    growth = 0;
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
        var seasonProg = calcColorLerp(dummyMonth / monthsInYear);
        background(seasonProg);
    }
    growth += 3.17057705e-8;
    if (growth >= 1) {
        console.log("hi");
        calcRings(growth, growth * 5);
    }
    drawRingsViaInterface();
}
function keyPressed() {
    dummyMonth++;
    if (dummyMonth == monthsInYear) {
        dummyMonth = 0;
    }
    var seasonProg = calcColorLerp(dummyMonth / monthsInYear);
    background(seasonProg);
    growth += (1 / monthsInYear);
    console.log(growth);
    if (growth >= 1) {
        console.log("asjdlfkds");
        calcRings(growth, growth * 5);
    }
    drawRingsViaInterface();
}
//# sourceMappingURL=build.js.map