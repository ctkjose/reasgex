/*
 *    REASG Extend Toolkit
 *    Jose L Cuevas
 *
 */



rea_extend_helper = {
	
	expand_functions : [],
	registerExtendHelper: function(sel, fn){
		this.expand_functions.push( {sel: sel, fn:fn} );
	},
	expand_items : function(sel){
		var o = (typeof sel == "string") ? $(sel) : sel;
		for(i=0;i<this.expand_functions.length;i++){
			var def = this.expand_functions[i];
			o.find(def.sel).each(function(){
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
}


rea_helper_ui_calendar = {
	date_popup : null,
	btn : null,
	txt : null,
	
	initialize : function(){
		rea_extend_helper.registerExtendHelper( "input.datepicker",  rea_helper_ui_calendar.extendElement );
		
		$("body").on('blur', 'input[data-type=datepicker]', function(e){
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
		
		$("body").on('click touchend', '.input-group-addon.cal_btn', function(e){
			e.stopPropagation();
			var o = $(e.target);
			o = o.parents('div.datepicker:first');
			
			var t = o.find('input[type=text]');
			
			rea_helper_ui_calendar.txt = t;
			rea_helper_ui_calendar.popup();
		});
		
		$("body").on('click touchend', "td.day:not([data-date='']), i[data-date]", function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
			
			var o = $(e.target);
			var p = o.closest('#ui_cal_view');
			var n = p.attr("name");
			
			var d = rea_helper_ui_calendar.dateFromTarget( o );
			
			if (!o.hasClass('day')) {
				rea_helper_ui_calendar.populate( d );
				return;
			}
			
			//var t = $('input.datepicker[name=' + n + ']');
			
			if ( typeof(rea_helper_ui_calendar.txt) != 'undefined') {
				rea_helper_ui_calendar.txt.val( d.as_string );
				rea_helper_ui_calendar.txt.trigger('change');
				rea_helper_ui_calendar.popupClose();
			}
		});
		
		$("body").on("click touchend", function(e){
			if (rea_helper_ui_calendar.date_popup == null) return;
			rea_helper_ui_calendar.date_popup.removeClass('open');
			rea_helper_ui_calendar.date_popup.hide();
		});
	},
	extendElement : function(o){
		
		var data_class = 'datepicker';
		var data_type = "datepicker";
		var n = o.attr("name");
		
		if (o.attr('data-calendar')) {
			//t.attr("maxlength", 14);	
		}
		
		if (o.attr('class')) {
			data_class = o.attr('class');
		}
		
		var d = $('<div class="input-group ' + data_class + '"  data-type="' + data_type + '" name="' + n + '">');
		var b = $('<span class="input-group-addon cal_btn"><i class="icon icon-calendar"></i></span>');
	
		var t = o.clone();
		
		if (!t.attr('placeholder')) {
			t.attr('placeholder', 'M/D/YYYY');
		}
		if (!t.attr('title')) {
			t.attr('title', 'M/D/YYYY');
		}
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
	
		
	},
	dateString : function(d){
		return d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate();		
	},
	dateHumanString : function(d){
		return (d.getMonth()+1) + '/' + d.getDate() + "/" + d.getFullYear();
	},
	popupClose: function(){
		if (rea_helper_ui_calendar.date_popup == null) return;
		rea_helper_ui_calendar.date_popup.removeClass('open');
		rea_helper_ui_calendar.date_popup.hide();
	},
	popup : function(){
	
		if ( typeof(this.txt) == 'undefined') {
			return;
		}
		if (this.date_popup == null) {
			var s = "<div id='ui_cal_view' class='boxed with-border round popup'>";
			s = s + "</div>";
			
			this.date_popup = $(s);
			
			$('body').prepend(this.date_popup);
			
			//$("body").on("click touchend", "td.day:not([data-date=''])", rea_helper_ui_calendar.evt_dayClick);
			//$("body").on("click touchend", "i[data-date]", rea_helper_ui_calendar.evt_dateClick);
			
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
		
		this.date_popup.attr('name', this.txt.attr('name') );
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
		var pm = rea_helper_ui_calendar.dateHumanString(e.prev_month);
		var nm = rea_helper_ui_calendar.dateHumanString(e.next_month);
			
		th = "<tr><th class='day_prev'><i data-date='" + pm + "' class='icon x24 icon-arrow_left'></i></th><th class='day_month' colspan='5'>" + strs.months[rea_app_config.lang][e.month] + ", " + e.year + "</th><th class='day_next'><i data-date='" + nm + "' class='icon x24 icon-arrow_right'></i></th></tr>";
		
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
rea_helper_ui_datasource = {
	initialize : function(){
		rea_extend_helper.registerExtendHelper( "datasource",  rea_helper_ui_datasource.extendElement );
	},
	extendElement : function(o){
		var n = o.attr("name");
		var def = {"source":"json","source_pull":"static","url":"","url_find":"","bind":[] };
		
		if (o.attr("href")) {
			def.source = 'ajax';
			def.url = o.attr("href");
			
			if (o.attr("source_pull")) {
				def.source_pull=o.attr("source_pull");
			}else{
				def.source_pull='static';
			}

		}
		
		var items = [];
		var ops = o.find('option');
		ops.each( function(x) {
			var op = $(this);
			var e = {};
			e[op.attr('value')]= op.html();
			items.push(e);
		});
		
		var ds = new rea.datasource(n,def, items);
		window[n] = ds;
		
		o.remove();
		
	}
}

rea_helper_ui_table = {
	initialize : function(){
		rea_extend_helper.registerExtendHelper( "table.table",  rea_helper_ui_table.extendElement );
		
		$('.repeater-cmd-add').on('click touchstart', function(e){
			e.preventDefault();
			e.stopPropagation();
			
			var o = $(e.target);
			var tbl = o.parents(".table");
			var atr = tbl.data('template');
			var n = tbl.attr("name");
			var tb = tbl.find('tbody');
			var ltr = tb.find('tr:last-child');
			var k = 1;
			if (ltr.length > 0) {
				k = (ltr.data('key') * 1) + 1;
			}
			
			
			var tds = atr.find('td');
			var tr = $("<tr data-owner='" + n + "' data-key='" + k + "' data-row-added='1'></tr>");
			tds.each( function() {
				var td = $(this).clone(true, true);
				var html = td.html();
				var css = (td.attr('class')) ? td.attr('class') : '';
				html = html.replace(/\%[A-Z|a-z|0-9|\_|\-]*\%/, '');
				css = css.replace(/\%[A-Z|a-z|0-9|\_|\-]*\%/, '');
				
				td.attr('class', css);
				td.html(html);
				td.data('owner', n).data('key', k);
				
				tr.append(td);
			});
			rea_extend_helper.expand_items(tr);
			tb.append(tr);
			
		});
		
		
		
	},
	extendElement : function(tbl){
		var n = tbl.attr("name");
		
		var atr = tbl.find('tr.table-row-template');
		
		tbl.data('template', atr);
		
		if (tbl.attr("datasource")) {
			var ds_name = tbl.attr("datasource");
			var ds = window[ds_name];
			
			var v = (tbl.attr("default")) ? tbl.attr("default") : '';
			ds.get( function(ds){
				console.log("on tbl get");
				rea_helper_ui_table.populateWithDS(tbl, ds);
				
			});
			
			if (ds.def.source_pull=='dynamic') {
				tbl.attr("data-source-update-on-change", tbl.attr("datasource"));
			}
			
		}
		//var ops = o.find('tr.template');
		
		
		
		atr.remove();
		
	},
	populateWithDS : function(tbl, ds){
		
		var atr = tbl.data('template');
		var n = tbl.attr("name");
		var tb = tbl.find('tbody');
		
		console.log("@ui_table[" + n + "].populateWithDS ==============================");
		for (var k in ds.items) {
			//console.log(ds.items[k]);
			var r = ds.items[k];	
			
			var attr = (r.hasOwnProperty('row_attributes')) ? r.row_attributes : {css: ''}
			var tds = atr.find('td');
			var tr = $("<tr data-owner='" + n + "' data-key='" + k + "'></tr>");
			tds.each( function() {
				var td = $(this).clone(true, true);
				var html = td.html();
				var css = (td.attr('class')) ? td.attr('class') : '';
				for (var rk in r) {
					var s = "%" + rk + "%";
					html = html.replace(s, r[rk]);
					css = css.replace(s, r[rk]);
				}
				
				td.attr('class', css);
				td.html(html);
				td.data('owner', n).data('key', k);
				
				
				
				tr.append(td);
			});
			
			console.log("Create Table ROW==========================")
			rea_extend_helper.expand_items(tr);
			rea_controller.bindDatasourceToSelector({items : r}, tr);
			
			if (attr.hasOwnProperty('css')) {
				tr.addClass(attr.css);
			}
			
			tb.append(tr);
		}
	}
}
rea_helper_ui_checkbox = {
	initialize : function(){
		rea_extend_helper.registerExtendHelper( "div.checkbox",  rea_helper_ui_checkbox.extendElement );
		rea_extend_helper.registerExtendHelper( "div.radio",  rea_helper_ui_checkbox.extendElement );
	},
	extendElement : function(o){
		var n = o.attr("name");
		var s = '';
		var lbl = '';
		var v = '';
		var data_type = "";
		var lbl_type = "";
		var in_type = "checkbox";
		var inline = '&nbsp; ';
		var data_bind = "";
	
		
		//<div class='checkbox' name="fieldName" default="1" options="{1:'Option 1', 2:'Option 2'}"></div>
		
		if (o.hasClass('radio')) {
			in_type = "radio";
		}
		
		if (o.attr("data-bind")) {
			data_bind = " data-bind=\"" + o.attr("data-bind") + "\"";
			o.removeAttr("data-bind");
		}
		
		if (o.attr("label")) {
			lbl = o.attr("label");
		}
		if (o.attr("default")) {
			v = o.attr("default");
		}
		
		var m_options = {};
		
		if (o.attr("options")) {
			var ops = JSON.parse(o.attr("options"));
			for (var k in ops) {
				
				m_options[k] = ops[k];
			}
		}else{
			if (o.hasClass('bool')) {
				data_type = " data-type='check_bool' ";
				m_options[1] = lbl;
			}
			
			if (o.hasClass('yesno')) {
				in_type = "radio";
				data_type = " data-type='check_bool' ";
				m_options[0] = 'No';
				m_options[1] = 'Yes';
				
			}
		}
		
		var d = $('<fieldset class="' + in_type + '" name="' + n + '" ' + data_type + '></fieldset>');
		if (inline) {
			d.addClass("inline");
		}
		
		if (o.hasClass('control-group')) {
			inline = '';
			d.addClass('control-group');
		}
		
		
		var i = 0;
		for (var k in m_options) {
			i++;
			var opn = (in_type == 'radio') ? n : n + "_" + i;
			var checked = (v == k) ? ' checked' : '';
			var s = (i > 1) ? inline: '';
			s += "<label for='" + opn + "' class='" + in_type + "'>";
			s += "<input data-ignore='1' type='" + in_type + "' name='" + opn + "'" + data_type + "value='" + k + "'" + checked + "> " + m_options[k] + "</label>";
			
			d.append(s);
		}
		
		o.replaceWith( d );
		
		return;
	}
}
rea_helper_ui_select = {
	initialize : function(){
		//rea_extend_helper.registerExtendHelper( "select.select",  rea_helper_ui_select.extendElement );
		rea_extend_helper.registerExtendHelper( "div.select",  rea_helper_ui_select.extendElement );
		
	},
	extendElement : function(o){
		var n = o.attr("name");
		var s = '';
		var v = '';
		
		var lbl_type = "";
		var data_class = "select";
		var data_bind = "";
		var data_type = "data-type='list'";
		
		//<div class='checkbox' name="fieldName" default="1" options="{1:'Option 1', 2:'Option 2'}"></div>
		
		if( o.attr("extended") ) return;
		
		
		if (o.hasClass('multiple')) {
			in_type = "select multiple";
		}
		
		if (o.attr('class')) {
			data_class = o.attr('class');
		}
		
		if (o.attr("data-bind")) {
			data_bind = " data-bind=\"" + o.attr("data-bind") + "\"";
			o.removeAttr("data-bind");
		}
		
		if (o.attr("default")) {
			v = o.attr("default");
		}
		
		var m_options = {};
		
		if (o.attr("options")) {
			var ops = JSON.parse(o.attr("options"));
			for (var k in ops) {
				
				m_options[k] = ops[k];
			}
		}else if (o.attr("datasource")) {
			
		}
		
		var d = o;
		if( o.elmType() != "select" ){
			d = $('<select class="' + data_class + '" name="' + n + '" ' + data_type + '></select>');
			if (o.attr('data-with-code')) d.attr('data-with-code', o.attr('data-with-code'));
		}
		
		d.attr('default', v);
		d.attr("extended", 1);
		var i = 0;
		
		var sc = (o.attr("data-with-code") && (o.attr("data-with-code") == "1") ) ? 1: 0;
		for (var k in m_options) {
			i++;
			var selected = (v == k) ? ' selected ' : '';
			var caption =  m_options[k];
			if (sc) caption = "(" + k + ") " + caption;
			var s = "<option value='" + k + "'" + selected + "> " + caption + "</option>";
			d.append(s);
		}
		
		//d.attr('default', v);
		if (n == "town") {
			console.log("here-------------");
		}
		
	
		
		
		if( o.attr("datasource") && ( o.elmType() != "select" ) ){
			d.attr("data-ds", o.attr("datasource"));
			o.removeAttr("datasource");
		}
		
		
		
		
		if( o.elmType() != "select" ){
			o.replaceWith( d );
		}
		
		console.log("CREATED [select class='" + data_class + "' name='" + n + "' " + data_type + "]---------");
		
		if (d.attr("data-ds")) {
			d.attr("data-source", d.attr("data-ds"));
			//var ds_name = o.attr("datasource");
			//d.data('ds', d.attr("data-ds"));
			var sel_ds = window[d.attr("data-source")];
			
			console.log("Forcing ds[" + sel_ds.uid + "].get() for select[name=" + n + "]");
			
			var ds_populated_handler = null;
			ds_populated_handler = rea_controller.on( "ds_populated", function(e){
				var ds = e.ds;
				if (ds.uid != sel_ds.uid) return;
				console.log("@ds_populated_handler ds[" + ds.uid + "].get() for select[name=" + n + "]");
				rea_helper_ui_select.populateWithDS(d, ds );
				
				if (ds.def.source_pull!='dynamic') {
					ds_populated_handler.remove();	
				}
			});
			
			sel_ds.get(null);
			
			if (sel_ds.def.source_pull=='dynamic') {
				d.attr("data-source-update-on-change", d.attr("data-source"));
			}
			
		}
		
		return;
	},
	eventDataSourcePopulated : function(e){
		var ds = e.ds;
		console.log("@rea_helper_ui_select.eventDataSourcePopulated(select[data-ds=" + ds.uid + "])");
		$("select[data-ds=" + ds.uid + "]").each( function(i, k){
			var o = $(k);
			if(!ds.ready) return; //check again
			
			rea_helper_ui_select.populateWithDS(o, ds );
		});
	},
	populateWithDS : function(o, ds){
		if(typeof ds.def == "undefined") return;
		if(typeof ds.items == "undefined") return;
		
		var n = o.attr("name");
		console.log("@rea_helper_ui_select.populateWithDS(" + n + "," + ds.uid + ")" );
		var ops = {};
		if(typeof ds.def.bind != "undefined") ops = $.extend(ops, ds.def.bind);
		
		rea_helper_ui_select.populateOptionsWithItems(o, ds.items, ops );
	},
	populateOptionsWithItems : function( osel, items, options){
		
		if(!osel) return;
		//console.log("populateOptionsWithItems");
		var v = (osel.attr("default")) ? osel.attr("default") : osel.val();
		
		osel.find('option').remove().end();
		
		var ops = $.extend(options, {});
		var sc = (osel.attr("data-with-code") && (osel.attr("data-with-code") == "1") ) ? 1: 0;
		var addOp = function(key, caption){
			var html = '<option value="' + key + '" class="ui_option" x_class="ctrl_option" x_node="option"'
			if (key == v) {
				html += ' selected="selected"';
			}
			if (sc) {
				caption = "(" + key + ") " + caption;
			}
			
			html += '>' + caption + '</option>';
					  
			osel.append(html);
		};
		
		var count = Array.isArray(items) ? items.length : Object.keys(items).length;
		
		if( Array.isArray(items)) {
			for (var i = 0; i < items.length; i++) {
				var entry = items[i];
				var keys = Object.keys(entry);
				if(ops.hasOwnProperty('caption') && ops.hasOwnProperty('value')){
					var k = (keys.indexOf(ops.value) > 0) ? entry[ops.value] : ((keys.length > 0) ? entry[keys[0]] : '') ;
					var c = (keys.indexOf(ops.caption) > 0) ? entry[ops.caption] : ((keys.length > 1) ? entry[keys[1]] : '');
				}else if(keys.length == 1){
					//its a key value pair
					var k = keys[0];
					var c = entry[k];
				}else if( keys.length == 2){
					var k = entry[keys[0]];
					var c = entry[keys[1]];
				}
	  
				addOp(k, c);
			}
		}else{ //is an object
			var keys = Object.keys(items);
			for (var i = 0; i < keys.length; i++) {
				var entry = items[keys[i]];
				
				if(typeof entry == "object"){
					var k = keys[i];
					var c = '';
					
					
				}else{
					var k = keys[i];
					var c = entry;
				}
				
				addOp(k, c);
			}
		}
		
		osel.trigger("change");
	}
}

// UI Elements
rea_helper_ui_lookup = {
	ds_busy : false,
	ds_refresh : false,
	ds_last_q : '',
	extendElement : function(o){
		//implements a searchable list, and attempts to make it accessible by having a select behind scenes
		
		var n = o.attr("name");
		var s = '';
		var v = '';
		
		var lbl_type = "";
		var data_class = "lookup";
		var data_bind = "";
		var data_type = "data-type='lookup'";
		
		

		if (o.attr('class')) {
			data_class = o.attr('class');
		}
		
		if (o.attr("data-bind")) {
			data_bind = " data-bind=\"" + o.attr("data-bind") + "\"";
			o.removeAttr("data-bind");
		}
		
		if (o.attr("default")) {
			v = o.attr("default");
		}
		
		var m_options = {};
		
		if (o.attr("options")) {
			var ops = JSON.parse(o.attr("options"));
			for (var k in ops) {
				
				m_options[k] = ops[k];
			}
		}
		
		var d = $('<div class="input-group ' + data_class + '"  ' + data_type + ' name="' + n + '">');
		if (o.attr('data-with-code')) d.attr('data-with-code', o.attr('data-with-code'));
		
		var ad = $("<span class='input-group-addon'><i class='icon icon-search' title='Toggle search box for this field'></i></span>");
		var t = $('<span class="select_label span_input" name="' + n + '_txt" value="' + v + '"></span>');
		//var h = $('<input type="hidden" class="' + data_class + '" name="' + n + '" value="' + v + '">');
		var sel = $('<select  class="select hidden" name="' + n + '" data-type="list" aria-hidden="true" tabindex="-1" data-value="" data-default="">');
		if (o.attr('data-with-code')) sel.attr('data-with-code', o.attr('data-with-code'));
		
		var sel_ds = null;
		if( o.attr("datasource") && ( o.elmType() != "select" ) ){
			d.attr("data-ds", o.attr("datasource"));	
			sel.attr("data-ds", o.attr("datasource"));
			o.removeAttr("datasource");
			sel_ds = window[d.attr("data-ds")];
		}
		
		sel.data("default", v);
		sel.data("value", v);
		sel.data("lookup", d);
		sel.on("change", function(e){
			var s = $(e.target);
			var op = s.find("option:selected");
			var sn = s.data("lookup").find(".select_label");
			
			sn.html(op.text());
		});
		
		d.data("select_entry", sel);
		o.after(sel);
		
		d.append(ad);
		d.append(t);
		//d.append(sel);
		
		var i = 0;
		
		for (var k in m_options) {
			i++;
			var selected = (v == k) ? ' selected ' : '';
			var s = "<option value='" + k + "'" + selected + "> " + m_options[k] + "</option>";
			sel.append(s);
		}
		
		
		d.attr('default', v);
		
		var has_ds = d.attr("data-ds") ? 1 : 0;
		
		if (sel_ds && (sel_ds.def.source_pull!='dynamic') ) {
			console.log("Forcing ds[" + sel_ds.uid + "].get() for lookup[name=" + n + "][" + sel_ds.def.source_pull + "]");
			
			var ds_populated_handler = null;
			ds_populated_handler = rea_controller.on( "ds_populated", function(e){
				var ds = e.ds;
				if (ds.uid != sel_ds.uid) return;
				console.log("@ds_populated_handler ds[" + ds.uid + "].get() for lookup[name=" + n + "]");
				rea_helper_ui_select.populateWithDS(sel, ds );
				ds_populated_handler.remove();
			});
			
			sel_ds.get(null);
		}else if (sel_ds && (sel_ds.def.source_pull=='dynamic') ) {
			d.attr("find-live-with-ds", sel_ds.uid);
		}
		
		o.replaceWith( d );
		
		
		return;
	},
	initialize: function() {		
		rea_extend_helper.registerExtendHelper( "div.lookup",  rea_helper_ui_lookup.extendElement );

		$(document).on('click', '.lookup .input-group-addon', function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
			
			var o = $(e.target);
			o = o.parents('.lookup:first');
			
			var t = o.find('.select_label');
			var sel = o.data("select_entry");
			
			var s = t.val().toLowerCase();
			var v = sel.val();
			var n = sel.attr('name');
			
			var k = n  + "_popup";
			var sc = (o.attr("data-with-code") && (o.attr("data-with-code") == "1") ) ? 1: 0;
			
			if ( (window[k] != null) && window[k].hasClass('open') ) {
				window[k].removeClass('open');
				window[k].hide();
				return;
			}
			
			var ops = sel.find("option");
			var count_found = 0;
			var html = "";
			for(var i = 0; i < ops.length; i++){
				var op = $(ops[i]);
				
				var op_value = op.attr("value");
				var op_text = op.text();
				
				html+= "<div class='lookup-entry clickable' data-value='" + op_value  + "' data-caption='" + op_text + "' data-owner='" + n + "'>";
				if (sc) html+= '<span>' + op_value + '</span> ';
				
				html+= op_text + "</div>";
			}
			html+= "<div class='lookup-entry not-found' data-owner='" + n + "' style='display: none;'>Not found</div>";
			
			var w = n + "_popup";
		
			if (window[w] == null) {
				
				var s = "<div id='ui_lookup_view' class='boxed with-border round popup basic-form'>";
				s = s + "<div class='ui_lookup_view_header'><input type='text' data-ignore='1' name='ui_lookup_q' autocomplete='off' value='' class='ui_lookup_view_query' placeholder='Search...'></div>";
				s = s + "<div class='ui_lookup_view_options'></div>";
				s = s + "</div>";
				
				window[w] = $(s);
				
				$('body').prepend(window[w]);
			}

			window[w].attr("name", n);
			window[w].data('lookup', o);
			
			window[w].find("div.ui_lookup_view_options").html(html);
		
			var p = t.offset();
			
			window[w].show();
			window[w].animate({top: (p.top + t.outerHeight())+ 'px', left: p.left + 'px'}, 0);
		
			var vt = window[w].find("input.ui_lookup_view_query");
			vt.focus();
			vt.data("select", sel);
			window[w].data('owner', o);
		
			vt.removeAttr("disabled");
			if (! window[w].hasClass('open') ) {
				window[w].addClass('open');
			}
			
		});
		$(document).on('click', ".lookup-entry.clickable", function(e){
			var op = $(e.target);
			var w = op.parents('#ui_lookup_view');
			var n = w.attr('name');
			var o = w.data('lookup');
	
			var sel = o.data("select_entry");
			var t = o.find('.select_label');
			
			var op_value = op.data("value");
			var op_text = op.data("caption");
			
			sel.val(op_value);
			sel.data("default", op_value);
			sel.data("value", op_value);
			
			t.html(op_text);
			
			w.removeClass('open');
			w.hide();
		});
		
		$(document).on('keyup', 'input.ui_lookup_view_query', function(e){
			var q = $(e.target);
			var find = q.val();
			var w = q.parents('#ui_lookup_view');
			var o = w.data('lookup');
			
			if ( o.attr("find-live-with-ds") ) {
				rea_helper_ui_lookup.filterQueryDS(find, q, o, w);
			}else{
				rea_helper_ui_lookup.filterInplace(find, q, o, w);
			}
		});
		

	
	},
	filterQueryDS : function(find, q, o, w ){
		// List searches by querying the DS again
		var sel = o.data("select_entry");
	
		var n = o.attr('name');
		var op_list = w.find(".lookup-entry.clickable");
		var list = w.find("div.ui_lookup_view_options");
		find = find.toLowerCase();
		
		var ds = window[o.attr("find-live-with-ds")];
		//if( (ds.params.q) && (ds.params.q.length > 0) && (find = ds.params.q) ) return;
		
		var sc = (o.attr("data-with-code") && (o.attr("data-with-code") == "1") ) ? 1: 0;
		
		if (ds.busy) return;

		var addOp = function(op_value, op_text, find){
			if ( (find.length > 0) && ( op_text.toLowerCase().indexOf(find) < 0) && ( op_value.toLowerCase().indexOf(find) < 0) ) return;
		
			var html= "<div class='lookup-entry clickable' data-value='" + op_value  + "' data-caption='" + op_text + "' data-owner='" + n + "'>";
			if (sc) html+= '<span>' + op_value + '</span> ';
			html+= op_text + "</div>";
			
			list.append(html);
			sel.append("<option value='" + op_value  + "' data-owner='" + n + "'>" + op_text + "</option>");
		};
		
		var populateWithDS = function(ds, find){
			var count_found = 0;
			var ops = {};
			
			sel.find('option').remove().end();
			list.html("");
		
			if( Array.isArray(ds.items)) {
				for (var i = 0; i < ds.items.length; i++) {
					var entry = ds.items[i];
					var keys = Object.keys(entry);
					if(ops.hasOwnProperty('caption') && ops.hasOwnProperty('value')){
						var k = (keys.indexOf(ops.value) > 0) ? entry[ops.value] : ((keys.length > 0) ? entry[keys[0]] : '') ;
						var c = (keys.indexOf(ops.caption) > 0) ? entry[ops.caption] : ((keys.length > 1) ? entry[keys[1]] : '');
					}else if(keys.length == 1){
						//its a key value pair
						var k = keys[0];
						var c = entry[k];
					}else if( keys.length == 2){
						var k = entry[keys[0]];
						var c = entry[keys[1]];
					}
					addOp(k, c, find);
				}
			}else{ //is an object
				var keys = Object.keys(ds.items);
				for (var i = 0; i < keys.length; i++) {
					var entry = ds.items[keys[i]];
					
					if(typeof entry == "object"){
						var k = keys[i];
						var c = '';
					}else{
						var k = keys[i];
						var c = entry;
					}
					
					addOp(k, c, find);
				}
			}
			
			q.removeAttr("disabled");
		};
		
		if ( (ds.params.q) && (ds.params.q.length > 0) && (find.indexOf(ds.params.q) == 0) ) {
			//reuse the current list
			populateWithDS(ds, find);
		}else{
			q.attr("disabled", "disabled");
			list.html("<div class='ui_loader'></div>");
			ds.setParams({"q": find.toLowerCase()});
			ds.get(function(ds){
					populateWithDS(ds, "");
			});
		}	
	},
	filterInplace : function(find, q, o, w ){
		var sel = o.data("select_entry");
	
		var n = o.attr('name');
		var op_list = w.find(".lookup-entry.clickable");
		
		find = find.toLowerCase();
		
		
		
		if( rea_helper_ui_lookup.ds_last_q == find) return;
		rea_helper_ui_lookup.ds_last_q = find;
		
		var filtering = (find.length > 0) ? true : false;
		var count_found = 0;
	
		for(var i = 0; i < op_list.length; i++){
			var op = $(op_list[i]);
			var op_value = op.data("value");
			var op_text = op.data("caption");
			
			var ok_use = true;
			if (filtering && ( op_text.toLowerCase().indexOf(find) < 0) && ( op_value.toLowerCase().indexOf(find) < 0) ) ok_use = false;			

			if( !ok_use ){
				op.addClass("hidden");
			}else{
				count_found++;
				op.removeClass("hidden");		
			}
		}
		
		
		var nf = w.find(".lookup-entry.not-found");
		if (nf.length > 0) {
			if (filtering && (count_found == 0)) {
				nf.show();
			}else{
				nf.hide();
			}
		}
	}
}
rea_helper_ui_lookup1 = {
	ds_busy : false,
	ds_refresh : false,
	ds_last_q : '',
	extendElement : function(o){
		
		var n = o.attr("name");
		var s = '';
		var v = '';
		
		var lbl_type = "";
		var data_class = "lookup";
		var data_bind = "";
		var data_type = "data-type='lookup'";
		
		//<div class='checkbox' name="fieldName" default="1" options="{1:'Option 1', 2:'Option 2'}"></div>
		

		if (o.attr('class')) {
			data_class = o.attr('class');
		}
		
		if (o.attr("data-bind")) {
			data_bind = " data-bind=\"" + o.attr("data-bind") + "\"";
			o.removeAttr("data-bind");
		}
		
		if (o.attr("default")) {
			v = o.attr("default");
		}
		
		var m_options = {};
		
		if (o.attr("options")) {
			var ops = JSON.parse(o.attr("options"));
			for (var k in ops) {
				
				m_options[k] = ops[k];
			}
		}else if (o.attr("datasource")) {
			
		}
		
		var d = $('<div class="input-group ' + data_class + '"  ' + data_type + ' name="' + n + '">');				
		var ad = $("<span class='input-group-addon'><i class='icon icon-search' title='Toggle search box for this field'></i></span>");
		var t = $('<input type="text" data-ignore="1" class="' + data_class + '" name="' + n + '_txt" ' + data_type + ' value="' + v + '">');
		var h = $('<input type="hidden" class="' + data_class + '" name="' + n + '" value="' + v + '">');
		
		d.append(ad);
		d.append(h);
		d.append(t);
		
		var i = 0;
		
		for (var k in m_options) {
			i++;
			var selected = (v == k) ? ' selected ' : '';
			//var s = "<option value='" + k + "'" + selected + "> " + m_options[k] + "</option>";
			//d.append(s);
		}
		
		
		d.attr('default', v);
		
		if (o.attr("datasource")) {
			t.attr("data-source", o.attr("datasource"));
			t.attr("data-ds", o.attr("datasource"));
			//var ds_name = o.attr("datasource");
			var sel = d;
			var value = v;
			sel.data('ds', o.attr("datasource"));
			var sel_ds = window[o.attr("datasource")];
			
			if (sel_ds.def.source_pull=='dynamic') {
				d.attr("data-source-update-on-change", o.attr("datasource"));
			}
		}
		
		o.replaceWith( d );
		
		return;
	},
	data_source_ready: function(o, t, h, ds, v){
	
		var html = '';
		var c = 0;
		var s = v.toLowerCase();
		var sc = 0;
		console.log("@data_source_ready==============");
		rea_helper_ui_lookup.ds_busy = false;
		
		for (var k in ds.items){
			var ok = false;
			var n = ds.items[k];
			
			if (typeof n == "object") {
				var keys = Object.keys(n);
				k = keys[0];
				n = n[k];
			}
			
			console.log("[" + k + "][" + n + "]==[" + s + "]");
			if( n.toLowerCase().indexOf(s) >= 0){
				ok = true;
			}else if( k.toLowerCase().indexOf(s) >= 0){
				ok = true;
			}
			
			if( ok ){ // || ds.def.source_pull == 'dynamic'){
				html+= "<div class='ui_look_list_entry' data-value='" + k  + "' data-caption='" + n  + "' data-owner='" + h.attr('name') + "'";
				html+= ">";
				
				//html+= " onclick='ui_cmb_select(this);'>";
				if(sc=='1'){
					html+= '<span>' + k + '</span>';
				}
				
				html+= n + "</div>";
			}
		}
		
		var k = h.attr('name') + "_popup";
		
		if (window[k] == null) {
			
			var s = "<div id='ui_lookup_view' class='boxed with-border round popup basic-form'>";
			s = s + "<div class='ui_lookup_view_header'><input type='text' data-ignore='1' name='ui_lookup_q' autocomplete='off' value='' class='ui_lookup_view_query' placeholder='Search...'></div>";
			s = s + "<div class='ui_lookup_view_options'></div>";
			s = s + "</div>";
			
			window[k] = $(s);
			
			$('body').prepend(window[k]);
			
		}
		
		window[k].attr("name", h.attr('name'));
		window[k].find("div.ui_lookup_view_options").html(html);
		
		var p = t.offset();
			
		window[k].show();
		window[k].animate({top: (p.top + t.outerHeight())+ 'px', left: p.left + 'px'}, 0);
		
		var vt = window[k].find("input.ui_lookup_view_query");
		vt.focus();
		
		window[k].data('owner', o);
		
		vt.removeAttr("disabled");
		if (! window[k].hasClass('open') ) {
			window[k].addClass('open');
			vt.val(t.val());
		}
	},
	
	initialize: function() {
		
		rea_extend_helper.registerExtendHelper( "div.lookup",  rea_helper_ui_lookup.extendElement );
		$("input[type=text]").on('keyup', function(e){
			var o = $(e.target);
			var n = o.attr('name');
			//console.log("input[name=" + n + "]key up");
		});
		
		$(document).on('click', 'div.ui_look_list_entry', function(e){
			var o = $(e.target);
			var n = o.data('owner');
			var v = o.data('value');
			var k = n  + "_popup";
			
			window[k].removeClass('open');
			window[k].hide();
			
			var d = window[k].data('owner');
			
			var t = d.find('input[type=text]');
			var h = d.find('input[type=hidden]');
			
			h.val(v);
			t.val(o.data('caption'));
			
		});
		$(document).on('keyup', 'input.ui_lookup_view_query', function(e){
			var q = $(e.target);
			var v = q.val();
			
			var o = q.parents('#ui_lookup_view');
			var n = o.attr('name');
			var k = n  + "_popup";
			
			o = $('.lookup[name=' + n + ']');
			
			if (rea_helper_ui_lookup.ds_busy) {
				return;
			}
			
			var t = o.find('input[type=text]');
			var h = o.find('input[type=hidden]');
			var s = v.toLowerCase();
			
			if( !t.attr("data-source") ){
				return;
			}
			
			var ds = window[t.attr("data-source")];
			
			if ( (rea_helper_ui_lookup.ds_last_q.length > 0) &&
				(v.substring(0, rea_helper_ui_lookup.ds_last_q.length ) == rea_helper_ui_lookup.ds_last_q) ) {
				//reuse the current list...
				rea_helper_ui_lookup.ds_refresh = false;
				rea_helper_ui_lookup.data_source_ready(o, t, h, ds, v);
			}else if ( (rea_helper_ui_lookup.ds_last_q.length > 0) &&
					  !rea_helper_ui_lookup.ds_refresh && 
					  (rea_helper_ui_lookup.ds_last_q.substring(0, v.length ) == v) ) {
				
				rea_helper_ui_lookup.ds_refresh = false;
				rea_helper_ui_lookup.data_source_ready(o, t, h, ds, v);
			}else{
				rea_helper_ui_lookup.ds_busy = true;
				rea_helper_ui_lookup.ds_refresh = true;
				q.attr("disabled", "disabled");
				window[k].find("div.ui_lookup_view_options").html("<div class='ui_loader'></div>");
				ds.get(function(ds){
					rea_helper_ui_lookup.data_source_ready(o, t, h, ds, v);
				});
				
				
			}
			
			rea_helper_ui_lookup.ds_last_q = v;
			
		});
		$(document).on('click', '.lookup .input-group-addon', function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
			
			var o = $(e.target);
			o = o.parents('.lookup:first');
			
			var t = o.find('input[type=text]');
			var h = o.find('input[type=hidden]');
			
			var s = t.val().toLowerCase();
			var v = h.val();
			var n = h.attr('name');
			var k = n  + "_popup";
			
			
			if ( (window[k] != null) && window[k].hasClass('open') ) {
				window[k].removeClass('open');
				window[k].hide();
				return;
			}
			
			if( !t.attr("data-source") ){
				return;
			}
			
			var ds = window[t.attr("data-source")];
			
			rea_helper_ui_lookup.ds_busy = true;
			ds.get(function(ds){
				rea_helper_ui_lookup.data_source_ready(o, t, h, ds, s);
			});

		});
	}
}

rea_controller.on("initialize", rea_helper_ui_datasource.initialize );
rea_controller.on("initialize", rea_helper_ui_table.initialize );


rea_controller.on("initialize", rea_helper_ui_calendar.initialize );
rea_controller.on("initialize", rea_helper_ui_checkbox.initialize );
rea_controller.on("initialize", rea_helper_ui_select.initialize );
rea_controller.on("initialize", rea_helper_ui_lookup.initialize );



$(document).ready(function(){
    
	
});

