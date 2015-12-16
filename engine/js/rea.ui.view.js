var rea_ui_views = function(){
	var obj = {
		viewCreateWithNode: function(o){
			
			var v = new rea_ui_view();
			
			v.name = o.elmTag();
			
			v.o = o;
			if(o.attr("name")){
				v.name = o.elmName();
			}
			
			return v;
		}
	}
	
	return obj;
}();

function rea_ui_view(){
	this.name = '';
	this.o = null;
	
}

//rea_ui_view.prototype.