$(document).ready(function () {
  var forms = $('form.ajax-form')

  forms.on('submit', function (event) {
      event.preventDefault()

      var form = $(event.target)

      $.ajax({
          url: form.attr('action'),
          crossDomain: true,
          data: form.serialize(),
          method: form.attr('method'),
          cache: false,
          success: function (response) {
              form[0].reset()
              var alert = $('.tellus-alert.alert-success')
              alert.fadeIn()

              setTimeout(function () { alert.fadeOut() }, 5000)

              $(".modal").removeClass("modal-open");

          },
          error: function (response) {
              var alert = $('.tellus-alert.alert-danger')
              alert.fadeIn()

              setTimeout(function () { alert.fadeOut() }, 5000)
          }
      })
  })

  $(".modal-window").click(function () {
      $(".modal").addClass("modal-open");
  });

  $(".modal-get-early-access-window").click(function () {
      $(".modal-get-early-access").addClass("modal-open");
  });

  $(".modal-backdrop").click(function () {
      $(".modal").removeClass("modal-open");
  });

  $(".modal-close").click(function () {
      $(".modal").removeClass("modal-open");
  });

  $(".hamburger-toggle").click(function () {
      $("#menu1").toggleClass("hidden-xs");
      $("#menu1").toggleClass("hidden-sm");
  });

  $('.lazy-image-holder').each(function () {

      var lazy = $(this);
      var src = lazy.attr('data-src');

      lazy.css('background-image', 'url(' + src + ')');
      lazy.css('opacity', 1);

  });

  //   $(".video-play-icon").click(function () {
  //     $(".video").attr("src", $(this).data('src'));
  //     $(".video").removeAttr('data-src');
  //   });

});


window.mr = window.mr || {};

mr = (function (mr, $, window, document) {
  "use strict";

  mr = mr || {};

  var components = { documentReady: [], documentReadyDeferred: [], windowLoad: [], windowLoadDeferred: [] };

  mr.status = { documentReadyRan: false, windowLoadPending: false };

  $(document).ready(documentReady);
  $(window).on("load", windowLoad);

  function documentReady(context) {

      context = typeof context === typeof undefined ? $ : context;
      components.documentReady.concat(components.documentReadyDeferred).forEach(function (component) {
          component(context);
      });
      mr.status.documentReadyRan = true;
      if (mr.status.windowLoadPending) {
          windowLoad(mr.setContext());
      }
  }

  function windowLoad(context) {
      if (mr.status.documentReadyRan) {
          mr.status.windowLoadPending = false;
          context = typeof context === "object" ? $ : context;
          components.windowLoad.concat(components.windowLoadDeferred).forEach(function (component) {
              component(context);
          });
      } else {
          mr.status.windowLoadPending = true;
      }
  }

  mr.setContext = function (contextSelector) {
      var context = $;
      if (typeof contextSelector !== typeof undefined) {
          return function (selector) {
              return $(contextSelector).find(selector);
          };
      }
      return context;
  };

  mr.components = components;
  mr.documentReady = documentReady;
  mr.windowLoad = windowLoad;

  return mr;
}(window.mr, jQuery, window, document));


