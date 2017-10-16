(function($) {
    
    
    'use strict';
    
    
    // Polyfill (jQuery extension) to listen for 'transitionEnd' events
    
    // Source: http://blog.alexmaccaw.com/css-transitions
    $(function() {
        $.support.transition = transitionEnd();
    });
    
    $.fn.emulateTransitionEnd = function(duration) {
        var $element = $(this),
            called = false;
        
        $element.one($.support.transition.end, function() {
            called = true;
        });
        
        var callback = function() {
            if (!called) {
                $element.trigger($.support.transition.end);
            }
        };
        
        setTimeout(callback, duration);
        
        return this;
    };
    
    
    // Simpler Shorthand
    $.fn.onTransitionEnd = function(fn, duration) {
        duration = duration || 350;
        
        // In edge case scenarios, the DOM may not be ready and this method may be called too early.
        // We prevent that here by either calling the callback function after the transition ends
        // or if the transition event string isn't available, call the callback function immediately.
        var transition = $.support.transition ? $.support.transition.end : null;
        
        if (transition) {
            $(this).one(transition, fn).emulateTransitionEnd(duration);
        } else {
            fn.call(this);
        }
    };
    
    
    // Determine the proper transitionEnd event name
    function transitionEnd() {
        var element = document.createElement('element'),
            transitionEndEventNames = {
                'WebkitTransition'  : 'webkitTransitionEnd',
                'MozTransition'     : 'transitionend',
                'OTransition'       : 'oTransitionEnd otransitionend',
                'transition'        : 'transitionend'
            };
        
        for (var name in transitionEndEventNames) {
            if (element.style[name] !== undefined) {
                return {
                    end: transitionEndEventNames[name]
                };
            }
        }
        
        return false; // explicit for IE8
    }
    
    
})(jQuery);

(function($) {
    
    
    'use strict';
    
    
    var $body = $('body');
    
    
    // Create Javelin object
    var Javelin = {
        
        // Public methods
        addCommas:      addCommas,
        broadcast:      broadcast,
        contains:       contains,
        dataAttr:       dataAttr,
        getUrlParam:    getUrlParam,
        hiddenWidth:    hiddenWidth,
        hiddenHeight:   hiddenHeight
        
    };
    
    
    // Make public
    window.Javelin = Javelin;
    
    
    // Init
    __init();
    
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // Javelin Error Class
    function JavelinError(message) {
        this.name = 'Javelin Error';
        this.message = message || 'An unknown error has occurred';
        this.stack = (new Error()).stack;
    };
    
    
    // Initialize
    function __init() {
        // If logged in, set classname to act as a flag for certain styling
        if ($('#javelin_adminBar').length > 0) {
            $body.addClass('is-admin');
        } else if ($('#javelin_userBar').length > 0) {
            $body.addClass('is-user');
        }
        
        
        // Add the 'is-parent' class to top level navigation items for proper styling of hover and active states
        $('#nav > li > ul, #subnav > li > ul').each(function(i, element) {
            $(element).parent().addClass('is-parent');
        });
    }
    
    
    // Add commas to a number-formatted string
    // 
    // It may be important to know that `integer` refers to the part of the
    // number to the left of the decimal while `fractional` refers to the
    // part of the number to the right of the decimal.
    function addCommas(str) {
        var decimal = str.toString().split('.'),
            integer = decimal[0],
            fractional = decimal[1] ? '.' + decimal[1] : '',
            regex = /(\d+)(\d{3})/;
        
        while (regex.test(integer)) {
            integer = integer.replace(regex, '$1,$2');
        }
        
        return integer + fractional;
    }
    
    
    // Broadcast a jQuery event on the `body` element
    function broadcast(type, data) {
        var event = jQuery.Event('b40.' + type);
        
        $body.trigger(event, data || {});
    }
    
    
    // Returns true if `needle` is a descendant of `haystack`
    function contains(haystack, needle) {
        var parent = $(needle).parent()[0];
        
        if (parent == $body[0]) {
            // Return false if we make it as far as the body tag with no matches
            return false;
        } else if (parent == haystack[0]) {
            // Return true if we find a match
            return true;
        } else {
            // Recursively traverse up the DOM until we find a match or the body tag. The parent of
            // the current needle will be the next needle argument.
            return contains(haystack, parent);
        }
    }
    
    
    // Return the value of one or more HTML5 data attributes.
    // 
    // This is a workaround for our outdated version of jQuery which doesn't
    // have a data() method that will recognize data attributes. If `attr`
    // is an array, it will return an array of matches.
    function dataAttr(target, attr) {
        if ($.isArray(attr)) {
            var props = {};
            
            $.each(attr, function(i, prop) {
                var value = Javelin.dataAttr(target, prop);
                
                if (value) {
                    props[prop] = value;
                }
            });
            
            return props;
        }
        
        return target.attr('data-' + attr);
    }
    
    
    // Return a parameter from the URL string
    function getUrlParam(param) {
        var url = decodeURIComponent(window.location.search.substring(1)),
            params = url.split('&');
        
        for (var i = 0; i < params.length; i++) {
            var parts = params[i].split('=');
            
            if (parts[0] === param) {
                return parts[1] === undefined ? true : parts[1];
            }
        }
    }
    
    
    // Return the computed width of a hidden element
    function hiddenWidth(element, useOuter) {
        var method = useOuter ? 'outerWidth' : 'width';
        
        return _hiddenDimensions(element, method);
    }
    
    
    // Return the computed height of a hidden element
    function hiddenHeight(element, useOuter) {
        var method = useOuter ? 'outerHeight' : 'height';
        
        return _hiddenDimensions(element, method);
    }
    
    
    // Return either the width or height of a hidden element
    function _hiddenDimensions(element, method) {
        if (!element) {
            throw new JavelinError('Unable to perform operation on undefined value. (Requires a jQuery extended element)');
        }
        
        var $element = $(element);
        
        if ($element.length) {
            var cachedStyle  = $element.attr('style');
            
            $element.css({
                display:    'block',
                visibility: 'hidden',
                position:   'absolute'
            });
            
            var size = $element[method]();
            
            $element.attr('style', (cachedStyle ? cachedStyle : ''));
            
            return size;
        } else {
            throw new JavelinError('Unable to perform operation on undefined value. (Requires a jQuery extended element)');
        }
    }
    
    
})(jQuery);