/** @module reasg/js/ui/forms */

/**
 * Implements bootstrap helpers to build UI Forms in REASG
 */


rea.registerComponent( "ui", "select", ["ui.panel"],
function(){
	var ui_select = {
		initialize : function(){

		},		
		uiDataProvider: function(uidsc){
			uidsc.registerDataProvider("select", [this,"uiDataSetter"], [this,"uiDataGetter"] );	
		},
		uiDataGetter: function(){
			
		},
		uiDataSetter: function(o,value, attr){
			console.log("@ui_select.uiDataSetter()");

			var v = '';
			var ty = (typeof value);
	
			if ( Array.isArray(value) && (value.hasOwnProperty(1)) ) {
				v = '';
			}else if( (ty == "string") || (ty == "number") ) {
				v = value;
			}else if( (ty == "boolean") ) {
				v = (value) ? '1' : '0';
			}
			o.attr('value', v);
			o.val(v);
			
			if(attr.ro){
				o.attr("disabled", "disabled");
			}else if(o.attr("disabled")){
				o.removeAttr("disabled");
			}
		},
		/**
		 * Implements the UI Extend interface.
		 * @param {Object} extender - The rea_helper_ui_extender instance
		 */
		uiExtender : function(extender){
			extender.registerExpandHelper( "div.select", [this, "uiExpandElement"] );
			//extender.registerExpandHelper( "select.select", [this, "uiExpandElement"] );

		},
		uiExpandElement: function(o){
			console.log("@ui.select.expandElement()");
			
			var n = o.attr("name");
			var s = '';
			var v = '';
			
			var lbl_type = "";
			var data_class = "select";
			var data_bind = "";
			var data_type = "data-type='list'";
			
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
				d = $('<select class="' + data_class + ' form-control" name="' + n + '" ' + data_type + '></select>');
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
			
			if(o.hasOwnProperty("view") && o.attr("name")){
				d.attr("name", o.view.name + "." + o.attr("name")); 
			}
	
			if( o.elmType() != "select" ){
				o.replaceWith( d );
			}
		}
	};
	return ui_select;
}() );

