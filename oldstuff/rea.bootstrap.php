<?php
class rea_bootstrap_view extends rea_view {
	public function getHTML(){
		$html = parent::getHTML();
		return $html;
	}
}

class rea_ui_data_model {
	var $fields = array();
	
	function set(){
		
		$c = func_num_args();
		if($c < 1) return;

		if($c == 1){
			$x = func_get_arg(0);
			if(is_array($x)){
				foreach($x as $k => $v){
					$this->fields[] = array( 'name'=> $k, 'value'=> $v , 'attr'=> array() );
				}
			}elseif(is_string($x)){
				$this->fields[$x] = $x;
			}else{
				
			}
		}elseif($c == 2){
			$k = func_get_arg(0);
			$v = func_get_arg(1);
			
			$this->fields[] = array( 'name'=> $k, 'value'=> $v , 'attr'=> array() );
		}elseif($c == 3){
			$k = func_get_arg(0);
			$v = func_get_arg(1);
			$a = func_get_arg(2);
			if( !is_array($a) ){
				$a = array( $a );
			}
			
			$this->fields[] = array( 'name'=> $k, 'value'=> $v , 'attr'=> $a );
		}
		
		return $this;
	}
	function setAttributeForKey($k, $a){
		foreach($this->fields as $i => $e){
			if($e['name'] == $k){
				$this->fields[$i]['attr'][]= $a;
				break;
			}
		}
		
	}
	function __construct(){
		
	}
}
class rea_ui_view {
	var $html = '';
	var $data = array();
	var $name = '';
	var $backend_url = REA_SELF_URL;
	public function setElementValue(){
		
		$c = func_num_args();
		if($c < 1) return;

		if($c == 1){
			$x = func_get_arg(0);
			if(is_array($x)){
				foreach($x as $k => $v){
					$this->data[] = array( 'name'=> $k, 'value'=> $v);
				}
			}elseif(is_string($x)){
				$this->data[] = array( 'name'=> $x, 'value'=> $x);;
			}else{
				
			}
		}elseif($c == 2){
			$k = func_get_arg(0);
			$v = func_get_arg(1);
			
			$this->data[] = array( 'name'=> $k, 'value'=> $v );
		}
		
		return $this;
	}
	public static function createFromFile($path) {
		if( substr($path, 0,1) != '/'){
			$path = REA_SELF_DIRECTORY . $path;
		}
		
		$a = new rea_ui_view;
		$a->html = file_get_contents($path);
		$a->name = str_replace('.', '_', str_replace('.html', '', basename($path)));
		
		return $a;
	}
	
	public function getHTML(){
		
		$payload = array('name'=> $this->name, 'backend_url' => $this->backend_url);
		
		$s.= "<script type='text/javascript'>\n";
		$s.= "rea_views.view_options[\"{$this->name}\"] = " . json_encode($payload) . ";\n";
		
		if(!empty($this->data)){
			$s.= "rea_views.setViewDataFromJSON(\"{$this->name}\", " . json_encode($this->data) . ");\n";
		}
		$s.= "</script>";
		
		
		return $this->html . $s;
	}
	
}
class rea_ui_glue extends rea_template {
	var $target_node = null;	
	var $init_actions= '';
	var $js_stack = '';
	var $js_buff = '';
	function input($sel){
		$this->js_buff .= "bs_helper_view.target = \$(\"input[name={$sel}]\");\n";
		return $this;
	}
	function widget($sel){
		
		$this->js_buff.= "\$(\"{$sel}\")";
		return $this;
	}
	function disable(){
		if(empty($this->target_node)) return $this;
		$this->js_buff.= '.prop( "disabled", true); '; 
		$this->js_stack.= $this->js_buff  . "\n";
		$this->js_buff = '';
	}
	function enable(){
		if(empty($this->target_node)) return $this;
		$this->js_buff.= '.prop( "disabled", false); '; 
		$this->js_stack.= $this->js_buff  . "\n";
		$this->js_buff = '';
	}
	function value($v){
		if(empty($this->target_node)) return $this;
		$this->js_buff.= ".val(\"{$v}\");"; 
		$this->js_stack.= $this->js_buff  . "\n";
		$this->js_buff = '';
	}
}


?>