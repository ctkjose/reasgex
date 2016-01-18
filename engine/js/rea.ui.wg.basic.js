/** @module reasg/js/ui/widgets */

/**
 * Implements bootstrap helpers to build basic widgets in REASG
 */
///MARK: Widgets Basic Textbox, Hiddens and Textareas

rea.registerComponent( "ui", "generic", ["ui.panel"],
function(){
	var ui_generic = {
		initialize : function(){
			
		},
		uiDataProvider: function(uidsc){
			uidsc.registerDataProvider(['uiwd-text'] , [this,"uiDataSetter"], [this,"uiDataGetter"] );	
		},
		uiDataGetter: function(o){
			if( o.attr('data-ignore') && (o.data('ignore')=='1')) return null;
			var n = o.elmName();
			var v = o.val();
			var t = (o.attr('data-type') ? o.data('type') : 'text');
			
			if (t=='date'){
				var val = [];
				if(v.length > 0) {
					var dp = v.split('/');
					var d = new Date( dp[2], dp[0]-1, dp[1], 0, 0, 0);
					v = d.toMYSQLDateTime();
				
					val[n + '_utc'] = {'name' : n + '_utc', 'type' : 'date_utc', 'value': d.toUTCString() };
					val[n + '_iso'] = {'name' : n + '_iso', 'type' : 'date_utc', 'value': d.toISOString() };
					val[n + '_json'] = {'name' : n + '_json', 'type' : 'date_json', 'value': d.toJSON() };
					val[n + '_seconds'] = {'name' : n + '_seconds', 'type' : 'seconds', 'value': Math.round(d.getTime()/1000.0) };
				}else{
					val = null;
				}
				return {'name' : n, 'type' : 'date', 'value': val };
			}else{
			
			}
		
			return {'name' : n, 'type' : 'text', 'value': v };
		},
		uiDataSetter: function(o,value, attr){
			//console.log("@ui_generic.uiDataSetter()");

			var v = '';
			var ty = (typeof value);
	
			if ( Array.isArray(value) && (value.hasOwnProperty(1)) ) {
				v = '';
			}else if( (ty == "string") || (ty == "number") ) {
				v = value;
			}else if( (ty == "boolean") ) {
				v = (value) ? '1' : '0';
			}
			
			if(attr && attr.hasOwnProperty('ro') && attr.ro){
				o.attr("disabled", "disabled");
			}else if(o.attr("disabled")){
				o.removeAttr("disabled");
			}
			if(attr && attr.hasOwnProperty('ph')){
				o.attr("placeholder", attr.ph);
			}
			if(attr && attr.hasOwnProperty('dc')){
				var p = o.closest(".input-group[name='" + o.attr("name") + "']");
				if(p && (p.length > 0)){
					var d = p.find(".input-group-addon");
					if(d && (d.length > 0)) d.html( attr.dc );
				}
			}
			
			o.val(v);
		},
		uiExtender : function(extender){
			extender.registerExpandHelper( "input.field", [this, "uiExpandTextBox"] );
			extender.registerExpandHelper( "input.email", [this, "uiExpandTextBox"] );
			extender.registerExpandHelper( "input.password", [this, "uiExpandTextBox"] );
			
			extender.registerExpandHelper( ".masked-text", [this, "uiExpandFieldDecorated"] );
			
			
			
			extender.registerExpandHelper( "textarea", [this, "uiExpandTextArea"] );
			extender.registerExpandHelper( "input[type=hidden]", [this, "uiExpandHidden"] );
			extender.registerExpandHelper( "input.hidden", [this, "uiExpandHidden"] );
		},
		uiExpandHidden: function(o){
			//console.log("@ui.checkbox.uiExpandTextBox()");			
			var n = o.attr("name");

			var scope = "default";
			if(o.elmKey("expanded")) return;
			
			
			
			if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }
		
			o.addClass("uiw").addClass("hidden").addClass("uiwd-text");
			
			if(o.hasClass("hidden")){
				o.attr("type", "hidden");
			}
			
			o.elmKey("uiw", "generic");
			if(scope != "default") o.elmKey("scope", scope);
		},
		uiExpandFieldDecorated: function(o){
			//console.log("@ui.checkbox.uiExpandTextBox()");			
			var n = o.attr("name");

			var scope = "default";
			if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }
		
			var v = "";
			
			if (o.attr("default")) {
				v = o.attr("default");
			}

			o.addClass("uiw").addClass("field");
			o.addClass("ui_masked_text");
			o.elmKey("uiw", "ui_masked_text");
			o.attr("extended", 1);
			
			if(scope != "default") o.elmKey("scope", scope);
			
			var widget =  ui_widgets.ui_masked_text.instanceWithElement(o);
			if(o.attr("mask")){
				widget.buildComponents(o.attr("mask"));
			}
		},
		uiExpandTextBox: function(o){
			//console.log("@ui.checkbox.uiExpandTextBox()");			
			var n = o.attr("name");

			if(o.data("ignore") && (o.data("ignore") == "1")) return;
			
			var scope = "default";
			if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }
		
		
			o.addClass("field");
			
			if(o.hasClass("email")){
				o.attr("type", "email");
			}else if(o.hasClass("password")){
				o.attr("type", "password");
			}else{
				o.attr("type", "text");
			}
			
			
			o.addClass("uiw");
			o.addClass("ui_textbox");
			o.elmKey("uiw", "ui_textbox");
			o.attr("extended", 1);
			
			if(scope != "default") o.elmKey("scope", scope);
			
			
			var widget = ui_widgets.ui_textbox.instanceWithElement(o);
			widget.installEvents();
		},
		uiExpandTextArea: function(o){
			//console.log("@ui.checkbox.uiExpandTextArea()");			
			var n = o.attr("name");

			var scope = "default";
			if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); o.elmKey("scope", scope); }

			o.addClass("form-control").addClass("textarea");
			
			o.addClass("uiw");
			o.elmKey("uiw", "generic");
			
			if( o.attr("rtf") ){
				o.addClass("uiwd-html");
			}else{
				o.addClass("uiwd-text");
				client_interactions.installEvents(n, o);
			}
		}
	}
	return ui_generic;
}() );

