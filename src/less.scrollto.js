(function($, Javelin) {
    
    
    'use strict';
    
    
    var $body = $('html, body'),
        
        cancelableEvents = 'scroll mousedown DOMMouseScroll mousewheel keyup',
        broadcastCount = 0;
    
    
    // Add to global Javelin object
    Javelin.Scrollto = {
        
        // Default configuration
        DEFAULTS: {
            
            easing:     'easeInOutCubic',
            duration:   1250,
            offset:     0
            
        },
        
        defaults: function() {
            return $.extend({}, this.DEFAULTS);
        }
        
    };
    
    
    // Register event handlers
    $('[data-scrollto]').click(clickHandler);
    
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // Handle click events
    function clickHandler(event) {
        var self            = $(this),
            defaultOptions  = Javelin.Scrollto.defaults(),
            dataOptions     = Javelin.dataAttr(self, ['offset', 'duration', 'easing']),
            options         = $.extend(defaultOptions, dataOptions),
            target          = $(self.attr('data-scrollto'));
        
        // If the destination element exists, continue
        if (target.length > 0) {
            var destination = (target.offset().top + parseInt(options.offset));
            
            // Broadcast event
            Javelin.broadcast('scrollto.start');
            
            // Allow user to cancel the scrolling animation and prevent jerking the screen around
            $body.bind(cancelableEvents, function() {
                $body.stop();
            });
            
            // Animate the document's scrollTop property to the destination
            $body.animate({ scrollTop: destination }, {
                duration: parseInt(options.duration),
                easing: options.easing,
                complete: function() {
                    $body.unbind(cancelableEvents);
                    
                    // Defer event broadcasting (see function description below)
                    setTimeout(deferredBroadcast, 100);
                }
            });
            
            // Cancel default click behavior
            event.preventDefault();
        }
    }
    
    
    // Callback function for deferring an event broadcast until after BOTH the body and html tags have completed their animation
    function deferredBroadcast() {
        if (broadcastCount > 0) {
            // Broadcast event
            Javelin.broadcast('scrollto.complete');
            
            // Reset counter
            broadcastCount = 0;
        } else {
            // Increment
            broadcastCount++;
        }
    }
    
    
    // Avoid direct access of the defaults object to prevent unwanted mutations or changes that would apply to all instances of Scrollto()
    function getDefaults() {
        return $.extend({}, Javelin.Scrollto.DEFAULTS);
    }
    
    
})(jQuery, Javelin);