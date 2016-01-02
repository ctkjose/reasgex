//Parts adapted from original work of David Walsh

rea_controller = { topics : {}, ae : [], ops : {waitForReady : true }, ready: false, delayedForReady : [] };;

rea_controller.callAppEvent = function(e, p){
	console.log("@callAppEvent(" + e + ")");
	console.log(p);

	//rea_view_validator.runValidations(this);
	//if (!rea_view_validator.result) {
	//		alert("failed");
	//	return false;
	//}

	var url = window.location.pathname;
	p['a'] = e;
	
 	$.post( url, p, function( data ) {
		//console.log("Start Response==================");
		console.log(data);
		//console.log("End Response==================");
		rea_controller.handleResponse(data);
	});

}
rea_controller.handleCommand = function(cmd, params){
	var s = '';
	if (cmd == "display_msg" ) {
		alert(params.msg);
		return;
	}
	
	if (cmd == "display_alert" ) {
		s = '<div class="alert ' + params.type + '" role="alert">';
		s += '<i class="close icon" data-dismiss="alert" aria-label="Close"></i>';
		s += params.msg + '</div>';
		
		$('.place-alerts').before(s);
		return;
	}
	
	if (cmd == "redirect" ) {
		s = '<div class="alert info" role="alert">';
		if (params.hasOwnProperty('msg')) {
			s += params.msg;
		}else{
			s += 'Redirecting...';
		}
		s += '</div>';
		
		$(".page-content").html(s);
		var url = params.url;
		setTimeout( function(){window.location.href = url;}, 3000 );
		return;
	}
}
rea_controller.handleResponse = function(data){
	if (!data.hasOwnProperty("cmd")) {
		return;
	}
	
	
	for (var i = 0; i < data.cmd.length; i++) {
		var e = data.cmd[i];
		console.log(e);
		this.handleCommand(	e.cmd, e);
	}
	
}


rea_controller.dispatchCallAppEventForNode = function(o){
	var m = o.attr('call-app-event');
	
	var data = {};
	if (o.attr('params-data-from-sel')) {
		data = rea_controller.datasetCreateFromSelector( o.attr('params-data-from-sel') );
	}else{
	}
				
	console.log("send form with message [" + m + "]");
	rea_controller.callAppEvent( m, data );

}
rea_controller.bindDatasourceToSelector = function(ds, sel){
	//console.log("@bindDatasourceToSelector(" + sel + ")");
	//console.log(ds);
	
	rea_controller.datasetUseWithSelector(ds, sel);
}
rea_controller.installDefaultEvents = function(){
	
	$(document).on('click', '[data-dismiss]', function(e){
		var o = $(e.target);
		if (!o.attr('data-dismiss')) {
			o = o.parents('[data-dismiss]:first');
		}
		
		var n = o.attr("data-dismiss");
		
		var x = o.parents("." + n);
		if (x) {
			//x.fadeOut(800, function(){ $(this).remove(); });
			//x.fadeOut(700).delay(400).remove();
			x.fadeOut(800).delay(400, function(){ $(this).remove(); });
		}
	});
	
	$(document).on('click', '[confirm]', function(e){
		var o = $(e.target);
		if (!o.attr('confirm')) {
			o = o.parents('[confirm]:first');
		}
		
		var m = o.attr("confirm");
		var ok = confirm(m);
    
		if (!ok) {
			e.stopImmediatePropagation();
			e.preventDefault();
			return;
		}
	});
	
	$(document).on('click', '[open-url]', function(e){
		var o = $(e.target);
		if (!o.attr('open-url')) {
			o = o.parents('[open-url]:first');
		}
		
		e.stopImmediatePropagation();
		e.preventDefault();
		
		var m = o.attr("open-url");
		
		//window.location.href = m;
		alert(m);
	});
	
	$(document).on('click', '[call-app-event]', function(e){
		var o = $(e.target);
		if (!o.attr('call-app-event')) {
			o = o.parents('[call-app-event]:first');
		}
		
		
		e.stopImmediatePropagation();
		e.preventDefault();
		
		rea_controller.dispatchCallAppEventForNode(o);
	});
	
	
}

