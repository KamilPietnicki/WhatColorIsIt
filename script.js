$( document ).ready(function() {

  //Key DOM elements variables
  var page           = $('#background');
  var textTime       = $('#text');
  var textHex        = $('#hex');
  var settingsButton = $('#settings_icon');
  var settingsMenu   = $('#settings_menu');

  //Setting toggles variables
  var setting_doubleColour = $('#doubleColour');

  //Time related variables
  var dt;
  var time;
  var hours;
  var minutes;
  var seconds;

  //Other variables
  var hexValue;
  var timeout = null;
  var doubleColour = false;

  //Initial function calls
  getTime();
  setTime();

  //Calls functions every 10ms
  setInterval(function() {
    getTime();
    setTime();
  }, 100);

  //Displays Time, Hex code and changes background
  function setTime() {
    textTime.text(time);
    textHex.text(hexValue);
    page.css('background', hexValue);
  }

  //Gets the current time
  function getTime() {
    dt      = new Date();
    hours   = dt.getHours();
    minutes = dt.getMinutes();
    seconds = dt.getSeconds();

    if (doubleColour) {
      checkDigitsDouble(hours, minutes, seconds);
      checkDigits(hours, minutes, seconds);
    } else {
      checkDigits(hours, minutes, seconds);
    }
  }

  //Adds a 0 infront of digits less than 10
  function minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }

  //Checks for any digits that are less than 10
  function checkDigits(h, m, s) {
    h = minTwoDigits(h);
    m = minTwoDigits(m);
    s = minTwoDigits(s);

    setTimeValue(h, m, s);

    if (!doubleColour) {
      setHexValue(h, m, s);  
    };
  }

  //Runs when double colour intensity is enabled
  function checkDigitsDouble(h, m, s) {
    h = minTwoDigits(h * 2);
    m = minTwoDigits(m * 2);
    s = minTwoDigits(s * 2);

    setHexValue(h, m, s);
  }

  //Sets the value of time and hex variables
  function setTimeValue(h, m, s) {
    time = h + " : " + m + " : " + s;
  }

  function setHexValue(h, m, s) {
    hexValue = '#' + h + m + s;
  }

  //Toggles settings menu
  settingsButton.click(function() {
    settingsMenu.fadeToggle(500);
  });

  //Checks if the setting 'Double Colour Intensity' is enabled
  setting_doubleColour.click(function () {
    if (this.checked) {
      doubleColour = true;
    } else {
      doubleColour = false;
    }
  });

  //Fades out settings icon when the mouse is idle
  $(document).on('mousemove', function() {
      clearTimeout(timeout);
      settingsButton.fadeIn(1000);

      timeout = setTimeout(function() {
          settingsButton.fadeOut(1000);
      }, 5000);
  });
});
