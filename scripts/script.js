/* Informative, pithy general comments go here when I have time.
*/

var classmateArray = [];

var timerID = -1;
/* Initial timerID setting, to ensure that no timer gets accidentally
stopped at the beginning. */

var TIMER_DURATION = 10000;  // in milliseconds

function Classmate(first_name, last_name, picUrl, info) {
  // Classmate constructor function.
  this.first_name = first_name;
  this.last_name = last_name;
  this.picUrl = picUrl;
  this.info = info;
}

$(document).ready(function(){
  $.ajax({
    // Gets cohort data.
    url: 'http://devjana.net/support/tau_students.json',
    dataType: 'JSON',
    success: function(data){
      for (var i = 0; i < data.tau.length; i++) {
        classmateArray.push(new Classmate(data.tau[i].first_name, data.tau[i].last_name, data.tau[i].picUrl, data.tau[i].info));
      }
      buildNav();
      buildFrames();
      var startIndex = 0;
      $('#classmate' + startIndex).fadeIn();
      buttonHighlight(startIndex);
      resetInterval();
    },
    error: function(){
      alert('Unable to access JSON data. Please make sure that CORS is enabled. Reload page to try again.');
    }
  });
});

$(document).on('click', 'nav > button', function() {
  /* Navigation button handler. One of two ways frame change happens. */
  var buttonName = $(this).attr('name');
  triggerTarget(buttonName);
  resetInterval();
});

function resetInterval() {
  clearInterval(timerID);
  timerID = setInterval(function(){
    triggerTarget("next");
  }, TIMER_DURATION);
}

var triggerTarget = function(buttonName) {
  /* If the user clicks the "Prev" or "Next" button, or 10-second timer
  triggers, function goes through some logic to make sure viewer wraps to the
  correct target. If user clicks the button of the currently displayed frame,
  nothing happens. If user clicks a name, target is determined. Sends
  targetIndex to flipPicture function. */
  var targetIndex;
  var currentIndex = Number($('button.disabled').attr('name'));
  if (buttonName == "prev") {
    if (currentIndex === 0) {
      targetIndex = (classmateArray.length - 1);
    } else {
      targetIndex = (currentIndex - 1);
    }
  } else if (buttonName == "next") {
    if (currentIndex === (classmateArray.length - 1)) {
      targetIndex = 0;
    } else {
      targetIndex = (currentIndex + 1);
    }
  } else if (buttonName == currentIndex) {
    return;
  } else {
    targetIndex = Number(buttonName);
  }
  flipPicture(targetIndex);
};

var buildNav = function() {
  // Constructs navigation buttons for side navigation panel.
  $('nav').append('<button name="prev" class="btn btn-primary">Prev</button>\n');
  $('nav').append('<div class="btn-group-vertical">\n');
  for (var i = 0; i < classmateArray.length; i++) {
    var el = '<button name="' + i + '" class="btn btn-default">' + classmateArray[i].first_name + '</button>\n';
    $('nav').append(el);
  }
  $('nav').append('</div>\n');
  $('nav').append('<button name="next" class="btn btn-primary">Next</button>\n');
};

var buildFrames = function() {
  /* Constructs a picture frame (div) for every member of classmateArray,
  all occupying the same position, with every single frame hidden. This
  definitely wasn't my first idea for doing this, but it conveniently
  solved two problems: (i) it loads all classmateArray pictures simultaneously,
  which makes the fade-in/fade-out process work without image loading
  interfering; and (ii) it makes using the jQuery fadeIn and fadeOut methods
  much easier to use. */
  for (i = 0; i < classmateArray.length; i++) {
    var frameText = '';
    frameText += '<div id="classmate' + i + '" style="display: none;">\n';
    frameText += '<h2 class="name">' + classmateArray[i].first_name + ' ' + classmateArray[i].last_name + '</h2>\n';
    frameText += '<img src="' + classmateArray[i].picUrl + '" height="300">\n';
    frameText += '<p class="info">' + classmateArray[i].info + '</p>\n';
    frameText += '<p class="index">' + (i + 1) + '/' + classmateArray.length + '</p>\n';
    frameText += '</div>\n';
    $('main').append(frameText);
  }
};

var flipPicture = function(index) {
  /* Finds the only visible classmate frame and fades it out. Then, when
  fadeOut is complete, calls an anonymous function that executes fadeIn
  on the student frame index passed to the function. */
  $('main > div:visible').fadeOut(function(){
    $('#classmate' + index).fadeIn();
  });
  buttonHighlight(index);
};

var buttonHighlight = function(index) {
  /* Highlights the button of the currently displayed frame. Also serves
  as a pretty unwieldy memory of the displayed frame, which I use to
  interpret the "Prev" and "Next" buttons. */
  $('button.disabled').removeClass('btn-info disabled');
  $('button[name="' + index + '"]').addClass('btn-info disabled');
};