rea_controller.matchValue = function(a, b){
	//var idx = o.elmName().replace(n, '') * 1;
	var ok = false;
	var t = Array.isArray(a) ? 'array' : (typeof a);
	
	//console.log("matchValue(" + b + ", " + t + ") =============================");
	
	if ( t == 'array' ) {
		for(var i = 0; i< a.length; i++){
			if (rea_controller.matchValue( a[i], b )) ok = true;
		}
	}else if( t == "string" ) {
		ok = (b == a);
	}else if( t == "number" ) {
		ok = ( (b*1) == a);
	}else if( t == "boolean" ) {
		ok = a ? (b == '1') : (b == '0');
	}else{
		ok = (a == b);
	}
	
	//console.log("matchValue(" + b + ", " + t + ", " + (ok ? 'TRUE' : 'FALSE' ) + ")");
	//console.log(a);
	//console.log("matchValue end =============================");
	return ok;
}
rea_controller.datasetUseWithSelector = function(ds, sel){
	
	if (typeof sel == "string") {
		var p = $(sel);
	}else{
		var p = sel;
	}
	
	var data = {};
	
	//if (p.hasClass("select")) {
	//	
	//}
	
	var elms = p.find('input[type=hidden], input[type=text], input[type=email], input[type=password], textarea');
	elms.each( function(i) {
		var s = $(this);
		var n = s.elmName();
		
		if ( !ds.items.hasOwnProperty(n) ) {
			if (s.is("[data-ignore=1]")) {
				return;
			}
			
			s.val('');
			return;
		}
		
		var src = ds.items[n];
		var v = '';
		
		
		if ( Array.isArray(src) && (src.hasOwnProperty(1)) ) {
			v = '';
		}else if( (typeof src == "string") || (typeof src == "number") ) {
			v = src;
		}else if( (typeof src == "boolean") ) {
			v = (src) ? '1' : '0';
		}
		
		if (s.elmType() == 'datepicker') {
			var r = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}\:[0-9]{2}/;
			if (r.test(v)) { //is ISO8601
				var d = new Date(v);
				v = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
			}
			var r = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}\:[0-9]{2}\:[0-9]{2}/;
			if (r.test(v)) { //is Mysql datetime
				var ps = v.split(' ');
				var dp = ps[0].split('-');
				var tp = ps[1].split(':');
				var d = new Date( dp[0], dp[1]-1, dp[2], tp[0], tp[1], tp[2]);
				v = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
			}
		}
		
		s.val(v);
		
	});
	
	
	var elms = p.find('select');
	elms.each( function(i) {
		var s = $(this);
		var n = s.elmName();
		var v = '';
		
		if (s.attr('default')) v = s.attr('default');

		if ( !ds.items.hasOwnProperty(n) ) {
			s.val(v);
			return;
		}
		
		var src = ds.items[n];
	
		if ( Array.isArray(src) && (src.hasOwnProperty(1)) ) {
			v = '';
		}else if( (typeof src == "string") || (typeof src == "number") ) {
			v = src;
		}else if( (typeof src == "boolean") ) {
			v = (src) ? '1' : '0';
		}
		s.attr('value', v);
		
		s.val(v);
		
	});
	
	//pack field sets
	var elms = p.find('fieldset.checkbox, fieldset.radio');
	elms.each( function(i) {
		var s = $(this);
		var n = s.elmName();
		var m = (s.hasClass('radio')) ? false : true;
		var t = (m ? 'checkbox' : 'radio');
		
		if ( !ds.items.hasOwnProperty(n) ) {
			return;
		}
		var k = "@fieldset." + t + "[name=" + n + "]";
		
		//console.log(k + " =======================================");
		var src = ds.items[n];
		if( s.attr("data-type") && (s.data('type') =='check_bool') ) m = false;
		
		var val = (m ? []:'');
		var c = 0;
		var ops = s.find('input[type=' + t + ']');
		ops.each( function(x) {
			var o = $(this);
			//if (o.attr('data-ignore') && (o.data('ignore') == 1)) return;
			var idx = o.elmName();
			
			
			c++;
			var v = o.attr('value');
			var check = false;
			
			//console.log(k + " > input[type=" + t + "][name=" + idx + "][value=" + v + "]");
			
			check = rea_controller.matchValue(src, v);
			
			if (check) {
				o.attr("checked", "checked");
			}else {
				o.removeProp("checked");
				o.removeAttr("checked");
			}
		});
	});
	
	return;

	
	elms = p.find('input[data-type=datepicker]');
	elms.each( function(i) {
		var s = $(this);
		var n = s.elmName();
		var v = s.val();
		if (v.length > 0) {
			var dp = v.split('/');
			var d = new Date( dp[2], dp[0]-1, dp[1], 0, 0, 0);
			v = d.toMYSQLDateTime();
			
			data[n + '_utc'] = {'name' : n + '_utc', 'type' : 'date_utc', 'value': d.toUTCString() };
			data[n + '_iso'] = {'name' : n + '_iso', 'type' : 'date_utc', 'value': d.toISOString() };
			data[n + '_json'] = {'name' : n + '_json', 'type' : 'date_json', 'value': d.toJSON() };
			data[n + '_seconds'] = {'name' : n + '_seconds', 'type' : 'seconds', 'value': Math.round(d.getTime()/1000.0) };
			
		}else{
			v = null;
		}
		
		data[n] = {'name' : n, 'type' : 'date', 'value': v };
	});
	
	
	
	
	var elms = p.find('input[type=checkbox]:not([data-ignore=1])');
	elms.each( function(i) {
		var s = $(this);
		var n = s.elmName();
		var v = s.attr('value');
		
		if (! s.is(":checked") ) {
			v = s.attr('default') ? s.attr('default') : '';
		}
		
		if ( data.hasOwnProperty(n) ) {
			if (Array.isArray(data[n]) ) {
				data[n].push( {'name' : n, 'type' : 'text', 'value': v } );
			}else{
				data[n] = [data[n], {'name' : n, 'type' : 'text', 'value': v } ];
			}
		}else{
			data[n] = {'name' : n, 'type' : 'text', 'value': v };
		}		
	});
	

}

