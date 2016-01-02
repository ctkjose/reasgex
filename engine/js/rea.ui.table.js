rea.registerComponent( "ui", "table", ["ui.panel"],
function(){
	ui_table = {
		initialize : function(){
			
		},
		uiExpandElement: function(tbl){
			console.log("@ui.table.expandElement()");
			console.log(tbl);
			
			var n = tbl.attr("name");
			if(tbl.hasOwnProperty("view")){
				tbl.data("view", n);
				
				n = tbl.view.name + "." + n;
				tbl.attr("name", n);
			}

			var atr = tbl.find('tr.table-row-template');
			tbl.data('template', atr);
			
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
				var view = tbl.data("view");
				
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
				rea_helper_ui_extender.expandForSelector(tr, view);
				
				tb.append(tr);
				
			});
		},
		uiDataProvider: function(uidsc){
			uidsc.registerDataProvider("table.table", [this,"uiDataSetter"], [this,"uiDataGetter"] );	
		},
		uiDataGetter: function(){
			
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
				ui_datasource_controller.datasetUseWithSelector( { 'name':view, 'items': r }, tr);
				
				if (ops.hasOwnProperty('css')) {
					tr.addClass(ops.css);
				}
				
				tb.append(tr);
			}
			
		},
	};
	return ui_table;
}() );