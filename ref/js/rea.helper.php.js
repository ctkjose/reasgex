function is_null(a) {
	return (a === null);
}
function isset() {
	var a = arguments,l = a.length,i = 0, undef;

	if (l === 0) {
		return false;
	}

	while (i !== l) {
		if (a[i] === undef || a[i] === null) {
			return false;
		}
		i++;
	}
	return true;
}
function is_string(mixed_var) {
	return (typeof mixed_var === 'string');
}
function is_numeric(mixed_var) {
	var whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
	return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -1)) && mixed_var !== '' && !isNaN(mixed_var);
}
function is_object(a) {
	if (Object.prototype.toString.call(a) === '[object Array]') {
		return false;
	}
	return a !== null && typeof a === 'object';
}
function is_array(a){
	if (!a || typeof a !== 'object' || typeof a.length !== 'number') {
		return false;
	}
	var len = a.length;
	a[a.length] = 'bogus';
	if (len !== a.length) {
		a.length -= 1;
		return true;
    }
	
    delete a[a.length];
    return false;
}
function in_array (needle, haystack, argStrict) {
  var key = '',
    strict = !! argStrict;

  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }

  return false;
}
function array_key_exists (key, search) {
  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
    return false;
  }

  return key in search;
}
function explode (delimiter, string, limit) {
	if ( arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined' ) return null;
	if ( delimiter === '' || delimiter === false || delimiter === null) return false;
	if ( typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string === 'object'){
		return { 0: '' };
	}
	
	if ( delimiter === true ) delimiter = '1';
	
	delimiter += '';
	string += '';
	
	var s = string.split( delimiter );
	if ( typeof limit === 'undefined' ) return s;
	
	if ( limit === 0 ) limit = 1;
	
	if ( limit > 0 ){
		if ( limit >= s.length ) return s;
		return s.slice( 0, limit - 1 ).concat( [ s.slice( limit - 1 ).join( delimiter ) ] );
	}
	
	if ( -limit >= s.length ) return [];
	
	s.splice( s.length + limit );
	return s;
}
function implode (glue, pieces) {
	var i = '',
    retVal = '',
    tGlue = '';
	if (arguments.length === 1) {
		pieces = glue;
		glue = '';
	}
	if (typeof pieces === 'object') {
		if (Object.prototype.toString.call(pieces) === '[object Array]') {
			return pieces.join(glue);
		}
		for (i in pieces) {
			retVal += tGlue + pieces[i];
			tGlue = glue;
		}
		return retVal;
	}
	return pieces;
}
function strlen(s){
	return s.length;
}
function substr(str, start, len) {
	
	var i = 0,se = 0,ret = '';
	str += '';
	var pend = str.length;

    if (start < 0) {
      start += pend;
    }
    
	pend = typeof len === 'undefined' ? pend : (len < 0 ? len + pend : len + start);
    return start >= str.length || start < 0 || start > pend ? !1 : str.slice(start, pend);
}
function str_replace(search, replace, subject, count) {
	var i = 0,j = 0, temp = '', repl = '', sl = 0, fl = 0;
    var f = [].concat(search);
    var r = [].concat(replace);
    var s = subject;
    var ra = Object.prototype.toString.call(r) === '[object Array]';
    
	sa = Object.prototype.toString.call(s) === '[object Array]';
	s = [].concat(s);
	
	if (count) {
		this.window[count] = 0;
	}

	for (i = 0, sl = s.length; i < sl; i++) {
		if (s[i] === '') {
			continue;
		}
		for (j = 0, fl = f.length; j < fl; j++) {
			temp = s[i] + '';
			repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
			s[i] = (temp).split(f[j]).join(repl);
			if (count && s[i] !== temp) {
				this.window[count] += (temp.length - s[i].length) / f[j].length;
			}
		}
	}
	
	return sa ? s : s[0];
}
function htmlentities (string, quote_style, charset, double_encode) {
// From: http://phpjs.org/functions

	var hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style),
    symbol = '';
  string = string == null ? '' : string + '';

  if (!hash_map) {
    return false;
  }

  if (quote_style && quote_style === 'ENT_QUOTES') {
    hash_map["'"] = '&#039;';
  }

  if (!!double_encode || double_encode == null) {
    for (symbol in hash_map) {
      if (hash_map.hasOwnProperty(symbol)) {
        string = string.split(symbol).join(hash_map[symbol]);
      }
    }
  } else {
    string = string.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g, function (ignore, text, entity) {
      for (symbol in hash_map) {
        if (hash_map.hasOwnProperty(symbol)) {
          text = text.split(symbol).join(hash_map[symbol]);
        }
      }

      return text + entity;
    });
  }

  return string;
}