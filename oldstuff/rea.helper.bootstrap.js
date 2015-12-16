/*
 *    REASG Bootstrap Toolkit
 *    Jose L Cuevas
 *
 */

reasg = {

};

rea_bootstrap_helper = {
	
	expand_functions : [],
	
	expand_items : function(){
		
		for(i=0;i<this.expand_functions.length;i++){
			var def = this.expand_functions[i];
			$(def.sel).each(function(){
				var o = $( this );
				def.fn(o);
			});
		}
	},
	expand_form_rows : function(o){
		var lbl = o.children("label");
		//var has_lbl = (typeof(lbl) !== 'undefined') ? true : false;
		var has_lbl = (lbl.length > 0) ? true : false;
		if (has_lbl) {
			lbl.detach();
			lbl.addClass("col-sm-2");
		}else if (o.attr('data-label')) {
			has_lbl = true;
			lbl = $("<label class=\"control-label col-sm-2\">" + o.data("label") + "</label>");
		}
		
		var html = o.html();
		var d = $("<div class=\"col-sm-10\"></div>");
		d.append(html);
		
		o.html("");
		
		if (has_lbl) {
			o.append(lbl);
		}else{
			d.addClass("col-sm-offset-2");
		}
		o.append(d);
		o.addClass("form-group");
	},
	expand_form_footer : function(o){
		
		
		var html = o.html();
		var d = $("<div class=\"pull-right\"></div>");
		d.append(html);
		
		o.html("");
		
		o.append(d);
		o.addClass("form-group");
		o.addClass("clearfix");
	},
	expand_input_buttons : function(o){
		if (o.attr('data-rea-msg')) {
			o.click( function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				
				var c = $(this);
				if (c.attr('data-confirm')) {
					var ok = confirm(c.data('confirm'));
    
					if (!ok) {
						return;
					}
				}
				
				var m = o.data('rea-msg');
				var f = o.parents('form:first');
				var view = rea_views.getView( f.attr("name") );
				
				view.sendMessage(m);
				
			});
		}
	},
	expand_checkbox : function(o){
		
		var n = o.attr("name");
		var s = '';
		var lbl = '';
		var v = '1';
		var data_type = "";
		var lbl_type = "";
		var in_type = "checkbox";
		var inline = false;
		var data_bind = "";
		
		if (o.hasClass('radio')) {
			in_type = "radio";
		}
		if (o.hasClass('inline')) {
			//o.removeClass('inline');
			inline = true;
		}
		if (o.attr("data-bind")) {
			data_bind = " data-bind=\"" + o.attr("data-bind") + "\"";
			o.removeAttr("data-bind");
		}
		
		if (o.hasClass('yesno')) {
			lbl_type = (inline) ? "<label class=\"radio-inline\">" : '<label>';
			s = lbl_type + "<input type='radio' value='1' name='" + n + "' id='" + n + "_yes' data-type='check_yesno'" + data_bind + "> Yes</label>";
			s += lbl_type + "<input type='radio' value='0' name='" + n + "' id='" + n + "_no' data-type='check_yesno'" + data_bind + "> No</label>"
		
			o.append(s);
			return;
		}
		if (o.hasClass('bool')) {
			v = "1";
			data_type = " data-type='check_bool'";
		}
		
		if (o.attr('data-options')) {
			var ops = o.data('options');	
		}
		
		if (o.attr('data-label')) {
			lbl = o.data('label');
		}
		if (o.attr('data-value')) {
			v = o.data('value');
		}
		
		lbl_type = (inline) ? "<label class=\"" + in_type + "-inline\">" : '<label>';

		var b = $(lbl_type + "<input type='" + in_type + "' value='" + v + "' name='" + n + "' id='" + n + "' " + data_bind + data_type + "> " + lbl + "</label>");
		o.append(b);
	},
	expand_datepicker : function(o){
		if (o.attr('data-calendar')) {
			//t.attr("maxlength", 14);	
		}
		
		var n = o.attr("name");
		
		o.css({"width": "240px"});
		
		var b = $('<span class="input-group-addon cal_btn" id="' + n + '_calendar"><i class="glyphicon glyphicon-calendar"></i></span>');
		var t = o.children("input");
		t.attr("data-type", "calendar");
		if (!t.attr('placeholder')) {
			t.attr('placeholder', 'M/D/YYYY');
		}
		
		t.blur(function(e){
			var r = /^(\d+)\/(\d+)\/\d{4}$/;
			var o = $(e.target);
			var v = o.val();
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
		
		b.data("text-box", t);
		b.click(function(e){
			bs_helper_calendar.txt = t;
			bs_helper_calendar.popup();
		});
		
		o.append(b);
	},
	expand_input_group : function(o){
			var n = o.attr("name");
			var t =  $("<input type='text' class='form-control' name='" + n  + "'>");
			var data_bind = "";
			if (o.attr("data-bind")) {
				t.attr("data-bind", o.attr("data-bind"));
				o.removeAttr("data-bind");
			}
		
			if (o.attr('placeholder')) {
				t.attr('placeholder', o.attr('placeholder'));
			}
			
			if (o.attr('data-prefix')) {
				if (o.attr('data-prefix') == 'checkbox' ) {
					o.append('<span class="input-group-addon" id="' + n + '_prefix"> <input type="checkbox" aria-label="..." name="' + n + '_checkbox" value="1"></span>');
					t.attr('aria-label', "...");
				}else{
					o.append('<span class="input-group-addon" id="basic-addon1">' + o.data('prefix') + '</span>');
					t.attr('aria-describedby', "basic-addon1");
				}
			}
			
			
			if (o.attr('data-validate')) {
				t.attr('data-validate', o.data("validate"));
				if(o.attr("data-error-message")){
					t.attr('data-error-message', o.data("error-message"));
					o.removeAttr('data-error-message');
				}
				if(o.attr("data-empty-value")){
					t.attr('data-empty-value', o.data("empty-value"));
					o.removeAttr('data-empty-value');
				}
				
				if(o.attr("data-v-regex")){
					t.attr('data-v-regex', o.data("v-regex"));
					o.removeAttr('data-v-regex');
				}
				
				o.removeAttr('data-validate');
			}
			o.append(t);
			
			if (o.attr('data-suffix')) {
				o.append('<span class="input-group-addon" id="basic-addon2">' + o.data('suffix') + '</span>');
				
			}
			if (o.attr('data-btn')) {
				var b = "<span class='input-group-btn'><button class='btn btn-default' id='" + n + "_btn' type='button'>" + o.data('btn') + "</button></span>";
				o.append(b);
			}
		
	},
	
}

rea_bootstrap_helper.expand_functions = [
	{sel: "div.form-row", fn: rea_bootstrap_helper.expand_form_rows},
	{sel: "div.form-footer", fn: rea_bootstrap_helper.expand_form_footer},
	{sel: "div.input-group", fn: rea_bootstrap_helper.expand_input_group},
	{sel: "div.checkbox", fn: rea_bootstrap_helper.expand_checkbox},
	{sel: "div.radio", fn: rea_bootstrap_helper.expand_checkbox},
	{sel: "button", fn: rea_bootstrap_helper.expand_input_buttons},
	{sel: "input[type=submit]", fn: rea_bootstrap_helper.expand_input_buttons},
	{sel: "div.datepicker", fn: rea_bootstrap_helper.expand_datepicker}
];

bs_helper_calendar = {
	date_popup : null,
	btn : null,
	txt : null,
	
	
	dateString : function(d){
		return d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate();		
	},
	dateHumanString : function(d){
		return (d.getMonth()+1) + '/' + d.getDate() + "/" + d.getFullYear();
	},
	popupClose: function(){
		if (this.date_popup == null) return;
		this.date_popup.removeClass('open');
		this.date_popup.hide();
	},
	popup : function(){
	
		if ( typeof(this.txt) == 'undefined') {
			return;
		}
		if (this.date_popup == null) {
			var s = "<div id='ui_cal_view' class='ui_ctrl_cal'>";
			s = s + "</div>";
			
			this.date_popup = $(s);
			
			$('body').prepend(this.date_popup);
			
			$("body").on("click", "td.day:not([data-date=''])", function(e){
				e.stopPropagation();
				var d = bs_helper_calendar.dateFromTarget( $(e.target) );
				if ( typeof(bs_helper_calendar.txt) != 'undefined') {
					bs_helper_calendar.txt.val(d.as_string);
					bs_helper_calendar.popupClose();
					
				}
			});
		
			$("body").on("click", "i:not([data-date=''])", function(e){
				e.stopPropagation();
				var d = bs_helper_calendar.dateFromTarget($(e.target));
				bs_helper_calendar.populate( d );
			});
		}

		if ( this.date_popup.hasClass('open') ) {
			this.popupClose();
			return;
		}else{
			this.date_popup.addClass('open');
		}
		
		
		var e =  this.dateFromString( this.txt.val() );
		
		this.populate( e );
		var p = this.txt.offset();
		
		this.date_popup.show();
		this.date_popup.animate({top: (p.top + this.txt.outerHeight())+ 'px', left: p.left + 'px'}, 0);
	
	
	},
	populate : function(e){
		//console.log(o);
		
		var html = '', th='' ,th_days='';
		
		var strs = {
			'months' : [
				['','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				['','Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
			],
			'th_days' : [
				'<tr><th>Su</th><th>M</th><th>Tu</th><th>W</th><th>Th</th><th>F</th><th>Sa</th></tr>',
				'<tr><th>D</th><th>L</th><th>M</th><th>W</th><th>J</th><th>V</th><th>S</th></tr>'
			],
			'today' : ['Today', 'Hoy'],
			'nm' : ['Next Month', 'Proximo Mes'],
			'pm' : ['Previous Month', 'Mes Anterior'],
		};
		
		
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
		var pm = bs_helper_calendar.dateHumanString(e.prev_month);
		var nm = bs_helper_calendar.dateHumanString(e.next_month);
			
		th = "<tr><th class='day_prev'><i data-date='" + pm + "' class='glyphicon glyphicon-chevron-left'></i></th><th class='day_month' colspan='5'>" + strs.months[rea_app_config.lang][e.month] + ", " + e.year + "</th><th class='day_next'><i data-date='" + nm + "' class='glyphicon glyphicon-chevron-right'></i></th></tr>";
		
		s += "<table border='0' cellspacing='1' id='cal_month'>";
		s += "<thead>" + th + strs.th_days[rea_app_config.lang] + "</thead><tbody>";
		s += html + "</tbody></table>";
		
		
		this.date_popup.html( s );
		
		//return s;
	},
	dateFromTarget : function(t){
		
		if ((typeof(t.data('date')) !== 'undefined') ) {
			return this.dateFromString( t.data('date') );
		}else{
			return this.dateFromString( 'M/D/YYYY' );
		}
	},
	dateFromString : function(s){
		
		var v = s.toUpperCase();
		var out = {'today' : new Date() };
		var d = new Date();
		
		if( (v != '') && (v != 'M/D/YYYY')){
			var p = v.split('/');
			if ( p.length != 3) {
				ok = false;
			}else{
				d = new Date(p[2], p[0]-1, p[1]);
			}
		}
		
		out.as_string = (d.getMonth()+1) + '/' + d.getDate() + "/" + d.getFullYear();
		out.as_date = d;
		out.m = d.getMonth();
		out.month = d.getMonth() + 1;
		out.year = d.getFullYear();
		out.day = d.getDate();
		out.dow = d.getDay();
		
		var cm = new Date(out.year, out.m, 1);
		out.fow = cm.getDay();
		
		out.next_month = (out.m == 11) ? new Date(out.year+1, 0, 1) : new Date(out.year, out.month, 1);
		out.prev_month = (out.m == 0) ? new Date(out.year-1, 11, 1) : new Date(out.year, out.m-1, 1);
		
		var daysinmonth= new Array(0,31,28,31,30,31,30,31,31,30,31,30,31);
		if( ((out.year%4 == 0)&&(out.year%100 != 0) ) ||(out.year%400 == 0) ){
			daysinmonth[2] = 29;
		}
		out.last_day = daysinmonth[out.month];
	
		//console.log(out);
		return out;
		
	}
}
