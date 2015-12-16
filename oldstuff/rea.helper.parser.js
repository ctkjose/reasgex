/*
 *    REASG Bootstrap Toolkit
 *    Jose L Cuevas
 *
 */

function rea_tokenizer() {
	
	this.kToken_Operators = "=:!><().,+-/\^*&%{}[];";
	
	//Token types
	this.kTokenType_EOF = 255;
	this.kTokenType_Selector = 9;
	this.kTokenType_String = 1;
	this.kTokenType_Operator = 2;
	this.kTokenType_Comment = 3;
	this.kTokenType_Number = 4;
	this.kTokenType_Identifier = 5;
	this.kTokenType_Keyword = 6;
	this.kTokenType_Function = 6;

	this.source='';
	this.done = false;
	this.keywords = ['-----'];
	this.saved_token = null;
	this.last_token = null;
	this.initialize = function(src){
		this.source = src;
		this.last_token = null;
		this.saved_token = null;
		this.done = false;
	}
	this.isWhite = function(c){
		if((c == "\n") || (c == "\r") || (c == "\t") || (c == ' ')) return true;
		return false;
	}
	this.getCh = function(p){
		if ( (p + 1) > this.source.length) {
			return '';
		}
		return this.source.substring(p, p+1);
	}
	this.isKeyword = function(k){
		if (this.keywords.indexOf(k.toLowerCase()) >= 0) return true;
		return false;
	}
	this.syntaxError = function(m){
		console.log(m)
	}
	this.needToken = function (tok){
		var tk = this.nextToken();
		if(tk.type == this.kTokenType_EOF) return false;
		
		if(tk.value != tok){
			this.putTokenBack();
			this.syntaxError("Expecting token \"" + tok + "\" but found \"" + tk.value + "\".");
			return false;
		}
		
		return true;
	}
	
	this.ifOperator = function (op){
		var tk = this.nextToken();
		if(tk.type == this.kTokenType_EOF) return false;
		
		if(tk.type != this.kTokenType_Operator){
			this.putTokenBack();
			return false;
		}
		if(tk.value != op){
			this.putTokenBack();
			return false;
		}
		
		return true;
		
	}
	this.putTokenBack = function(){
		if(this.last_token == null) return;
		this.saved_token = {type : this.last_token.type, value : this.last_token.value};
	}
	this.pokeToken = function(){
		var tk = this.nextToken();
		this.putTokenBack();
		
		return tk;
	}
	this.skipNextToken = function (){
		var tk = this.nextToken();
	}
	this.nextToken = function(){
		this.last_token = {type : this.kTokenType_EOF, value : ''};
		var tk = {type : this.kTokenType_EOF, value : ''};
		
		if(this.saved_token != null){
			tk.type = this.saved_token.type;
			tk.value = this.saved_token.value;
			this.saved_token = null;
			this.last_token = {type : tk.type, value : tk.value};
			return tk;
		}
		
		var c = ''; var b = ''; var p = -1;
		var sl = this.source.length - 1;
		
		if(sl < 0){
			return tk;
		}

		do{
			p++;
			c = this.getCh(p);
			
		}while(this.isWhite(c) && (p <= sl));
		
		if(p > sl){
			this.done = true;
			this.source = "";
			return tk;
		}

		if( (c == "\"") || (c == "'") ){
			var sd = (c == "\"") ? "\"" : "'";
			tk.type = this.kTokenType_String;
			do{
				p++;
				c = this.getCh(p);
				b += c;
			}while((c != sd)  && (p <= sl));
			
			this.source = this.source.substring(p+1);
			tk.value = b.substring(0, b.length-1);
		}else if(c == "@"){ //comment
			tk.type = this.kTokenType_Comment;
			do{
				p++;
				c = this.source.substring(p,p+1);
			}while( ((c != "\n") && (c != "\r")) && (p <= sl) );
			
			//print "End Comment, source[{$p}] = $c<br>";
			tk.value = '';
			this.source = this.source.substring(p+1);
			//alert("tk comment[type]=[" + tk.type + "][" + tk.value + "]");
		}else if( "-0123456789".indexOf(c) > -1  ) {
			
			if ( (c == '-') && ( "0123456789.".indexOf(this.source.substring(p+1,p+2)) == -1  ) ){
				tk.value = c;
				tk.type = this.kTokenType_Operator;
				this.source = this.source.substring(p+1);
				//alert("tk op[type]=[" + tk.type + "][" + tk.value + "]");
				
			}else{
				b = '';
				while( "-0123456789.".indexOf(c) > -1 ){
					b += c;
					p++;
					if(p > sl) break;
					c = this.getCh(p);
				}
	
				tk.type = this.kTokenType_Number;
				tk.value = b * 1;
				this.source = this.source.substring(p);
				//alert("tk number[type]=[" + tk.type + "][" + tk.value + "]");
			}
			
		}else if( this.kToken_Operators.indexOf(c) > -1 ){
			tk.type = this.kTokenType_Operator;
			var cn = this.source.substring(p+1,p+2);
			if(c == '<'){
				if(cn == '>'){
					c = '!=';
					p++;
				}else if(cn == '='){
					c = '<=';
					p++;
				}
			}else if( c == '>'){
				if(cn == '='){
					c = '>=';
					p++;
				}
			}else if(c == '!'){
				if(cn == '='){
					c = '!=';
					p++;
				}
			}else if(c == '='){
				if(cn == '='){
					c = '==';
					p++;
				}
			}else if(c == '&'){
				if(cn == '&'){
					c = '&&';
					p++;
				}
			}else if(c == '|'){
				if(cn == '|'){
					c = '||';
					p++;
				}
			}
			
			tk.value = c;
			this.source = this.source.substring(p+1);
		}else if ((c == "$")||(c == "#")) {
			tk.value = c;
			c = '';
			b = '';
			do{
				b += c; p++;
				if(p > sl) break;
				c = this.getCh(p);
			}while((c == ':') || (!this.isWhite(c) && !(this.kToken_Operators.indexOf(c) > -1) && !(c==' ')) );
			
			tk.type = (tk.value=="#") ? this.kTokenType_Selector : this.kTokenType_Selector;
			tk.value = b;
			if((b.length == 0) && (c=="(")) {
				tk.type = this.kTokenType_Identifier;
				tk.value = "$";
			}
			
			this.source = this.source.substring(p);
		}else{
			b = '';
			while(!this.isWhite(c) && !(this.kToken_Operators.indexOf(c) > -1) && !(c==' ')){
				b += c;p++;
				if(p > sl) break;
				c = this.getCh(p);
			}
			
			this.source = this.source.substring(p);
			
			if(this.isKeyword(b)){
				tk.type = this.kTokenType_Keyword;
				tk.value = b.toLowerCase();
			}else if(b.toLowerCase() == 'true'){
				tk.type = this.kTokenType_Number;
				tk.value = '1';
			}else if(b.toLowerCase() == 'false'){
				tk.type = this.kTokenType_Number;
				tk.value = '0';
			}else if(!isNaN(b)){
				tk.type = this.kTokenType_Number;
				tk.value = b * 1;
			}else{
				tk.type = this.kTokenType_Identifier;
				tk.value = b;
			}
			
			//alert("tk[type]=[" + tk.type + "][" + tk.value + "]");
		}
		this.last_token = {type : tk.type, value : tk.value};
		return tk;
	}
	return this;
}