//////////////// Utility Functions
mr = (function (mr, $, window, document) {
  "use strict";
  mr.util = {};

  mr.util.requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;

  mr.util.documentReady = function ($) {
      var today = new Date();
      var year = today.getFullYear();
      $('.update-year').text(year);
  };

  mr.util.windowLoad = function ($) {
      $('[data-delay-src]').each(function () {
          var $el = $(this);
          $el.attr('src', $el.attr('data-delay-src'));
          $el.removeAttr('data-delay-src');
      });
  };

  mr.util.getURLParameter = function (name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [undefined, ""])[1].replace(/\+/g, '%20')) || null;
  };


  mr.util.capitaliseFirstLetter = function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  };

  mr.util.slugify = function (text, spacesOnly) {
      if (typeof spacesOnly !== typeof undefined) {
          return text.replace(/ +/g, '');
      } else {
          return text
              .toLowerCase()
              .replace(/[\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\]\[\}\{\'\"\;\\\:\?\/\>\<\.\,]+/g, '')
              .replace(/ +/g, '-');
      }
  };

  mr.util.sortChildrenByText = function (parentElement, reverse) {
      var $parentElement = $(parentElement);
      var items = $parentElement.children().get();
      var order = -1;
      var order2 = 1;
      if (typeof reverse !== typeof undefined) { order = 1; order2 = -1; }

      items.sort(function (a, b) {
          var keyA = $(a).text();
          var keyB = $(b).text();

          if (keyA < keyB) return order;
          if (keyA > keyB) return order2;
          return 0;
      });

      // Append back into place
      $parentElement.empty();
      $(items).each(function (i, itm) {
          $parentElement.append(itm);
      });
  };

  // Set data-src attribute of element from src to be restored later
  mr.util.idleSrc = function (context, selector) {

      selector = (typeof selector !== typeof undefined) ? selector : '';
      var elems = context.is(selector + '[src]') ? context : context.find(selector + '[src]');

      elems.each(function (index, elem) {
          elem = $(elem);
          var currentSrc = elem.attr('src'),
              dataSrc = elem.attr('data-src');

          // If there is no data-src, save current source to it
          if (typeof dataSrc === typeof undefined) {
              elem.attr('data-src', currentSrc);
          }

          // Clear the src attribute
          elem.attr('src', '');

      });
  };

  // Set src attribute of element from its data-src where it was temporarily stored earlier
  mr.util.activateIdleSrc = function (context, selector) {

      selector = (typeof selector !== typeof undefined) ? selector : '';
      var elems = context.is(selector + '[data-src]') ? context : context.find(selector + '[data-src]');

      elems.each(function (index, elem) {
          elem = $(elem);
          var dataSrc = elem.attr('data-src');

          // Write the 'src' attribute using the 'data-src' value
          elem.attr('src', dataSrc);
      });
  };

  mr.util.pauseVideo = function (context) {
      var elems = context.is('video') ? context : context.find('video');

      elems.each(function (index, video) {
          var playingVideo = $(video).get(0);
          playingVideo.pause();
      });
  };

  // Take a text value in either px (eg. 150px) or vh (eg. 65vh) and return a number in pixels.
  mr.util.parsePixels = function (text) {
      var windowHeight = $(window).height(), value;

      // Text text against regular expression for px value.
      if (/^[1-9]{1}[0-9]*[p][x]$/.test(text)) {
          return parseInt(text.replace('px', ''), 10);
      }
      // Otherwise it is vh value.
      else if (/^[1-9]{1}[0-9]*[v][h]$/.test(text)) {
          value = parseInt(text.replace('vh', ''), 10);
          // Return conversion to percentage of window height.
          return windowHeight * (value / 100);
      } else {
          // If it is not proper text, return -1 to indicate bad value.
          return -1;
      }
  };

  mr.util.removeHash = function () {
      // Removes hash from URL bar without reloading and without losing search query
      history.pushState("", document.title, window.location.pathname + window.location.search);
  }

  mr.components.documentReady.push(mr.util.documentReady);
  mr.components.windowLoad.push(mr.util.windowLoad);
  return mr;

}(mr, jQuery, window, document));

//////////////// Window Functions
mr = (function (mr, $, window, document) {
  "use strict";

  mr.window = {};
  mr.window.height = $(window).height();
  mr.window.width = $(window).width();

  $(window).on('resize', function () {
      mr.window.height = $(window).height();
      mr.window.width = $(window).width();
  });

  return mr;
}(mr, jQuery, window, document));


