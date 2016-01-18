/** @module reasg/js/data_types_extensions */

if(typeof rea == undefined){
	rea = {"types": {}};
}

rea.types.date = {};

rea.types.date.create = function(any){
	
	var o = {};
	if (typeof any == 'string') {
		o = rea.types.date.dateFromString(any);
	}else if(any){
		o = rea.types.date.dateFromTarget(any);
	}else{
		o  = new Date();
	}
	
	o.today = new Date();
	
	o.toString = function(){
		return rea.types.date.dateToString(this);
	}
	o.toHumanString = function(){
		return rea.types.date.dateToHumanString(this);
	}
	o.toMYSQLDate = function(){
		return rea.types.date.dateToMYSQLDate(this);
	}
	o.toMYSQLDateTime = function(){
		return rea.types.date.dateToMYSQLDateTime(this);
	}
	o.epoch = function(){
		return Math.round(this.getTime()/1000.0);
	}
	
	return o;

}
rea.types.date.stringIsISO8601 = function(value){
	var r = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}\:[0-9]{2}/;
	return (r.test(value));
}
rea.types.date.stringIsMysqlDateTime = function(value){
	var r = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}\:[0-9]{2}\:[0-9]{2}/;
	return (r.test(value));
}

rea.types.date.dateToMYSQLDate = function(d){
	return d.getFullYear() + '-' +
    (d.getMonth() < 9 ? '0' : '') + (d.getMonth()+1) + '-' +
    (d.getDate() < 10 ? '0' : '') + d.getDate();
}
rea.types.date.dateToMYSQLDateTime = function(d){
	return rea.types.date.dateToMYSQLDate(d) + ' ' + (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' +  + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
}
rea.types.date.dateToString = function(d){
	return d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate();
}
rea.types.date.dateToHumanString = function(d){
	return (d.getMonth()+1) + '/' + d.getDate() + "/" + d.getFullYear();
}
rea.types.date.dateFromTarget = function(t){
	if ((typeof(t.data('date')) !== 'undefined') ) {
		return rea.types.date.dateFromString( t.data('date') );
	}else if( t.elmType() == "text" ){
		return rea.types.date.dateFromString( "" + t.val() );
	}else{
		return rea.types.date.dateFromString( 'M/D/YYYY' );
	}
}
rea.types.date.dateFromString = function(s){
	var v = ("" + s).toUpperCase();
	var d = new Date();
	
	var m = null;
	if( rea.types.date.stringIsISO8601(v) ){
		d = new Date(value);
		
	}else if( rea.types.date.stringIsMysqlDateTime(v) ){
		var ps = v.split(' ');
		var dp = ps[0].split('-');
		var tp = ps[1].split(':');
		d = new Date( dp[0], dp[1]-1, dp[2], tp[0], tp[1], tp[2]);
		
	}else if( (m = /([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})/.exec(v)) ){
		d = new Date(m[3], m[1]-1, m[2]);
		
	}	
	
	
	
	
	d.as_string = (d.getMonth()+1) + '/' + d.getDate() + "/" + d.getFullYear();
	d.m = d.getMonth();
	d.month = d.getMonth() + 1;
	d.year = d.getFullYear();
	d.day = d.getDate();
	d.dow = d.getDay();
	
	d.asMYSQLDate = rea.types.date.dateToMYSQLDate(d);
	d.asMYSQLDateTime = rea.types.date.dateToMYSQLDateTime(d);
	
	var cm = new Date(d.year, d.m, 1);
	d.fow = cm.getDay();
	
	d.next_month = (d.m == 11) ? new Date(d.year+1, 0, 1) : new Date(d.year, d.month, 1);
	d.prev_month = (d.m == 0) ? new Date(d.year-1, 11, 1) : new Date(d.year, d.m-1, 1);
	
	var daysinmonth= new Array(0,31,28,31,30,31,30,31,31,30,31,30,31);
	if( ((d.year%4 == 0)&&(d.year%100 != 0) ) ||(d.year%400 == 0) ){
		daysinmonth[2] = 29;
	}
	d.last_day = daysinmonth[d.month];
	
	return d;
}



rea.types.strings = {};

rea.types.strings.getSafeHTML = function(sin){
	var s = sin;
	s = s.replace(/\>/g, "&gt;");
	s = s.replace(/\</g, "&lt;");
	
	s = s.replace(/\r\n/g, '&lt;br&gt;');
	s = s.replace(/\r/g, '&lt;br&gt;');
	s = s.replace(/\n/g, '&lt;br&gt;');
	s = s.replace(/\ /g, "&nbsp;");
	s = s.replace(/\t/g, "&nbsp; &nbsp; ");
	
	console.log("hmtl=" + s);
	return s;
}
rea.types.strings.getBasicHTML = function(sin){
	var s = sin;
	s = s.replace(/\>/g, "&gt;");
	s = s.replace(/\</g, "&lt;");
	
	s = s.replace(/\r\n/g, '<br>');
	s = s.replace(/\r/g, '<br>');
	s = s.replace(/\n/g, '<br>');
	s = s.replace(/\ /g, "&nbsp;");
	s = s.replace(/\t/g, "&nbsp; &nbsp; ");
	
	console.log("hmtl=" + s);
	return s;
}
rea.types.strings.htmlentities = function(s){
	return s.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {return '&#' + i.charCodeAt(0) + ';';});
}

