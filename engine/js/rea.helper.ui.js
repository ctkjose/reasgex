/**
 * Support to REASG templates
 *
 */

var ui_support = {
	view : {
		size : '',
		width: 0,
		height: 0,
		uagent:'',
		attr: {},
	},
	opsViewSizes : [
		['lg', "$width >= 1280"],
		['md', "$width >= 768"],
		['xs', "$width < 460"],
		['sm', "$width < 768"],
	],
	opsViewDeviceAttr :[
		['webkit', ["webkit"]],
		['android', ["android"]],
		['safari', ["safari"]],
		['chrome', ["chrome"]],
		['ios', ["iphone","ipad", "ipod"] ],
		['windows', ["iemobile"] ],
		['mobile', ["iphone","ipad", "ipod", "android", "iemobile"] ],
	],
	copyClasses: function(o,t, classes){
		for(var i in classes){
			if(o.hasClass(classes[i])) t.addClass(classes[i]);
		}
	},
	copyAttr: function(o,t, attrs){
		for(var i in attrs){
			if(o.attr(attrs[i])) t.attr(attrs[i], o.attr(attrs[i]));
		}
		
	},
	applyStandardRowSizeAttr: function(o, t){
		this.copyAttr(o,t,['xs-min-width', 'sm-min-width', 'md-min-width', 'lg-min-width'] );
		
		if(o.attr('min-width')){
			t.css({"min-width": o.attr('min-width')});
		}
	},
	createNotification : function(message, type) {
		var html = '<div class="alert alert-' + type + ' alert-dismissable page-alert">';    
		html += '<button type="button" class="close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>';
		html += message;
		html += '</div>';    
		$(html).hide().prependTo('#noty-holder').slideDown();
	},
	init : function(){
		
		this.view.uagent = navigator.userAgent.toLowerCase();
		
		for( var i in this.opsViewDeviceAttr){
			var e = this.opsViewDeviceAttr[i];
			//var m = e[1];
			var ok = false;
			e[1].forEach(function(m){
				ok = ok || (ui_support.view.uagent.search(m) > -1);
			});
			this.view.attr[e[0]] = ok;
		}
		
		
		$(document).on("click", '.page-alert .close', function(e) {
			e.preventDefault();
			$(this).closest('.alert.page-alert').slideUp();
		});
		$(window).bind("load resize", function() {
			topOffset = 50;
			ui_support.view.width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
			
			var changed = false;
			var size = ui_support.view.size;
			
			for( var i in ui_support.opsViewSizes){
				var e = ui_support.opsViewSizes[i];
				var $width = ui_support.view.width;
				var ok = false;
				
				
				eval("{ ok=(" + e[1] + "); }");
				if(!ok) continue;
				if(size != e[0]) changed = true;
				size = e[0];
				break;
			}
			
			if(changed){
				$("body").removeClass(ui_support.view.size);
				$("body").addClass(size);
				
				ui_support.view.size = size;
				rea_controller.dispatchEvent("view-size-changed", size);
			}
			
			if (ui_support.view.width < 768) {
				
				$('div.navbar-collapse').addClass('collapse');
				$('.navbar-top-links.navbar-collapse').addClass('collapse');
				topOffset = 100; // 2-row-menu
			} else {
				
				$('div.navbar-collapse').removeClass('collapse');
				$('.navbar-top-links.navbar-collapse').removeClass('collapse');
			}
	
			var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
			height = height - topOffset;
			ui_support.view.height = height;
			
			//if (height < 1) height = 1;
			//if (height > topOffset) {
				//$("#page-wrapper").css("min-height", (height) + "px");
			//}

			
		});
	}
	
}
$(document).ready(function(){
	ui_support.init();
});