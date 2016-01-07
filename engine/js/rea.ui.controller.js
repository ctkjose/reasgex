/**
 * Implements the core controller and backend bridge
 * @module reasg/js/ui_controller
 *
 * REASG Toolkit, Jose L Cuevas
 */

//Parts adapted from original work of David Walsh

var rea_controller = { topics : {}, ae : [], ops : {waitForReady : true }, ready: false, delayedForReady : [] };;

rea_controller.on = function(topic, listener) {
	if(!hasOwnProperty.call(this.topics, topic)) this.topics[topic] = { listeners: [] };
	var index = this.topics[topic].listeners.push(listener) -1;
	return {
		remove: function() {
			delete rea_controller.topics[topic].listeners[index];
		}
	};
};

rea_controller.dispatchEvent = function(topic) {
	//console.log("@rea_controller.dispatchEvent(" + topic + ")");
	
	var args = Array.prototype.slice.call(arguments, 1);
	//console.log(args);
		
		
	if( (topic === "ready") && this.ops.waitForReady && !this.ready){
		console.log("rea_controller.ready() ============");
		this.ready = true;
		this.delayedForReady.forEach( function(e){
			var a = e.args;
			if(!hasOwnProperty.call(rea_controller.topics, e.topic)) return;
			rea_controller.topics[e.topic].listeners.forEach( function(fn) {
				
				rea.types.callbackWithArguments(fn, a);
			});
		});
		
		this.delayedForReady = null;
	}
	if( (topic !== "initialize") && this.ops.waitForReady && !this.ready){
		this.delayedForReady.push( {'topic' : topic, 'args': args });
		return;
	}
	
	if(!hasOwnProperty.call(this.topics, topic)) return;
	this.topics[topic].listeners.forEach(function(fn) {
		rea.types.callbackWithArguments(fn, args);
	});
};

rea_controller.backend = {
	/**
	* Send an client_action to the backend.
	* @param {client_action} a - An action to send.
	*/
	sendAction : function(a, data){
		var backend = this;
		var url = a.getURL();
		
		console.log("@rea_controller.sendAction(" + url + ")");
		console.log(a);
		
		var promise = {success: undefined,failure: undefined, data: undefined};
		if(arguments.length >= 3){
			promise.success = arguments[2];
		}
		if(arguments.length >= 4){
			promise.failure = arguments[3];
		}
		console.log("promise----");
		console.log(promise);
		var p = {
			'api-return' : 'json',
			'api-json-data' : JSON.stringify(data),
			'from-backend' : client_interactions.backend,
		};
		
		$.post( url, p, function( data, status, xhr ) {
			console.log("Start Response==================");
			var type = "" + xhr.getResponseHeader("Content-Type");
			
			m = /([a-z0-9\-\_]+\/[a-z0-9\-\_]+)/.exec(type.toLowerCase());
			if(!m){
				type == "text/html";
				console.log("Error: Unable to get mime from response");
			}else{
				type = m[1];
			}
			
			console.log(type);
			if( type == "text/html"){
				backend.handleResponseHTML(data, promise);
			}else if(type == "text/json"){
				backend.handleResponseJSON(data, promise);
			}
			console.log("End Response==================");
			
		}).fail(function() {
			rea.types.callback(promise.failure, []);
		});
	},
	handleResponseHTML : function(data, promise){
		console.log("@handleResponseHTML");
		console.log(data);
		
		promise.data = obj;
		rea.types.callback(promise.success, [promise.data]);
		
	},
	handleResponseJSON : function(data, promise){
		console.log("@handleResponseJSON");
		if(typeof data == "string"){
			var obj = JSON.parse(data);
		}else{
			var obj = data;
		}
		
		console.log(obj);
		if (obj.hasOwnProperty("ui_controller_cmd") && Array.isArray(obj.ui_controller_cmd)) {
			this.processCommands(obj.ui_controller_cmd);
		}
		promise.data = obj;
		rea.types.callbackWithArguments(promise.success, [promise.data]);
		
		
		
	},
	processCommands : function(cmd){
		for (var i = 0; i < cmd.length; i++) {
			var e = cmd[i];
			console.log(e);
			var args = e.args || [];
			this.processCommand(e.cmd, args);
		}
	},
	processCommand : function(cmd, args ){
		if( client_interactions.hasOwnProperty(cmd) ){
			//run a client_interaction
			
			client_interactions[cmd].apply(client_interactions, args);
		}
	}
};

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
		var cls = (s.hasClass('radio')) ? 'radio' : 'checkbox';
		var m = (s.hasClass('radio')) ? false : true;
		
		if (!opWithTable && s.parents("table.repeater").length > 0) {
			return;
		}
		
		if( s.attr("data-type") && (s.data('type') =='check_bool') ) m = false;
		
		var val = (m ? []:'');
		var c = 0;
		var ops = s.find('input[type=' + cls + ']:checked');
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


