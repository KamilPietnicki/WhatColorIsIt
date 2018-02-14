$( document ).ready(function() {

  //Key DOM elements variables
  var page                  = $('#background');
  var textTime              = $('#text');
  var textHex               = $('#hex');
  var settingsButton        = $('#settings_icon');
  var settingsMenu          = $('#settings_menu');
  var timerStart            = $('#startTimer');
  var timerPause            = $('#pauseTimer');
  var arrow_dropDown        = $('.arrow_dropDown');
  var fontsContainer        = $('#fonts_container');
  var fontOptionContainer   = $('.font_option_container');

  //Setting variables
  var setting_doubleColour   = $('#doubleColour');
  var setting_inputHours     = $('#field-timer-hours');
  var setting_inputMinutes   = $('#field-timer-minutes');
  var setting_inputSeconds   = $('#field-timer-seconds');

  //Time related variables
  var dt;
  var time;
  var hours;
  var minutes;
  var seconds;

  var timerHours   = 0;
  var timerMinutes = 0;
  var timerSeconds = 0;

  //Other variables
  var alarmSound   = document.createElement('audio');
  var hexValue;
  var timeout      = null;
  var timerInterval;
  // var selectedFont;

  var menuClicked         = false;
  var doubleColour        = false;
  var startClicked        = false;
  var pauseClicked        = false;
  var fontsContainerOpen  = false;

  //Initial function calls
  getTime();
  setTime();
  changeFont();

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
    hexValue = h + m + s;

    if (doubleColour) {
      hexValue = fullColourHex(h, m, s);
    }

    hexValue = '#' + hexValue;
  }

  function fullColourHex (r, g, b) {
    var red   = convertToHex(r);
    var green = convertToHex(g);
    var blue  = convertToHex(b);

    return red + green + blue;
  }

  function convertToHex(n) {
    var hex = Number(n).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
  }

  //Toggles settings menu
  settingsButton.click(function() {
    if (!menuClicked) {
      settingsMenu.fadeIn(500);
      menuClicked = true;
    } else {
      settingsMenu.fadeOut(500);
      menuClicked = false;
    }
  });

  //Checks if the setting 'Double Colour Intensity' is enabled
  setting_doubleColour.click(function () {
    if (this.checked) {
      doubleColour = true;
    } else {
      doubleColour = false;
    }
  });

  //Prevent input of letterns & symbols into timer
  setting_inputHours.add
  (setting_inputMinutes).add
  (setting_inputSeconds).on('input' ,function (e) { 
    e.preventDefault();

    var value = $(this).val();
    
    if (!value.match(/^\d+$/)) {
      $(this).val("00");
    }

    timerHours   = parseInt(setting_inputHours.val());
  });

  //Set minutes & seconds to 59 if more than 60
  setting_inputMinutes.add
  (setting_inputSeconds).on('input' ,function (e) { 
    e.preventDefault();

    var value = $(this).val();
    var number = parseInt(value);

    if (number >= 60) {
      $(this).val("59");
    }

    timerMinutes = parseInt(setting_inputMinutes.val());
    timerSeconds = parseInt(setting_inputSeconds.val());
  });

  //handles timer start/reset button
  timerStart.click(function () { 
    if (startClicked) {
      timerStart.find('p').text("Start");
      startClicked = false;

      resetTimer();
    }

    else {
      timerStart.find('p').text("Reset");
      startClicked = true;

      startTimer();
    }
  });

  //handles timer pause/resume button
  timerPause.click(function () { 
    if (pauseClicked) {
      timerPause.find('p').text("Pause");
      pauseClicked = false;

      resumeTimer();
    }

    else {
      timerPause.find('p').text("Resume");
      pauseClicked = true;

      pauseTimer();
    }
  });

  function startTimer() {
    timerInterval = setInterval(startCountdown, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);

    timerHours   = "00";
    timerMinutes = "00";
    timerSeconds = "00";

    setting_inputHours.val(timerHours);
    setting_inputMinutes.val(timerMinutes);
    setting_inputSeconds.val(timerSeconds);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }

  function resumeTimer() {
    timerInterval = setInterval(startCountdown, 1000);
  }

  //counts down all the values in the timer
  function startCountdown() {
    timerSeconds--;
    timerSeconds = minTwoDigits(timerSeconds);
    setting_inputSeconds.val(timerSeconds);

    if (timerSeconds == "0-1") {

      if (timerHours == "00" && timerMinutes == "00") {
        clearInterval(timerInterval);

        timerSeconds = "00";
        setting_inputSeconds.val(timerSeconds);

        playAlarm();
      }

      else if (timerMinutes > 0) {
        timerMinutes--;
        timerMinutes = minTwoDigits(timerMinutes);
        setting_inputMinutes.val(timerMinutes);

        timerSeconds = 59;
        setting_inputSeconds.val(timerSeconds);
      }

      else if (timerHours > 0) {
        timerHours--;
        timerHours = minTwoDigits(timerHours);
        setting_inputHours.val(timerHours);

        timerMinutes = 59;
        setting_inputMinutes.val(timerMinutes);

        timerSeconds = 59;
        setting_inputSeconds.val(timerSeconds);
      }

    }
  }

  //Plays alarm sound
  function playAlarm() {
    alarmSound.setAttribute('src', 'stuff/alarm.mp3');
    alarmSound.play();
  }

  arrow_dropDown.click(function () { 
    if (fontsContainerOpen) {
      fontsContainer.slideUp();
      fontsContainerOpen = false;
    }

    else {
      fontsContainer.slideDown();
      fontsContainerOpen = true;
    }

    
  });

  fontOptionContainer.click(function () { 
    var activated = $(this).hasClass("font_selected");
    var selectedFont  = $(this).attr("data-id") ;

    localStorage.setItem("selectedFont", selectedFont);

    if (!activated) {
      fontOptionContainer.removeClass("font_selected");
      $(this).addClass("font_selected");
      changeFont();
    }

  });

  function changeFont() {
    var selectedFont = localStorage.getItem("selectedFont");

    switch(selectedFont) {
      case "font-1":
        textTime.css('font-family', 'Titillium Web');
        textHex.css('font-family', 'Titillium Web');
        break;

      case "font-2":
        textTime.css('font-family', 'Archivo Black');
        textHex.css('font-family', 'Archivo Black');
        break;

      case "font-3":
        textTime.css('font-family', 'Caveat');
        textHex.css('font-family', 'Caveat');
        break;

      case "font-4":
        textTime.css('font-family', 'Iceberg');
        textHex.css('font-family', 'Iceberg');
        break;

      case "font-5":
        textTime.css('font-family', 'Space Mono');
        textHex.css('font-family', 'Space Mono');
        break;

      case "font-6":
        textTime.css('font-family', 'Stardos Stencil');
        textHex.css('font-family', 'Stardos Stencil');
        break;
    }
  }


  fontOptionContainer.each(function(i) {
    var data = $(this).attr("data-id");
    var selectedFont = localStorage.getItem("selectedFont");

    if (selectedFont =! null && selectedFont == data) {
      fontOptionContainer.removeClass("font_selected");
      $(this).addClass("font_selected");
    }
  });



  //Fades out settings icon when the mouse is idle
  $(document).on('mousemove', function() {
    if (timeout !== null) {
      clearTimeout(timeout);
      settingsButton.fadeIn(500);

      if (menuClicked) {
        settingsMenu.fadeIn(500);
      }
    }

    timeout = setTimeout(function() {
      settingsButton.fadeOut(500);

      if (menuClicked) {
        settingsMenu.fadeOut(500);
      }
    }, 10000);
  });
});