///MARK: Widgets Select

rea.registerComponent( "ui", "select", ["ui.panel"],
function(){
	var ui_select = {
		initialize : function(){

		},		
		uiDataProvider: function(uidsc){
			uidsc.registerDataProvider(['uiwd-select'] , [this,"uiDataSetter"], [this,"uiDataGetter"] );
		},
		uiDataGetter: function(o){
			if( o.attr('data-ignore') && (o.data('ignore')=='1')) return null;
			var n = o.elmName();
			var v = o.val();
		
			return {'name' : n, 'type' : 'text', 'value': v };
		},
		uiDataSetter: function(o,value, attr){
			

			var v = '';
			var ty = (typeof value);
	
			if ( Array.isArray(value) && (value.hasOwnProperty(1)) ) {
				v = '';
			}else if( (ty == "string") || (ty == "number") ) {
				v = value;
			}else if( (ty == "boolean") ) {
				v = (value) ? '1' : '0';
			}
			console.log("@ui_select.uiDataSetter(" + v + ")");
			o.elmKey('value', v);
			o.val(v);
			
			if(attr && attr.hasOwnProperty('ro') && attr.ro){
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
			//console.log("@ui.select.expandElement()");
			
			var n = o.attr("name");
			var s = '';
			var v = '';
			
			var lbl_type = "";
			
			if(o.attr("extended") ) return;
			if(o.data("ignore") && (o.data("ignore") == "1")) return;
			
			if (o.hasClass('multiple')) {
				in_type = "select multiple";
			}
			
			if (o.attr('class')) {
				data_class = o.attr('class');
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
				d = $('<select class="field" name="' + n + '"></select>');
				if (o.attr('data-with-code')) d.attr('data-with-code', o.attr('data-with-code'));
			}
			
			d.removeClass("select");
			
			d.addClass("uiw").addClass("ui_select");
			d.elmKey("uiw", "ui_select");
			
			var wg = ui_widgets.ui_select.instanceWithElement(d);
			
			d.attr('default', v);
			d.attr("extended", 1);
		
			
			wg.setOptions(m_options);
			
			
			if( o.attr("datasource") && ( o.elmType() != "select" ) ){
				
				var dsn = o.attr("datasource");
				
				var ds = ui_datasource_controller.getDatsourceWithName(dsn);
				
				if( (typeof ds != "undefined") && (ds.ready) ){
					wg.setOptionsWithDS(ds);
				}
				
				var fn = function(ds){
					wg.setOptionsWithDS(ds);
				};
				
				rea_controller.on("ds_changed_" + dsn, fn);
				d.elmKey("ds", o.attr("datasource"));
				o.removeAttr("datasource");
				
			}
			
			if( o.attr("scope") ) { d.elmKey("scope", o.attr("scope")); }
			
			wg.installEvents();

			if( o.elmType() != "select" ){
				o.replaceWith( d );	
			}
		},
		populateOptionsWithDS: function(o, ds){
			//console.log("@ui_select.populateOptionsWithDS1()");
			
			if( (typeof ds != "object") || (!ds.hasOwnProperty("items")) ) return;
			
			if(!ds.items.hasOwnProperty("options")) return;
			var keys = Object.keys(ds.items.options);
			
			var v = o.val();
			if(!v){
				v = o.elmKey('value');
			}
			
			o.find("option").remove()
			for(var i=0; i<keys.length; i++){
				var k = keys[i];
				var e = ds.items.options[k];
				var op = { 'value' : k };
				if(k == v) op['selected'] = "selected";
				o.append($('<option>', op).text(e));
				
			}
			
			
		},
	};
	return ui_select;
}() );


///MARK: Widgets Buttons
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
			
			///extender.registerExpandHelper( ".btn", [this, "uiExpandElement"] );
			//extender.registerExpandHelper( "buttons", [this, "uiExpandElement"] );
			//extender.registerExpandHelper( "input[type=submit]", [this, "uiExpandElement"] );
		},
		uiExpandElement: function(o){
			console.log("@ui.button.expandElement()");
			
			if(o.elmKey("expanded")) return;
			
			var scope = "default";
			if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }
			o.data("scope", scope);
			
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
			

			var btn = new client_interactions_element(o);
			
			if( o.attr("confirm") ){
				btn.appendAction("click", function(){
					if (!confirm(this.attr("confirm"))) {
						this.preventDefault();
						this.stopOtherEvents();
					}
				});
			}
			if( o.attr("href") ){
				//post to a given URL
			}
			if( o.attr("action") || o.attr("action-with-data")){
				//post to controller with message
				var v = o.closest(".view");
				
				
				var sendAction = function(){};
				if( o.attr("action-with-data") ){
					var action = new client_action(o.attr("action-with-data"));
					o.removeAttr("action-with-data");
					sendAction = function(){
						this.preventDefault();
						this.stopOtherEvents();
						
						var v = this.o.closest(".view");
						if( !v && (!v.length<=0)) return;
	
						var ds = ui_datasource_controller.createDatasetFromSelector(v);
						console.log("sending action with ds ===========================");
						
						var s = this.o.html();
						this.o.elmKey("caption", s);
						s = "<i class='fa fa-spinner fa-spin'></i> " + s;
						this.o.html(s);
						this.o.attr("disabled","disabled");
						
						var me = this.o;
						var done = function(){
							if(!me || (me.length <= 0) || !me.elmKey("caption")) return;
							me.html( me.elmKey("caption") );
							me.removeAttr("disabled");
						};
						rea_controller.backend.sendAction(action, ds, done);
						
					};
				}else{
					var action = new client_action(o.attr("action"));
					o.removeAttr("action");
					sendAction = function(){
						this.preventDefault();
						this.stopOtherEvents();
						
						console.log("sending action alone ===========================");
						rea_controller.backend.sendAction(action, {});
					};
				}
				
				btn.appendAction("click", sendAction);
			}
			
			btn.appendAction("click", function(){ alert("alive click"); this.preventDefault(); });
			btn.installEvent("click");
			
		}
	};
	return ui_button;
}() );

