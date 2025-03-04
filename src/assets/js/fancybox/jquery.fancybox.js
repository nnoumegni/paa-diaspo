/*!
 * fancyBox - jQuery Plugin
 * version: 2.0.5 (27/03/2012)
 * @requires jQuery v1.6 or later
 *
 * Examples at http://fancyapps.com/fancybox/
 * License: www.fancyapps.com/fancybox/#license
 *
 * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
 *
 */
(function (window, document, undefined) {
  'use strict';

  var $ = window.jQuery,
    W = $(window),
    D = $(document),
    F = ($.fancybox = function () {
      F.open.apply(this, arguments);
    }),
    didResize = false,
    resizeTimer = null,
    isMobile = document.createTouch !== undefined,
    isString = function (str) {
      return $.type(str) === 'string';
    },
    isPercentage = function (str) {
      return isString(str) && str.indexOf('%') > -1;
    };

  $.extend(F, {
    // The current version of fancyBox
    version: '2.0.5',

    defaults: {
      padding: 15,
      margin: 20,

      width: 800,
      height: 600,
      minWidth: 100,
      minHeight: 100,
      maxWidth: 9999,
      maxHeight: 9999,

      autoSize: true,
      autoResize: !isMobile,
      autoCenter: !isMobile,
      fitToView: true,
      aspectRatio: false,
      topRatio: 0.5,

      fixed: !($.browser.msie && $.browser.version <= 6) && !isMobile,
      scrolling: 'auto', // 'auto', 'yes' or 'no'
      wrapCSS: 'fancybox-default',

      arrows: true,
      closeBtn: true,
      closeClick: false,
      nextClick: false,
      mouseWheel: true,
      autoPlay: false,
      playSpeed: 3000,
      preload: 3,

      modal: false,
      loop: true,
      ajax: { dataType: 'html', headers: { 'X-fancyBox': true } },
      keys: {
        next: [13, 32, 34, 39, 40], // enter, space, page down, right arrow, down arrow
        prev: [8, 33, 37, 38], // backspace, page up, left arrow, up arrow
        close: [27], // escape key
      },

      // Override some properties
      index: 0,
      type: null,
      href: null,
      content: null,
      title: null,

      // HTML templates
      tpl: {
        wrap:
          '<div class="fancybox-wrap"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div>',
        image: '<img class="fancybox-image" src="{href}" alt="" />',
        iframe:
          '<iframe class="fancybox-iframe" name="fancybox-frame{rnd}" frameborder="0" hspace="0"' +
          ($.browser.msie ? ' allowtransparency="true"' : '') +
          '></iframe>',
        swf:
          '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="wmode" value="transparent" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{href}" /><embed src="{href}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="100%" height="100%" wmode="transparent"></embed></object>',
        error:
          '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
        closeBtn:
          '<div title="Close" class="fancybox-item fancybox-close"></div>',
        fsBtn:
          '<div title="Full Screen" class="fancybox-item fancybox-fs"></div>',
        next:
          '<a title="Next" class="fancybox-nav fancybox-next"><span></span></a>',
        prev:
          '<a title="Previous" class="fancybox-nav fancybox-prev"><span></span></a>',
      },

      // Properties for each animation type
      // Opening fancyBox
      openEffect: 'fade', // 'elastic', 'fade' or 'none'
      openSpeed: 250,
      openEasing: 'swing',
      openOpacity: true,
      openMethod: 'zoomIn',

      // Closing fancyBox
      closeEffect: 'fade', // 'elastic', 'fade' or 'none'
      closeSpeed: 250,
      closeEasing: 'swing',
      closeOpacity: true,
      closeMethod: 'zoomOut',

      // Changing next gallery item
      nextEffect: 'elastic', // 'elastic', 'fade' or 'none'
      nextSpeed: 300,
      nextEasing: 'swing',
      nextMethod: 'changeIn',

      // Changing previous gallery item
      prevEffect: 'elastic', // 'elastic', 'fade' or 'none'
      prevSpeed: 300,
      prevEasing: 'swing',
      prevMethod: 'changeOut',

      // Support for FullScreen API
      // https://developer.mozilla.org/en/DOM/Using_full-screen_mode
      // Added by Pascal Meunier for Aeris Lab < pm@aeris.pro >
      fsBtn: false,

      // Enabled helpers
      helpers: {
        overlay: {
          speedIn: 0,
          speedOut: 300,
          opacity: 0.8,
          css: {
            cursor: 'pointer',
          },
          closeClick: true,
        },
        title: {
          type: 'float', // 'float', 'inside', 'outside' or 'over'
        },
      },

      // Callbacks
      onCancel: $.noop, // If canceling
      beforeLoad: $.noop, // Before loading
      afterLoad: $.noop, // After loading
      beforeShow: $.noop, // Before changing in current item
      afterShow: $.noop, // After opening
      beforeClose: $.noop, // Before closing
      afterClose: $.noop, // After closing
    },

    //Current state
    group: {}, // Selected group
    opts: {}, // Group options
    coming: null, // Element being loaded
    current: null, // Currently loaded element
    isOpen: false, // Is currently open
    isOpened: false, // Have been fully opened at least once
    wrap: null,
    outer: null,
    inner: null,

    player: {
      timer: null,
      isActive: false,
    },

    // Loaders
    ajaxLoad: null,
    imgPreload: null,

    // Some collections
    transitions: {},
    helpers: {},

    /*
     *	Static methods
     */

    open: function (group, opts) {
      //Kill existing instances
      F.close(true);

      //Normalize group
      if (group && !$.isArray(group)) {
        group = group instanceof $ ? $(group).get() : [group];
      }

      F.isActive = true;

      //Extend the defaults
      F.opts = $.extend(true, {}, F.defaults, opts);

      //All options are merged recursive except keys
      if ($.isPlainObject(opts) && opts.keys !== undefined) {
        F.opts.keys = opts.keys
          ? $.extend({}, F.defaults.keys, opts.keys)
          : false;
      }

      F.group = group;

      F._start(F.opts.index || 0);
    },

    cancel: function () {
      if (F.coming && false === F.trigger('onCancel')) {
        return;
      }

      F.coming = null;

      F.hideLoading();

      if (F.ajaxLoad) {
        F.ajaxLoad.abort();
      }

      F.ajaxLoad = null;

      if (F.imgPreload) {
        F.imgPreload.onload = F.imgPreload.onabort = F.imgPreload.onerror = null;
      }
    },

    close: function (a) {
      F.cancel();

      if (!F.current || false === F.trigger('beforeClose')) {
        return;
      }

      F.unbindEvents();

      //If forced or is still opening then remove immediately
      if (!F.isOpen || (a && a[0] === true)) {
        $('.fancybox-wrap').stop().trigger('onReset').remove();

        F._afterZoomOut();
      } else {
        F.isOpen = F.isOpened = false;

        $('.fancybox-item, .fancybox-nav').remove();

        F.wrap.stop(true).removeClass('fancybox-opened');
        F.inner.css('overflow', 'hidden');

        F.transitions[F.current.closeMethod]();
      }
    },

    fullscreen: function (a) {
      // Callback function.
      var fullscreen_callback = function (b) {
        if (b === true) {
          // Disable buttons.
          $('.fancybox-item').hide();
          $('.fancybox-nav').hide();
        } else {
          // Enable buttons.
          $('.fancybox-item').show();
          $('.fancybox-nav').show();
        }
        //console.log(b);
      };

      // Check if fullscreen plugin is enabled.
      if ($.support.fullscreen) {
        $('.fancybox-wrap').fullScreen({ callback: fullscreen_callback });
      } else {
        alert('Error, no fullscreen jQuery plugin found.');
      }
    },

    // Start/stop slideshow
    play: function (a) {
      var clear = function () {
          clearTimeout(F.player.timer);
        },
        set = function () {
          clear();

          if (F.current && F.player.isActive) {
            F.player.timer = setTimeout(F.next, F.current.playSpeed);
          }
        },
        stop = function () {
          clear();

          $('body').unbind('.player');

          F.player.isActive = false;

          F.trigger('onPlayEnd');
        },
        start = function () {
          if (
            F.current &&
            (F.current.loop || F.current.index < F.group.length - 1)
          ) {
            F.player.isActive = true;

            $('body').bind({
              'afterShow.player onUpdate.player': set,
              'onCancel.player beforeClose.player': stop,
              'beforeLoad.player': clear,
            });

            set();

            F.trigger('onPlayStart');
          }
        };

      if (F.player.isActive || (a && a[0] === false)) {
        stop();
      } else {
        start();
      }
    },

    next: function () {
      if (F.current) {
        F.jumpto(F.current.index + 1);
      }
    },

    prev: function () {
      if (F.current) {
        F.jumpto(F.current.index - 1);
      }
    },

    jumpto: function (index) {
      if (!F.current) {
        return;
      }

      index = parseInt(index, 10);

      if (F.group.length > 1 && F.current.loop) {
        if (index >= F.group.length) {
          index = 0;
        } else if (index < 0) {
          index = F.group.length - 1;
        }
      }

      if (F.group[index] !== undefined) {
        F.cancel();

        F._start(index);
      }
    },

    reposition: function (absolute, e) {
      if (F.isOpen) {
        if (e && e.type === 'scroll') {
          F.wrap.stop().animate(F._getPosition(absolute), 200);
        } else {
          F.wrap.css(F._getPosition(absolute));
        }
      }
    },

    update: function (e) {
      if (F.isOpen) {
        // It's a very bad idea to attach handlers to the window scroll event, run this code after a delay
        if (!didResize) {
          resizeTimer = setTimeout(function () {
            var current = F.current;

            if (didResize) {
              didResize = false;

              if (current) {
                if (
                  !e ||
                  (e &&
                    (e.type === 'orientationchange' ||
                      (current.autoResize && e.type === 'resize')))
                ) {
                  if (current.autoSize && current.type !== 'iframe') {
                    F.inner.height('auto');
                    current.height = F.inner.height();
                  }

                  F._setDimension();

                  if (current.canGrow && current.type !== 'iframe') {
                    F.inner.height('auto');
                  }
                }

                if (current.autoCenter) {
                  F.reposition(null, e);
                }

                F.trigger('onUpdate');
              }
            }
          }, 100);
        }

        didResize = true;
      }
    },

    toggle: function () {
      if (F.isOpen) {
        F.current.fitToView = !F.current.fitToView;

        F.update();
      }
    },

    hideLoading: function () {
      D.unbind('keypress.fb');

      $('#fancybox-loading').remove();
    },

    showLoading: function () {
      F.hideLoading();

      //If user will press the escape-button, the request will be canceled
      D.bind('keypress.fb', function (e) {
        if (e.keyCode === 27) {
          e.preventDefault();
          F.cancel();
        }
      });

      $('<div id="fancybox-loading"><div></div></div>')
        .click(F.cancel)
        .appendTo('body');
    },

    getViewport: function () {
      return {
        x: W.scrollLeft(),
        y: W.scrollTop(),
        w: window.innerWidth ? window.innerWidth : W.width(),
        h: window.innerHeight ? window.innerHeight : W.height(),
      };
    },

    // Unbind the keyboard / clicking actions
    unbindEvents: function () {
      if (F.wrap) {
        F.wrap.unbind('.fb');
      }

      D.unbind('.fb');
      W.unbind('.fb');
    },

    bindEvents: function () {
      var current = F.current,
        keys = current.keys;

      if (!current) {
        return;
      }

      W.bind('resize.fb, orientationchange.fb', F.update);

      if (!current.fixed && current.autoCenter) {
        W.bind('scroll.fb', F.update);
      }

      if (keys) {
        D.bind('keydown.fb', function (e) {
          var code;

          // Ignore key combinations and key events within form elements
          if (
            !e.ctrlKey &&
            !e.altKey &&
            !e.shiftKey &&
            !e.metaKey &&
            $.inArray(e.target.tagName.toLowerCase(), [
              'input',
              'textarea',
              'select',
              'button',
            ]) < 0 &&
            !$(e.target).is('[contenteditable]')
          ) {
            code = e.keyCode;

            if ($.inArray(code, keys.close) > -1) {
              F.close();
              e.preventDefault();
            } else if ($.inArray(code, keys.next) > -1) {
              F.next();
              e.preventDefault();
            } else if ($.inArray(code, keys.prev) > -1) {
              F.prev();
              e.preventDefault();
            }
          }
        });
      }

      if ($.fn.mousewheel && current.mouseWheel && F.group.length > 1) {
        F.wrap.bind('mousewheel.fb', function (e, delta) {
          var target = e.target || null;

          if (
            delta !== 0 &&
            (!target ||
              target.clientHeight === 0 ||
              (target.scrollHeight === target.clientHeight &&
                target.scrollWidth === target.clientWidth))
          ) {
            e.preventDefault();

            F[delta > 0 ? 'prev' : 'next']();
          }
        });
      }
    },

    trigger: function (event) {
      var ret,
        obj =
          F[
            $.inArray(event, ['onCancel', 'beforeLoad', 'afterLoad']) > -1
              ? 'coming'
              : 'current'
          ];

      if (!obj) {
        return;
      }

      if ($.isFunction(obj[event])) {
        ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
      }

      if (ret === false) {
        return false;
      }

      if (obj.helpers) {
        $.each(obj.helpers, function (helper, opts) {
          if (
            opts &&
            $.isPlainObject(F.helpers[helper]) &&
            $.isFunction(F.helpers[helper][event])
          ) {
            F.helpers[helper][event](opts, obj);
          }
        });
      }

      $.event.trigger(event + '.fb');
    },

    isImage: function (str) {
      return isString(str) && str.match(/\.(jpg|gif|png|bmp|jpeg)(.*)?$/i);
    },

    isSWF: function (str) {
      return isString(str) && str.match(/\.(swf)(.*)?$/i);
    },

    _start: function (index) {
      var coming = {},
        element = F.group[index] || null,
        isDom,
        href,
        type,
        rez,
        hrefParts;

      if (element && (element.nodeType || element instanceof $)) {
        isDom = true;

        if ($.metadata) {
          coming = $(element).metadata();
        }
      }

      coming = $.extend(
        true,
        {},
        F.opts,
        { index: index, element: element },
        $.isPlainObject(element) ? element : coming
      );

      // Re-check overridable options
      $.each(['href', 'title', 'content', 'type'], function (i, v) {
        coming[v] =
          F.opts[v] || (isDom && $(element).attr(v)) || coming[v] || null;
      });

      // Convert margin property to array - top, right, bottom, left
      if (typeof coming.margin === 'number') {
        coming.margin = [
          coming.margin,
          coming.margin,
          coming.margin,
          coming.margin,
        ];
      }

      // 'modal' propery is just a shortcut
      if (coming.modal) {
        $.extend(true, coming, {
          closeBtn: false,
          closeClick: false,
          nextClick: false,
          arrows: false,
          mouseWheel: false,
          keys: null,
          helpers: {
            overlay: {
              css: {
                cursor: 'auto',
              },
              closeClick: false,
            },
          },
        });
      }

      //Give a chance for callback or helpers to update coming item (type, title, etc)
      F.coming = coming;

      if (false === F.trigger('beforeLoad')) {
        F.coming = null;
        return;
      }

      type = coming.type;
      href = coming.href || element;

      ///Check if content type is set, if not, try to get
      if (!type) {
        if (isDom) {
          rez = $(element).data('fancybox-type');

          if (!rez && element.className) {
            rez = element.className.match(/fancybox\.(\w+)/);
            type = rez ? rez[1] : null;
          }
        }

        if (!type && isString(href)) {
          if (F.isImage(href)) {
            type = 'image';
          } else if (F.isSWF(href)) {
            type = 'swf';
          } else if (href.match(/^#/)) {
            type = 'inline';
          }
        }

        // ...if not - display element itself
        if (!type) {
          type = isDom ? 'inline' : 'html';
        }

        coming.type = type;
      }

      // Check before try to load; 'inline' and 'html' types need content, others - href
      if (type === 'inline' || type === 'html') {
        if (!coming.content) {
          if (type === 'inline') {
            coming.content = $(
              isString(href) ? href.replace(/.*(?=#[^\s]+$)/, '') : href
            ); //strip for ie7
          } else {
            coming.content = element;
          }
        }

        if (!coming.content || !coming.content.length) {
          type = null;
        }
      } else if (!href) {
        type = null;
      }

      /*
       * Add reference to the group, so it`s possible to access from callbacks, example:
       * afterLoad : function() {
       * 	this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
       * }
       */

      if (type === 'ajax' && isString(href)) {
        hrefParts = href.split(/\s+/, 2);

        href = hrefParts.shift();
        coming.selector = hrefParts.shift();
      }

      coming.href = href;
      coming.group = F.group;
      coming.isDom = isDom;

      if (type === 'image') {
        F._loadImage();
      } else if (type === 'ajax') {
        F._loadAjax();
      } else if (type) {
        F._afterLoad();
      } else {
        F._error('type');
      }
    },

    _error: function (type) {
      F.hideLoading();

      $.extend(F.coming, {
        type: 'html',
        autoSize: true,
        minHeight: 0,
        hasError: type,
        content: F.coming.tpl.error,
      });

      F._afterLoad();
    },

    _loadImage: function () {
      // Reset preload image so it is later possible to check "complete" property
      var img = (F.imgPreload = new Image());

      img.onload = function () {
        this.onload = this.onerror = null;

        F.coming.width = this.width;
        F.coming.height = this.height;

        F._afterLoad();
      };

      img.onerror = function () {
        this.onload = this.onerror = null;

        F._error('image');
      };

      img.src = F.coming.href;

      if (!img.width) {
        F.showLoading();
      }
    },

    _loadAjax: function () {
      F.showLoading();

      F.ajaxLoad = $.ajax(
        $.extend({}, F.coming.ajax, {
          url: F.coming.href,
          error: function (jqXHR, textStatus) {
            if (F.coming && textStatus !== 'abort') {
              F._error('ajax', jqXHR);
            } else {
              F.hideLoading();
            }
          },
          success: function (data, textStatus) {
            if (textStatus === 'success') {
              F.coming.content = data;

              F._afterLoad();
            }
          },
        })
      );
    },

    _preloadImages: function () {
      var group = F.group,
        current = F.current,
        len = group.length,
        item,
        href,
        i,
        cnt = Math.min(current.preload, len - 1);

      if (!current.preload || group.length < 2) {
        return;
      }

      for (i = 1; i <= cnt; i += 1) {
        item = group[(current.index + i) % len];
        href = $(item).attr('href') || item;

        if (item.type === 'image' || F.isImage(href)) {
          new Image().src = href;
        }
      }
    },

    _afterLoad: function () {
      F.hideLoading();

      if (!F.coming || false === F.trigger('afterLoad', F.current)) {
        F.coming = false;

        return;
      }

      if (F.isOpened) {
        $('.fancybox-item').remove();

        F.wrap.stop(true).removeClass('fancybox-opened');
        F.inner.css('overflow', 'hidden');

        F.transitions[F.current.prevMethod]();
      } else {
        $('.fancybox-wrap').stop().trigger('onReset').remove();

        F.trigger('afterClose');
      }

      F.unbindEvents();

      F.isOpen = false;
      F.current = F.coming;

      //Build the neccessary markup
      F.wrap = $(F.current.tpl.wrap)
        .addClass(
          'fancybox-' +
            (isMobile ? 'mobile' : 'desktop') +
            ' fancybox-type-' +
            F.current.type +
            ' fancybox-tmp ' +
            F.current.wrapCSS
        )
        .appendTo('body');
      F.outer = $('.fancybox-outer', F.wrap).css(
        'padding',
        F.current.padding + 'px'
      );
      F.inner = $('.fancybox-inner', F.wrap);

      F._setContent();
    },

    _setContent: function () {
      var current = F.current,
        content = current.content,
        type = current.type,
        loadingBay,
        minWidth = current.minWidth,
        minHeight = current.minHeight,
        maxWidth = current.maxWidth,
        maxHeight = current.maxHeight;

      switch (type) {
        case 'inline':
        case 'ajax':
        case 'html':
          if (current.selector) {
            content = $('<div>').html(content).find(current.selector);
          } else if (content instanceof $) {
            if (content.parent().hasClass('fancybox-inner')) {
              content.parents('.fancybox-wrap').unbind('onReset');
            }

            content = content.show().detach();

            $(F.wrap).bind('onReset', function () {
              content.appendTo('body').hide();
            });
          }

          if (current.autoSize) {
            loadingBay = $(
              '<div class="fancybox-wrap ' +
                F.current.wrapCSS +
                ' fancybox-tmp"></div>'
            )
              .appendTo('body')
              .css({
                minWidth: isPercentage(minWidth) ? minWidth : minWidth + 'px',
                minHeight: isPercentage(minHeight)
                  ? minHeight
                  : minHeight + 'px',
                maxWidth: isPercentage(maxWidth) ? maxWidth : maxWidth + 'px',
                maxHeight: isPercentage(maxHeight)
                  ? maxHeight
                  : maxHeight + 'px',
              })
              .append(content);

            current.width = loadingBay.width();
            current.height = loadingBay.height();

            // Re-check to fix 1px bug in some browsers
            loadingBay.width(F.current.width);

            if (loadingBay.height() > current.height) {
              loadingBay.width(current.width + 1);

              current.width = loadingBay.width();
              current.height = loadingBay.height();
            }

            content = loadingBay.contents().detach();

            loadingBay.remove();
          }

          break;

        case 'image':
          content = current.tpl.image.replace('{href}', current.href);

          current.aspectRatio = true;
          break;

        case 'swf':
          content = current.tpl.swf
            .replace(/\{width\}/g, current.width)
            .replace(/\{height\}/g, current.height)
            .replace(/\{href\}/g, current.href);
          break;

        case 'iframe':
          content = $(current.tpl.iframe.replace('{rnd}', new Date().getTime()))
            .attr('scrolling', current.scrolling)
            .attr('src', current.href);

          current.scrolling = isMobile ? 'scroll' : 'auto';

          break;
      }

      if (type === 'image' || type === 'swf') {
        current.autoSize = false;
        current.scrolling = 'visible';
      }

      if (type === 'iframe' && current.autoSize) {
        F.showLoading();

        F.inner
          .width(current.width)
          .height(current.height)
          .css('overflow', current.scrolling);

        content
          .bind({
            onCancel: function () {
              $(this).unbind();

              F._afterZoomOut();
            },
            load: function () {
              F.hideLoading();

              try {
                if (this.contentWindow.document.location) {
                  F.current.height = $(this).contents().find('body').height();
                }
              } catch (e) {
                F.current.autoSize = false;
              }

              if (F.isOpened) {
                F.update();
              } else {
                F._beforeShow();
              }
            },
          })
          .appendTo(F.inner);
      } else {
        F.inner.append(content);

        F._beforeShow();
      }
    },

    _beforeShow: function () {
      F.coming = null;

      //Give a chance for helpers or callbacks to update elements
      F.trigger('beforeShow');

      //Set initial dimensions and hide
      F._setDimension();
      F.wrap.hide().removeClass('fancybox-tmp');

      F.bindEvents();

      F._preloadImages();

      F.transitions[F.isOpened ? F.current.nextMethod : F.current.openMethod]();
    },

    _setDimension: function () {
      var wrap = F.wrap,
        outer = F.outer,
        inner = F.inner,
        current = F.current,
        viewport = F.getViewport(),
        margin = current.margin,
        padding2 = current.padding * 2,
        width = current.width,
        height = current.height,
        maxWidth = current.maxWidth + padding2,
        maxHeight = current.maxHeight + padding2,
        minWidth = current.minWidth + padding2,
        minHeight = current.minHeight + padding2,
        ratio,
        height_,
        space;

      viewport.w -= margin[1] + margin[3];
      viewport.h -= margin[0] + margin[2];

      if (isPercentage(width)) {
        width = ((viewport.w - padding2) * parseFloat(width)) / 100;
      }

      if (isPercentage(height)) {
        height = ((viewport.h - padding2) * parseFloat(height)) / 100;
      }

      ratio = width / height;
      width += padding2;
      height += padding2;

      if (current.fitToView) {
        maxWidth = Math.min(viewport.w, maxWidth);
        maxHeight = Math.min(viewport.h, maxHeight);
      }

      if (current.aspectRatio) {
        if (width > maxWidth) {
          width = maxWidth;
          height = (width - padding2) / ratio + padding2;
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = (height - padding2) * ratio + padding2;
        }

        if (width < minWidth) {
          width = minWidth;
          height = (width - padding2) / ratio + padding2;
        }

        if (height < minHeight) {
          height = minHeight;
          width = (height - padding2) * ratio + padding2;
        }
      } else {
        width = Math.max(minWidth, Math.min(width, maxWidth));
        height = Math.max(minHeight, Math.min(height, maxHeight));
      }

      width = Math.round(width);
      height = Math.round(height);

      //Reset dimensions
      $(wrap.add(outer).add(inner)).width('auto').height('auto');

      inner.width(width - padding2).height(height - padding2);
      wrap.width(width);

      height_ = wrap.height(); // Real wrap height

      //Fit wrapper inside
      if (width > maxWidth || height_ > maxHeight) {
        while (
          (width > maxWidth || height_ > maxHeight) &&
          width > minWidth &&
          height_ > minHeight
        ) {
          height = height - 10;

          if (current.aspectRatio) {
            width = Math.round((height - padding2) * ratio + padding2);

            if (width < minWidth) {
              width = minWidth;
              height = (width - padding2) / ratio + padding2;
            }
          } else {
            width = width - 10;
          }

          inner.width(width - padding2).height(height - padding2);
          wrap.width(width);

          height_ = wrap.height();
        }
      }

      current.dim = {
        width: width,
        height: height_,
      };

      current.canGrow =
        current.autoSize && height > minHeight && height < maxHeight;
      current.canShrink = false;
      current.canExpand = false;

      if (
        width - padding2 < current.width ||
        height - padding2 < current.height
      ) {
        current.canExpand = true;
      } else if (
        (width > viewport.w || height_ > viewport.h) &&
        width > minWidth &&
        height > minHeight
      ) {
        current.canShrink = true;
      }

      space = height_ - padding2;

      F.innerSpace = space - inner.height();
      F.outerSpace = space - outer.height();
    },

    _getPosition: function (a) {
      var current = F.current,
        viewport = F.getViewport(),
        margin = current.margin,
        width = F.wrap.width() + margin[1] + margin[3],
        height = F.wrap.height() + margin[0] + margin[2],
        rez = {
          position: 'absolute',
          top: margin[0] + viewport.y,
          left: margin[3] + viewport.x,
        };

      if (
        current.autoCenter &&
        current.fixed &&
        (!a || a[0] === false) &&
        height <= viewport.h &&
        width <= viewport.w
      ) {
        rez = {
          position: 'fixed',
          top: margin[0],
          left: margin[3],
        };
      }

      rez.top =
        Math.ceil(
          Math.max(rez.top, rez.top + (viewport.h - height) * current.topRatio)
        ) + 'px';
      rez.left =
        Math.ceil(Math.max(rez.left, rez.left + (viewport.w - width) * 0.5)) +
        'px';

      return rez;
    },

    _afterZoomIn: function () {
      var current = F.current,
        scrolling = current ? current.scrolling : 'no';

      if (!current) {
        return;
      }

      F.isOpen = F.isOpened = true;

      F.wrap.addClass('fancybox-opened').css('overflow', 'visible');

      F.inner.css(
        'overflow',
        scrolling === 'yes'
          ? 'scroll'
          : scrolling === 'no'
          ? 'hidden'
          : scrolling
      );

      //Assign a click event
      if (current.closeClick || current.nextClick) {
        //This is not the perfect solution but arrows have to be next to content so their height will match
        // and I do not want another wrapper around content
        F.inner.css('cursor', 'pointer').bind('click.fb', function (e) {
          if (!$(e.target).is('a') && !$(e.target).parent().is('a')) {
            F[current.closeClick ? 'close' : 'next']();
          }
        });
      }

      //Create a close button
      if (current.closeBtn) {
        $(current.tpl.closeBtn).appendTo(F.outer).bind('click.fb', F.close);
      }

      //Create a fullscreen button
      if (current.fsBtn) {
        $(current.tpl.fsBtn).appendTo(F.outer).bind('click.fb', F.fullscreen);
      }

      //Create navigation arrows
      if (current.arrows && F.group.length > 1) {
        if (current.loop || current.index > 0) {
          $(current.tpl.prev).appendTo(F.inner).bind('click.fb', F.prev);
        }

        if (current.loop || current.index < F.group.length - 1) {
          $(current.tpl.next).appendTo(F.inner).bind('click.fb', F.next);
        }
      }

      F.trigger('afterShow');

      F.update();

      if (F.opts.autoPlay && !F.player.isActive) {
        F.opts.autoPlay = false;

        F.play();
      }
    },

    _afterZoomOut: function () {
      F.trigger('afterClose');

      F.wrap.trigger('onReset').remove();

      $.extend(F, {
        group: {},
        opts: {},
        current: null,
        isActive: false,
        isOpened: false,
        isOpen: false,
        wrap: null,
        outer: null,
        inner: null,
      });
    },
  });

  /*
   *	Default transitions
   */

  F.transitions = {
    getOrigPosition: function () {
      var current = F.current,
        element = current.element,
        padding = current.padding,
        orig = $(current.orig),
        pos = {},
        width = 50,
        height = 50,
        viewport;

      if (!orig.length && current.isDom && $(element).is(':visible')) {
        orig = $(element).find('img:first');

        if (!orig.length) {
          orig = $(element);
        }
      }

      if (orig.length) {
        pos = orig.offset();

        if (orig.is('img')) {
          width = orig.outerWidth();
          height = orig.outerHeight();
        }
      } else {
        viewport = F.getViewport();

        pos.top = viewport.y + (viewport.h - height) * 0.5;
        pos.left = viewport.x + (viewport.w - width) * 0.5;
      }

      pos = {
        top: Math.ceil(pos.top - padding) + 'px',
        left: Math.ceil(pos.left - padding) + 'px',
        width: Math.ceil(width + padding * 2) + 'px',
        height: Math.ceil(height + padding * 2) + 'px',
      };

      return pos;
    },

    step: function (now, fx) {
      var ratio, innerValue, outerValue;

      if (fx.prop === 'width' || fx.prop === 'height') {
        innerValue = outerValue = Math.ceil(now - F.current.padding * 2);

        if (fx.prop === 'height') {
          ratio = (now - fx.start) / (fx.end - fx.start);

          if (fx.start > fx.end) {
            ratio = 1 - ratio;
          }

          innerValue -= F.innerSpace * ratio;
          outerValue -= F.outerSpace * ratio;
        }

        F.inner[fx.prop](innerValue);
        F.outer[fx.prop](outerValue);
      }
    },

    zoomIn: function () {
      var wrap = F.wrap,
        current = F.current,
        effect = current.openEffect,
        elastic = effect === 'elastic',
        dim = current.dim,
        startPos = $.extend({}, dim, F._getPosition(elastic)),
        endPos = $.extend({ opacity: 1 }, startPos);

      //Remove "position" property that breaks older IE
      delete endPos.position;

      if (elastic) {
        startPos = this.getOrigPosition();

        if (current.openOpacity) {
          startPos.opacity = 0;
        }

        F.outer.add(F.inner).width('auto').height('auto');
      } else if (effect === 'fade') {
        startPos.opacity = 0;
      }

      wrap
        .css(startPos)
        .show()
        .animate(endPos, {
          duration: effect === 'none' ? 0 : current.openSpeed,
          easing: current.openEasing,
          step: elastic ? this.step : null,
          complete: F._afterZoomIn,
        });
    },

    zoomOut: function () {
      var wrap = F.wrap,
        current = F.current,
        effect = current.openEffect,
        elastic = effect === 'elastic',
        endPos = { opacity: 0 };

      if (elastic) {
        if (wrap.css('position') === 'fixed') {
          wrap.css(F._getPosition(true));
        }

        endPos = this.getOrigPosition();

        if (current.closeOpacity) {
          endPos.opacity = 0;
        }
      }

      wrap.animate(endPos, {
        duration: effect === 'none' ? 0 : current.closeSpeed,
        easing: current.closeEasing,
        step: elastic ? this.step : null,
        complete: F._afterZoomOut,
      });
    },

    changeIn: function () {
      var wrap = F.wrap,
        current = F.current,
        effect = current.nextEffect,
        startPos = F._getPosition(effect === 'elastic'),
        endPos = { opacity: 1 };

      if (effect === 'elastic') {
        startPos.top = parseInt(startPos.top, 10) - 200 + 'px';
        endPos.top = '+=200px';
        startPos.opacity = 0;
      }

      wrap
        .css(startPos)
        .show()
        .animate(endPos, {
          duration: effect === 'none' ? 0 : current.nextSpeed,
          easing: current.nextEasing,
          complete: function () {
            //Somehow this helps to restore overflow
            setTimeout(F._afterZoomIn, 1);
          },
        });
    },

    changeOut: function () {
      var wrap = F.wrap,
        current = F.current,
        effect = current.nextEffect,
        endPos = { opacity: 0 },
        cleanUp = function () {
          $(this).trigger('onReset').remove();
        };

      wrap.removeClass('fancybox-opened');

      if (effect === 'elastic') {
        endPos.top = '+=200px';
      }

      wrap.animate(endPos, {
        duration: effect === 'none' ? 0 : current.prevSpeed,
        easing: current.prevEasing,
        complete: cleanUp,
      });
    },
  };

  /*
   *	Overlay helper
   */

  F.helpers.overlay = {
    overlay: null,

    update: function () {
      var width, scrollWidth, offsetWidth;

      if (!isMobile) {
        //Reset width/height so it will not mess
        this.overlay.width(0).height(0);
      }

      if ($.browser.msie) {
        scrollWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        );
        offsetWidth = Math.max(
          document.documentElement.offsetWidth,
          document.body.offsetWidth
        );

        width = scrollWidth < offsetWidth ? W.width() : scrollWidth;
      } else {
        width = D.width();
      }

      this.overlay.width(width).height(D.height());
    },

    beforeShow: function (opts) {
      if (this.overlay) {
        return;
      }

      opts = $.extend(
        true,
        {
          speedIn: 'fast',
          closeClick: true,
          opacity: 1,
          css: {
            background: 'black',
          },
        },
        opts
      );

      this.overlay = $('<div id="fancybox-overlay"></div>')
        .css(opts.css)
        .appendTo('body');

      this.update();

      if (opts.closeClick) {
        this.overlay.bind('click.fb', F.close);
      }

      W.bind('resize.fb', $.proxy(this.update, this));

      this.overlay.fadeTo(opts.speedIn, opts.opacity);
    },

    onUpdate: function () {
      //Update as content may change document dimensions
      this.update();
    },

    afterClose: function (opts) {
      if (this.overlay) {
        this.overlay.fadeOut(opts.speedOut || 0, function () {
          $(this).remove();
        });
      }

      this.overlay = null;
    },
  };

  /*
   *	Title helper
   */

  F.helpers.title = {
    beforeShow: function (opts) {
      var title,
        text = F.current.title;

      if (text) {
        title = $(
          '<div class="fancybox-title fancybox-title-' +
            opts.type +
            '-wrap">' +
            text +
            '</div>'
        ).appendTo('body');

        if (opts.type === 'float') {
          //This helps for some browsers
          title.width(title.width());

          title.wrapInner('<span class="child"></span>');

          //Increase bottom margin so this title will also fit into viewport
          F.current.margin[2] += Math.abs(
            parseInt(title.css('margin-bottom'), 10)
          );
        }

        title.appendTo(
          opts.type === 'over'
            ? F.inner
            : opts.type === 'outside'
            ? F.wrap
            : F.outer
        );
      }
    },
  };

  // jQuery plugin initialization
  $.fn.fancybox = function (options) {
    var that = $(this),
      selector = this.selector || '',
      index,
      run = function (e) {
        var what = this,
          idx = index,
          relType,
          relVal;

        if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)) {
          e.preventDefault();

          relType = options.groupAttr || 'data-fancybox-group';
          relVal = $(what).attr(relType);

          if (!relVal) {
            relType = 'rel';
            relVal = what[relType];
          }

          if (relVal && relVal !== '' && relVal !== 'nofollow') {
            what = selector.length ? $(selector) : that;
            what = what.filter('[' + relType + '="' + relVal + '"]');
            idx = what.index(this);
          }

          options.index = idx;

          F.open(what, options);
        }
      };

    options = options || {};
    index = options.index || 0;

    if (selector) {
      D.undelegate(selector, 'click.fb-start').delegate(
        selector,
        'click.fb-start',
        run
      );
    } else {
      that.unbind('click.fb-start').bind('click.fb-start', run);
    }

    return this;
  };
})(window, document);
