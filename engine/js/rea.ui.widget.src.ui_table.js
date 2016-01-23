
///@ui_date

ui_widgets.ui_table = new ui_widget("ui_table");
ui_widgets.ui_table.initWithElement = function(o){
	this.init(o);
};

ui_widgets.ui_table.setAttr = function(a, v){
	
	if(a == "ro"){
		if(v=="1"){
			this.o.attr("disabled", "disabled");
		}else if(this.o.attr("disabled")){
			this.o.removeAttr("disabled");
		}
	}
	if(a == "title"){
		this.o.elmKey("o-title", v);
		if(!this.o.attr("title")) this.o.attr("title", v);
	}
	if(a == "placeholder"){
		this.o.attr("placeholder", v);	
	}
}
ui_widgets.ui_table.getValue = function(){
	
	var v = this.o.val();
	var d = rea.types.date.create(v);
	var val = {};
	var n = this.o.elmName();
	
	if(v.length > 0) {
		val["multiple"] = true;
		val["record_type"] = "date";
		val["value"] = d.dateToHumanString();
		val["utc"] = d.toUTCString();
		val["iso"] = d.toISOString();
		val["json"] = d.toJSON();
		val["epoch"] = d.epoch();
		val["mysql"] = d.toMYSQLDateTime();
	
	}else{
		val = null;
	}
	
	return val;
}
ui_widgets.ui_table.setValue = function(value){
	
	var v = '';
	var ty = (typeof value);
	
	if( (ty == "string") ) {
		v = value;
	}
	var d = null;
	
	if( value instanceof Date){
		d = value;
	}else if(typeof value == "string"){
		d = rea.types.date.create(value);
	}
	
	if(!d) return;

	v = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
	this.o.attr("title", o.data("o-title") + "; Value " + v);
	
	this.o.elmKey("date", v);
	
	this.o.val(value);
}

ui_widgets.ui_table.register = function(){
	ui_widgets.ui_table.initHooks();
	
	return {
		"provide-expand": ["table.table"],
		"privide-data": true,
		"expand-needs": null,
	};
}
ui_widgets.ui_table.initHooks = function(){
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
		ui_widgets.expandForSelector(tr);
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
}
ui_widgets.ui_table.expandRow = function(row, sel){
	row.find(sel).each(function(){
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
}
ui_widgets.ui_table.expandElement = function(tbl){
	if(tbl.elmKey("expanded")) return;
	
	var n = tbl.attr("name");
	var scope = "default";
	if( tbl.attr("scope") ) { scope = tbl.attr("scope"); tbl.removeAttr("scope"); tbl.elmKey("scope", scope); }

	var atr = tbl.find('tr.table-row-template');
	
	this.expandRow(atr,"td");
	this.expandRow(tbl,"th");
	
	tbl.data('template', atr);
	atr.remove();
	
	tbl.addClass("uiw").addClass("uiwc").elmKey("uiw", "ui_table");
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
}