rea_controller.datasetCreateFromSelector = function(sel, opWithTable){
	if (typeof sel == "string") {
		var p = $(sel);
	}else{
		var p = sel;
	}
	
	if ( typeof opWithTable == "undefined") {
		opWithTable = false;
	}
	
	var data = {};
	console.log('@datasetCreateFromSelector(' + sel + ')');
	
	var elms = p.find('table.repeater');
	elms.each( function(i) {
		var s = $(this);
		var n = s.elmName();
		console.log("table[name=" + n + "]");
		var rows = [];
		var trs = s.find("tbody tr");
		trs.each( function(){
			var tr = $(this);
			var row_deleted = (tr.attr('data-row-deleted') ? 1 : 0);
			var row_added = (tr.attr('data-row-added') ? 1 : 0); 
			var row_data = rea_controller.datasetCreateFromSelector( tr, true );
			console.log("table[name=" + n + "].row===============");
			console.log(row_data);
			
			var row = {items : row_data , row_deleted : row_deleted, row_added : row_added };
			rows.push(row);
		});
		
		data[n] = {'name' : n, 'type' : 'repeater', 'value': rows };
	});
	//pack field sets
	elms = p.find('fieldset.checkbox, fieldset.radio');
	elms.each( function(i) {
		var s = $(this);
		var n = s.elmName();
		var m = (s.hasClass('radio')) ? false : true;
		
		if (!opWithTable && s.parents("table.repeater").length > 0) {
			return;
		}
		
		if( s.attr("data-type") && (s.data('type') =='check_bool') ) m = false;
		
		var val = (m ? []:'');
		var c = 0;
		var ops = (m) ? s.find('input[type=checkbox]:checked') : s.find('input[type=radio]:checked');
		ops.each( function(x) {
			var o = $(this);
			c++;
			var v = o.attr('value');
			if(m){
				val.push( v );
			}else{
				val = v;
			}
		});
		
		if ( s.attr("data-type") && (s.data('type') =='check_bool') && (c < 1) ) {
			val = 0;
		}
		
		data[n] = {'name' : n, 'type' : (m ? 'list':'text'), 'value': val };
	});
	
	elms = p.find('input[data-type=datepicker]');
	elms.each( function(i) {
		var s = $(this);
		var n = s.elmName();
		var v = s.val();
		
		if (!opWithTable && s.parents("table.repeater").length > 0) {
			return;
		}
		
		if (v.length > 0) {
			var dp = v.split('/');
			var d = new Date( dp[2], dp[0]-1, dp[1], 0, 0, 0);
			v = d.toMYSQLDateTime();
			
			data[n + '_utc'] = {'name' : n + '_utc', 'type' : 'date_utc', 'value': d.toUTCString() };
			data[n + '_iso'] = {'name' : n + '_iso', 'type' : 'date_utc', 'value': d.toISOString() };
			data[n + '_json'] = {'name' : n + '_json', 'type' : 'date_json', 'value': d.toJSON() };
			data[n + '_seconds'] = {'name' : n + '_seconds', 'type' : 'seconds', 'value': Math.round(d.getTime()/1000.0) };
			
		}else{
			v = null;
		}
		
		data[n] = {'name' : n, 'type' : 'date', 'value': v };
	});
	
	
	
	
	var elms = p.find('input[type=checkbox]:not([data-ignore=1])');
	elms.each( function(i) {
		var s = $(this);
		var n = s.elmName();
		var v = s.attr('value');
		
		if (!opWithTable && s.parents("table.repeater").length > 0) {
			return;
		}
		
		if (! s.is(":checked") ) {
			v = s.attr('default') ? s.attr('default') : '';
		}
		
		if ( data.hasOwnProperty(n) ) {
			if (Array.isArray(data[n]) ) {
				data[n].push( {'name' : n, 'type' : 'text', 'value': v } );
			}else{
				data[n] = [data[n], {'name' : n, 'type' : 'text', 'value': v } ];
			}
		}else{
			data[n] = {'name' : n, 'type' : 'text', 'value': v };
		}		
	});
	
	var elms = p.find('input[type=hidden]:not([data-ignore=1]),input[type=text]:not([data-ignore=1]), input[type=email]:not([data-ignore=1]), input[type=password]:not([data-ignore=1]), textarea:not([data-ignore=1]), select:not([data-ignore=1])');
	elms.each( function(i) {
		var s = $(this);
		var n = s.elmName();
		var v = s.val();
	
		if (!opWithTable && s.parents("table.repeater").length > 0) {
			return;
		}
	
		if ( data.hasOwnProperty(n) ) {
			if (Array.isArray(data[n]) ) {
				data[n].push( {'name' : n, 'type' : 'text', 'value': v } );
			}else{
				data[n] = [data[n], {'name' : n, 'type' : 'text', 'value': v } ];
			}
		}else{
			data[n] = {'name' : n, 'type' : 'text', 'value': v };
		}
	});
	
	
	
	//console.log(data);
	return data;
}


