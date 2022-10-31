var startingYr;
var growth = 0;
var maxSize;
var yearSelect;
var userPromptedInputButton;
var completedUserPromptedInput;
var inputOptions = new Array("It's been a difficult season...", "Lots of growth lately!");
var inputOptionsCheckBoxes = new Array();
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
var tree = { rings: new Array(), age: 21, radius: 0 };
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
    userPromptedInputButton = createButton("Share something with the tree", 0);
    userPromptedInputButton.position(10, 30);
    userPromptedInputButton.mousePressed(onInputButtonPressed);
    yearSelect = createSelect();
    yearSelect.position(10, 10);
    for (var i = year() - 100; i <= year(); i++) {
        yearSelect.option(i.toString(), i);
    }
    yearSelect.changed(onYoBSelected);
    var foo = tree.age * 5;
    calcRings(tree.age, foo);
    drawRingsViaInterface();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function calcRadiusPerRing() {
    return tree.radius / tree.rings.length;
}
function drawRingsViaInterface() {
    tree.rings.forEach(function (ring) {
        beginShape();
        for (var i = 0; i < ring.shapeNs.length; i++) {
            curveVertex(ring.shapeXs[i] + ring.shapeNs[i], ring.shapeYs[i] + ring.shapeNs[i]);
            endShape();
        }
    });
}
function setupCheckboxes() {
    userPromptedInputButton.hide();
    if (inputOptionsCheckBoxes.length == inputOptions.length) {
        inputOptionsCheckBoxes.forEach(function (value) {
            value.show();
        });
        completedUserPromptedInput.show();
        return;
    }
    var pos = 50;
    inputOptions.forEach(function (value, index) {
        console.log(value);
        inputOptionsCheckBoxes.push(createCheckbox(value));
        inputOptionsCheckBoxes[index].position(10, pos);
        pos += 20;
    });
    completedUserPromptedInput = createButton("All done for now");
    completedUserPromptedInput.mousePressed(onInputButtonPressed);
    completedUserPromptedInput.position(10, pos);
}
function hideCheckboxes() {
    inputOptionsCheckBoxes.forEach(function (value) {
        value.hide();
    });
    completedUserPromptedInput.hide();
    userPromptedInputButton.show();
}
function onYoBSelected() {
    var yearSelected = yearSelect.value();
    tree.age = year() - yearSelected;
    tree.rings = Array();
    tree.radius = 0;
    if (tree.age * 5 >= maxSize / 2) {
        var newRadius = tree.age * 4;
        calcRings(tree.age, newRadius);
    }
    else {
        var newRadius = tree.age * 5;
        calcRings(tree.age, newRadius);
    }
    drawRingsViaInterface();
}
function onInputButtonPressed() {
    console.log(userPromptedInputButton);
    if (userPromptedInputButton.value() == 0) {
        setupCheckboxes();
        userPromptedInputButton.value(1);
    }
    else {
        hideCheckboxes();
        userPromptedInputButton.value(0);
    }
}
var scaleVar = 50;
var resolution = 0.002;
var numPoints = 500;
function calcRings(numNewRings, newRadius) {
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
        calcRings(growth, growth * 5);
    }
    drawRingsViaInterface();
}
//# sourceMappingURL=build.js.map