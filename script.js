$( document ).ready(function() {

  var page     = $('#background');
  var textTime = $('#text');
  var textHex  = $('#hex');

  var dt;
  var time;
  var hours;
  var minutes;
  var seconds;

  var hexValue;

  getTime();
  setTime();

  setInterval(function() {
    getTime();
    setTime();
  }, 100);

  function setTime() {
    textTime.text(time);
    textHex.text(hexValue);
    page.css('background-color', hexValue);
  }

  function getTime() {
    dt      = new Date();
    hours   = dt.getHours();
    minutes = dt.getMinutes();
    seconds = dt.getSeconds();

    checkDigits(hours, minutes, seconds);
    convertToHex(hours, minutes, seconds);

  }

  function minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function checkDigits(h, m, s) {
    if (h >= 10 && m >= 10 && s >= 10) {
      time = h + " : " + m + " : " + s;
    } else {
      h = minTwoDigits(h);
      m = minTwoDigits(m);
      s = minTwoDigits(s);

      time = h + " : " + m + " : " + s;
    }
  }

  function convertToHex(h, m, s) {
    h = minTwoDigits(h);
    m = minTwoDigits(m);
    s = minTwoDigits(s);

    hexValue = '#' + h + m + s;
    console.log(hexValue);
  }
});
