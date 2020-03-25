var circleItem = document.querySelector("#mycircle");
var container = document.querySelector("#container");
var goalItem = document.querySelector("#goal");
var squareItem = document.querySelector("#square");
var triangleItem = document.querySelector("#triangle");
var reverseTriangleItem = document.querySelector("#r_triangle");

var circleActive = false;
var circleCurrentX;
var circleCurrentY;
var circleInitialX;
var circleInitialY;
var circlexOffset;
var circleyOffset;

var goalInitialX;
var goalInitialY;
var isIncreasedGoal = false;

var squareInitialX;
var squareInitialY;

var triangleInitialX;
var triangleInitialY;

var reverseTriangleInitialX;
var reverseTriangleInitialY;

var counterValue = 0;

var mouseData = []
var initialTimestamp = new Date().valueOf()

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);
squareItem.addEventListener("dblclick", squareClick, false);
triangle.addEventListener("click", triangleClick, false);
reverseTriangleItem.addEventListener('contextmenu', e => {
    e.preventDefault();
    reverseTriangleClick();
  });

container.addEventListener("mousemove", mouseMove);
container.addEventListener("mouseup", mouseUp);  
container.addEventListener("mousedown", mouseDown);
document.getElementById("download_csv").addEventListener("click", download_csv);

window.onload = function() {

  modal.style.display = "block";
};

function getNewProblem() {

  hideAllElement();
  problemNum = randomInteger(0, 1000);

  if (problemNum % 6 == 0) {
    getReverseTriangleProblem();
    document.getElementById("instructionSpan").innerHTML = "Press Right Click on the Reversed Triangle!"
  } else{
    problemNum = problemNum % 3;

    if (problemNum == 0) {
      getCircleProblem();
      document.getElementById("instructionSpan").innerHTML = "Drop the Circle to the Goal Position!"
    } else if (problemNum == 1) {
      getSquareProblem();
      document.getElementById("instructionSpan").innerHTML = "Press Double Click on the Square!"
    } else {
      getTriangleProblem();
      document.getElementById("instructionSpan").innerHTML = "Press Left Click on the Triangle!"
    }
  }
}

function getCircleProblem() {

  setGoalRandomCoordinates();
  setCircleRandomCoordinates();
  document.getElementById("mycircle").style.visibility = "visible";
  document.getElementById("goal").style.visibility = "visible";
}

function getSquareProblem() {

  setSquareRandomCoordinates();
  document.getElementById("square").style.visibility = "visible";
}

function getTriangleProblem() {

  setTriangleRandomCoordinates();
  document.getElementById("triangle").style.visibility = "visible";
}

function getReverseTriangleProblem() {

  setReverseTriangleRandomCoordinates();
  document.getElementById("r_triangle").style.visibility = "visible";
}

function setSquareRandomCoordinates() {

  obj_width = document.getElementById('square').offsetWidth;
  tolerance = 30;
  squareInitialX = randomInteger(tolerance, document.getElementById('container').clientWidth - obj_width - tolerance);
  squareInitialY = randomInteger(tolerance, document.getElementById('container').clientHeight - obj_width - tolerance);
  setTranslate(squareInitialX, squareInitialY, squareItem); 
}

function setTriangleRandomCoordinates() {

  obj_width = document.getElementById('triangle').offsetWidth;
  tolerance = 30;
  triangleInitialX = randomInteger(tolerance, document.getElementById('container').clientWidth - obj_width - tolerance);
  triangleInitialY = randomInteger(tolerance, document.getElementById('container').clientHeight - obj_width - tolerance);
  setTranslate(triangleInitialX, triangleInitialY, triangleItem); 
}

function setReverseTriangleRandomCoordinates() {

  obj_width = document.getElementById('r_triangle').offsetWidth;
  tolerance = 30;
  reverseTriangleInitialX = randomInteger(tolerance, document.getElementById('container').clientWidth - obj_width - tolerance);
  reverseTriangleInitialY = randomInteger(tolerance, document.getElementById('container').clientHeight - obj_width - tolerance);
  setTranslate(reverseTriangleInitialX, reverseTriangleInitialY, reverseTriangleItem); 
}

