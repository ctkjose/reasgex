var rea_ui_views = function(){
	var obj = {
		viewCreateWithName: function(n){
			
			var v = new rea_ui_view();
			
			v.name = n;
			v.o = $(".view[name='" + n + "']");
			
			
			return v;
		},
		viewCreateWithNode: function(o){
			
			var v = new rea_ui_view();
			
			v.name = o.elmTag();
			
			v.o = o;
			if(o.attr("name")){
				v.name = o.attr("name");
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