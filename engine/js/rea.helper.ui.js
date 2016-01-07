/**
 * Support to REASG templates
 *
 */

var ui_support = {
	createNotification : function(message, type) {
		var html = '<div class="alert alert-' + type + ' alert-dismissable page-alert">';    
		html += '<button type="button" class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>';
		html += message;
		html += '</div>';    
		$(html).hide().prependTo('#noty-holder').slideDown();
	},
	init : function(){
		$(document).on("click", '.page-alert .close', function(e) {
			e.preventDefault();
			$(this).closest('.alert.page-alert').slideUp();
		});
		$(window).bind("load resize", function() {
			topOffset = 50;
			width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
			if (width < 768) {
				$('div.navbar-collapse').addClass('collapse');
				$('.navbar-top-links.navbar-collapse').addClass('collapse');
				topOffset = 100; // 2-row-menu
			} else {
				$('div.navbar-collapse').removeClass('collapse');
				$('.navbar-top-links.navbar-collapse').removeClass('collapse');
			}
	
			height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
			height = height - topOffset;
			if (height < 1) height = 1;
			if (height > topOffset) {
				$("#page-wrapper").css("min-height", (height) + "px");
			}
		});
	}
	
}
$(document).ready(function(){
	ui_support.init();
});