rea_controller.on = function(topic, listener) {
	if(!hasOwnProperty.call(this.topics, topic)) this.topics[topic] = { listeners: [] };
	var index = this.topics[topic].listeners.push(listener) -1;
	return {
		remove: function() {
			delete rea_controller.topics[topic].listeners[index];
		}
	};
};
rea_controller.dispatchEvent = function(topic, info) {
	
	if( (topic === "ready") && this.ops.waitForReady && !this.ready){
		console.log("rea_controller.ready() ============");
		this.ready = true;
		this.delayedForReady.forEach( function(e){
			var data = e.info;
			if(!hasOwnProperty.call(rea_controller.topics, e.topic)) return;
			rea_controller.topics[e.topic].listeners.forEach( function(fn) {
				fn(data);
			});
		});
		
		this.delayedForReady = null;
	}
	if( (topic !== "initialize") && this.ops.waitForReady && !this.ready){
		this.delayedForReady.push( {'topic' : topic, 'info':info });
		return;
	}
	
	if(!hasOwnProperty.call(this.topics, topic)) return;
	this.topics[topic].listeners.forEach(function(fn) {
		fn(info != undefined ? info : {});
	});
};

rea_controller.attachToController = function(){
	$('body').find("[data-controller-attach]").each(function(){
		var o = $( this );
		var src = o.data("controller-attach");
		o.removeData("controller-attach");
		o.removeAttr("data-controller-attach");
		rea_controller.attachElementToController(o, src);
	});
	
}
rea_controller.attachElementToController = function(target, s){
	var basic_ops = ['change', 'focus', 'blur', 'click', 'focusin', 'focusout', 'hover', 'mouseenter', 'mouseover', 'mouseout', 'mouseleave', 'mousedown', 'dblclick', 'keyup','keypress', 'keydown'];
	var p = s.toLowerCase().split(/\s*,+\s*/);
	
	var use = [];
	var n = target.elmName();
	
	p.forEach( function(w){
		w=w.trim();
		if( w.lenght <= 0) return;
		var ns =  w + "." + n;
		
		var r = /^([a-z|\-|\_]*)\.([a-z|\-|\_|0-1|A-Z]*)/;
		if (r.test(w)){
			var p = r.exec(w);
			ns = w;
			w = p[1];
		}
		
		if (basic_ops.indexOf(w) <= -1) return;
		use.push({ns:ns, e:w, n:n});
	});
	use.forEach( function(o){
		
		if ( rea_controller.ae.indexOf(o.ns) > -1) return;
		console.log("@attachElementToController(" + o.ns + ")");
	
		$(document).on(o.ns, function(e){
			rea_controller.dispatchEvent(o.ns, {'name': o.n, 'event': e } );
		});
		
		rea_controller.ae.push(o.ns);
		
	});
	
}

