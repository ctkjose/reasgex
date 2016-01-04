<?php

class js {
	public static function encode($s){
		$o = '';
		if(is_string($s)){
			$o = str_replace('"', "\\\"", $s);
			$o = str_replace("\t", "\\t", $o);
			$o = str_replace("\n", "\\n", $o);
			$o = str_replace("\r", "\\r", $o);
			$o = "\"{$o}\"";
		}elseif(is_bool($s)){
			$o = ($s) ? 'true' : 'false';
		}elseif(is_numeric($s)){
			$o = $s;
		}elseif(is_array($s)){
			$o = self::encodeArray($s);
		}elseif(is_null($s)){
			$o = 'null';
		}
	
		return $o;
	}
	public static function encodeArray($s){
		$out = [];
		foreach($s as $k => $v){
			$o = self::encode($v);
			$out[] = $k . ': ' . $o;
		}
		
		$o = implode(', ', $out);
	}
}
