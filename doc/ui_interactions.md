# Client Interactions #

This module provides basic UI interaction patterns, behaviors and functionality.

Most interactions with the UI are done using the '''Client Interactions''' module.

## A UI Intercations Controller ##

You can add a basic object to interact with the UI using the functionality provided by the '''Client Interactions'''.


### Default Hooks ###

Default Hooks are simple functions in your object that handle events triggered by UI elements or widgets.

To create a Default Hook add a function to your controller object that follows the following format: ```on<event>_<elm_name>```.

For example for the event ```change``` of a field name ```email``` we create a function name: ```onChange_email```. It would look like this:

```js

var my_controller = {

	onChange_email : function(msg){
		console.log("Email changed...");
	
		var value = this.getValue();
		if( value == "jose.cuevas"){
			alert("You are set...");
		}
	}
}
```

Valid events are "onChange", "onClick", "onBlur", "onFocus".

The functions accepts a msg object as argument. Inside your function "this" is an instance of "client_interactions_element".


## client_interactions_element ##

The ```client_interactions_element``` is a helper object to represents an element or a widget.

| Function | Description |
| -------- | ----------- |
| setValue(value) | Sets the value of the element |
| getValue() | Returns the value of the element |
| stopOtherEvents() | When in an event callback, it stops other events after the current one from executing |

## Technical Notes ##

### Install event handlers on an element ###
Installs basic hooks to broadcast events to ```rea_controller``` using the event ```"uiw_event"```.
```js
	client_interactions.installEvents(elm_name, $o);
```

### Raise an event ###
```js
	var rvalue=null; //a return value
	rea_controller.dispatchEvent("uiw_event", {"action": evt_name,"name": elm_name, "event": e, "node": $o, "rvalue":rvalue} );
```

