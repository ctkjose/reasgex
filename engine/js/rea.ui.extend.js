/**
 * Implements html semantical extensions, shorthand helpers and behaviors
 * @module reasg/js/ui_extender
 *
 * REASG Toolkit, Jose L Cuevas
 */


var rea_helper_ui_extender = function(){
	var a = {
		expand_functions : [],
		global_expand_function :[],
		/**
		 * Implements the UI Extend interface.
		 * 
		 * @param {string} sel - A selector
		 * @param {Callback} fn - A callback
		 */
		registerExpandHelper : function(sel, fn){
			this.expand_functions.push( {sel: sel, fn:fn} );
		},
		registerGlobalExpandHelper : function(sel, fn){
			this.global_expand_function.push( {sel: sel, fn:fn} );
		},
		/**
		 * Runs extensions and .
		 * 
		 * @param {string} sel - A selector
		 * @param {Callback} fn - A callback
		 */
		expandForSelector : function(sel){
			var o = (typeof sel == "string") ? $(sel) : sel;
			
			if(!o || (o.length <= 0)) return;
			
			if(o.hasClass("extended")) return;
			
			if(!o.hasClass("view")) o.addClass("view");
			if(o.hasClass("extend")) o.removeClass("extend");
			
			if(!o.hasClass("extended")) o.addClass("extended");
			
			for(var i=0;i<this.expand_functions.length;i++){
				var def = this.expand_functions[i];
				o.find(def.sel).each(function(){
					var o = $( this );
					rea.types.callback(def.fn, o);
				});
			}
		},
		copyAttributes: function(a, o, e){
			
			for(var i=0;i<a.length;i++){
				var k = a[i];
				if( o.attr(k) ) e.attr(k, o.attr(k));
			}
			
		},
		/**
		 * Expand default selectors
		 */
		expandDefaults : function(){
			
			for(var i=0;i<this.global_expand_function.length;i++){
				var def = this.global_expand_function[i];
				$(def.sel).each(function(){
					var o = $( this );
					rea.types.callback(def.fn, o);
				});
			}
			var defaults = [".view.extend"];
			for(var i in defaults){
				this.expandForSelector(defaults[i]);	
			}
		},
		componentLoaded : function(e){
			//console.log("@rea_helper_ui_extender.componentLoaded()");
			//console.log(e);
			//console.log("@rea_helper_ui_extender.componentLoaded(" + e.scope + "." + e.name + ")");
			if( !e.instance ) return;
			if( !e.instance.hasOwnProperty("uiExtender") ) return;
			
			console.log("rea_helper_ui_extender.componentLoaded():: " + e.scope + "." + e.name + ".uiExtender()");
			e.instance.uiExtender( this );
			
		},
		initialize : function(){
			
			rea_controller.on("component_loaded", [this,"componentLoaded"]);
			//console.log("@rea_helper_ui_extender.constructor()");
		}
	};
	
	a.initialize();
	
	
	return a;
}();