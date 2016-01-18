
///@ui_masked_text

ui_widgets.ui_masked_text = new ui_widget("ui_masked_text");	
ui_widgets.ui_masked_text.initWithElement = function(o){
	console.log("@ui_masked_text.initWithElement()");
	
	this.init(o);
	this.buffer = "";
	
	var $this = this;
	var t = this.o.find(".edit-area");
	
	
	
};
ui_widgets.ui_masked_text.setAttr = function(a, v){
	
	if(a == "ro"){
		var s = (v=="1") ? true : false;
		this.o.find(".edit-area").each(function(){
			if(s){
				$(this).addClass("disabled");
			}else{
				$(this).removeClass("disabled");
			}
		});
	}
	if(a == "text-sizes"){
		var text_sizes = v.split(","); var sr = -1;
		this.o.find(".edit-area").each(function(){
			sr++;
			if(typeof text_sizes[sr] !== "undefined"){
				$(this).css({"min-width":text_sizes[sr]});
			}
		});
	}
	
	if(a == "title"){
		this.o.elmKey("o-title", v);	
	}
	if(a == "placeholder"){
		this.o.attr("placeholder", v);	
	}
}
ui_widgets.ui_masked_text.buildComponents = function(src){
	var m = null;
	var r = /\{([A-Za-z0-9_\.\/\$\:\,\-\@\*\ \[\]\#\+]*)\}/mg;
	var comp = [];
	
	var $this = this;
	$this.matching = false;
	$this.selection = null;
	
	var text_sizes = [];
	if(this.o.attr("text-sizes")){
		var s = this.o.attr("text-sizes");
		text_sizes = s.split(",");
	}
	
	var sr = -1;
	while ((m = r.exec(src)) !== null) {
		
		var s = m[1];
		var e = {"t":"fixed", "s" : s, "r":""};
		var span = "";
		
		
		if(s.indexOf("[") === 0){
			var n = /\[[\<\>]*([A-Za-z0-9_\.\/\$\:\,\-\@\*\ \#\+]*)\]/.exec(s);
			if(n){
				e.t = "edit"; e.s = "";
				e.r = n[0];
			}
			
			s = "<span class=\"edit-area\" contenteditable=\"true\"></span>";
			var span =$(s);
			span.attr("name", "edit-area-" + this.o.attr("name"));
			span.data("mask", e.r);
			
			sr++;
			
			if(typeof text_sizes[sr] !== "undefined"){
				span.css({"min-width":text_sizes[sr]});
			}
			
			span.data("mask", e.r);
			span.on('change', function(event) {
				var t = $(this);
				
				$this.broadcast("change", event, []);
			});
			span.on("click touchend", function(e){
				$this.broadcast("click", e, []);
			}).on("focus", function(e){
				$this.broadcast("focus", e, []);
			});
			
			this.o.append(span);
			
			ui_support.CreateMasked(span);
			
		}else{
			s = rea.types.strings.getSafeHTML(e.s);
			s = "<span class=\"edit-fixed\">" + s + "</span>";
			var span =$(s);
			this.o.append(span);
		}
		
		
	}
	
	
};
