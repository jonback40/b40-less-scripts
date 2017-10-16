(function($, Javelin) {
    
    
    'use strict';
    
    
    var $search = $('.search-bar-collapsible'),
        $input = $search.find('.search-bar-input'),
        
        isActive = false;
    
    
    // Register event handlers
    $search
        .hover(expand, collapseDeferred)
        .focus(expand)
        .blur(collapse);
    
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // Activate and reveal the full search box
    function expand() {
        if (!isActive) {
            isActive = true;
            
            // Set active state
            $search.addClass('active');
            
            // Broadcast event
            Javelin.broadcast('search.expanded');
        }
    }
    
    
    // Deactivate the search box, unless the text field is currently focused or has a value
    function collapse() {
        if (isActive && !isFocused() && $input.val() === '') {
            isActive = false;
            
            // Remove active state and clear input field
            $search.removeClass('active');
            $input.val('');
            
            // Broadcast event
            Javelin.broadcast('search.collapsed');
        }
    }
    
    
    // Wait for a moment and then deactivate the search box
    function collapseDeferred() {
        setTimeout(collapse, 750);
    }
    
    
    // Return true if the given element is the 'activeElement' in the document
    function isFocused() {
        return $input.get(0) === document.activeElement;
    }
    
    
})(jQuery, Javelin);