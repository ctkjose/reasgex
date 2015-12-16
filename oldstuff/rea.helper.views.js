/*
 *    REASG Bootstrap Toolkit
 *    Jose L Cuevas
 *
 */

if(typeof rea == "undefined") rea = {};

rea.forms = {};

t = {};

function t1(){
	rea.observable(t,'k');
	
	t.k = "jose";
	
	console.log("t.k=" + t.k);
	
}
rea.observable = function(obj, n){
	
	Object.defineProperty(obj, n, {
		get: function() { return this[n]; }, 
		set: function(v) { this[n] = v; console.log("got v=[" + v + "]"); },
		configurable: true
	});
	
	
}
rea.forms.initialize = function(f){
	
	var bs = new rea_selectors_parser();
	
	var fs = $('body').find('form');
	fs.each( function(i) {
		var o = $(this);
		var f = rea.forms.get(o);

		//bs.bindingInitializeViews(o);

	});
}


rea.forms.get = function(f){
	var o = null;
	if (typeof f == typeof "") {
		o = $("form[name=" + f + "]");
	}else{
		o = f;
	}
	
	var n= o.attr("name");
	if ( this.items.hasOwnProperty(n) ) return this.items[n];
	
	var a = new this.form(o);
	this.items[n] = a;
	return a;
}
rea.forms.form = function(f){
	this.f = f;
	
	this.name = this.f.attr("name");
	this.action = this.f.attr("action");
	this.method = this.f.attr("method");
	this.elements = [];
	if ((typeof this.action === typeof undefined) || (this.action === false)) {
		this.action = window.location.pathname;
	}
	
	if ((typeof this.method === typeof undefined) || (this.method === false)) {
		this.method = 'post';
	}
	
	var e = this.f.children("input[name='a']");
	if (!e.length) {
		this.f.append("<input type='hidden' name='a' value='default'>");
	}
		
	this.elements = {};
	rea.forms.items[this.name] = this;
}
rea.forms.form.prototype.element = function(n){
	
	if ( this.elements.hasOwnProperty(n) ){
		return this.elements[n];
	}
	
	var view = this;
	var o= this.f.find('input[name=' + n + '], textarea[name=' + n + '], select[name=' + n + ']').first();		
	var e = new rea_view_element(o);
	this.elements[n] = e;		
	
	return this.elements[n];
}
rea.forms.form.prototype.initializeElements = function(){
	var view = this;
	
	for(var i = 0; i< this.elements.length; i++){
		this.elements[i].dispose();
	}
	
	var inputs = this.f.find('input, textarea, select');		
	inputs.each( function(i) {
		var o = $(this);	
		var e = new rea_view_element(o);
		if (view.elements.hasOwnProperty(e.name)) {
			return;
		}
		view.elements.push(e);		
	});
}


/*
 *
 * REA DATASOURCE
 *
 */
rea.datasource = function(uid, def, items){
	
	var o = this;
	o.uid = uid;
	o.def = def;
	o.busy = false;
	o.ready = false;
	o.params = {};
	o.items = {};
	
	if (typeof items != "undefined") {
		o.items = items;
	}
	if((o.def.source_pull == 'static') && (o.def.url.length > 0)){
		rea_controller.on("ready", function(e){
			o.get();
		});
	}else if( o.def.url.length == 0 ){
		if (Object.keys(o.items).length > 0) {
			rea_controller.on("ready", function(e){
				o.ready = true;
				o.itemsChanged();
			});
		}
	}
	
	return this;
	
}
rea.datasource.prototype.setParams = function(values){
	var q = values;
	var k = Object.keys(q);
	for(var i in k){
		this.params[k[i]] = q[ k[i] ];
	}
}
rea.datasource.prototype.bindOnChangeWithQuery = function(ds, sel, queries){
	//var n = o.attr('name') ? o.attr('name') : (o.attr('id') ? o.attr('id') : '');
	var fn = function(e){
		//console.log('@bindOnChangeWithQuery ==== [name={$item->name}]');
		ds.setParams(queries);
		ds.get();
	};
	$(document).on("change", sel, fn);
}

rea.datasource.prototype.ajax_populate = function(fn){

	if( this.busy ) return false;
	if(this.def.url.length == 0) return false;
	
	//console.log("@ds[" + this.uid + "].ajax_populate(" + q + ")");
	var o = this;
		
	this.busy= true;
	this.ready = false;
	
	var d = {};
	
	for (var attr in this.params) {
		if (this.params.hasOwnProperty(attr)) d[attr] = this.params[attr];
	}
	
	$.get(this.def.url, d, function(data){
		//console.log("@ds[" + o.uid + "].ajax_populate(" + q + ")$.get(" + o.def.url + ")");
		o.items = data.items;
		console.log(data);
		if (data.bind) {
			o.def.bind = data.bind;
		}
		
		o.busy=false;
		o.ready = true;
		if (fn) {
			fn(o);
		}
		o.itemsChanged();
	});
	
	return true;
}

