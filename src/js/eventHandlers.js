//Timebar

document.getElementsByClassName("timeReset")[0].addEventListener("click",
  function() {
    chronoSphere.resetToPresent();
  }, false);


//Change time
document.getElementsByClassName("yearB")[0].addEventListener("click",
  function() {
    chronoSphere.changeTime(-1, "years");
  }, false);

document.getElementsByClassName("monthB")[0].addEventListener("click",
  function() {
    chronoSphere.changeTime(-1, "months");
  }, false);

document.getElementsByClassName("dayB")[0].addEventListener("click",
  function() {
    chronoSphere.changeTime(-1, "days");
  }, false);

document.getElementsByClassName("hourB")[0].addEventListener("click",
  function() {
    chronoSphere.changeTime(-1, "hours");
  }, false);

document.getElementsByClassName("hourA")[0].addEventListener("click",
  function() {
    chronoSphere.changeTime(1, "hours");
  }, false);

document.getElementsByClassName("dayA")[0].addEventListener("click",
  function() {
    chronoSphere.changeTime(1, "days");
  }, false);

document.getElementsByClassName("monthA")[0].addEventListener("click",
  function() {
    chronoSphere.changeTime(1, "months");
  }, false);

document.getElementsByClassName("yearA")[0].addEventListener("click",
  function() {
    chronoSphere.changeTime(1, "years");
  }, false);