rea.registerComponent( "ui", "checkbox", ["ui.panel"],
function(){
	var ui_checkbox = {
		initialize : function(){
		},
		uiDataProvider: function(uidsc){
			uidsc.registerDataProvider("fieldset.radios", [this,"uiDataSetter"], [this,"uiDataGetter"] );
			uidsc.registerDataProvider("fieldset.checkboxes", [this,"uiDataSetter"], [this,"uiDataGetter"] );
			uidsc.registerDataProvider("input[type=checkbox]", [this,"uiDataSetter"], [this,"uiDataGetter"] );
			uidsc.registerDataProvider("input[type=radio]", [this,"uiDataSetter"], [this,"uiDataGetter"] );
		},
		uiDataGetter: function(){
			
		},
		uiDataSetter: function(o,value, attr){
			console.log("@ui_checkbox.uiDataSetter()");
			var n = o.elmName();
			
			var v = '';
			var ty = (typeof value);
	
			if ( Array.isArray(value) && (value.hasOwnProperty(0)) ) {
				v = value;
			}else if( (ty == "string") || (ty == "number") ) {
				v = value;
			}else if( (ty == "boolean") ) {
				v = (value) ? '1' : '0';
			}
			
			var m = (o.hasClass('radio') || o.hasClass('radios')) ? false : true; //multiples
			var t = (m ? 'checkbox' : 'radio');
			if( o.attr("data-type") && (o.data('type') =='bool') ) m = false;
			
			var k = "@fieldset." + t + "[name=" + n + "]";
			//console.log(k + " =======================================");
			
			var ops = [];
			if(o.elmTag() == 'fieldset'){
				var items = o.find('input[type=' + t + ']');
				items.each( function(x) {
					ops.push( $(this) );
				});
			}else{
				ops.push(o);
			}
			
			var c = 0;
			
			for(var i=0; i< ops.length; i++){
				var e = ops[i];
				var idx = e.elmName();
			
				c++;
				var ev = e.attr('value');
				var check = false;
			
				console.log(k + " > input[type=" + t + "][name=" + idx + "][value=" + ev + "]");
			
				check = ui_datasource_controller.matchValue(v, ev);
			
				if (check) {
					e.prop("checked", true);
				}else {
					e.removeProp("checked");
					e.removeAttr("checked");
				}
				
				if(attr.ro){
					e.attr("disabled", "disabled");
				}else if(e.attr("disabled")){
					e.removeAttr("disabled");
				}
			}
		},
		/**
		 * Implements the UI Extend interface.
		 * @param {Object} extender - The rea_helper_ui_extender instance
		 */
		uiExtender : function(extender){
			//implements the UI Extender interface
			extender.registerExpandHelper( "checkbox", [this, "uiExpandElement"] );
			extender.registerExpandHelper( "radio", [this, "uiExpandElement"] );
		},
		uiExpandElement: function(o){
			console.log("@ui.checkbox.expandElement()");
			
			var v = "";
			var in_type = "checkbox";
			var inline = "&nbsp;";
			
			var chk = {'name': '', 'name_prefix':'', 'type':'checkbox', 'lbl': null,'bind':'', 'default':'', 'html': "", 'options': {}, 'data_type':'' };
			
			chk.name = o.elmName();
			chk.type = o.elmTag();
		
			if(o.hasOwnProperty("view")){
				chk.name_prefix = o.view.name + ".";
			}
			
			if (o.attr("data-bind")) {
				chk.bind = " data-bind=\"" + o.attr("data-bind") + "\"";
				o.removeAttr("data-bind");
			}
			if (o.attr("label")) {
				chk.lbl = o.attr("label");
			}else{
				if(o.html().length > 1){
					chk.lbl = o.html();
				}
			}
			
			
			if (o.attr("default")) {
				chk.default = o.attr("default");
				v = chk.default;
			}
			
			if (o.attr("options")) {
				var ops = JSON.parse(o.attr("options"));
				for (var k in ops) {
					chk.options[k] = ops[k];
				}
			}else{
				if (o.hasClass('bool')) {
					chk.data_type = " data-type='bool' ";
					chk.options[1] = (chk.lbl) ? chk.lbl : '';
				}
				if (o.hasClass('yesno')) {
					chk.type = "radio";
					chk.data_type = " data-type='bool' ";
					chk.options[1] = 'Yes';
					chk.options[0] = 'No';
					
				}
			}
			
			var plurals = {'radio':'radios', 'checkbox':'checkboxes'};
			var lc = plurals[chk.type];
			var d = $('<fieldset class="' + lc + '" name="' + chk.name_prefix + chk.name + '" ' + chk.data_type + '></fieldset>');
			
			if (inline) {
				d.addClass("inline");
			}
			
			if (o.hasClass('control-group')) {
				inline = '';
				d.addClass('control-group');
			}
			
			var i = 0;
			var keys = Object.getOwnPropertyNames(chk.options);
			var c = (keys) ? keys.length : 0;
			for (var k in chk.options) {
				i++;
				if(c > 1){
					var dti = " data-ignore='1' ";
					var opn = chk.name_prefix + ((chk.type == 'radio') ? chk.name : chk.name + "_" + i);
				}else{
					var dti = "";
					var opn = chk.name_prefix + chk.name;
				}
				var checked = (v == k) ? ' checked' : '';
				var s = (i > 1) ? inline: '';
				s += "<label for='" + opn + "' class='" + lc + "'>";
				s += "<input type='" + chk.type + "'" + dti + "name='" + opn + "'" + chk.data_type + "value='" + k + "'" + checked + "> " + chk.options[k] + "</label>";
				
				d.append(s);
			}
			
			if(c==1){
				var s = d.html();
				d = $(s);
				//d.find("input").removeData("ignore").removeAttr("data-ignore");
			}
			
			o.replaceWith( d );
		}
	};
	return ui_checkbox;
}() );

