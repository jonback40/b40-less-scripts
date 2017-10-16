(function($, Javelin) {
    
    
    'use strict';
    
    
    var $win = $(window),
        $body = $('body'),
        $header = $('.sticky-header'),
        
        inBreakpoint = $header.outerHeight(),
        breakpointOffset = 200, // currently, 200 is an arbitrary value
        scrollTop = 0;
    
    
    // Register event handlers
    $win
        .scroll(onScroll)
        .trigger('scroll');
    
    
    // --------------------------------------------------------------------------------------------------------------
    
    
    // Handle window scroll events
    function onScroll() {
        var oldScrollTop = scrollTop;
        scrollTop = $win.scrollTop();
        
        // Update 'page-scroll' states on the 'body' tag
        if (scrollTop >= oldScrollTop || scrollTop <= 0) {
            if (scrollTop >= inBreakpoint) {
                if (!$body.hasClass('page-scroll-before')) {
                    $body.addClass('page-scroll-before').onTransitionEnd(function() {
                        $body.addClass('page-scroll-in page-scroll-after');
                    });
                }
            } else {
                if ($body.hasClass('page-scroll-before')) {
                    $body.removeClass('page-scroll-before page-scroll-in page-scroll-after');
                }
            }
        } else {
            if (scrollTop < (inBreakpoint + breakpointOffset)) {
                if ($body.hasClass('page-scroll-after')) {
                    $body.removeClass('page-scroll-after').onTransitionEnd(function() {
                        $body.removeClass('page-scroll-before page-scroll-in');
                    });
                }
            }
        }
    }
    
    
})(jQuery, Javelin);