///MARK: Widgets Checkbox
rea.registerComponent( "ui", "checkbox", ["ui.panel"],
function(){
	var ui_checkbox = {
		initialize : function(){
		},
		uiDataProvider: function(uidsc){
			uidsc.registerDataProvider(['uiwd-checkbox'] , [this,"uiDataSetter"], [this,"uiDataGetter"] );
			uidsc.registerDataProvider(['uiwd-radio'] , [this,"uiDataSetter"], [this,"uiDataGetter"] );
		},
		uiDataGetter: function(o){
			
			if( o.attr('data-ignore') && (o.attr('data-ignore')=='1')) return null;
			
			var n = o.elmName();
			
			//if (!opWithTable && s.parents("table.repeater").length > 0) {
			//return;
			//}
		
			var opexc = (o.is('fieldset.radios')) ? true : false;
			var opm = (opexc || o.is('fieldset.checkboxes')) ? true : false;
			
			var val = ((opm && !opexc) ? []:'');
			console.log("opm=" + opm + "::opexc=" + opexc);
			if(opm){
				var c = 0;
				var ops = (opexc) ? o.find('input[type=radio]:checked') : o.find('input[type=checkbox]:checked');
				ops.each( function(i) {
					var e = $(this);
					c++;
					console.log("found fieldset child [" + c + "] " + e.elmName() );
					var v = e.attr('value');
					if(opexc){
						val = v;
					}else{
						val.push( v );	
					}
				});
				
				if ( o.attr("data-type") && (o.data('type') =='bool') && (c < 1) ) {
					val = 0;
				}
			}else{
				var bool = o.attr("data-type") && (o.data('type') =='bool') ? true : false;
				if (! o.is(":checked") ) {
					v = o.attr('default') ? o.attr('default') : (bool ? 0 : 'k');
				}else{
					v = o.attr('value');
				}
				val = v;
			}
			//data[n] = {'name' : n, 'type' : (m ? 'list':'text'), 'value': val };
			
		
			return {'name' : n, 'type' : (opm ? 'list':'text'), 'value': val };

		},
		uiDataSetter: function(o,value, attr){
			//console.log("@ui_checkbox.uiDataSetter()");
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
			
				check = ui_datasource_controller.matchValue(v, ev);
			
				if (check) {
					e.prop("checked", true);
				}else {
					e.removeProp("checked");
					e.removeAttr("checked");
				}
				
				if(attr && attr.hasOwnProperty('ro') && attr.ro){
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
			///extender.registerExpandHelper( "checkbox", [this, "uiExpandElement"] );
			///extender.registerExpandHelper( "radio", [this, "uiExpandElement"] );
		},
		uiExpandElement: function(o){
			//console.log("@ui.checkbox.expandElement()");
			
			var v = "";
			var in_type = "checkbox";
			var chk = {'name': '', 'name_prefix':'', 'type':'checkbox', 'lbl': null,'bind':'', 'default':'', 'html': "", 'options': {}, 'data_type':'' };
			
			chk.name = o.elmName();
			chk.type = o.elmTag();
		
			var scope = "default";
			if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }
			
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
			
			var is_bool = false;
			
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
					is_bool = true;
					chk.options['1'] = (chk.lbl) ? chk.lbl : '';
				}
				if (o.hasClass('yesno')) {
					chk.type = "radio";
					is_bool = true;
					chk.options['1'] = 'Yes';
					chk.options['0'] = 'No';
					
				}
			}
			
			var plurals = {'radio':'radios', 'checkbox':'checkboxes'};
			var lc = plurals[chk.type];
			var d = $('<fieldset class="' + lc + '" name="' + chk.name + '" ' + chk.data_type + '></fieldset>');
			
			d.addClass("uiwc-for-" + lc);
			d.addClass("uiw");
			d.data("uiwd", lc);
			
			d.addClass("inline");
			if(scope != "default") d.elmKey("scope", scope);
			
			if (o.hasClass('control-group')) {
				inline = '';
				d.addClass('control-group');
			}
			
			var i = 0;
			var keys = Object.getOwnPropertyNames(chk.options);
			var c = (keys) ? keys.length : 0;
			for (var k in chk.options) {
				i++;
				
				var opn = chk.name;
				opn += ((chk.type != 'radio') && (c>1)) ? "_" + i : "";

				var checked = (v == k) ? ' checked' : '';
				var lbl = $("<label for='" + opn + "' class='" + lc + "'></label>");
				
				var s = "<input type='" + chk.type + "' name='" + opn + "' " + chk.data_type + " value='" + k + "'>";
				var e = $(s);
				
				if(scope != "default") e.elmKey("scope", scope);
				
				if(v == k){
					e.prop("checked", true).attr("checked", true);
				}
				if(c > 1){
					lbl.append('&nbsp;');
					e.elmKey("ignore", 1);
					e.addClass("uiwe");
				}else{
					e.addClass("uiw");
					e.addClass("uiwd-" + chk.type);
					if(is_bool) e.addClass("uiwd-force-bool");
					e.elmKey("uiw", "checkbox");
				}
				
				client_interactions.installEvents(chk.name, e);
				lbl.append(e);
				lbl.append( ' ' + chk.options[k] );
				
				d.append(lbl);
			}
			
			if(c==1){
				var s = d.html();
				d = $(s);
			}else{
				d.addClass("uiw");
				d.addClass("uiwd-" + chk.type);
				d.elmKey("uiw", "checkbox");
				if(is_bool) d.addClass("uiwd-force-bool");
			}
			
			o.replaceWith( d );
		}
	};
	return ui_checkbox;
}() );

