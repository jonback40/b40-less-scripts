(function($, Javelin) {
    
    
    'use strict';
    
    
    var $doc = $(document);
    
    
    // Add to global Javelin object
    Javelin.Dropdown = {
        
        _instances: [],
        
        
        // Return all instances in storage
        all: function() {
            var instances = this._instances;
            
            return instances;
        },
        
        
        // Create and store a new instance
        create: function(element) {
            var instance = new Dropdown(element);
            
            this._instances.push(instance);
        },
        
        
        // Return a single instance from storage
        get: function(index) {
            var instance = this._instances[index];
            
            return instance;
        },
        
        
        // Return a single instance from storage based on a matching ID
        getById: function(target) {
            for (var i = 0; i < this._instances.length; i++) {
                if (this._instances[i].target[0].id === target) {
                    return this._instances[i];
                }
            }
            
            return undefined;
        }
        
    };
    
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // Dropdown Class
    var Dropdown = function(element) {
        this.active = false;
        this.element = $(element);
        this.options = this.element.find('.dropdown-option');
        this.selectedValue = '';
        
        // Remember the hidden input field to store the dropdown value
        var targetAttr = this.element.attr('data-target'),
            targetParam = targetAttr.replace('#', ''),
            target = $(targetAttr);
        
        if (target.length) {
            this.target = target;
        } else {
            throw new DropdownError('A hidden input field is required to store the dropdown value');
        }
        
        // Look for a url param that corresponds to the value of '[data-target]' and if it exists,
        // attempt to set that as the selected value on this dropdown
        var param = Javelin.getUrlParam(targetParam);
        if (param) {
            this.setByValue(param);
        } else {
            // If no default value is set from url params, try to use the value of the hidden input field
            var defaultValue = target.val();
            
            if (defaultValue !== '') {
                this.setByValue(defaultValue);
            } else {
                // If no default value is provided, set the default selected value to the first option
                this.setByOption(this.options.get(0));
            }
        }
        
        // Remember the original field label
        this.originalLabel = this.element.find('.dropdown-label-text').text();
        
        // Register event handlers
        this.options.click(this.select.bind(this));
        this.element.find('.dropdown-label').click(this.toggle.bind(this));
    };
    
    
    // Dropdown Methods
    Dropdown.prototype.addOption        = addOption;
    Dropdown.prototype.deselect         = deselect;
    Dropdown.prototype.get              = get;
    Dropdown.prototype.getSelected      = getSelected;
    Dropdown.prototype.hide             = hide;
    Dropdown.prototype.select           = select;
    Dropdown.prototype.setByOption      = setByOption;
    Dropdown.prototype.setByValue       = setByValue;
    Dropdown.prototype.setData          = setData;
    Dropdown.prototype.show             = show;
    Dropdown.prototype.toggle           = toggle;
    Dropdown.prototype.val              = val;
    
    
    // Dropdown Error Class
    var DropdownError = function(message) {
        this.name = 'Javelin.Dropdown Error';
        this.message = message;
        
        this.toString = function() {
            return this.name + ': ' + this.message;
        };
    };
    
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // Dropdown factory
    $doc.ready(function() {
        $('.dropdown').each(function(index, element) {
            Javelin.Dropdown.create(element);
        });
        
        // Dismiss dropdowns when clicking anywhere outside of them
        $(document)
            .click(_dismissDropdowns)
            
            // TODO: This does not work... but we need to dismiss the dropdown for touch devices
            .bind('ontouchstart', _dismissDropdowns);
    });
    
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // Add an option
    function addOption(val, label) {
        var $option = $('<li data-value="'+ val +'" class="dropdown-option">' + label + '</li>');
        
        // Insert into dropdown list
        this.element.find('.dropdown-options > ul').append($option);
        
        // Re-cache and re-listen to our options
        this.options.unbind('click');
        this.options = this.element.find('.dropdown-option');
        this.options.click(this.select.bind(this));
    }
    
    
    // Broadcast jQuery event on a dropdown component
    function _broadcast(eventName, context) {
        var dropdownEvent = jQuery.Event('b40.dropdown.' + eventName);
        
        // Attach entire dropdown instance to the event data
        dropdownEvent.dropdown = context;
        
        context.element.trigger(dropdownEvent);
    }
    
    
    // Return 'value' as a string
    function _coerceToString(value) {
        return value === undefined ? undefined : value + '';
    }
    
    
    // Dismiss dropdowns
    function _dismissDropdowns(event) {
        // Ignore right-clicks
        if (event && event.which === 3) {
            return;
        }
        
        $.each(Javelin.Dropdown.all(), function(index, dropdown) {
            // Cancel if this dropdown is already hidden
            if (!dropdown.active) {
                return;
            }
            
            // Cancel if we're clicking inside of a dropdown
            if (event && event.type === 'click' && Javelin.contains(dropdown.get(), event.target)) {
                return;
            }
            
            // Cancel if the click behavior was already prevented
            if (event.isDefaultPrevented()) {
                return;
            }
            
            // Hide dropdown
            dropdown.hide();
        });
    }
    
    
    // Deselect an option that was already selected
    function deselect() {
        // Deactivate all other options in this dropdown
        this.options.removeClass('active');
        
        // Update dropdown label and target input value
        this.element.find('.dropdown-label-text').text(this.originalLabel);
        this.setByOption(this.options.get(0));
        
        // Broadcast the dropdown 'change' event
        _broadcast('change', this);
    }
    
    
    // Return the jQuery extended element associated with the dropdown
    function get() {
        return this.element;
    }
    
    
    // Return the selected option as a data object
    function getSelected() {
        return this.selectedValue;
    }
    
    
    // Hide the dropdown menu
    function hide(event) {
        if (event) {
            event.preventDefault();
        }
        
        this.active = false;
        this.element.removeClass('active');
        
        // Broadcast the dropdown 'hide' event
        _broadcast('hide', this);
    }
    
    
    // Handle the click event when a user chooses an option from the dropdown menu
    function select(event) {
        event.preventDefault();
        
        // If we are NOT clicking an 'active' option...
        if (event.target !== this.selectedValue.target) {
            // ...activate selected element
            this.setByOption(event.target);
        } else {
            // ...otherwise, deactivate selected element
            this.deselect();
        }
        
        // Hide dropdown
        this.hide();
    }
    
    
    // Set the selected option by providing the `target` element that would normally be clicked by the user in the dropdown menu
    function setByOption(target) {
        var $selected = $(target),
            
            key = $selected.text(),
            value = _coerceToString($selected.attr('data-value'));
        
        // Save the newly selected value and update our data
        var newData = this.setData(target, key, value);
        
        // Deactivate all other options in this dropdown and activate the one that was just clicked
        this.options.removeClass('active');
        $selected.addClass('active');
        
        // Update dropdown label and target input value
        this.element.find('.dropdown-label-text').text(newData.label);
        this.target.val(newData.value);
        
        // Broadcast the dropdown 'change' event
        _broadcast('change', this);
    }
    
    
    // Set the selected option by providing the `value` that matches an option in the dropdown menu
    // If there are multiple options with the same value, the first option found with that value will be used
    function setByValue(value) {
        value = _coerceToString(value);
        
        // Find the option that has a matching 'value'
        var options = this.options;
        var targetOption = options.filter(function(index) {
            return value === $(options.get(index)).attr('data-value');
        });
        
        // If we found a match, set that option as the selected option,
        // If multiple matches were found, the FIRST item will be used as instructed with '.get(0)'
        if (targetOption) {
            this.setByOption(targetOption.get(0));
        }
    }
    
    
    // Set the value of the data object for the selected option and return the 'selectedValue' property
    function setData(target, label, value) {
        this.selectedValue = {
            target: target,
            label: label,
            value: _coerceToString(value)
        };
        
        return this.selectedValue;
    }
    
    
    // Show the dropdown menu
    function show(event) {
        if (event) {
            event.preventDefault();
        }
        
        this.active = true;
        this.element.addClass('active');
        
        // Broadcast the dropdown 'show' event
        _broadcast('show', this);
    }
    
    
    // Toggle the visibility of the dropdown menu
    function toggle(event) {
        if (event) {
            event.preventDefault();
        }
        
        // Show or hide
        if (this.active) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    
    // Return the selected option's value
    function val() {
        return this.selectedValue.value;
    }
    
    
})(jQuery, Javelin);