(function($, Javelin) {
    
    
    'use strict';
    
    
    var $win = $(window);
    
    
    // Add to global Javelin object
    Javelin.SimplemodalVideo = {
        
        // Default configuration
        DEFAULTS: {
            
            width:  800,
            height: 450,
            autoplay: 0,
            speed: 200
            
        },
        
        
        // Avoid direct access of the defaults object to prevent unwanted mutations
        defaults: function() {
            return $.extend({}, this.DEFAULTS);
        }
        
    };
    
    
    // Register event handlers
    $('[data-simplemodal="open-simplemodal-video"]').click(clickHandler);
    
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // Handle click events
    function clickHandler(event) {
        var self            = $(this),
            defaultOptions  = Javelin.SimplemodalVideo.defaults(),
            dataOptions     = Javelin.dataAttr(self, ['width', 'height', 'autoplay', 'speed']),
            options         = $.extend(defaultOptions, dataOptions),
            src             = $(this).attr('href') + (options.autoplay == 1 ? '?autoplay=1' : ''); // ?autoplay=1 works for YouTube and Vimeo
        
        // Open modal
        $.modal(
            '<iframe src="' + src + '" width="' + options.width + '" height="' + options.height + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>',
            {
                zIndex: 10000,
                overlayCss: { background: '#000' },
                overlayClose: true,
                closeHTML: '<a href="#" class="close">&times;</a>',
                
                onOpen: function(dialog) {
                    dialog.overlay.fadeIn(options.speed, function() {
                        dialog.container.fadeIn(options.speed, function() {
                            dialog.data.fadeIn(options.speed, function() {
                                $win
                                    .resize(responsiveIframe)
                                    .trigger('resize');
                                
                                // Broadcast event
                                Javelin.broadcast('simplemodal.open', dialog);
                            });
                        });
                    });
                },
                
                onClose: function(dialog) {
                    dialog.container.fadeOut(options.speed, function() {
                        dialog.overlay.fadeOut(options.speed, function() {
                            $.modal.close();
                            
                            // Broadcast event
                            Javelin.broadcast('simplemodal.close', dialog);
                            
                            $win.unbind('resize', responsiveIframe);
                        });
                    });
                },
                
                onShow: function(dialog) {
                    // Broadcast event
                    Javelin.broadcast('simplemodal.show', dialog);
                }
            }
        );
        
        // Cancel default click behavior
        event.preventDefault();
        
        
        // We're defining this function within this scope so it can properly reference the local 'options' var
        function responsiveIframe() {
            var $container = $('#simplemodal-container'),
                $iframe = $('#simplemodal-data > iframe'),
                
                ratio = (options.width / options.height),
                
                winWidth = $win.width(),
                winHeight = $win.height(),
                
                scaledWidth = winWidth < options.width ? winWidth : options.width,
                scaledHeight = winWidth < options.width ? Math.round(scaledWidth / ratio) : options.height,
                
                top = Math.round((winHeight / 2) - (scaledHeight / 2)),
                left = Math.round((winWidth / 2) - (scaledWidth / 2));
            
            // Update modal size and position
            $iframe.css({
                width: scaledWidth + 'px',
                height: scaledHeight + 'px'
            });
            
            $container.css({
                width: scaledWidth + 'px',
                height: scaledHeight + 'px',
                top: top,
                left: left
            });
        }
    }
    
    
    // Avoid direct access of the defaults object to prevent unwanted mutations or changes that would apply to all instances of SimplemodalVideo()
    function getDefaults() {
        return $.extend({}, Javelin.SimplemodalVideo.DEFAULTS);
    }
    
    
})(jQuery, Javelin);