rea.datasource.prototype.itemsChanged = function(){
	
	if(rea_controller){
		rea_controller.dispatchEvent("ds_populated", {ds: this});
	}
};
rea.datasource.prototype.setValue = function(q, fn){
	
	this.ready = false;
	if ( (this.def.source == 'ajax') && (this.def.url.length == 0) ){
		return this;
	}
	
	if ( (this.def.source == 'ajax') && (this.def.source_pull != 'static')) {
		this.ajax_populate(q, fn);
		return this;
	}
	
	this.ready = true;
	if (fn) {
		fn(this);
	}
	o.itemsChanged();
	return null;
};
rea.datasource.prototype.get = function(fn){
	//console.log("@ds[" + this.uid + "].get(" + q + ")======");
	if ( (this.def.source == 'ajax') && (this.def.url.length == 0) ) return this;
	
	var up = false;
	if ( (this.def.source == 'ajax') ){
		up = (this.def.source_pull != 'static') ? true : (!this.ready);
	}
	
	if(up){
		this.ajax_populate(fn);
		return this;
	}
		
	this.ready = true;
	if (fn) {
		fn(this);
	}
	this.itemsChanged();
	return this;
};

/*
 *
 * REA VIE VALIDATOR
 *
 */ 

rea_view_validator = {
	result : true,
	runValidations : function(view){
		rea_view_validator.result = true;
		view.form.find("[data-validate]").each(function(){
			alert("here1");
			var o = $( this );
			var k = o.data("validate");
			var m = "";
			var ok = true;
			var v = o.val();
			if(o.attr("data-error-message")) m = o.data("error-message");
			if (k == "empty") {
				ok = (o.attr("data-empty-value")) ? (o.val() != o.data("empty-value")) : (o.val() != "");
			}else if (k == "regex") {
				var r = new RegExp(o.attr('data-v-regex'));
				ok = r.test(v);
			}else if (k == "number") {
				var r = /^[+-]?(?=.)(?:\d+,)*\d*(?:\.\d+)?$/;
				ok = r.test(v);
			}else if (k == "email") {
				var r = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				ok = r.test(v);
			}
			if (!ok) {
				rea_view_validator.failedValidation(o, m);
			}
		});
		
	},
	failedValidation : function(o, m){
		alert(m);
		o.focus();
		
		rea_view_validator.result = false;
	}
	
}


//JavaScript Extensions

Date.prototype.toMYSQLDate = function(){
	return this.getFullYear() + '-' +
    (this.getMonth() < 9 ? '0' : '') + (this.getMonth()+1) + '-' +
    (this.getDate() < 10 ? '0' : '') + this.getDate();
}
Date.prototype.toMYSQLDateTime = function(){
	return this.toMYSQLDate() + ' ' + (this.getHours() < 10 ? '0' : '') + this.getHours() + ':' + (this.getMinutes() < 10 ? '0' : '') + this.getMinutes() + ':' +  + (this.getSeconds() < 10 ? '0' : '') + this.getSeconds();
}

//JQUERY Extensions
jQuery.elm = function(e){
	
	var o = $( "[id=" + e +"]" );
	if (o.length) return o;
	
	o = $( "[name=" + e +"]" );
	if (o.length) return o;
	
	o = $( "[name^=" + e +"_]" );
	if (o.length) return o;
	
	return null;
}
jQuery.fn.elmForm = function(){
	return this.parents('form:first');
}
jQuery.fn.elmName = function(){
	var n = this.attr("name");
	if ((typeof n === typeof undefined) || (n === false)) {
		n = this.attr("id");
	}
	return n;
}
jQuery.fn.elmType = function(){
	if (this.attr("data-type")) return this.data("type").toLowerCase();
	if (this.attr("type")) return this.attr("type").toLowerCase();
	return this[0].tagName.toLowerCase();
};
	
jQuery.fn.elmHasOptions = function(){
	var t = this.elmType();
	if ( (t == "select") || (t == "checkbox") || (t == "radio") || (t == "check_yesno" ) || (t == "check_bool" )) {
		return true;
	}
	return false;
};
jQuery.fn.elmOptionsGet = function(){
	if(!this.elmHasOptions() ) return [];
	
	var t = this.elmType();
	var n = this.elmName();
	var a = [];
	
	if ( t == "select" ){
		var selected =this.o.find('option');
	}else{	
		var selected = $('input[name=' + n + ']'); //fix this, n could be an id
	}
	
	selected.each( function() {
		var ck = $(this);
		a.push(ck);
	});
	
	return a;
}