//////////////// Scroll Functions
mr = (function (mr, $, window, document) {
  "use strict";


  mr.scroll = {};
  var raf = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  mr.scroll.listeners = [];
  mr.scroll.busy = false;
  mr.scroll.y = 0;
  mr.scroll.x = 0;

  var documentReady = function ($) {

      //////////////// Capture Scroll Event and fire scroll function
      jQuery(window).off('scroll.mr');
      jQuery(window).on('scroll.mr', function (evt) {
          if (mr.scroll.busy === false) {

              mr.scroll.busy = true;
              raf(function (evt) {
                  mr.scroll.update(evt);
              });

          }
          if (evt.stopPropagation) {
              evt.stopPropagation();
          }
      });

  };

  mr.scroll.update = function (event) {

      // Loop through all mr scroll listeners
      var parallax = typeof window.mr_parallax !== typeof undefined ? true : false;
      mr.scroll.y = (parallax ? mr_parallax.mr_getScrollPosition() : window.pageYOffset);
      mr.scroll.busy = false;
      if (parallax) {
          mr_parallax.mr_parallaxBackground();
      }


      if (mr.scroll.listeners.length > 0) {
          for (var i = 0, l = mr.scroll.listeners.length; i < l; i++) {
              mr.scroll.listeners[i](event);
          }
      }

  };

  mr.scroll.documentReady = documentReady;

  mr.components.documentReady.push(documentReady);

  return mr;

}(mr, jQuery, window, document));


//////////////// Scroll Class Modifier
mr = (function (mr, $, window, document) {
  "use strict";

  mr.scroll.classModifiers = {};
  // Globally accessible list of elements/rules
  mr.scroll.classModifiers.rules = [];

  mr.scroll.classModifiers.parseScrollRules = function (element) {
      var text = element.attr('data-scroll-class'),
          rules = text.split(";");

      rules.forEach(function (rule) {
          var ruleComponents, scrollPoint, ruleObject = {};
          ruleComponents = rule.replace(/\s/g, "").split(':');
          if (ruleComponents.length === 2) {
              scrollPoint = mr.util.parsePixels(ruleComponents[0]);
              if (scrollPoint > -1) {
                  ruleObject.scrollPoint = scrollPoint;
                  if (ruleComponents[1].length) {
                      var toggleClass = ruleComponents[1];
                      ruleObject.toggleClass = toggleClass;
                      // Set variable in object to indicate that element already has class applied
                      ruleObject.hasClass = element.hasClass(toggleClass);
                      ruleObject.element = element.get(0);
                      mr.scroll.classModifiers.rules.push(ruleObject);
                  } else {
                      // Error: toggleClass component does not exist.
                      //console.log('Error - toggle class not found.');
                      return false;
                  }
              } else {
                  // Error: scrollpoint component was malformed
                  //console.log('Error - Scrollpoint not found.');
                  return false;
              }
          }
      });

      if (mr.scroll.classModifiers.rules.length) {
          return true;
      } else {
          return false;
      }
  };

  mr.scroll.classModifiers.update = function (event) {
      var currentScroll = mr.scroll.y,
          scrollRules = mr.scroll.classModifiers.rules,
          l = scrollRules.length,
          currentRule;

      // Given the current scrollPoint, check for necessary changes 
      while (l--) {

          currentRule = scrollRules[l];

          if (currentScroll > currentRule.scrollPoint && !currentRule.hasClass) {
              // Set local copy and glogal copy at the same time;
              currentRule.element.classList.add(currentRule.toggleClass);
              currentRule.hasClass = mr.scroll.classModifiers.rules[l].hasClass = true;
          }
          if (currentScroll < currentRule.scrollPoint && currentRule.hasClass) {
              // Set local copy and glogal copy at the same time;
              currentRule.element.classList.remove(currentRule.toggleClass);
              currentRule.hasClass = mr.scroll.classModifiers.rules[l].hasClass = false;
          }
      }
  };

  var fixedElementSizes = function () {
      $('.main-container [data-scroll-class*="pos-fixed"]').each(function () {
          var element = $(this);
          element.css('max-width', element.parent().outerWidth());
          element.parent().css('min-height', element.outerHeight());
      });
  };

  var documentReady = function ($) {
      // Collect info on all elements that require class modification at load time
      // Each element has data-scroll-class with a formatted value to represent class to add/remove at a particular scroll point.
      $('[data-scroll-class]').each(function () {
          var element = $(this);

          // Test the rules to be added to an array of rules.
          if (!mr.scroll.classModifiers.parseScrollRules(element)) {
              console.log('Error parsing scroll rules on: ' + element);
          }
      });

      // For 'position fixed' elements, give them a max-width for correct fixing behaviour
      fixedElementSizes();
      $(window).on('resize', fixedElementSizes);

      // If there are valid scroll rules add classModifiers update function to the scroll event processing queue.
      if (mr.scroll.classModifiers.rules.length) {
          mr.scroll.listeners.push(mr.scroll.classModifiers.update);
      }
  };

  mr.components.documentReady.push(documentReady);
  mr.scroll.classModifiers.documentReady = documentReady;



  return mr;

}(mr, jQuery, window, document));