function randomInteger(min, max) {

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setCircleRandomCoordinates() {

  obj_width = document.getElementById('goal').offsetWidth;
  tolerance = 30;
  min_obj_distance = 100;

  do {
    circlexOffset = randomInteger(tolerance, document.getElementById('container').clientWidth - obj_width - tolerance);
  } while ( ((circlexOffset + obj_width + min_obj_distance) > goalInitialX) && (circlexOffset < (goalInitialX + obj_width + min_obj_distance)) );

  circleyOffset = randomInteger(tolerance, document.getElementById('container').clientHeight - obj_width - tolerance);

  setTranslate(circlexOffset, circleyOffset, circleItem); 
}

function setGoalRandomCoordinates() {

  obj_width = document.getElementById('goal').offsetWidth;
  tolerance = 30;
  goalInitialX = randomInteger(tolerance, document.getElementById('container').clientWidth - obj_width - tolerance);
  goalInitialY = randomInteger(tolerance, document.getElementById('container').clientHeight - obj_width - tolerance);
  setTranslate(goalInitialX, goalInitialY, goalItem); 
}

function download_csv() {

  var csv = "client timestamp,button,state,x,y\n";
  mouseData.forEach(function(row) {
      csv += row.join(',');
      csv += "\n";
  });

  console.log(csv);
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'session_' + counterValue + 'min' + '.csv';
  hiddenElement.click();
}

function mouseMove(e) {

  var tmpData;
  switch(e.buttons) {
    case 0:
      tmpData = [new Date().valueOf() - initialTimestamp, 'NoButton', 'Move', e.clientX, e.clientY]
      break;
    case 1:
      tmpData = [new Date().valueOf() - initialTimestamp, 'Left', 'Drag', e.clientX, e.clientY]
      break;
    case 2:
      tmpData = [new Date().valueOf() - initialTimestamp, 'Right', 'Drag', e.clientX, e.clientY]
      break;
    default:
      tmpData = [new Date().valueOf() - initialTimestamp, 'Other', 'Drag', e.clientX, e.clientY]
  }

  mouseData.push(tmpData);
}

function mouseUp(e) {

  var tmpData;
  switch(e.which) {
    case 1:
      tmpData = [new Date().valueOf() - initialTimestamp, 'Left', 'Released', e.clientX, e.clientY]
      break;
    case 3:
      tmpData = [new Date().valueOf() - initialTimestamp, 'Right', 'Released', e.clientX, e.clientY]
      break;
    default:
      tmpData = [new Date().valueOf() - initialTimestamp, 'Other', 'Released', e.clientX, e.clientY]
  }

  mouseData.push(tmpData);
}

function mouseDown(e) {

  switch(e.buttons) {
    case 1:
      tmpData = [new Date().valueOf() - initialTimestamp, 'Left', 'Pressed', e.clientX, e.clientY]
      break;
    case 2:
      tmpData = [new Date().valueOf() - initialTimestamp, 'Right', 'Pressed', e.clientX, e.clientY]
      break;
    default:
      tmpData = [new Date().valueOf() - initialTimestamp, 'Other', 'Pressed', e.clientX, e.clientY]
  }

  mouseData.push(tmpData);
}

function squareClick() {

  getNewProblem();
}

function triangleClick() {

  getNewProblem();
}

function reverseTriangleClick() {

  getNewProblem();
}

function dragStart(e) {
  circleInitialX = e.clientX - circlexOffset;
  circleInitialY = e.clientY - circleyOffset;

  if (e.target === circleItem) {
    circleActive = true;
  }
}

function hideAllElement() {

  document.getElementById("mycircle").style.visibility = "hidden";
  document.getElementById("goal").style.visibility = "hidden";
  document.getElementById("square").style.visibility = "hidden";
  document.getElementById("triangle").style.visibility = "hidden";
  document.getElementById("r_triangle").style.visibility = "hidden";
}

function dragEnd(e) {

  circleInitialX = circleCurrentX;
  circleInitialY = circleCurrentY;

  circleActive = false;

  if (isCircleInGoal() && e.target === circleItem) {
    getNewProblem();
    resetGoalSize();
  }
}

function drag(e) {

  if (circleActive) {
    e.preventDefault();

    circleCurrentX = e.clientX - circleInitialX;
    circleCurrentY = e.clientY - circleInitialY;

    circlexOffset = circleCurrentX;
    circleyOffset = circleCurrentY;

    setTranslate(circleCurrentX, circleCurrentY, circleItem);

    if ( isCircleInGoal()) {
      increaseGoalSize();
    } else if (isIncreasedGoal == true) {
      resetGoalSize();
    }
  }
}

function isCircleInGoal() {

  goalWidth = document.getElementById('goal').offsetWidth - 20;
  goalHeight = document.getElementById('goal').offsetHeight - 20;
  circleWidth = document.getElementById('mycircle').offsetWidth;
  circleHeight = document.getElementById('mycircle').offsetHeight;

  circleEndX = circleCurrentX + circleWidth;
  circleEndY = circleCurrentY + circleHeight;
  goalEndX = goalInitialX + goalWidth;
  goalEndY = goalInitialY + goalHeight;

  if ( ( (circleEndX < goalEndX) && (circleEndX > goalInitialX) && (circleEndY > goalInitialY) && (circleEndY < goalEndY) ) ||
      ( (circleCurrentX > goalInitialX) && (circleCurrentX < goalEndX) && (circleEndY > goalInitialY) && (circleEndY < goalEndY) ) ||
      ( (circleEndX > goalInitialX) && (circleEndX < goalEndX) && (circleCurrentY > goalInitialY) && (circleCurrentY < goalEndY) ) ||
      ( (circleCurrentX > goalInitialX) && (circleCurrentX < goalEndX) && (circleCurrentY > goalInitialY) && (circleCurrentY < goalEndY) ) ) {
    return true
  };

  return false;
}

function setTranslate(xPos, yPos, el) {

  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function increaseGoalSize() {

  if (isIncreasedGoal == false) {

    isIncreasedGoal = true;
    document.getElementById("goal").style.width = "120px";
    document.getElementById("goal").style.height = "120px";
    document.getElementById("goalTitle").style.padding = "35px 0px 0px 0px";
    goalInitialX = goalInitialX - 20;
    goalInitialY = goalInitialY - 20;
    setTranslate(goalInitialX, goalInitialY, goalItem);
  }
}

function resetGoalSize() {

  if (isIncreasedGoal == true) {

    isIncreasedGoal = false;
    document.getElementById("goal").style.width = "80px";
    document.getElementById("goal").style.height = "80px";
    document.getElementById("goalTitle").style.padding = "15px 0px 0px 0px";
    goalInitialX = goalInitialX + 20;
    goalInitialY = goalInitialY + 20;
    setTranslate(goalInitialX, goalInitialY, goalItem);
  }
}

var counterValue = 0;

function startCounter(){

  var countDownDate = new Date()
  countDownDate.setMinutes( countDownDate.getMinutes() + Number(counterValue) );
  // Update the count down every 1 second
  var countDownTimer = setInterval( function() {

    // Get today's date and time
    var now = new Date().getTime();
      
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
      
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
    // Output the result in an element with id="demo"
    document.getElementById("countDownTimer").innerHTML = minutes + "m " + seconds + "s left";
      
    // If the count down is over, write some text 
    if (distance < 0) {
      clearInterval(countDownTimer);
      document.getElementById("countDownTimer").innerHTML = "Session finished";
      download_csv();
    }
  }, 1000);
}

// Get the modal
var modal = document.getElementById("helpModal");

// Get the <span> element that closes the modal
var startMeasurementBtn = document.getElementById("startMeasurementBtn");

// When the user clicks on <span> (x), close the modal
startMeasurementBtn.onclick = function() {

  counterValue = document.getElementById("measurementPeriod").value;

  if (counterValue < 1 || counterValue > 60) {
    document.getElementById("measurementPeriodAlert").style.display = "block";
  } else {
    modal.style.display = "none";

    startCounter();
    getNewProblem();
  }
}

var resetMeasurementBtn = document.getElementById("resetBtn");

resetMeasurementBtn.onclick = function() {

  var response = confirm("Do you want to restart this session? All unsaved data will be deleted!");
  if (response == true) {
    location.reload();
  }
}