rea_controller.valueFromElement = function(o){
	var n = o.attr("name") ? o.attr("name") : "K";
	var data = [];
	if( o.hasClass("ui_ctrl_cal_textbox") ){
		var v = o.val();
		
		if (v.length > 0) {
			var dp = v.split('/');
			var d = new Date( dp[2], dp[0]-1, dp[1], 0, 0, 0);
			v = d.toMYSQLDateTime();
			
			data[n + '_utc'] = {'name' : n + '_utc', 'type' : 'date_utc', 'value': d.toUTCString() };
			data[n + '_iso'] = {'name' : n + '_iso', 'type' : 'date_utc', 'value': d.toISOString() };
			data[n + '_json'] = {'name' : n + '_json', 'type' : 'date_json', 'value': d.toJSON() };
			data[n + '_seconds'] = {'name' : n + '_seconds', 'type' : 'seconds', 'value': Math.round(d.getTime()/1000.0) };
			
		}else{
			v = null;
		}
		
		data[n] = {'name' : n, 'type' : 'date', 'value': v };
	}else{
		data[n] = {'name' : n, 'type' : 'text', 'value': o.val() };
	}
	

	return data;
}
rea_controller.valueFromSelector = function(sel){
	
	var out = [];
	var elms = $(document).find(sel);
	elms.each( function(i) {
		var o = $(this);
		var n = o.attr("name") ? o.attr("name") : "K";
		var v = rea_controller.valueFromElement(o);
		
		if ( out.hasOwnProperty(n) ) {
			if (! Array.isArray(out[n]) ) {
				out[n] = [out[n]];
			}
			for(var k in v ){
				if(k == n) continue;
				out[n].push = v[k];
			}
		}else{
			for(var k in v ){
				out[k] = v[k];
			}
		}
	});
	
	return out;
};

rea_controller.bindingInitialize = function(){
	this.ps = new rea_selectors_parser();
	
	var ops = ['change', 'focus', 'blur', 'click', 'focusin', 'focusout', 'hover', 'keyup', 'keypress'];
	for( var i = 0; i < ops.length; i++){
		var e = ops[i];
		console.log("@binding [data-when-" + e + "]" );
		$('body').find("[data-when-" + e + "]").each(function(){
			var o = $( this );
			var s = o.data("when-" + e);
			o.removeData("when-" + e);
			o.removeAttr("data-when-" + e);
			rea_controller.bindingBuild(o, e, s);
		});
	}
}

rea_controller.bindingBuild = function(o, e, bind){
	var src = bind.trim();
	var n = o.elmName();
	var ns = e + "." + n;
	console.log("@bindingBuild(" + n + "::" + ns + ")------------------------------");
	
		
	rea_controller.attachElementToController(o, ns);

	this.ps.evaluate(src);
	src = this.ps.src_block;
console.log(src);
	rea_controller.on( ns, function(m){
		var o = $(m.event.target);
		console.log("@callback for " + ns + "::name=" + m.name );
		
		var fn = new Function("e","name", "o", src);
		fn(m.event, m.name, o );
	});

	
}



