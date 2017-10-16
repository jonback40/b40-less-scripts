(function() {
    
    
    'use strict';
    
    
    var $replacements = $('[data-svg-replace]');
    
    
    // Find all SVG replacements and load their SVG data
    $replacements.each(replaceSvg);
    
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // Replacement Error Class
    function ReplacementError(message) {
        this.name = 'SVG Replacement Error';
        this.message = message || 'An unknown error has occurred';
        this.stack = (new Error()).stack;
    }
    
    
    // Load the source data from an SVG and replace the image in the DOM with a full SVG model
    function replaceSvg(i, element) {
        var self = $(element),
            src = self.attr('src'),
            cache = self.attr('data-cache'),
            url = window.location.protocol + '//' + window.location.host + src;
        
        // Cancel if we are attempting to loading anything other than an SVG file
        if (url.indexOf('.svg') === -1) {
            throw new ReplacementError('File type must be in SVG format.');
            
            return;
        }
        
        // Handle caching option, if provided
        if (cache && cache == 'false') {
            url += '?' + Date.now();
        }
        
        // Load SVG data and replace into DOM
        $.ajax({
            url: url,
            method: 'GET',
            error: function(jqXHR, textStatus, errorThrown) {
                throw new ReplacementError(errorThrown);
                
                // Broadcast event
                Javelin.broadcast('svgreplace.complete');
            },
            success: function(data, textStatus, jqXHR) {
                var svg = data.documentElement || data.document;
                
                if (svg) {
                    self.replaceWith(svg);
                    
                    // Broadcast event
                    Javelin.broadcast('svgreplace.complete', { replacedWith: svg });
                } else {
                    throw new ReplacementError('Unable to determine the document element in data response. Please ensure the format of the requested SVG data is valid XML.');
                }
            }
        });
    }
    
    
})();