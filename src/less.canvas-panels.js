(function($, Hammer) {
    
    
    'use strict';
    
    
    var $body = $('body');
    
    
    // Register event handlers
    $('.open-left-canvas').click(toggleLeftCanvas);
    $('.open-right-canvas').click(toggleRightCanvas);
    
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // Functions to handle setting the states for canvas panels
    function closeLeftCanvas() {
        $body.removeClass('canvas-left-is-open');
        
        // Broadcast event
        Javelin.broadcast('canvas.left.closed');
    }
    
    
    function closeRightCanvas() {
        $body.removeClass('canvas-right-is-open');
        
        // Broadcast event
        Javelin.broadcast('canvas.right.closed');
    }
    
    
    function openLeftCanvas() {
        $body.addClass('canvas-left-is-open');
        
        // Broadcast event
        Javelin.broadcast('canvas.left.open');
    }
    
    
    function openRightCanvas() {
        $body.addClass('canvas-right-is-open');
        
        // Broadcast event
        Javelin.broadcast('canvas.right.open');
    }
    
    
    function toggleLeftCanvas(event) {
        event.preventDefault();
        
        if ($body.hasClass('canvas-left-is-open')) {
            closeLeftCanvas();
            
            if (Hammer) {
                Hammer($body.get(0)).off('swipeleft', closeLeftCanvas);
            }
        } else {
            openLeftCanvas();
            
            if (Hammer) {
                Hammer($body.get(0)).on('swipeleft', closeLeftCanvas);
            }
        }
    }
    
    
    function toggleRightCanvas(event) {
        event.preventDefault();
        
        if ($body.hasClass('canvas-right-is-open')) {
            closeRightCanvas();
            
            if (Hammer) {
                Hammer($body.get(0)).off('swiperight', closeRightCanvas);
            }
        } else {
            openRightCanvas();
            
            if (Hammer) {
                Hammer($body.get(0)).on('swiperight', closeRightCanvas);
            }
        }
    }
    
    
})(jQuery, window.Hammer);