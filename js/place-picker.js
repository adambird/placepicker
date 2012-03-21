!function( $ ) {
	var PlacePicker = function(element, options){
		this.element = $(element);
		this.picker = $(PPGlobal.template)
							.appendTo('body')
							.on({
								click: $.proxy(this.click, this),
								mousedown: $.proxy(this.mousedown, this)
							});
		this.isInput = this.element.is('input');
		
		if (this.isInput) {
			this.element.on({
				focus: $.proxy(this.show, this),
				blur: $.proxy(this.hide, this),
				keyup: $.proxy(this.update, this)
			});
		}
	};
	
	$.fn.placepicker = function ( option ) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('placepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('placepicker', (data = new PlacePicker(this, $.extend({}, $.fn.placepicker.defaults,options))));
			}
			if (typeof option == 'string') data[option]();
		});
	};
	
	PlacePicker.prototype = {
		constructor: PlacePicker,
		
		show: function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e ) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (!this.isInput) {
				$(document).on('mousedown', $.proxy(this.hide, this));
			}
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},
		
		hide: function(){
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = 0;
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}
			this.setValue();
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},
		
		place: function(){
			var offset = this.component ? this.component.offset() : this.element.offset();
			this.picker.css({
				top: offset.top + this.height,
				left: offset.left
			});
		},
		
		click: function(e) {
			e.stopPropagation();
			e.preventDefault();
		},
		
		mousedown: function(e){
			e.stopPropagation();
			e.preventDefault();
		},

		setValue: function() {
			if (!this.isInput) {
				this.element.data('lat', 0);
				this.element.data('lon', 0);
			}
		}
	};
	
	var PPGlobal = {};
	
	PPGlobal.template = '<div class="placepicker dropdown-menu">'+
							'<div class="placepicker-map">'+
								'<div id="placepicker-map-canvas" style="width:100%; height:100%">This is the map canvas</div>'+
							'</div>'+
						'</div>';
}( window.jQuery )