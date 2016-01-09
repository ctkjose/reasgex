rea.registerComponent( "ui", "table", ["ui.panel"],
function(){
	ui_table = {
		initialize : function(){
			
		},
		uiExpandElement: function(tbl){
			//console.log("@ui.table.expandElement()");
			
			if(tbl.elmKey("expanded")) return;
			
			var n = tbl.attr("name");
			var scope = "default";
			if( tbl.attr("scope") ) { scope = tbl.attr("scope"); tbl.removeAttr("scope"); tbl.elmKey("scope", scope); }

			var atr = tbl.find('tr.table-row-template');
			
			atr.find("td").each(function(){
				var td = $(this);
				if(td.attr("size")){
					td.css({"width":td.attr("size")});
					td.removeAttr("size");
				}
				if(td.attr("max-size")){
					td.css({"max-width":td.attr("max-size")});
					td.removeAttr("max-size");
				}
			});
			
			tbl.find("th").each(function(){
				var td = $(this);
				if(td.attr("size")){
					td.css({"width":td.attr("size")});
					td.removeAttr("size");
				}
				if(td.attr("max-size")){
					td.css({"max-width":td.attr("max-size")});
					td.removeAttr("max-size");
				}
			});
			tbl.data('template', atr);
			
			tbl.addClass("uiw").addClass("uiwc");
			tbl.addClass("uiwc-for-table-rows");
			tbl.addClass("uiwd-table-rows");
			
			if (tbl.attr("datasource1")) {
				var ds_name = tbl.attr("datasource");
				var ds = window[ds_name];
				
				var v = (tbl.attr("default")) ? tbl.attr("default") : '';
				ds.get( function(ds){
					console.log("on tbl get");
					//rea_helper_ui_table.populateWithDS(tbl, ds);
					
				});
				
				if (ds.def.source_pull=='dynamic') {
					tbl.attr("data-source-update-on-change", tbl.attr("datasource"));
				}
			}
			//var ops = o.find('tr.template');
			atr.remove();
			
			ui_support.applyStandardRowSizeAttr(tbl,tbl);
			
			var m = $("<span></span>");
			tbl.before(m);
			tbl.detach();
			var dw = $("<div class='table-wrapper'></div>");
			dw.append(tbl);
			
			if(tbl.hasClass("size-fixed")) {
				dw.addClass("size-fixed");
			}
			
			m.replaceWith(dw);
		},
		uiExtender : function(extender){
			console.log("@ui.table.extender()");
			extender.registerExpandHelper( "table.table", [this, "uiExpandElement"] );
				
			$(document).on('click touchstart','.repeater-cmd-add', function(e){
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
				
				var scope = "default";
				if( tbl.elmHasKey("scope") ) { scope = tbl.elmKey("scope"); }

				
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
					td.data('owner', n).elmKey('key', k);
					
					tr.append(td);
				});
				rea_helper_ui_extender.expandForSelector(tr);
				
				tr.elmKey("row-added", 1);
				
				tb.append(tr);
				
			});
			
			$(document).on('click touchstart','.repeater-cmd-del', function(e){
				e.preventDefault();
				e.stopPropagation();
				
				var o = $(e.target);
				var tbl = o.parents(".table");
				var atr = tbl.data('template');
				var n = tbl.attr("name");
				
				var tr = o.closest("tr");
				tr.elmKey("row-deleted", 1);
				tr.hide();
			});
		},
		uiDataProvider: function(uidsc){
			//uidsc.registerDataProvider("table.table", [this,"uiDataSetter"], [this,"uiDataGetter"] );
			uidsc.registerDataProvider(['uiwd-table-rows'] , [this,"uiDataSetter"],  [this,"uiDataGetter"] );
		},
		uiDataGetter: function(tbl){
			var n = tbl.attr("name");
			
			var data = [];
			
			var trs = tbl.find("tr[data-key]");
			
			trs.each(function(){
				var tr = $(this);
				console.log("@row -------------------------");
				console.log(tr);
				var row_data = ui_datasource_controller.createDatasetFromSelector(tr, null, n);
				
				row_data.flg_row_deleted = 0;
				row_data.flg_row_added = 0;
				if(tr.elmKey("row-added") && (tr.elmKey("row-added")=="1")){
					row_data.flg_row_added = 1;
				}
				if(tr.elmKey("row-deleted") && (tr.elmKey("row-deleted")=="1")){
					row_data.flg_row_deleted = 1;
				}
				data.push(row_data);
			});
			
			return {'name' : n, 'type' : 'list', 'value': data };
		},
		uiDataSetter: function(tbl,value, attr){
			console.log("@ui_table.uiDataSetter()=======================");
			
			if ( !Array.isArray(value) || (!value.hasOwnProperty(0)) ) {
				return;
			}
			
			var atr = tbl.data('template');
			var n = tbl.attr("name");
			var view = tbl.data("view");
			var tb = tbl.find('tbody');
			
			for(var i=0; i<value.length; i++){
				var r = value[i];
				var ops = (r.hasOwnProperty('row_attr')) ? r.row_attr : {css: ''};
				
				var tds = atr.find('td');
				var tr = $("<tr data-owner='" + n + "' data-key='" + i + "'></tr>");
				tds.each( function() {
					var td = $(this).clone(true, true);
					var html = td.html();
					var css = (td.attr('class')) ? td.attr('class') : '';
					for (var rk in r) {
						var s = "%" + rk + "%";
						console.log("rk[" + rk + "]=[" + s + "]");
						html = html.replace(s, r[rk]);
						css = css.replace(s, r[rk]);
					}
					
					td.attr('class', css);
					td.html(html);
					td.data('owner', n).data('key', i);
					
					tr.append(td);
				});
				
				rea_helper_ui_extender.expandForSelector(tr, view);
				ui_datasource_controller.populateSelectorWithDataset(tr, { 'name':view, 'items': r , 'attr':{} });
				
				if (ops.hasOwnProperty('css')) {
					tr.addClass(ops.css);
				}
				
				tb.append(tr);
			}
			
		},
	};
	return ui_table;
}() );