/**
 * @name		jQuery FullScreen Plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2012/02/enhance-your-website-fullscreen-api/
 * @license		MIT License
 */

(function ($) {
  // Adding a new test to the jQuery support object
  $.support.fullscreen = supportFullScreen();

  // Creating the plugin
  $.fn.fullScreen = function (props) {
    if (!$.support.fullscreen || this.length != 1) {
      // The plugin can be called only
      // on one element at a time

      return this;
    }

    if (fullScreenStatus()) {
      // if we are already in fullscreen, exit
      cancelFullScreen();
      return this;
    }

    // You can potentially pas two arguments a color
    // for the background and a callback function

    var options = $.extend(
      {
        background: '#111',
        callback: function () {},
      },
      props
    );

    // This temporary div is the element that is
    // actually going to be enlarged in full screen

    var fs = $('<div>', {
      css: {
        'overflow-y': 'auto',
        background: options.background,
        width: '100%',
        height: '100%',
      },
    });

    var elem = this;

    // You can use the .fullScreen class to
    // apply styling to your element
    elem.addClass('fullScreen');

    // Inserting our element in the temporary
    // div, after which we zoom it in fullscreen
    fs.insertBefore(elem);
    fs.append(elem);
    requestFullScreen(fs.get(0));

    fs.click(function (e) {
      if (e.target == this) {
        // If the black bar was clicked
        cancelFullScreen();
      }
    });

    elem.cancel = function () {
      cancelFullScreen();
      return elem;
    };

    onFullScreenEvent(function (fullScreen) {
      if (!fullScreen) {
        // We have exited full screen.
        // Remove the class and destroy
        // the temporary div

        elem.removeClass('fullScreen').insertBefore(fs);
        fs.remove();
      }

      // Calling the user supplied callback
      options.callback(fullScreen);
    });

    return elem;
  };

  // These helper functions available only to our plugin scope.

  function supportFullScreen() {
    var doc = document.documentElement;

    return (
      'requestFullscreen' in doc ||
      ('mozRequestFullScreen' in doc && document.mozFullScreenEnabled) ||
      'webkitRequestFullScreen' in doc
    );
  }

  function requestFullScreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    }
  }

  function fullScreenStatus() {
    return (
      document.fullscreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen
    );
  }

  function cancelFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }

  function onFullScreenEvent(callback) {
    $(document).on(
      'fullscreenchange mozfullscreenchange webkitfullscreenchange',
      function () {
        // The full screen status is automatically
        // passed to our callback as an argument.
        callback(fullScreenStatus());
      }
    );
  }
})(jQuery);
