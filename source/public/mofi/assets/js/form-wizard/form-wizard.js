"use strict";
// 2. Numbering wizard
var form = document.getElementById("msform");
document.getElementById("backbtn").disabled = true;
var fieldsets = form.querySelectorAll("form");
var currentStep = 0;
var numSteps = 5;

for (var i = 1; i < fieldsets.length; i++) {
  fieldsets[i].style.display = "none";
}

function scrollToElementIfNotVisible(elementId) {
  var element = document.getElementById(elementId);
  var rect = element.getBoundingClientRect();
  var isVisible = (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
  if (!isVisible) {
    element.scrollIntoView({ behavior: 'auto' });
  }
}

function nextStep() {
  document.getElementById("backbtn").disabled = false;
  currentStep++;
  if (currentStep > numSteps) {
    currentStep = 1;
  }
  var stepper = document.getElementById("stepper1");
  var steps = stepper.getElementsByClassName("step");

  Array.from(steps).forEach((step, index) => {
    let stepNum = index + 1;
    let stepLength = steps.length;
    if (stepNum === currentStep && currentStep < stepLength) {
      addClass(step, "editing");
      fieldsets[currentStep].style.display = "flex";
      // Scroll to element only if not visible
      scrollToElementIfNotVisible("formulir_mcu");
    } else {
      removeClass(step, "editing");
    }
    if (stepNum <= currentStep && currentStep < stepLength) {
      addClass(step, "done");
      addClass(step, "active");
      removeClass(step, "editing");
      fieldsets[currentStep - 1].style.display = "none";
    } else {
      removeClass(step, "done");
    }
    if (currentStep == stepLength - 1) {
      document.getElementById("nextbtn").textContent = "Selesai";
    }
    if (currentStep > stepLength - 1) {
      document.getElementById("nextbtn").textContent = "Selesai";
      addClass(step, "done");
      addClass(step, "active");
      removeClass(step, "editing");
      document.getElementById("nextbtn").disabled = true;
    }
  });
}

function backStep() {
  currentStep--;
  var stepper = document.getElementById("stepper1");
  var steps = stepper.getElementsByClassName("step");
  let stepLength = steps.length;
  document.getElementById("nextbtn").textContent = "Selanjutnya";
  document.getElementById("nextbtn").disabled = false;
  if (currentStep < stepLength - 1) {
    document.getElementById("backbtn").disabled = false;
    fieldsets[currentStep + 1].style.display = "none";
    fieldsets[currentStep].style.display = "flex";
    removeClass(steps[currentStep], "done");
    removeClass(steps[currentStep], "active");
    // Scroll to element only if not visible
    scrollToElementIfNotVisible("formulir_mcu");
    if (currentStep == 0) {
      document.getElementById("backbtn").disabled = true;
    }
  } else {
    removeClass(steps[currentStep], "done");
    removeClass(steps[currentStep], "active");
  }
}


// function prevStep(){
//   fieldsets[currentStep].style.display = "none";
//   currentStep--;
//   fieldsets[currentStep].style.display = "block";
// }

/* get, set class, see https://ultimatecourses.com/blog/javascript-hasclass-addclass-removeclass-toggleclass */

function hasClass(elem, className) {
  return new RegExp(" " + className + " ").test(" " + elem.className + " ");
}

function addClass(elem, className) {
  if (!hasClass(elem, className)) {
    elem.className += " " + className;
  }
}

function removeClass(elem, className) {
  console.log("elem, className", elem, className);
  var newClass = " " + elem.className.replace(/[\t\r\n]/g, " ") + " ";
  if (hasClass(elem, className)) {
    while (newClass.indexOf(" " + className + " ") >= 0) {
      newClass = newClass.replace(" " + className + " ", " ");
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, "");
  }
  console.log("elem.className", elem.className);
}
