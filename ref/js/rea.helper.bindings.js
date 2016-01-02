/*
 *    REA Bootstrap Toolkit
 *    Jose L Cuevas
 *
 */


function rea_selector (){
	this.execute = null;
}
rea_selectors_parser = function(){
	this.tokenizer = new rea_tokenizer();
	this.tokenizer.keywords = ["do", "set", "else", "when", "fech", "options"];
	this._debug = true;
	this.abort = false;
	this.src_block = '';
	this.selector = null;
	this.f = null; //form
	
	this.bindingInitializeViews = function(form){
		var parser = this;
		
		var ops = ['change', 'focus', 'blur', 'click', 'focusin', 'focusout', 'hover', 'mouseenter', 'mouseenter'];
		for( var i = 0; i < ops.length; i++){
			var e = ops[i];
			console.log("binding [data-when-" + e + "]" );
			$('body').find("[data-when-" + e + "]").each(function(){
				var o = $( this );
				var s = o.data("bind");
				//parser.bindingBuild(o, e, s);
			});
		}
	};

	this.bindingBuild = function(target, e, bind){
		var src = bind;
		var r = /^([a-z|\-|\_]*)\:/;
		if (!r.test(src)) return;
		
		var p = r.exec(src);
		var op = p[1].toLowerCase();
		src = src.replace(op + ":", "").trim();
		console.log(src);
		
		this.evaluate(src);
		src = this.src_block;
		
		console.log("@bindingBuild");
		
		var basic_ops = ['change', 'focus', 'blur', 'click', 'focusin', 'focusout', 'hover', 'mouseenter', 'mouseenter'];
		var form = this.f;
		
		if (basic_ops.indexOf(op) > -1) {
			target.on(op, function(e){
				var o = $(e.target);
				console.log("@binding " + op);
				console.log(form);
				console.log(target);
				
				var fn = new Function("e","target","form", src);
				fn(e,target,form);
				
				//var f = rea.forms.get(o.parents('form:first'));
				//var fn = new Function("o","e", "form", src);
				//fn(o, e, f);
			});
		}
		
	}
	this.evaluate = function(src){
		this.tokenizer.initialize(src);
		this.selector = new rea_selector;
		this.src_block = '';
		this.abort = false;
		this.tokenizer.nextToken();
		while(this.tokenizer.last_token.type !== this.tokenizer.kTokenType_EOF){
			if(this.abort) break;
			this.statement();
			if(this.tokenizer.last_token.type == this.tokenizer.kTokenType_EOF) break;
			this.tokenizer.nextToken();
		}
		
		
		//alert("SRC=" + this.src_block);
	};
	this.statement = function(){
		
		//alert("@statement=[" + this.tokenizer.last_token.type + "][" + this.tokenizer.last_token.value + "]");
		if( this.tokenizer.last_token.type == this.tokenizer.kTokenType_Identifier ){
			this.evalualteAssigment();
		}else if( this.tokenizer.last_token.type == this.tokenizer.kTokenType_Selector ){
			this.evalualteAssigment();
		}else if( this.tokenizer.last_token.type == this.tokenizer.kTokenType_Keyword ){
			this.evalualteStatement(this.tokenizer.last_token);
			
		}else if( (this.tokenizer.last_token.type == this.tokenizer.kTokenType_Operator) && ( ["{","["].indexOf(this.tokenizer.last_token.value) > -1) ){
			this.src_block += this.parseLiteralObjects(this.tokenizer.last_token.value);
		}else if(this.tokenizer.last_token.type == this.tokenizer.kTokenType_Comment ){
			
		}else{
			this.src_block += this.tokenizer.last_token.value + ';';
		}
	};
	this.evaluateSelector = function(n){
		var s = "";
		if (n == "controller") {
			s = "reasg_views.controller";
		}else if (n == "message") {
			s = "view.messageBackend";
		}else if (n == "post") {
			s = "view.postURL";
		}else if (n == "submit") {
			s = "view.submitURL";
		}else if (n == "get") {
			s = "view.getURL";
		}else if (n == "this") {
			s = "o";
		}else{
			var r = /([A-Z|0-9|\_])*\:([A-Z|0-9|\_])*/;
			if (r.test(n)){
				var p = n.split(":");
				if (p[0] == 'form') {
					s = "form1.element(\"" + p[1] + "\")";
				}else{
					s= "rea.forms.get(\"" + p[0] + "\").element(\"" + p[1] + "\")";
				}
			}else{
				s = "$.elm(\"" + n + "\")";
			}
		}
		return s;
	}
	this.evalualteAssigment = function(){
		
		var tk = this.tokenizer.last_token;
		var tok = tk.value;
		
		if(tk.type == this.tokenizer.kTokenType_Selector){
			tok = this.evaluateSelector(tok);
		}
		var sn = this.parseVarSymbol(tok);
		var is_obj = (sn != tok) ? true : false;
		
		m = false;
		if( this.tokenizer.ifOperator('(') ){
			sn = this.parseFunctionArguments(sn,'(');
			m = true;
		}
		if( this.tokenizer.ifOperator('[') ){
			sn = this.parseFunctionArguments(sn,'[');
		}
		
		tk = this.tokenizer.pokeToken();
		if(tk.type == this.tokenizer.kTokenType_Operator){
			this.tokenizer.skipNextToken();
			
			var op = tk.value;
			var sv = this.parseRValue();
			this.src_block += sn + ' ' + op + ' ' + sv + ';' + "\n";
			return;
		}
		
		//if(!is_obj && m) sn = substr(sn,1);
		this.src_block += sn + ';'  + "\n";
		return;
	}
	this.evalualteStatement = function(tk){
		var s = tk.value;
		
		if (s == "when") {
			this.src_block += this.evaluateWhen();
		}else if (s == "do") {
			this.src_block += this.evaluateDo("do");
		}else if (s == "options") {
			this.src_block += this.evaluateOptions();
		}else if(tk.type == this.tokenizer.kTokenType_Identifier){
			//this.convAssigment($tk);
		}
	};
	this.evaluateDo = function(cmd){
		
		var s = "";
		var when = "";
		var what = this.parseExpression();
		
		var tk = this.tokenizer.pokeToken();
		if (tk.value == "when") {
			this.tokenizer.skipNextToken();
			when = this.parseExpression();
			s = "if(" + when + "){ " + what + " }";
			
			tk = this.tokenizer.pokeToken();
			if (tk.value == "else") {
				this.tokenizer.skipNextToken();
				when = this.parseExpression();
				s+= "else{ " + this.parseExpression() + " }";
			}
		}else{
			s = what + ";\n";
		}
		
		return s;
	}
	this.evaluateWhen = function(){
		if(!this.tokenizer.needToken("(")){
			this.abort = true;
			return "";
		}
		
		if( this.tokenizer.ifOperator(")") ){
			return "";
		}
		
		var s = "";
		var when = this.parseRValue();
		
		if( this.tokenizer.ifOperator(',') ){
			s = "if(" + when + "){ " + this.parseRValue() + " }";

			if( this.tokenizer.ifOperator(',') ){
				s+= "else{ " + this.parseRValue() + " }";		
			}
			s += "\n";
		}
		if(!this.tokenizer.needToken(")")){
			this.abort = true;
		}
		
		return s;
	}
	this.evaluateOptions = function(){
		var what = this.parseExpression();
		
		var s = "";
		var tk = this.tokenizer.pokeToken();
		if (tk.value == "fetch") {
			this.tokenizer.skipNextToken();
			var fn = this.parseExpression();
			
			s += "var fn = " + fn + ";\n";
			s += "console.log('at fecth');\n";
			s += "fn(function(data){\n";
			s += "alert('at populate options'); console.log(data);";
			s +="});";
		}
		
		return s;
	}
	this.parseLiteralObjects = function(sd){
		var ed = (sd == "[") ? "]" : "}";
		var sf = sd + " ";
		//var tk  =  this.tokenizer.nextToken();
		while(this.tokenizer.last_token.type !== this.tokenizer.kTokenType_EOF){
			if( this.tokenizer.ifOperator(ed) ) break; 
			if( this.tokenizer.ifOperator(',') ){
				sf+= ',';
			}else{
				var sv = this.parseRValue();
				sf += sv;
			}
			if(this.abort) break;
		}
		
		sf += " " + ed;
			
		if( this.tokenizer.ifOperator('.') ){
			return this.parseVarSymbol(sf, false);
		}
		return sf;
	}
	this.parseFunction = function(s){
		//only appear on the right side
		if (s == "when") {
			return this.evaluateWhen();
		}
		
		return s;
	}	
	this.parseFunctionArguments = function(fn, del){
		del = (typeof v != 'undefined') ? del : '(';
		var sf =fn + del;
		var ed = (del == '(') ? ')' : ']';
		
		var tk  =  this.tokenizer.last_token;
		while(this.tokenizer.last_token.type !== this.tokenizer.kTokenType_EOF){
			if( this.tokenizer.ifOperator(ed) ) break; 
			if( this.tokenizer.ifOperator(',') ){
				sf+= ',';
			}else{
				var sv = this.parseRValue();
				sf += sv;
			}
			if(this.abort) break;
		}
		
		sf += ed;
			
		if( this.tokenizer.ifOperator('.') ){
			return this.parseVarSymbol(sf, false);
		}
		return sf;
	}
	this.parseTerm = function(){
		var v1 = this.parseFactor();
		var tk = this.tokenizer.nextToken();
		while( ['*', '/', '^', '%'].indexOf(tk.value) > -1 ){
			v1 = v1 + ' ' + tk.value + ' ' + this.parseFactor();
			tk = this.tokenizer.nextToken();
		}
		this.tokenizer.putTokenBack();
		return v1;
	};
	this.parseFactor = function(){

		var tk  =  this.tokenizer.nextToken();
		var type = tk.type;
		var tok = tk.value;
		var v1 = '';
		
		if(tok == '('){
			v1 = '(' + this.parseExpression() + ')';
			this.tokenizer.needToken(')');
		}else if(tok == '{'){
			v1 = this.parseLiteralObjects("{");
			type = this.tokenizer.kTokenType_Identifier;
		}else if(tok == '['){
			v1 = this.parseLiteralObjects("[");
			type = this.tokenizer.kTokenType_Identifier;
		}else if(type == this.tokenizer.kTokenType_Number){
			v1 = tok;
		}else if(type == this.tokenizer.kTokenType_String){
			v1 = "\"" + tok + "\"";
		}else if((type == this.tokenizer.kTokenType_Identifier) || (type == this.tokenizer.kTokenType_Selector) || ( type == this.tokenizer.kTokenType_Keyword ) ) {
			v1 = tok;
			
			if(type == this.tokenizer.kTokenType_Selector){
				v1 = this.evaluateSelector(v1);
			}
			if( type == this.tokenizer.kTokenType_Keyword ){
				v1 = this.parseFunction(tok);
			}
			
			var v2 = this.parseVarSymbol(v1);
			var is_obj = (v2 != v1) ? true : false;
			var is_fn = false;
			
			v1 = v2;
			
			if( this.tokenizer.ifOperator('(') ){
				v1 = this.parseFunctionArguments(v1);
				is_fn = true;
			}else if(this.tokenizer.ifOperator('[') ){
				v1 = v1 + '[' + this.parseExpression() + ']';
				this.tokenizer.needToken(']');
				
				if( this.tokenizer.ifOperator('.') ){
					v1 = this.parseVarSymbol(v1, false);
				}
			}else if(this.tokenizer.ifOperator('{') ){
				v1 = v1 + '{' + $this.parseExpression() + '}';
				this.tokenizer.needToken('}');
				
				if( this.tokenizer.ifOperator('.') ){
					v1 = this.parseVarSymbol(v1, false);
				}
			}else if(this.tokenizer.ifOperator('.') ){
				v1 = this.parseVarSymbol(v1, false);
			}else if(!is_obj){
				//add default
				if( (type == this.tokenizer.kTokenType_Selector) ) {
					v1 += ".val()";
				}
			}
			
			if(!is_obj && is_fn){
				//v1 = v1.substring(1);
			}
		}else{
			this.tokenizer.putTokenBack();
			return 0;
		}
		return v1;
	}
	this.parseVarSymbol = function(sObject, pd){
		pd = (typeof pd != 'undefined') ? pd : true; 
			
		if(pd){
			if( !this.tokenizer.ifOperator('.') ){
				
				if(sObject.substring(0,1) == "\"") return sObject;
				if('0123456789.'.indexOf( sObject.substring(0,1) ) >= 0) return sObject;
				return sObject;
			}
		}
		
		var tk  =  this.tokenizer.nextToken();
		var smember = tk.value;
		var v = '';
		if( !this.tokenizer.ifOperator('(') ){
			//if(substr($sObject,0,1) == chr(34)) return $sObject;
			//if(strpos('0123456789.', $sObject[0]) !== false) return $sObject;
			return sObject + "." + smember;
		}
		
		var sv = sObject + "." + smember + "(";
		while(this.tokenizer.last_token.type !== this.tokenizer.kTokenType_EOF){
			if( this.tokenizer.ifOperator(')') ) break;
			
			if( this.tokenizer.ifOperator(',') ){
				sv += ', ';
			}else{
				v = this.parseRValue();
				sv += v;
			}
		}
		
		sv+= ')';
		
		if( this.tokenizer.ifOperator('.') ){
			return this.parseVarSymbol(sv, false);
		}
		
		return sv;
	}
	this.parseRValue = function(){
		return this.parseExpression();
		
	}
	this.parseExpression = function (){
		var tk =  this.tokenizer.nextToken();
		var neg = '';

		if(tk.type == this.tokenizer.kTokenType_Operator){
			if( (tk.value == '+') || (tk.value == '-') ){
				neg = tk.value;
			}else if(tk.value == '!'){
				neg = tk.value;
			}else{
				this.tokenizer.putTokenBack();
			}
		}else{
			this.tokenizer.putTokenBack();
		}

		var v2 = "";
		var v1 = this.parseTerm();
		if(neg != '') v1 = neg + v1;
		
		tk =  this.tokenizer.nextToken();
		
		op_ex = ['and', 'or', '==', '=', '!=', '>=', '<=', '>', '<', '+', '-', '&', '&&', ':' ];
		if( op_ex.indexOf(tk.value) > -1 ){
			//noting
		}else{
			this.tokenizer.putTokenBack();
			return v1;
		}
		
		while( op_ex.indexOf(tk.value)  > -1 ){
			v2 = this.parseTerm();
			v1 = v1 + ' ' + tk.value + ' ' + v2;
	

			tk =  this.tokenizer.nextToken();
		}
		
		this.tokenizer.putTokenBack();
		return v1;
	}
}