rea.types.strings.matchFormat = function(sin, format){
	
	this.format_map = {
		"*": {'n': 1, 'l': 9000, 'm': ["[A-Za-z0-9_\\.\\ \\-\\']+"] },
		"0": {'n': 1, 'l': 1, 'm': ["[0-9]"] },
		"#": {'n': 1, 'l': 9000, 'm': ["[0-9]+"] },
		"a": {'n': 1, 'l': 1, 'm': ["[A-Za-z0-9_\\.\\'\\ ]"]},
		".": {'n': 1, 'l': 1, 'm': ["\\."] },
		"+": {'n': 1, 'l': 1, 'm': ["\\-\\+"] },
		"@": {'n': 1, 'l': 1, 'm': ["\\@"] },
		" ": {'n': 1, 'l': 1, 'm': ["\\ "] },
		":": {'n': 1, 'l': 1, 'm': ["\\:"] },
		"/": {'n': 1, 'l': 1, 'm': ["\\/"] },
		"-": {'n': 1, 'l': 1, 'm': ["\\-"] },
		"_": {'n': 1, 'l': 1, 'm': ["\\_"] },
		"d": {'n': 1, 'l': 2, 'm': ["0[1-9]","1[0-9]", "2[0-9]", "3[0-1]"] },
		"j": {'n': 1, 'l': 2, 'm': ["[1-9]","1[0-9]", "2[0-9]", "3[0-1]"] },
		"m": {'n': 1, 'l': 2, 'm': ["0[1-9]","1[0-2]"] },
		"n": {'n': 1, 'l': 2, 'm': ["[1-9]","1[0-2]"] },
		"M": {'n': 1, 'l': 3, 'm': ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC","ENE","ABR","AGO","DIC"] },
		"g": {'n': 1, 'l': 2, 'm': ["[1-9]","1[0-2]"] },
		"G": {'n': 1, 'l': 2, 'm': ["[0-9]","1[0-9]","2[0-3]"] },
		"h": {'n': 1, 'l': 2, 'm': ["0[1-9]","1[0-2]"] },
		"H": {'n': 1, 'l': 2, 'm': ["0[0-9]","1[0-9]","2[0-3]"] },
		"i": {'n': 1, 'l': 2, 'm': ["[012345][0-9]"] },
		"s": {'n': 1, 'l': 2, 'm': ["[012345][0-9]"] },
		"Y": {'n': 1, 'l': 4, 'm': ["[123456789][0-9]{3}"] },
		"y": {'n': 1, 'l': 2, 'm': ["[0-9]{2}"] },
	};
	
	if(format.indexOf("[") !== 0) return {"match": 0, "string":""};
	var n = /\[[\<\>]*([A-Za-z0-9_\.\/\$\:\,\-\@\*\ \#\+]*)\]/.exec(format);
	if(!n) return {"match": 0, "string":""};
	
	var s = sin.replace("&nbsp;", " ");
	
	var matched = "";
	var mf = n[1];
	var l = s.length;
	var mc = 0;
	var sdir = 1;
	var p = 0;
			
	if(n[0].substr(1,1) == "<"){
		sdir=-1;
		p = l-1;
	}	
		
	for(var i=(sdir>0)?0:l-1; (sdir>0) ? i<=mf.length-1:i>=0; i+=sdir){
		var ch = mf.substr(i,1);
		
		//console.log("i=" + i + "::ch=" + ch);
		if(!this.format_map.hasOwnProperty(ch)) return {"match": 0, "string":""};
		var er = this.format_map[ch];
		var ok = false;
		for(var x=0; x<er.m.length; x++){
			//alert("eval[" + x + "]=" + er.m[x]);
			if((sdir>0) && (p > l)) break;
			if((sdir<0) && (p < 0)) break;

			var n = new RegExp(er.m[x]);
			var pi = (sdir>0) ? p: Math.max(p-er.l+1,0);
			var ml = Math.min(er.l, l-matched.length);
			var ns = s.substr(pi,ml);
			var nm = n.exec(ns);
			if(nm){
				ok = true;
				p += (sdir * nm[0].length);
				matched= (sdir>0) ?  matched + nm[0] : nm[0] + matched;
				break;
			}
		}
		
		//console.log("s=" + s + "::s[" + p + "-" + pi + "]=[" + ns + "]::mc=[" + mc + "]::er=[ch:" + ch + ",l:" + ml + "]::matched=[" + matched + "]");
		
		if(!ok) break;
		mc++;
	}
	//console.log("s=" + s + "::matched=" + matched + "::er=[ch:" + ch + ",l:" + ml + "]");
				
	var status = 0;
	if((matched == s) && (mc==mf.length) ){
		status = 2;
	}else if(mc>0){
		status = 1;
	}
				
	return {"match": status, "string":matched };
}


// callback( fn );
// callback( [obj, fn_name] )

//JavaScript Extensions


var rea_date = function(any){
	this.today = new Date();
	
	if (typeof any == 'string') {
		this.fromString(any);
	}else if(any){
		this.fromTarget(any);
	}
	
}