rea_view_element = function(o){
	this.view = null;
	this.name = '';
	this.type = 'input';
	this.hasOptions = false;
	this.o = o;
	this.a = [];
	
	if (this.o.attr("data-type")){
		this.type = this.o.data("type");
	}else if (o.attr("type")){
		this.type = this.o.attr("type");
	}	
	this.type = this.type.toLowerCase();
	this.name = this.o.attr("name");
	
	
	
	if ( (this.type == "select") || (this.type == "checkbox") || (this.type == "radio") || (this.type == "check_yesno" ) || (this.type == "check_bool" )) {
		this.hasOptions = true;
	};
	this.dispose = function(){
		
	};
	
	this.options = function(){
		
		if(!this.hasOptions) return [this.o];
		
		var a = [];
		if ( this.type == "select" ){
			var selected =this.o.find('option');
		}else{	
			var selected = $('input[name=' + this.name + ']');
		}
		selected.each( function() {
			var ck = $(this);
			a.push(ck);
		});
		
		return a;
	}
	this.disable = function(option){
		if(typeof option !== 'undefined'){
			var items = this.options();
			for(var i = 0; i< items.length; i++){
				if (items[i].val() == option) {
					items[i].attr("disabled", "disabled");
					break;
				}
			}
		}else{
			this.o.attr("disabled", "disabled");
		}
	}
	this.enable = function(option){
		if(typeof option !== 'undefined'){
			var items = this.options();
			for(var i = 0; i< items.length; i++){
				if (items[i].val() == option) {
					items[i].prop("disabled", false);
					break;
				}
			}
		}else{
			this.o.prop("disabled", false);
		}
	}
	
	this.readonly = function(option){
		if(typeof option !== 'undefined'){
			var items = this.options();
			for(var i = 0; i< items.length; i++){
				if (items[i].val() == option) {
					items[i].attr("readonly", "readonly");
					break;
				}
			}
		}else{
			this.o.attr("readonly", "readonly");
		}
	};
	this.val = function(v){
		if(typeof v !== 'undefined'){
			this.set_value(v);
		}
		return this.get_value();
	};
	this.set_value = function(v){
		
		console.log("element[" + this.name + "].set_value(" + v + ")");
		if (this.hasOptions && (this.type != "select")) {
			var items = this.options();
			var a = [];
			for(var i = 0; i< items.length; i++){
				if(items[i].attr("value") == v){
					items[i].attr("checked", "checked");
				}else if (items[i].prop("checked")) {
					items[i].removeProp("checked");
				}
			}
		}else{
			this.o.val(v);
		}
	}
	this.get_value = function(){
		var v = "";
	
		if (this.hasOptions && (this.type != "select")) {
			var items = this.options();
			var a = [];
			for(var i = 0; i< items.length; i++){
				if (items[i].prop("checked")) {
					a.push(items[i].attr("value"));
				}
			}
			if ( (a.length == 1) ) {
				v = a[0];
			}else if ( (a.length < 1) ) {
				if ((this.type == "check_yesno") || (this.type == "check_bool") ) {
					v = 0;
				}
			}else{
				v = a;
			}
		}else{
			v = this.o.val();
		}
		
		if (this.type == "calendar") {
			var r = /^(\d+)\/(\d+)\/\d{4}$/;
			if (!r.test(v)) {
				v = "M/D/YYYY";
			}
		}

		return v;
	};
	return this;
}