///MARK: Widgets Switch
rea.registerComponent( "ui", "switch", ["ui.panel"],
function(){
	var ui_switch = {
		initialize : function(){
		},
		uiDataProvider: function(uidsc){
			uidsc.registerDataProvider(['uiwd-switch-btn'], [this, "uiYesNoDataSetter"], undefined);
		},
		uiYesNoDataSetter: function(o,value, attr){
			console.log("@ui_switch.uiYesNoDataSetter()");

			var v = '';
			var ty = (typeof value);
	
			if ( Array.isArray(value) && (value.hasOwnProperty(1)) ) {
				v = '0';
			}else if(ty == "string") {
				v = (value == "1") ? '1' : '0';
			}else if( ty == "number") {
				v = (value == 1) ? '1' : '0';
			}else if( (ty == "boolean") ) {
				v = (value) ? '1' : '0';
			}
			
			var p = o.closest(".btn-toogle-group");
			var b1 = p.find(".btn-on");
			var b2 = p.find(".btn-off");
		
			console.log(o);
			console.log(v);
			
			if(v=='1'){
				b1.removeClass("active");
				b2.addClass("active");
			}else{
				b2.removeClass("active");
				b1.addClass("active");
			}
			
			if(attr && attr.hasOwnProperty('ro') && (attr.ro=='1')){
				b1.attr("disabled", "disabled");
				b2.attr("disabled", "disabled");
			}else {
				console.log("remove disabled == " + p.attr("name") );
				b1.removeAttr("disabled");
				b2.removeAttr("disabled");
			}

			o.val(v);
		},
		/**
		 * Implements the UI Extend interface.
		 * @param {Object} extender - The rea_helper_ui_extender instance
		 */
		uiExtender : function(extender){
			//implements the UI Extender interface
			extender.registerExpandHelper( "div.toggle", [this, "uiExpandToggle"] );
			extender.registerExpandHelper( "div.options", [this, "uiExpandOptions"] );
		},
		uiExpandOptions: function(o){
			//console.log("@ui.toggle.expandElement()");
			
			var v = "";
			var n = o.elmName();
			
			var scope = "default";
			if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }
			
			if (o.attr("default")) {
				v = o.attr("default");
			}
			
			o.attr("extended", 1);
			o.addClass("field").addClass("ui_options").addClass("uiw");
			o.elmKey("uiw", "ui_options");
			
			var tz = '0';
			if(v == "1"){
				o.addClass("active");
				tz = '44';
			}
			
			o.elmKey("value", v);
			
			var options = {};
			if (o.attr("options")) {
				var ops = JSON.parse(o.attr("options"));
				for (var k in ops) {
					options[k] = ops[k];
				}
			}else if (o.hasClass("yesno")) {
				options = { "0":"No", "1": "Yes" };
				o.removeAttr("max-options").attr("max-options", 1);
			}
			
			var i = 0;
			for (var k in options) {
				i++;
				var opn = n + "_" + i;
				
				var op = $("<span class=\"edit-option\" value=\"\" onclick=\"void(0);\"></span>");
				op.attr("value", k);
				op.attr("name", opn);
				op.addClass("unselectable");
				op.html(options[k]);
				
				if(o.hasClass("yesno")) {
					if(k=="1"){ op.addClass("yes");	} else {op.addClass("no");}
				}
				
				if(Array.isArray(v)){
					
				}else if(v == k){
					op.addClass("active");
				}
				o.append(op);
			}
			
			var fno = function(p,e){
				var out = [];
				p.find(".edit-option.active").each(function(){out.push($(this).attr("value"));});
				p.elmKey("value", out.join(","));
				
				var rvalue = false;
				rea_controller.dispatchEvent("uiw_event", {"action": "change","name": n, "event": e, "node": p, "rvalue":rvalue} );
			}
			var fn = function(e){
				var o = $(e.target);
				if(!o.hasClass("edit-option")) return;
				
				var p = o.closest(".ui_options");
				if(p.hasClass("disabled")) return;
				
				if(o.hasClass("active")){
					o.removeClass("active");
					fno(p,e);
					return;
				}
				
				if(p.attr("max-options")){
					var mc = p.attr("max-options");
					if(mc == 1){
						p.find(".edit-option.active").each(function(){$(this).removeClass("active");});
					}else{
						var c = p.find(".edit-option.active").length;
						if(c+1>mc) return;
					}
				}
				
				o.addClass("active");
				
				fno(p,e);
				
				
			}
			
			o.on("click", fn);
		},
		uiExpandToggle: function(o){
			//console.log("@ui.toggle.expandElement()");
			
			var v = 0;
			var n = o.elmName();
			
			var scope = "default";
			if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }
			
			if (o.attr("default")) {
				v = o.attr("default");
			}
			
			
			o.addClass("field").addClass("ui_toggle").addClass("uiw");
			o.elmKey("uiw", "ui_toggle");
			o.attr("extended", 1);
			
			var tz = '0';
			if(v == "1"){
				o.addClass("active");
				tz = '44';
			}
			
			o.elmKey("value", v);
			var th = $("<div class=\"toggle-handle\" style=\"transform: translate3d(" + tz + "px, 0px, 0px);\"></div>");
			
			o.append(th);
				
			
			var fn = function(e){
				var o = $(e.target);
				if(!o.hasClass("toggle")) o = o.closest(".toggle");
				
				
				var v = (o.elmKey("value")=="1") ? 1 : 0;
				
				var tz = '0';
				if(v){
					o.removeClass("active");
					v = "0";
				}else{
					o.addClass("active");
					v = "1";
					tz = '44';
				}
				
				o.find(".toggle-handle").css({"transform": "translate3d(" + tz + "px, 0px, 0px)"} );
				o.elmKey("value", v);
				
				var rvalue = false;
				rea_controller.dispatchEvent("uiw_event", {"action": "change","name": n, "event": e, "node": o, "rvalue":rvalue} );
			}
			
			o.on("click", fn);
		}
	};
	return ui_switch;
}() );