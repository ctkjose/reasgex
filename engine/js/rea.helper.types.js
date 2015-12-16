/** @module reasg/js/data_types_extensions */

var o = {
	doThis : function(a, b){
		console.log("@test.doThis");
		console.log(this);
		console.log(arguments);
	},
	doThat : function(a){
		console.log("@test.doThat");
		console.log(this);
		console.log(arguments);
	}
}



// callback( fn );
// callback( [obj, fn_name] )

//JavaScript Extensions
Date.prototype.toMYSQLDate = function(){
	return this.getFullYear() + '-' +
    (this.getMonth() < 9 ? '0' : '') + (this.getMonth()+1) + '-' +
    (this.getDate() < 10 ? '0' : '') + this.getDate();
}
Date.prototype.toMYSQLDateTime = function(){
	return this.toMYSQLDate() + ' ' + (this.getHours() < 10 ? '0' : '') + this.getHours() + ':' + (this.getMinutes() < 10 ? '0' : '') + this.getMinutes() + ':' +  + (this.getSeconds() < 10 ? '0' : '') + this.getSeconds();
}

var rea_date = function(any){
	this.today = new Date();
	
	if (typeof any == 'string') {
		this.fromString(any);
	}else if(any){
		this.fromTarget(any);
	}
	
}
rea_date.prototype.dateString = function(d){
	return d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate();
}
rea_date.prototype.dateHumanString = function(d){
	return (d.getMonth()+1) + '/' + d.getDate() + "/" + d.getFullYear();
}
rea_date.prototype.fromTarget = function(t){
	if ((typeof(t.data('date')) !== 'undefined') ) {
		return this.fromString( t.data('date') );
	}else if( t.elmType() == "text" ){
		return this.fromString( "" + t.val() );
	}else{
		return this.fromString( 'M/D/YYYY' );
	}
}
rea_date.prototype.fromString = function(s){
	var v = ("" + s).toUpperCase();
	var d = new Date();
	
	if( (v != '') && (v != 'M/D/YYYY')){
		var p = v.split('/');
		if ( p.length != 3) {
			ok = false;
		}else{
			d = new Date(p[2], p[0]-1, p[1]);
		}
	}
	
	this.as_string = (d.getMonth()+1) + '/' + d.getDate() + "/" + d.getFullYear();
	this.as_date = d;
	this.m = d.getMonth();
	this.month = d.getMonth() + 1;
	this.year = d.getFullYear();
	this.day = d.getDate();
	this.dow = d.getDay();
	
	this.asMYSQLDate = d.toMYSQLDate();
	this.asMYSQLDateTime = d.toMYSQLDateTime();
	
	var cm = new Date(this.year, this.m, 1);
	this.fow = cm.getDay();
	
	this.next_month = (this.m == 11) ? new Date(this.year+1, 0, 1) : new Date(this.year, this.month, 1);
	this.prev_month = (this.m == 0) ? new Date(this.year-1, 11, 1) : new Date(this.year, this.m-1, 1);
	
	var daysinmonth= new Array(0,31,28,31,30,31,30,31,31,30,31,30,31);
	if( ((this.year%4 == 0)&&(this.year%100 != 0) ) ||(this.year%400 == 0) ){
		daysinmonth[2] = 29;
	}
	this.last_day = daysinmonth[this.month];	
}