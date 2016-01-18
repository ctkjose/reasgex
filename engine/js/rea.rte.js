/**
 * @module RTE
 * A ContentEditable helper object
 */
 
 
 
 /**
 * constructor rte({JQueryElement} o)
 */ 
var rte = function(o){
	this.o = o;
	this.selection = null;
	this.execCommand = function(command, option){
	    this.getSelection();
		if(!this.selection) return;
		
        try{
            document.execCommand(command, false, option);
        }catch(e){
            //console.log(e)
        }
    }
	this.focus = function(){
        if(!this.o || (this.o.length <= 0)) return;
        this.o.focus();
    }
	this.getSource = function(){
        if(!this.o || (this.o.length <= 0)) return '';
        return this.o.html();
    }
	this.getSelection = function(){
		var selection = window.getSelection();
        var node = selection.anchorNode;
		
		//(node.nodeName == "#text")
		while(node && !$(node).hasClass('edit-area') ){
			node = node.parentNode;
		}
		
		this.selection = null;
		var o = $(node);
			
		if(this.o.get(0) != node){
			return;
		}
		
		this.selection = selection;
	
	}
	this.getSelectionHTML = function(){
        var html = null;
        var rng	= this.getSelectionRange();

        if(rng) {
            var e = document.createElement('div');
			e.appendChild(rng.cloneContents());
			html = e.innerHTML;
        }
    
        return html;
    }
	this.getSelectionRange = function() {
		this.getSelection();
		if(!this.selection) return null;
        var rng	= null;        
		if (selection.rangeCount > 0){
            rng = this.selection.getRangeAt(0);
        }
        
        return rng;
    }
	this.clearSelection = function(){
		this.getSelection();
		if(!this.selection) return;
		this.selection.removeAllRanges();
	}
	this.setSelectionHTML = function(html){
        this.focus();
        this.execCommand('insertHTML', html);
    }
	this.setSelectionPos = function(start, len){
		this.getSelection();
		if(!this.selection) return "";
		
		//var sel = window.getSelection();
        //sel.removeAllRanges();
		
		console.log("rte.setSelectionPos(" + start + "," + len + ")");
		var r = document.createRange();
		
		var n = (this.o.get(0).firstChild) ? this.o.get(0).firstChild : this.o.get(0);
		r.setStart(n, start);
		r.setEnd(n, start+len);
		this.selection.removeAllRanges();
		this.selection.addRange(r);
	}
	this.getSelectionText = function(){
		this.getSelection();
		if(!this.selection) return "";
		
        var selection = window.getSelection();
        if (selection.rangeCount > 0){
            return selection.toString();
        }
        return "";
    }
	
	
};