rea_view = function(def) {
	this.target = null;
	this.name = def.name;
	this.data = [];
	this.elements = [];
	this.backend_url = "";
	this.toModel = function(){
		return this;	
	};
	this.messageBackend = function(m, p, withViewValues){
		p = (typeof p != 'undefined') ? p : {};
		withViewValues = (typeof withViewValues != 'undefined') ? withViewValues : true;
		
		if (withViewValues) {
			var params = $.extend(p, this.getViewValues() );
		}else{
			var params = $.extend(p, {});
		}
		
		params.a = m;
		
		var backend_url = this.backend_url;

		var fn = function(done_callback){
			$.ajax({type: "POST",url: backend_url, data: params, success: done_callback, dataType: "json" });
		};
		
		return fn;
	},
	this.submitURL = function(url, p){
		p = (typeof p != 'undefined') ? p : {};
		
		var params = $.extend({}, p, this.getViewValues() );
		var listener_url = url;

		var fn = function(done_callback){
			$.ajax({type: "POST",url: listener_url, data: params, success: done_callback, dataType: "json" });
		};
		
		return fn;
	},
	this.postURL = function(url, p){
		p = (typeof p != 'undefined') ? p : {};
		
		
		var params = $.extend({}, p );
		var listener_url = url;

		var fn = function(done_callback){
			$.ajax({type: "POST",url: listener_url, data: params, success: done_callback, dataType: "json" });
		};
		
		return fn;
	},

	this.getURL = function(url, p){
		p = (typeof p != 'undefined') ? p : {};
		
		
		var params = $.extend({}, p );
		var listener_url = url;

		var fn = function(done_callback){
			$.ajax({type: "get",url: listener_url, data: params, success: done_callback, dataType: "json" });
		};
		
		return fn;
	},

	this.initializeView = function(){
		
		if ( rea_views.view_options.hasOwnProperty(this.name) ){
			
			var d = rea_views.view_options[this.name];
			this.backend_url = d.backend_url;
		}
		
		this.form = $("form[name=" + this.name + "]");
		this.form.data("view", this);
		
		var e = this.form.children("input[name='a']");
		if (!e.length) {
			this.form.append("<input type='hidden' name='a' value='default'>");
		}
		
		this.initializeViewElements();

		if (this.data.length > 0) {
			this.populateData();	
		}
		
		//console.log("view[" + this.name + "].initializeView() ====================");
		//console.log(this.elements);
		//console.log(this.data);
		
		if (typeof rea_selectors_parser != 'undefined'){
			this.selectors_parser = new rea_selectors_parser;
			this.selectors_parser.bindingInitializeView(this);
		}
	}
	
	this.initializeViewElements = function(){
		var view = this;
		
		for(var i = 0; i< this.elements.length; i++){
			this.elements[i].dispose();
		}
		
		var inputs = this.form.find('input, textarea, select');		
		inputs.each( function(i) {
			var o = $(this);	
			var e = new rea_view_element(o);
			if (view.elements.hasOwnProperty(e.name)) {
				return;
			}
			view.elements.push(e);		
		});
	}
	this.sendMessage = function(msg){

		var e = this.form.children("input[name='a']");
		e.val(msg);
		e = null;
		
		rea_view_validator.runValidations(this);
		if (!rea_view_validator.result) {
			alert("failed");
			return false;
		}
		
		var values = this.getViewValues();
		
		var url = rea_views.view_options[this.name].backend_url;
		
		var view = this;
		$.post( url, values, function( data ) {
			console.log("Got Response======");
			console.log(data);
			
			view.handleResponse(data);
		});
		
		return false;
	}
	this.getViewValues = function(){
		
		var values = {};
		var view = this;
		
		for(var i = 0; i< this.elements.length; i++){
			values[ this.elements[i].name ] =  this.elements[i].val();
		}
		
		console.log("view[" + this.name + "].getViewValues() ==============");
		console.log(values);
		
		return values;
	},
	this.handleCommand = function(cmd, params){
		var s = '';
		if (cmd == "display_msg" ) {
			alert(params.msg);
			return;
		}
		
		if (cmd == "display_alert" ) {
			s = '<div class="alert alert-dismissible alert-' + params.type + '" role="alert">';
			s += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
			s += params.msg + '</div>';
			
			this.form.before(s);
			return;
		}
		
		if (cmd == "redirect" ) {
			s = '<div class="alert alert-dismissible alert-info" role="alert">';
			if (params.hasOwnProperty('msg')) {
				s += params.msg;
			}else{
				s += 'Redirecting...';
			}
			s += '</div>';
			
			$("div.container[role=main]").html(s);
			
			window.location.href = params.url;
			return;
		}
	}
	this.handleResponse = function(data){
		if (!data.hasOwnProperty("cmd")) {
			return;
		}
		
		var cmds = Object.keys(data.cmd);
		
		for (var i = 0; i < cmds.length; i++) {
			var k = cmds[i];
			this.handleCommand(	k, data.cmd[k]);
		}
		
	},
	this.populateData = function(){
		
		for (var i = 0; i < this.data.length; i++) {
			var a = this.data[i];
			var e = this.element(a.name);
			if (e == null) {
				continue;
			}
			e.val(a.value);
		}
	};
	
	
	return this;
};

rea_views = {
	lang : 0,
	flgInitialized : false,
	views : [],
	view_options : [],
	initialize : function(){
		this.flgInitialized = true;
		
		for ( var k in this.views ){
			this.views[k].initializeView();
		}
	},
	getView : function(n){
		if (!this.views.hasOwnProperty(n)) {
			this.views[n] = new rea_view({name:n});	
		}
		return this.views[n];
	},
	setViewDataFromJSON : function(n, data){
		if (!this.views.hasOwnProperty(n)) {
			this.views[n] = new rea_view({name:n});	
		}
		
		this.views[n].data = data;
		if(this.views[n].flgInitialized){
			this.views[n].populateData();
		}
	},
}

