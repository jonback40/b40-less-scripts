(function($, Javelin) {
    
    
    'use strict';
    
    
    var $body = $('body'),
        $fade = $('.page-nav-fade'),
        
        activeClass = 'nav-is-active';
    
    
    // Init
    __init();
    
    
    // Page Nav Error Class
    var NavError = function(message) {
        this.name = 'Javelin.Navigation Error';
        this.message = message;
        
        this.toString = function() {
            return this.name + ': ' + this.message;
        };
    };
    
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // Initialize
    function __init() {
        // Register event handlers
        $('[data-toggle-nav]').click(toggleNavigation);
        
        // Hide any fading elements by default once the page loads
        $fade.addClass('hidden-nav-down');
    }
    
    
    // Enable the "active" state
    function enableActiveState() {
        if ($fade.length) {
            $fade.removeClass('hidden-nav-down');
            
            // Allow the faded element time to render before we activate the navigation, otherwise
            // the fade transition won't work.
            setTimeout(function() {
                $body.addClass(activeClass);
            }, 100);
        } else {
            $body.addClass(activeClass);
        }
    }
    
    
    // Disable the "active" state
    function disableActiveState() {
        $body.removeClass(activeClass);
        
        // Hide faded elements once their opacity transition is complete
        if ($fade.length) {
            $fade.onTransitionEnd(function() {
                $fade.addClass('hidden-nav-down');
            });
        }
    }
    
    
    // Toggle the "active navigation" state of the page
    function toggleNavigation(event) {
        event.preventDefault();
        
        var self        = $(this),
            dataOptions = Javelin.dataAttr(self, ['toggle-nav']),
            target      = $(dataOptions['toggle-nav']),
            isActive    = $body.hasClass(activeClass);
        
        if (!isActive) {
            // If 'target' is present...
            if (target.length) {
                // Reset the scroll position of 'target'
                target.scrollTop(0);
                
                // Set the active state
                enableActiveState();
            } else {
                throw new NavError('Target not found: ' + dataOptions['toggle-nav']);
            }
        } else {
            // If 'target' is present...
            if (target.length) {
                // Remove the active state
                disableActiveState();
            } else {
                throw new NavError('Target not found: ' + dataOptions['toggle-nav']);
            }
        }
        
        // Broadcast event
        Javelin.broadcast('nav.toggled', { isActive: !isActive });
    }
    
    
})(jQuery, Javelin);