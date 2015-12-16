rea.registerComponent( "ui", "calendar", ["ui.panel"],
function(){
	ui_datepicker = {
		state : {'txt':'', 'target':null, 'popover':null},
		initialize : function(){
			rea_ui_panels_controller.installEventHandlers();
		},
		/**
		 * Implements the UI Extend interface.
		 * @param {Object} extender - The rea_helper_ui_extender instance
		 */
		uiExtender : function(extender){
			console.log("@ui.calendar.extender()");
			extender.registerExpandHelper( ".datepicker", [this, "uiExpandElement"] );
			
			$("body").on('blur', 'input[data-type=date]', function(e){
				var o = $(e.target);
				var n = o.attr('name');
				var v = o.val();
			
				var r = /^(\d+)\/(\d+)\/\d{4}$/;
				if ( v.length == 0) {
					o.css({'background-color' : '#fff'});
					return;
				}
				if (!r.test(v)) {
					o.css({'background-color' : '#FF0000'}).css({'background-color' : '#FFEEEE'});
				}else{
					o.css({'background-color' : '#fff'});
				}
			});
			
			$("body").on('click touchend', '.input-group-addon.ui_cal_btn', function(e){
				e.stopPropagation();
				var o = $(e.target);
				var p = o.parents('div.datepicker:first');
				var t = p.find('input[type=text]');
				console.log(t);
				
				rea_helper_calendar.popup(t);
				
				
				//rea.components.ui.calendar.state.txt = t;
				//rea.components.ui.calendar.popup();
			});
		},
		uiExpandElement: function(o){
			console.log("@ui.calendar.expandElement()");
			console.log(o);
			
			var data_class = 'datepicker';
			var data_type = "date";
			var n = o.attr("name");
			
			if (o.attr('data-calendar')) {
				//t.attr("maxlength", 14);	
			}
			
			if (o.attr('class')) {
				data_class = o.attr('class');
			}
			
			var d = $('<div class="input-group ' + data_class + '"  data-type="' + data_type + '" name="' + n + '">');
			var b = $('<span class="input-group-addon ui_cal_btn"><i class="fa fa-calendar"></i></span>');
		
			var t = o.clone();
			
			if (!t.attr('placeholder')) {
				t.attr('placeholder', 'M/D/YYYY');
			}
			if (!t.attr('title')) {
				t.attr('title', 'M/D/YYYY');
			}
			
			t.addClass('form-control');
			
			t.attr('data-type', data_type );
			t.attr('data-ignore', '1' );
			d.css({"width": "240px"});
			
			d.append(t);
			d.append(b);
			
			o.replaceWith( d );
			
			return;
		
			
			t.focus(function(e){
				var r = /^(\d+)\/(\d+)\/\d{4}$/;
				var o = $(e.target);
				var v = o.val();
				if ( v.length == 0) {
					o.css({'background-color' : '#fff'});
					return;
				}else if (r.test(v)) {
					o.css({'background-color' : '#fff'});
				}
			});
			
		}
	};
	return ui_datepicker;
}() );

var rea_helper_calendar = {
		strs : {},
		elm : null,
		date_popup : null,
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
rea_helper_calendar.lang = rea.lang;
rea_helper_calendar.strs = rea_helper_calendar.strings[ rea.lang ];
rea_helper_calendar.create = function(e){
	//console.log(o);
	
	var html = '', th='' ,th_days='';

	var sd = e.fow;

	d = 0;
	var lnk ='';
	for(var col=0; col<=5; col++){
		html += "<tr>";
		for(var row=0; row<=6; row++){
			if((row >= sd) && (d < e.last_day)){ //first day
				d++;
				sd = 0;
				//console.log('d=' + d + ' row=' + row + " col= " + col + ' sd=' + sd);
				lnk = " data-date='" + e.month + '/' + d + '/' + e.year + "'"; 
				if(d == e.day){
					html += "<td class='day active' " + lnk + ">";
				}else if((e.year == e.today.getFullYear()) && (e.m == (e.today.getMonth())) && (d == e.today.getDate())){
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
		if(d >= e.last_day) break;
	}
	
	var s = '';
	var pm = e.dateHumanString(e.prev_month);
	var nm = e.dateHumanString(e.next_month);
		
	th = "<tr><th class='day_prev'><i data-date='" + pm + "' class='fa fa-angle-left'></i></th><th class='day_month' colspan='5'>" + this.strs.months[e.month] + ", " + e.year + "</th><th class='day_next'><i data-date='" + nm + "' class='fa fa-angle-right'></i></th></tr>";
	
	s += "<table border='0' cellspacing='1' id='cal_month'>";
	s += "<thead>" + th + this.strs.th_days + "</thead><tbody>";
	s += html + "</tbody></table>";
	s += "</div>";
	
	return s;
}

rea_helper_calendar.popup = function(elm){
	
	if (typeof elm == 'string') {
		if(elm == 'close'){
			if (this.date_popup == null) return;
			this.date_popup.ui_popup('close');
		}
		
		return;
	}
	if (this.date_popup == null) {
		var s = "<div id='ui_cal_view' class='boxed with-border round popup'>";
		s = s + "</div>";
		
		this.date_popup = $(s);
		
		$('body').prepend(this.date_popup);
		
		//$("body").on("click touchend", "td.day:not([data-date=''])", rea_helper_ui_calendar.evt_dayClick);
		//$("body").on("click touchend", "i[data-date]", rea_helper_ui_calendar.evt_dateClick);
		
		
		$("body").on('click touchend', "td.day:not([data-date='']), i[data-date]", function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
			
			var o = $(e.target);
			var p = o.closest('#ui_cal_view');
			var n = p.attr("name");
			
	
			var dt = new rea_date(o);
			
			if (!o.hasClass('day')) {
				var s = rea_helper_calendar.create(dt);
				rea_helper_calendar.date_popup.html(s);
				return;
			}
			
			//var t = $('input.datepicker[name=' + n + ']');
			
			if ( typeof(rea_helper_calendar.elm) != 'undefined') {
				rea_helper_calendar.elm.val( dt.as_string );
				rea_helper_calendar.elm.trigger('change');
				rea_helper_calendar.popup("close");
			}
		});
	}
	
	var dt  = elm.data('rea_date');
	
	if(!dt){
		dt =  new rea_date();
	}
	
	dt.fromString( elm.val() );
	elm.data('rea_date', dt);
	
	var s = rea_helper_calendar.create(dt);
	rea_helper_calendar.elm = elm;
	
	rea_helper_calendar.date_popup.html(s);
	rea_helper_calendar.date_popup.ui_popup( {target: elm} );
}