//////////////// Accordions
mr = (function (mr, $, window, document) {
  "use strict";

  mr.accordions = mr.accordions || {};

  mr.accordions.documentReady = function ($) {
      $('.accordion__title').on('click', function () {
          mr.accordions.activatePanel($(this));
      });

      $('.accordion').each(function () {
          var accordion = $(this);
          var minHeight = accordion.outerHeight(true);
          accordion.css('min-height', minHeight);
      });

      if (window.location.hash !== '' && window.location.hash !== '#' && window.location.hash.match(/#\/.*/) === null) {
          if ($('.accordion > li > .accordion__title' + window.location.hash).length) {
              mr.accordions.activatePanelById(window.location.hash, true);
          }
      }

      jQuery(document).on('click', 'a[href^="#"]:not(a[href="#"])', function () {

          if ($('.accordion > li > .accordion__title' + $(this).attr('href')).length) {
              mr.accordions.activatePanelById($(this).attr('href'), true);
          }
      });
  };



  mr.accordions.activatePanel = function (panel, forceOpen) {

      var $panel = $(panel),
          accordion = $panel.closest('.accordion'),
          li = $panel.closest('li'),
          openEvent = document.createEvent('Event'),
          closeEvent = document.createEvent('Event');

      openEvent.initEvent('panelOpened.accordions.mr', true, true);
      closeEvent.initEvent('panelClosed.accordions.mr', true, true);



      if (li.hasClass('active')) {

          if (forceOpen !== true) {

              li.removeClass('active');
              $panel.trigger('panelClosed.accordions.mr').get(0).dispatchEvent(closeEvent);
          }
      } else {

          if (accordion.hasClass('accordion--oneopen')) {

              var wasActive = accordion.find('li.active');
              if (wasActive.length) {
                  wasActive.removeClass('active');
                  wasActive.trigger('panelClosed.accordions.mr').get(0).dispatchEvent(closeEvent);
              }
              li.addClass('active');
              li.trigger('panelOpened.accordions.mr').get(0).dispatchEvent(openEvent);

          } else {

              if (!li.is('.active')) {
                  li.trigger('panelOpened.accordions.mr').get(0).dispatchEvent(openEvent);
              }
              li.addClass('active');
          }
      }
  };

  mr.accordions.activatePanelById = function (id, forceOpen) {
      var panel;

      if (id !== '' && id !== '#' && id.match(/#\/.*/) === null) {
          panel = $('.accordion > li > .accordion__title#' + id.replace('#', ''));
          if (panel.length) {
              $('html, body').stop(true).animate({
                  scrollTop: (panel.offset().top - 50)
              }, 1200);

              mr.accordions.activatePanel(panel, forceOpen);
          }
      }
  };

  mr.components.documentReady.push(mr.accordions.documentReady);
  return mr;

}(mr, jQuery, window, document));


//////////////// Alerts
// mr = (function (mr, $, window, document){
//   "use strict";

//   mr.alerts = mr.alerts || {};

//   mr.alerts.documentReady = function($){
//       $('.alert__close').on('click touchstart', function(){
//           jQuery(this).closest('.alert').addClass('alert--dismissed');
//       });
//   };

//   mr.components.documentReady.push(mr.alerts.documentReady);
//   return mr;

// }(mr, jQuery, window, document));


//////////////// Backgrounds
mr = (function (mr, $, window, document) {
  "use strict";

  mr.backgrounds = mr.backgrounds || {};

  mr.backgrounds.documentReady = function ($) {

      //////////////// Append .background-image-holder <img>'s as CSS backgrounds

      $('.background-image-holder').each(function () {
          var imgSrc = $(this).children('img').attr('src');
          $(this).css('background', 'url("' + imgSrc + '")').css('background-position', 'initial').css('opacity', '1');
      });
  };

  mr.components.documentReady.push(mr.backgrounds.documentReady);
  return mr;

}(mr, jQuery, window, document));

//////////////// Bars
mr = (function (mr, $, window, document) {
  "use strict";

  mr.bars = mr.bars || {};

  mr.bars.documentReady = function ($) {
      $('.nav-container .bar[data-scroll-class*="fixed"]:not(.bar--absolute)').each(function () {
          var bar = $(this),
              barHeight = bar.outerHeight(true);
          bar.closest('.nav-container').css('min-height', barHeight);
      });
  };

  mr.components.documentReady.push(mr.bars.documentReady);
  return mr;

}(mr, jQuery, window, document));

//////////////// Cookies
// mr = (function (mr, $, window, document){
//   "use strict";

//   mr.cookies = {

//       getItem: function (sKey) {
//           if (!sKey) { return null; }
//           return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
//       },
//       setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
//           if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
//               var sExpires = "";
//               if (vEnd) {
//                 switch (vEnd.constructor) {
//                   case Number:
//                     sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
//                     break;
//                   case String:
//                     sExpires = "; expires=" + vEnd;
//                     break;
//                   case Date:
//                     sExpires = "; expires=" + vEnd.toUTCString();
//                     break;
//               }
//           }
//           document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
//           return true;
//       },
//       removeItem: function (sKey, sPath, sDomain) {
//           if (!this.hasItem(sKey)) { return false; }
//           document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
//           return true;
//       },
//       hasItem: function (sKey) {
//           if (!sKey) { return false; }
//           return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
//       },
//       keys: function () {
//           var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
//           for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
//           return aKeys;
//       }
//   };

//   return mr;

// }(mr, jQuery, window, document));

//////////////// Countdown
// mr = (function (mr, $, window, document){
//   "use strict";

//   mr.countdown = mr.countdown || {};
//   mr.countdown.options = mr.countdown.options || {};

//   mr.countdown.documentReady = function($){

//       $('.countdown[data-date]').each(function(){
//           var element      = $(this),
//               date         = element.attr('data-date'),
//               daysText     = typeof element.attr('data-days-text') !== typeof undefined ? '%D '+element.attr('data-days-text')+' %H:%M:%S': '%D days %H:%M:%S',
//               daysText     = typeof mr.countdown.options.format !== typeof undefined ? mr.countdown.options.format : daysText,
//               dateFormat   = typeof element.attr('data-date-format') !== typeof undefined ? element.attr('data-date-format'): daysText,

//               fallback;

//           if(typeof element.attr('data-date-fallback') !== typeof undefined){
//               fallback = element.attr('data-date-fallback') || "Timer Done";
//           }

//           element.countdown(date, function(event) {
//               if(event.elapsed){
//                   element.text(fallback);
//               }else{
//                   element.text(
//                     event.strftime(dateFormat)
//                   );
//               }
//           });
//       });

//   };

//   mr.components.documentReadyDeferred.push(mr.countdown.documentReady);
//   return mr;

// }(mr, jQuery, window, document));

//////////////// Datepicker
// mr = (function (mr, $, window, document){
//   "use strict";

//   mr.datepicker = mr.datepicker || {};

//   var options = mr.datepicker.options || {};

//   mr.datepicker.documentReady = function($){
//       if($('.datepicker').length){
//           $('.datepicker').pickadate(options);
//       }
//   };

//   mr.components.documentReadyDeferred.push(mr.datepicker.documentReady);
//   return mr;

// }(mr, jQuery, window, document));



//////////////// Dropdowns
mr = (function (mr, $, window, document) {
  "use strict";

  mr.dropdowns = mr.dropdowns || {};

  mr.dropdowns.done = false;

  mr.dropdowns.documentReady = function ($) {

      var rtl = false;

      if ($('html[dir="rtl"]').length) {
          rtl = true;
      }

      if (!mr.dropdowns.done) {
          jQuery(document).on('click', 'body:not(.dropdowns--hover) .dropdown, body.dropdowns--hover .dropdown.dropdown--click', function (event) {
              var dropdown = jQuery(this);
              if (jQuery(event.target).is('.dropdown--active > .dropdown__trigger')) {
                  dropdown.siblings().removeClass('dropdown--active').find('.dropdown').removeClass('dropdown--active');
                  dropdown.toggleClass('dropdown--active');
              } else {
                  $('.dropdown--active').removeClass('dropdown--active');
                  dropdown.addClass('dropdown--active');
              }
          });
          jQuery(document).on('click touchstart', 'body:not(.dropdowns--hover)', function (event) {
              if (!jQuery(event.target).is('[class*="dropdown"], [class*="dropdown"] *')) {
                  $('.dropdown--active').removeClass('dropdown--active');
              }
          });
          jQuery('body.dropdowns--hover .dropdown').on('click', function (event) {
              event.stopPropagation();
              var hoverDropdown = jQuery(this);
              hoverDropdown.toggleClass('dropdown--active');
          });

          // Append a container to the body for measuring purposes
          jQuery('body').append('<div class="container containerMeasure" style="opacity:0;pointer-events:none;"></div>');




          // Menu dropdown positioning
          if (rtl === false) {
              mr.dropdowns.repositionDropdowns($);
              jQuery(window).on('resize', function () { mr.dropdowns.repositionDropdowns($); });
          } else {
              mr.dropdowns.repositionDropdownsRtl($);
              jQuery(window).on('resize', function () { mr.dropdowns.repositionDropdownsRtl($); });
          }

          mr.dropdowns.done = true;
      }
  };

  mr.dropdowns.repositionDropdowns = function ($) {
      $('.dropdown__container').each(function () {
          var container, containerOffset, masterOffset, menuItem, content;

          jQuery(this).css('left', '');

          container = jQuery(this);
          containerOffset = container.offset().left;
          masterOffset = jQuery('.containerMeasure').offset().left;
          menuItem = container.closest('.dropdown').offset().left;
          content = null;

          container.css('left', ((-containerOffset) + (masterOffset)));

          if (container.find('.dropdown__content:not([class*="lg-12"])').length) {
              content = container.find('.dropdown__content');
              content.css('left', ((menuItem) - (masterOffset)));
          }

      });
      $('.dropdown__content').each(function () {
          var dropdown, offset, width, offsetRight, winWidth, leftCorrect;

          dropdown = jQuery(this);
          offset = dropdown.offset().left;
          width = dropdown.outerWidth(true);
          offsetRight = offset + width;
          winWidth = jQuery(window).outerWidth(true);
          leftCorrect = jQuery('.containerMeasure').outerWidth() - width;

          if (offsetRight > winWidth) {
              dropdown.css('left', leftCorrect);
          }

      });
  };

  mr.dropdowns.repositionDropdownsRtl = function ($) {

      var windowWidth = jQuery(window).width();

      $('.dropdown__container').each(function () {
          var container, containerOffset, masterOffset, menuItem, content;

          jQuery(this).css('left', '');

          container = jQuery(this);
          containerOffset = windowWidth - (container.offset().left + container.outerWidth(true));
          masterOffset = jQuery('.containerMeasure').offset().left;
          menuItem = windowWidth - (container.closest('.dropdown').offset().left + container.closest('.dropdown').outerWidth(true));
          content = null;

          container.css('right', ((-containerOffset) + (masterOffset)));

          if (container.find('.dropdown__content:not([class*="lg-12"])').length) {
              content = container.find('.dropdown__content');
              content.css('right', ((menuItem) - (masterOffset)));
          }
      });
      $('.dropdown__content').each(function () {
          var dropdown, offset, width, offsetRight, winWidth, rightCorrect;

          dropdown = jQuery(this);
          offset = windowWidth - (dropdown.offset().left + dropdown.outerWidth(true));
          width = dropdown.outerWidth(true);
          offsetRight = offset + width;
          winWidth = jQuery(window).outerWidth(true);
          rightCorrect = jQuery('.containerMeasure').outerWidth() - width;

          if (offsetRight > winWidth) {
              dropdown.css('right', rightCorrect);
          }

      });
  };


  mr.components.documentReady.push(mr.dropdowns.documentReady);
  return mr;

}(mr, jQuery, window, document));

//////////////// Video
mr = (function (mr, $, window, document) {
  "use strict";

  mr.video = mr.video || {};
  mr.video.options = mr.video.options || {};
  // mr.video.options.ytplayer = mr.video.options.ytplayer || {};

  mr.video.documentReady = function ($) {

      //////////////// Youtube Background

      // if($('.youtube-background').length){
      // 	$('.youtube-background').each(function(){


      // 		var player = $(this),

      // 		themeDefaults = {
      // 			containment: "self",
      // 			autoPlay: true,
      // 			mute: true,
      // 			opacity: 1
      // 		}, ao = {};

      // Attribute overrides - provides overrides to the global options on a per-video basis
      // 		ao.videoURL = $(this).attr('data-video-url');
      // 		ao.startAt = $(this).attr('data-start-at')? parseInt($(this).attr('data-start-at'), 10): undefined;


      // 		player.closest('.videobg').append('<div class="loading-indicator"></div>');
      // 		player.YTPlayer(jQuery.extend({}, themeDefaults, mr.video.options.ytplayer, ao));
      // 		player.on("YTPStart",function(){
      // 	  		player.closest('.videobg').addClass('video-active');
      // 		});	

      // 	});
      // }

      // if($('.videobg').find('video').length){
      // 	$('.videobg').find('video').closest('.videobg').addClass('video-active');
      // } 

      //////////////// Video Cover Play Icons

      $('.video-cover').each(function () {
          var videoCover = $(this);
          if (videoCover.find('iframe[src]').length) {
              videoCover.find('iframe').attr('data-src', videoCover.find('iframe').attr('src'));
              videoCover.find('iframe').attr('src', '');
          }
      });

      $('.video-cover .video-play-icon').on("click", function () {
          var playIcon = $(this);
          var videoCover = playIcon.closest('.video-cover');
          if (videoCover.find('video').length) {
              var video = videoCover.find('video').get(0);
              videoCover.addClass('reveal-video');
              video.play();
              return false;
          } else if (videoCover.find('iframe').length) {
              var iframe = videoCover.find('iframe');
              iframe.attr('src', iframe.attr('data-src'));
              videoCover.addClass('reveal-video');
              return false;
          }
      });
  };

  mr.components.documentReady.push(mr.video.documentReady);
  return mr;

}(mr, jQuery, window, document));