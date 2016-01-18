/** @module reasg/js/jquery extensions */
/** @author Jose Cuevas */
//JQUERY Extensions
jQuery.elm = function(e){
	
	var o = $( "[id=" + e +"]" );
	if (o.length) return o;
	
	o = $( "[name='" + e +"']" );
	if (o.length) return o;
	
	o = $( "[name^='" + e +"_']" );
	if (o.length) return o;
	
	return null;
}
jQuery.fn.elmForm = function(){
	return this.parents('form:first');
}
jQuery.fn.elmName = function(){
	var n = this.attr("name");
	if ((typeof n === typeof undefined) || (n === false)) {
		n = this.attr("id");
	}
	return n;
}
jQuery.fn.elmType = function(){
	if (this.attr("data-type")) return this.data("type").toLowerCase();
	if (this.attr("type")) return this.attr("type").toLowerCase();
	return this[0].tagName.toLowerCase();
};
jQuery.fn.elmTag = function(){
	return this.prop("tagName").toLowerCase();
};
jQuery.fn.elmKey = function(attr, val) {
	if(val){
		return this.attr('data-' + attr, val);
	}else{
		return this.attr('data-' + attr);
	}
	
};
jQuery.fn.elmHasKey = function(n){
	//return (typeof this.data(n) == "undefined") ? false : true;
	return (typeof this.attr('data-' + n) == "undefined") ? false : true;
};
jQuery.fn.elmHasOptions = function(){
	var t = this.elmType();
	if ( (t == "select") || (t == "checkbox") || (t == "radio") || (t == "check_yesno" ) || (t == "check_bool" )) {
		return true;
	}
	return false;
};
jQuery.fn.elmOptionsGet = function(){
	if(!this.elmHasOptions() ) return [];
	
	var t = this.elmType();
	var n = this.elmName();
	var a = [];
	
	if ( t == "select" ){
		var selected =this.o.find('option');
	}else{	
		var selected = $("input[name='" + n + "']"); //fix this, n could be an id
	}
	
	selected.each( function() {
		var ck = $(this);
		a.push(ck);
	});
	
	return a;
};


