
var rowSize = 100; // => container height / number of items
var container = document.querySelector(".container");
var listItems = Array.from(document.querySelectorAll(".list-item")); // Array of elements
var sortables = listItems.map(Sortable); // Array of sortables
var total = sortables.length;

var Decimal = true;
var alphabetical = false;

var score = 0;

randomize_decimal();

// if the li element in header with and id of "alphabetical" is clicked, then set the value of the variable alphabetical to true
document.getElementById("alphabetical").addEventListener("click", function () {
  Decimal = false;
  alphabetical = true;
  console.log("alphabetical");
  randomize_alphabetical();
}
);
document.getElementById("decimal").addEventListener("click", function () {
  alphabetical = false;
  Decimal = true;
  console.log("decimal");
  randomize_decimal()
}
);

// fuction that replaces all of the item contents with random numbers from 1 to 999 with 3 decimal places
function randomize_decimal() {
  for (var i = 0; i < listItems.length; i++) {
    var random = Math.random() * 999;
    var rounded = Math.round(random * 1000) / 1000;
    listItems[i].children[0].innerHTML = rounded;
  }
}


// generate a random string with length of n with the first letter capitalized and the rest lowercase
function randomString(n) {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i < n; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// replace the contents of the list items with random strings of length 3-10
function randomize_alphabetical() {
  for (var i = 0; i < listItems.length; i++) {
    listItems[i].children[0].innerHTML = randomString(Math.floor(Math.random() * 8) + 3);
  }
}



// function that checks if the list is sorted by the value of the list item content
function checkSorted_decimal() {
  let items = [];
  for (var i = 0; i < listItems.length; i++) {
    var style = window.getComputedStyle(listItems[i]);
    var matrix = new WebKitCSSMatrix(style.transform);
    items.push([listItems[i].children[0].innerHTML,matrix.m42]);
  }
  items = sortBy(items, 1);
  console.log(items);

  previous = items[0][1];
  for (var i = 1; i < items.length; i++) {
    if (items[i][1] < previous) {
      return false;
    }
    previous = items[i][1];
  }
  console.log("decimal");
  return true;
}

// sort 2d array by the first element
function sortBy(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

// fuctions that checks if the list is sorted by alphabetical order
function checkSorted_alphabetical() {
  let items = [];
  for (var i = 0; i < listItems.length; i++) {
    var style = window.getComputedStyle(listItems[i]);
    var matrix = new WebKitCSSMatrix(style.transform);
    items.push([matrix.m42,listItems[i].children[0].innerHTML]);
  }
  items = sortBy(items, 0);
  console.log(items);
  // check if the list is sorted by alphabetical order
  previous = items[0][1];
  for (var i = 1; i < items.length; i++) {
    if (items[i][1] < previous) {
      return false;
    }
    previous = items[i][1];
  }
  return true;
}


// check if button with id of "check" is clicked
document.getElementById("check").addEventListener("click", function () {
  if (Decimal) {
    if (checkSorted_decimal()) {
      score++;
      document.getElementById("score").innerHTML = "Score: "+score;
      randomize_decimal();
    } else {
      
    }
  } else {
    if (checkSorted_alphabetical()) {
      score++;
      document.getElementById("score").innerHTML = "Score: "+score;
      randomize_alphabetical();
    } else {
      
    }
  }
});



TweenLite.to(container, 0.5, { autoAlpha: 1 });

function changeIndex(item, to) {

  // Change position in array
  arrayMove(sortables, item.index, to);

  // Change element's position in DOM. Not always necessary. Just showing how.
  if (to === total - 1) {
    container.appendChild(item.element);
  } else {
    var i = item.index > to ? to : to + 1;
    container.insertBefore(item.element, container.children[i]);
  }

  // Set index for each sortable
  sortables.forEach((sortable, index) => sortable.setIndex(index));
}

function Sortable(element, index) {

  var content = element.querySelector(".item-content");

  var animation = TweenLite.to(content, 0.3, {
    boxShadow: "rgba(0,0,0,0.2) 0px 16px 32px 0px",
    force3D: true,
    scale: 1.1,
    paused: true });


  var dragger = new Draggable(element, {
    onDragStart: downAction,
    onRelease: upAction,
    onDrag: dragAction,
    cursor: "inherit",
    type: "y" });


  // Public properties and methods
  var sortable = {
    dragger: dragger,
    element: element,
    index: index,
    setIndex: setIndex };


  TweenLite.set(element, { y: index * rowSize });

  function setIndex(index) {

    sortable.index = index;

    // Don't layout if you're dragging
    if (!dragger.isDragging) layout();
  }

  function downAction() {
    animation.play();
    this.update();
  }

  function dragAction() {

    // Calculate the current index based on element's position
    var index = clamp(Math.round(this.y / rowSize), 0, total - 1);

    if (index !== sortable.index) {
      changeIndex(sortable, index);
    }
  }

  function upAction() {
    animation.reverse();
    layout();
  }

  function layout() {
    TweenLite.to(element, 0.3, { y: sortable.index * rowSize });
  }

  return sortable;
}

// Changes an elements's position in array
function arrayMove(array, from, to) {
  array.splice(to, 0, array.splice(from, 1)[0]);
}

// Clamps a value to a min/max
function clamp(value, a, b) {
  return value < a ? a : value > b ? b : value;
}

