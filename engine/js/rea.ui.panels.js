/** @module reasg/js/ui/forms */

/**
 * Implements bootstrap helpers to build UI Forms in REASG
 */

rea.registerComponent( "ui", "panel", [],
function(){
	var ui_panel = {
		opRowClasses : ['flow-sm-no','sm-align-right','xs-align-right', 'widgets-in-row', 'xs-hide', 'sm-hide','md-hide', 'lg-hide', 'sm-flow', 'xs-flow', 'xs-scroll', 'sm-scoll'],
		initialize : function(){
		
		},
		onViewSizeChanged : function(sz){
			return;
			console.log("@at onViewSizeChanged(" + sz + ")");
			
			var sel = ".view-row.sm-flow, .view-row.xs-flow";
			
			if((sz == "sm") || (sz == "xs")){
				var fn = function(o){
					var tdl = o.find(".view-row-label");
					var tdc = o.find(".view-row-contents");
					
					if(!tdl || (tdl.length <= 0)) return;
					
					tdl.removeClass("view-row-label");
					tdl.addClass("view-row-contents-header");
					
				};
			}else{
				var fn = function(o){
					var tdc = o.find(".view-row-contents");
					
					var tdh = tdc.find(".view-row-contents-header");
					if(!tdh || (tdh.length <= 0)) return;
					
					tdh.removeClass("view-row-contents-header");
					tdh.addClass("view-row-label");
				};
			}
			
			
			$(sel).each(function(){
				var o = $(this);
				fn(o);
			});
			
		
			sel = ".view-row.xs-scroll[xs-min-width], .view-row.sm-scroll[sm-min-width]";
			if((sz == "sm") || (sz == "xs")){
				fn = function(o){
					var tdc = o.find(".view-row-contents");
					var mw = (o.attr("xs-min-width")) ? o.attr("xs-min-width") : (o.attr("sm-min-width") ? o.attr("sm-min-width") : 1000 );
					tdc.css({"min-width":mw});
				}
			}else{
				fn = function(o){
					var tdc = o.find(".view-row-contents");
					tdc.css({"min-width":"auto"});
				}
			}
			
			$(sel).each(function(){
				var o = $(this);			
				fn(o);
			});
			
		},
		uiExtender : function(extender){
			console.log("@ui.panel.extender()");
			
			extender.registerExpandHelper( "span.decorate", [this, "uiExpandSpanDecorations"] );
			extender.registerExpandHelper( "group", [this, "uiExpandGroup"] );
			
			
			extender.registerExpandHelper( ".view-input-group .header", [this, "uiExpandViewHeader"] );
			extender.registerExpandHelper( ".view-input-group .row", [this, "uiExpandViewRow"] );
			extender.registerExpandHelper( ".view-input-group", [this, "uiExpandViewInputGroup"] );
			
			
			rea_controller.on("view-size-changed", [this, "onViewSizeChanged"]);
			
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
				g.addClass("input-group1");
				nx.detach();
				
				var sp = $('<span class="input-group-addon1"></span>');
				sp.html( o.html() );
				
				g.append(sp);
				g.append(nx);
			}else{
				nx = o.prev();
				if( (nx.length > 0) && ((nx.elmTag() == "input") || (nx.hasClass("text"))) ){
					g.addClass("input-group1");
					nx.detach();
					
					var sp = $('<span class="input-group-addon1"></span>');
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
				var d = $("<div class='muted'></div>");
				
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
		uiExpandViewInputGroup : function(o){
			console.log("@ui.panel.expandElement(Body)");
			
			
			var tb = $("<div class='view-input-group' data-expanded='1'></div>");
			
			ui_support.copyClasses(o, tb, ['widgets-in-row']);
			
			var html = o.html();
			tb.html(html);
			
			o.replaceWith( tb );
		},
		uiExpandViewHeader : function(o){
			console.log("@ui.panel.expandElement(Header)");

			var html = o.html();
			
			var div = $("<div class='view-row-header'></div>");
			
			ui_support.copyClasses(o, div, this.opRowClasses);
			
			var tdl = $("<div class='view-row-label'></div>");
			
			tdl.attr("colspan",2);
			tdl.html(html);
			
			div.append(tdl);
			
			o.replaceWith( div );
		},
		uiExpandViewRow : function(o){
			console.log("@ui.panel.expandElement(FormRow)");
			
			var lbl = o.children("label");
			var has_lbl = (lbl.length > 0) ? true : false;
			
			var tr = $("<div class='view-row'></div>");
			tr.removeClass("form").removeClass("row");
			
			ui_support.copyClasses(o, tr, this.opRowClasses);
			ui_support.copyAttr(o,tr, ['xs-min-width', 'sm-min-width']);
			
			var tdc = $("<div class='view-row-contents'></div>");
			var tdl = $("<div class='view-row-label unselectable'></div>");
			
			
			if (has_lbl) {
				lbl.detach();
				lbl.addClass("control-label").addClass("unselectable");
				tdl.append(lbl);
			}else if (o.elmKey('label') ) {
				has_lbl = true;
				lbl = $("<label class=\"control-label unselectable\">" + o.data("label") + "</label>");
				tdl.append(lbl);
			}
			
			if(has_lbl){
				tdl.append(lbl);
				tr.append(tdl);
				tr.addClass("with-label");
			}else{
				tr.addClass("without-label");
			}
			
			var html = null;
			if( o.hasClass("inline") ){
				html = this.helperGetInlineItems(o);
			}else{
				html = o.html();
			}
			
			tdc.append(html);
			tr.append(tdc);
			o.html("");
			
			o.replaceWith( tr );
			
			//o.addClass("form-group");
		},
		uiExpandRow1 : function(o){
			console.log("@ui.panel.expandElement(FormRow)");
			
			var sz = 'col-sm-10';
			var lbl = o.children("label");
			//var has_lbl = (typeof(lbl) !== 'undefined') ? true : false;
			var has_lbl = (lbl.length > 0) ? true : false;
			var cls = '';
			
			if(o.hasClass("col-keep-together")){
				cls += " col-keep-together";
				o.removeClass("col-keep-together");
			}
			
			if (has_lbl) {
				lbl.detach();
				lbl.addClass("col-sm-2");
			}else if (o.attr('data-label')) {
				has_lbl = true;
				
				lbl = $("<label class=\"control-label col-sm-2" + cls + "\">" + o.data("label") + "</label>");
			}else{
				sz += " col-sm-offset-2";
			}
			
			var html = null;
			if( o.hasClass("inline") ){
				html = this.helperGetInlineItems(o);
			}else{
				html = o.html();
			}
			
			var d = $("<div class='view-row-content'></div>");
			d.append(html);
			o.html("");
			
			if(o.hasClass("without-label")){
				sz = 'col-sm-12';
			}else if(has_lbl) {
				o.append(lbl);
			}
			d.addClass(cls);
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