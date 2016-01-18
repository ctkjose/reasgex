build = {
	"actions" : [
		{"action": "copy", "source": "engine/js/rea.ui.widget.src.core.js", "dest": "engine/js/rea.ui.widgets.min.js"},
		{"action" : "append","dest" : "engine/js/rea.ui.widgets.min.js",'source' : "engine/js/",'name_match' : "rea\.ui\.widget\.src\.ui\_[A-Za-z\_\.0-9]+\.js"},
		{"action" : "minify","file" : "engine/js/rea.ui.widgets.min.js"}
	],
}