rea.registerComponent( "ui", "button", ["ui.panel"],
function(){
	var ui_button = {
		initialize : function(){
			
		},
		/**
		 * Implements the UI Extend interface.
		 * @param {Object} extender - The rea_helper_ui_extender instance
		 */
		uiExtender : function(extender){
			//implements the UI Extender interface
			console.log("@ui.button.extender()");
			
			extender.registerExpandHelper( ".btn", [this, "uiExpandElement"] );
			extender.registerExpandHelper( "buttons", [this, "uiExpandElement"] );
			extender.registerExpandHelper( "input[type=submit]", [this, "uiExpandElement"] );
		},
		uiExpandElement: function(o){
			console.log("@ui.button.expandElement()");
			
			var in_type = "checkbox";
			
			if(o.hasOwnProperty("view") && o.attr("name")){
				o.attr("name", o.view.name + "." + o.attr("name")); 
			}
			
			var bstl = ['btn-default','btn-primary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger']; 
			var bscl = ['','blue','green','lblue','orange','red'];
			var bst_ok = false;
			
			bstl.forEach(function(s){
				if (o.hasClass(s)) bst_ok = true;	
			});
			
			if(!bst_ok){
				for(var i=0; i<bscl.length; i++){
					var s = bscl[i];
					if ( (s.length > 0)  && o.hasClass(s) ) {
						o.removeClass(s);
						o.addClass(bstl[i]);
						bst_ok = true;
						break;
					}
				}
				
				if(!bst_ok) o.addClass('btn-default');
			}
			
		}
	};
	return ui_button;
}() );
rea.registerComponent( "ui", "generic", ["ui.panel"],
function(){
	var ui_generic = {
		initialize : function(){
			
		},
		uiDataProvider: function(uidsc){
			uidsc.registerDataProvider("input[type=hidden], input[type=text], input[type=email], input[type=password], textarea", [this,"uiDataSetter"], [this,"uiDataGetter"] );	
		},
		uiDataGetter: function(){
			
		},
		uiDataSetter: function(o,value, attr){
			console.log("@ui_generic.uiDataSetter()");

			var v = '';
			var ty = (typeof value);
	
			if ( Array.isArray(value) && (value.hasOwnProperty(1)) ) {
				v = '';
			}else if( (ty == "string") || (ty == "number") ) {
				v = value;
			}else if( (ty == "boolean") ) {
				v = (value) ? '1' : '0';
			}
			
			if(attr.ro){
				o.attr("disabled", "disabled");
			}else if(o.attr("disabled")){
				o.removeAttr("disabled");
			}
			o.val(v);
		},
		uiExtender : function(extender){
			extender.registerExpandHelper( "input.text", [this, "uiExpandTextBox"] );
			extender.registerExpandHelper( "input.email", [this, "uiExpandTextBox"] );
			extender.registerExpandHelper( "input.password", [this, "uiExpandTextBox"] );
			extender.registerExpandHelper( "textarea", [this, "uiExpandTextArea"] );
		},
		uiExpandTextBox: function(o){
			console.log("@ui.checkbox.uiExpandTextBox()");			
			var n = o.attr("name");

			if(o.hasOwnProperty("view")){
				n = o.view.name + "." + n;
				o.attr("name", n);
			}
			
			o.addClass("form-control").addClass("textbox");
			if(o.hasClass("email")){
				o.attr("type", "email");
			}else if(o.hasClass("password")){
				o.attr("type", "password");
			}else{
				o.attr("type", "text");
			}
			
			if( o.attr("decorate") ){
				var s  = o.attr("decorate");
				o.removeAttr("decorate");	
				var d = o.clone();
			
				var fg = $("<div class='rea-group input-group' name='" + n + "'></div>");
				fg.append(d);
				fg.append("<span class='input-group-addon'>" + s + "</span>");
				
				o.replaceWith( fg );
			}
		},
		uiExpandTextArea: function(o){
			console.log("@ui.checkbox.uiExpandTextArea()");			
			var n = o.attr("name");

			if(o.hasOwnProperty("view")){
				n = o.view.name + "." + n;
				o.attr("name", n);
			}
			
			o.addClass("form-control").addClass("textarea");
			
			if( o.attr("rtf") ){
			}
		}
	}
	return ui_generic;
}() );
rea.registerComponent( "ui", "panel", [],
function(){
	var ui_panel = {
		initialize : function(){
			rea_ui_panels_controller.installEventHandlers();
		},
		uiExtender : function(extender){
			console.log("@ui.panel.extender()");
			
			extender.registerExpandHelper( "span.decorate", [this, "uiExpandSpanDecorations"] );
			extender.registerExpandHelper( "group", [this, "uiExpandGroup"] );
			
			extender.registerExpandHelper( ".form.row", [this, "uiExpandRow"] );
			
			
		},
		helperGetInlineItems : function(o){
			
			var items = [];
			
			var g = $("<div class='rea-group'></div>");
			var n = "" + o.elmName();
		
			var sz = 0; var nsz = 0;
			o.children("span,div,input,.btn").each(function(){
				var n = $( this );
				var d = $("<div></div>");
				
				n.detach();
				if( n.attr('size') ){
					sz += (n.attr('size') * 1) ;
					d.addClass("col-sm-" + n.attr('size') );
					n.removeAttr("size");
				}else{
					++nsz;
					d.addClass("need-size");
				}
				
				d.append(n);
				items.push( d );
			});
			
			if(nsz > 0){
				nsz = Math.floor((12 - sz)/nsz);
				if((nsz + sz) > 12) nsz -= ((nsz + sz)-12);
				for(var i=0; i< items.length; i++){
					if(!items[i].hasClass("need-size")) continue;
					items[i].addClass("col-sm-" + nsz);
					items[i].removeClass("need-size");
				}
			}

			for(var i=0; i< items.length; i++){
				g.append( items[i] );
			}
			return g;
		},
		uiExpandSpanDecorations : function(o){
			var p = o.parent();
			var items = [];
			
			var g = $("<div class='rea-group'></div>");
			var n = "" + o.elmName();
			
			var nx = o.next();
			if( (nx.length > 0) && ((nx.elmTag() == "input") || (nx.hasClass("text"))) ){
				g.addClass("input-group");
				nx.detach();
				
				var sp = $('<span class="input-group-addon"></span>');
				sp.html( o.html() );
				
				g.append(sp);
				g.append(nx);
			}else{
				nx = o.prev();
				if( (nx.length > 0) && ((nx.elmTag() == "input") || (nx.hasClass("text"))) ){
					g.addClass("input-group");
					nx.detach();
					
					var sp = $('<span class="input-group-addon"></span>');
					sp.html( o.html() );
					
					g.append(nx);
					g.append(sp);
				}
			}
			
			o.replaceWith(g);
		},
		uiExpandGroup : function(o){
			console.log("@ui.panel.expandElement(Group)");
			
			var p = o.parent();
			var items = [];
			
			var g = $("<div class='rea-group'></div>");
			var n = "" + o.elmName();
			
	
			var wsz = true;
			var fig = false;
			if(o.hasClass("inputs")){
				fig = true;
				g.addClass("input-group");
			}
			if(o.hasClass("btns")){
				fig = true;
				g.addClass("btn-group");
			}
			
			var sz = 0; var nsz = 0;
			o.children("span,div,input,.btn").each(function(){
				var n = $( this );
				var d = $("<div></div>");
				
				n.detach();
				if( n.attr('size') ){
					sz += (n.attr('size') * 1) ;
					d.addClass("col-sm-" + n.attr('size') );
					n.removeAttr("size");
					
				}else if( !fig ) {
					++nsz;
					d.addClass("need-size");
				}
				
				if(fig){
					if(sz > 0){
						d.append(n);
						items.push( d );
					}else{
						items.push( n );
					}
				}else{
					d.append(n);
					items.push( d );
				}
			});
			
			if(!fig && (nsz > 0)){
				nsz = Math.floor((12 - sz)/nsz);
				if((nsz + sz) > 12) nsz -= ((nsz + sz)-12);
				for(var i=0; i< items.length; i++){
					if(!items[i].hasClass("need-size")) continue;
					items[i].addClass("col-sm-" + nsz);
					items[i].removeClass("need-size");
				}
			}

			for(var i=0; i< items.length; i++){
				g.append( items[i] );
			}
			
			
			o.replaceWith(g);
		},
		uiExpandRow : function(o){
			console.log("@ui.panel.expandElement(FormRow)");
			
			var sz = 'col-sm-10';
			var lbl = o.children("label");
			//var has_lbl = (typeof(lbl) !== 'undefined') ? true : false;
			var has_lbl = (lbl.length > 0) ? true : false;
			if (has_lbl) {
				lbl.detach();
				lbl.addClass("col-sm-2");
			}else if (o.attr('data-label')) {
				has_lbl = true;
				
				lbl = $("<label class=\"control-label col-sm-2\">" + o.data("label") + "</label>");
			}else{
				sz += " col-sm-offset-2";
			}
			
			var html = null;
			if( o.hasClass("inline") ){
				html = this.helperGetInlineItems(o);
			}else{
				html = o.html();
			}
			
			var d = $("<div></div>");
			d.append(html);
			o.html("");
			
			if(o.hasClass("without-label")){
				sz = 'col-sm-12';
			}else if(has_lbl) {
				o.append(lbl);
			}
			
			d.addClass(sz);
			o.append(d);
			o.addClass("form-group");
		}
		
	};
	return ui_panel;
}() );



var rea_ui_panels_controller = function(){
	return {
		installEventHandlers : function(){
			
		}
		
		
	};
}();