<?php
namespace reasg\core;

class controller {
	use \reasg\core\ObjectBase, \reasg\core\ObjectExtendable;
	
	private $event_map = array();
	function on($evtName, $callBackMethod, $evtData=NULL, $callbackName=NULL){
		///N:Allows others to register for an event.
		$this->event_map[$evtName][] = array('callback'=> $callBackMethod, 'data'=> &$evtData, 'name' => $evtName);
	}
	function dispatchEvent($evtName, $param=array()){
		///N:Raises an event, the event gets send to observers registered for this event
		if(!array_key_exists($evtName, $this->event_map)) return;
		foreach( $this->event_map[$evtName] as $entry){
			$param['evtData'] = $entry['data'];
			$m = $entry['callback'];
			call_user_func_array($m, $param);
		}
	}
	function off($evtName, $callbackName=null) {
		if(is_null($callbackName)) {
			$this->event_map[$evtName] = array();
		} else {
			foreach($this->event_map[$evtName] as $id => $callback) {
				if($callback['name'] == $callbackName) {
					unset($this->event_map[$evtName][$id]);
				}
			}
		}
	}
}