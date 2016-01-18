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
		
		$("body").on('click touchend', '.input-group-addon.ui_cal_btn', function(e){
			e.stopPropagation();
			var o = $(e.target);
			if( !o.hasClass(".ui_cal_btn") ){
				o = o.closest(".ui_cal_btn");
			}
			
			var t = o.prev();
			if((t.length > 0) && !t.hasClass("ui_date") ){
				t = o.next();
			}
			if((t.length > 0) && !t.hasClass("ui_date") ){
				if( o.data("field") ){
					t = o.data("field");
					if(typeof t == "string") t = $("input[name='" + o.data("field") + "']");
				}
			}
			
			if(!t || (t.length <= 0)) return;
			ui_support.calendarPopup(t);
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


ui_support.CreateMasked = function(e) {
	
	e.attr("contenteditable", "true");
	e.addClass("edit-area");
	e.data("matching", false);
	e.data("buffer", "");
	
	var $this = {"txt": new rte(e), "selStart": 0, "matching":false, "buffer":""};
	
	e.on('blur', function(event) {
		event.stopPropagation();
		event.preventDefault();
		
		var t = $(this);
		var s = t.html();
		var r = new RegExp(t.data("mask"));
		if(!r.exec(s)){
			//t.focus();
			return;
		}
		
		var ev = new Event("change", {"bubbles":false, "cancelable":false, "target": this});
		document.dispatchEvent(ev);
		
		$this.txt.clearSelection();
	});
	e.on('focus', function(event) {
		var t = $(this);
		if(t.hasClass("disabled")){
			event.stopImmediatePropagation();
			event.preventDefault();
			
			t.blur();
		}
	});
	e.on('keydown', function(event) {
		var t = $(this);
		if($this.matching || t.hasClass("disabled")){
			event.stopImmediatePropagation();
			event.preventDefault();
			return;
		}
		
		if (event.which == 27) {
			t.trigger('blur');
		} else if ((event.which == 10) || (event.which == 13)) {
			event.stopImmediatePropagation();
			event.preventDefault();
		}
		
		$this.txt.getSelection();
		
		if($this.txt.selection && ($this.txt.selection.rangeCount > 0) ){
			var range = $this.txt.selection.getRangeAt(0);
			$this.selStart = range.endOffset;
			
			var s = t.html();
			if($this.selStart == s.length){
				$this.selStart = 0;
			}
		}
	});
	e.on('keyup', function(event) {
		var t = $(this);
		var s = t.html();
		
		if(s.length == 0){
			t.data("buffer","");
			return;
		}
		
		var ignore = [37,38,39,40,8];
		if( ignore.indexOf(event.which) >=0 ){
			if( event.which == 8 ){
				$this.buffer = s;
			}
		
			if($this.txt.selection && ($this.txt.selection.rangeCount > 0) ){
				var range = $this.txt.selection.getRangeAt(0);
				$this.selStart = range.endOffset;
			}
			return;
		}
		
		$this.matching = true;
		var r = rea.types.strings.matchFormat(s, t.data("mask"));
		if(r.match == 2){
			$this.matching = false;
			$this.buffer = s;
			var ev = new Event("change", {"bubbles":false, "cancelable":false, "target": this});
			document.dispatchEvent(ev);
			$this.txt.getSelection();
			return;
		}
		
		if(r.match == 1){
			s = r.string;
			s += $this.buffer.substr(s.length);
			$this.buffer = s;
		}else{
			s = $this.buffer;
		}
			
		t.html(s);
			
		if($this.selStart > 0){
			
			console.log("anchor=" + $this.selStart);
			if($this.selStart<=s.length){
				$this.txt.setSelectionPos($this.selStart,0);
			}else{
				$this.txt.setSelectionPos(s.length,0);
			}	
		}else{
			$this.txt.setSelectionPos(s.length,0);
		}
		
		
		var ev = new Event("change", {"bubbles":false, "cancelable":false, "target": this});
		document.dispatchEvent(ev);

		$this.matching = false;
		return;
	});
}

ui_support.calendarPopup = function(o, options){
	
	if (typeof o == 'string') {
		if(o == 'close'){
			if (ui_support.calendar_popup == null) return;
			ui_support.calendar_popup.uiPopup( "close");
		}
		
		return;
	}
	
	var ops = $.extend({
		'target' : null,
		'center' : false,
		'valueBuild': function(d){ return d.month  + "/" + d.day + "/" + d.year; },
		'valueSet': null,
		'valueGet': null,
	}, options );
	
	var $this = o;
	
	if(!ops.valueGet){
		ops.valueGet = function(){
			return $this.val();	
		}
	}
	if(!ops.valueSet){
		ops.valueSet = function(v){
			return $this.val(v);	
		}
	}
	

	if(!ui_support.hasOwnProperty("calendar_popup") || ui_support.calendar_popup == null) {
		var s = "<div id='ui-calendar-popup' class='dialog'>";
		s = s + "</div>";
		
		ui_support.calendar_popup = $(s);
		$('body').prepend(ui_support.calendar_popup);
		
		ui_support.calendar_popup.on('click touchend', "td.day:not([data-date='']), i[data-date]", function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
			
			var o = $(e.target);
			var dt =  rea.types.date.create(o);
			
			if (!o.hasClass('day')) { //is a month or year
				var s = ui_support.calendarBuildForDate(dt);
				ui_support.calendar_popup.html(s);
				return;
			}
			var s = dt.as_string;
			var fnVal = ui_support.calendar_popup.ops.valueBuild;
			if ( typeof fnVal == 'function') {
				s = fnVal(dt);
			}
			
			var fnSet = ui_support.calendar_popup.ops.valueSet;
			
			if ( typeof fnSet == 'function') {
				fnSet(s);
			}
			
			ui_support.calendar_popup.removeClass("in");
		});
		
		
	}

	
	var dt =  rea.types.date.create(ops.valueGet(o));
	o.data('date', dt.toHumanString());
	
	var s = ui_support.calendarBuildForDate(dt);
	ui_support.calendar_popup.html(s);
	
	ui_support.calendar_popup.ops = ops;
	ui_support.calendar_popup.uiPopup({target:o});
}

ui_support.calendarOptions = {
		strs : {},
		strings : {
			"en" : {
				'months' : ['','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				'th_days' : '<tr><th>Su</th><th>M</th><th>Tu</th><th>W</th><th>Th</th><th>F</th><th>Sa</th></tr>',
				'today' : 'Today',
				'nm' : 'Next Month',
				'pm' : 'Previous Month'
			},
			"es" : {
				'months' : ['','Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], 
				'th_days' : '<tr><th>D</th><th>L</th><th>M</th><th>W</th><th>J</th><th>V</th><th>S</th></tr>',
				'today' : 'Hoy',
				'nm' : 'Proximo Mes',
				'pm' : 'Mes Anterior'
			}
		}
}

ui_support.calendarBuildForDate = function(dt){
	var html = '', th='' ,th_days='';

	var sd = dt.fow;
	var strs = ui_support.calendarOptions.strings[ rea.lang ];
	
	d = 0;
	var lnk ='';
	for(var col=0; col<=5; col++){
		html += "<tr>";
		for(var row=0; row<=6; row++){
			if((row >= sd) && (d < dt.last_day)){ //first day
				d++;
				sd = 0;
				//console.log('d=' + d + ' row=' + row + " col= " + col + ' sd=' + sd);
				lnk = " data-date='" + dt.month + '/' + d + '/' + dt.year + "'"; 
				if(d == dt.day){
					html += "<td class='day active' " + lnk + ">";
				}else if((dt.year == dt.today.getFullYear()) && (dt.m == (dt.today.getMonth())) && (d == dt.today.getDate())){
					html += "<td class='day today' " + lnk + ">";
				}else{
					html += "<td class='day' " + lnk + ">";
				}
				html += d + "</td>";
			}else {
				html += "<td class='empty'>" + "</td>";
			}
		}
		html += "</tr>";
		if(d >= dt.last_day) break;
	}
	
	var s = '';
	var pm = rea.types.date.dateToHumanString(dt.prev_month);
	var nm = rea.types.date.dateToHumanString(dt.next_month);
		
	th = "<tr><th class='day_prev'><i data-date='" + pm + "' class='fa fa-angle-left'></i></th><th class='day_month' colspan='5'>" + strs.months[dt.month] + ", " + dt.year + "</th><th class='day_next'><i data-date='" + nm + "' class='fa fa-angle-right'></i></th></tr>";
	
	s += "<table border='0' cellspacing='1' id='cal_month'>";
	s += "<thead>" + th + strs.th_days + "</thead><tbody>";
	s += html + "</tbody></table>";
	s += "</div>";
	
	return s;
}



$(document).ready(function(){
	ui_support.init();
});