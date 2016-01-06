# Client Interactions #

This module provides basic UI interaction patterns, behaviors and functionality.

Most interactions with the UI are done using the <b>Client Interactions</b> module.

## An UI Intercations Controller ##

You can add a basic javascript object to interact with the UI using the functionality provided by the <b>Client Interactions</b>.

In your PHP backend you add the javascript file with your object using the following code:

```php
$f = \reasg\appBundle::create("test", "@assets");
\reasg\client_controller::importController('employee_controller', $f->js->child('employee.controller.js')->url);		
```
Notice we use ```appBundle``` to access our app files. In this case a ```employee.controller.js``` inside our ```assets``` folder.

Then we call ```client_controller::importController("controller_name", "file_url")``` to actually add our javascript file.

### Default Hooks ###

Default hooks are simple functions in your object that handle events triggered by UI elements or widgets.

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

The functions accepts a ```msg``` object as argument. Inside your function ```this``` is an instance of ```client_interactions_element```.


## client_interactions_element ##

The ```client_interactions_element``` is a helper object to represents an element or a widget.

| Function | Description |
| -------- | ----------- |
| setValue(value) | Sets the value of the widget |
| getValue() | Returns the value of the widget |
| stopOtherEvents() | When in an event callback, it stops other events after the current one from executing |
| preventDefault() | Stops propagation of DOM events on the element, prevents the default action |
| focus() | focus the element, operates on "this" |
| attr(name, value) | sets an attr on the element |
| attr() | gets an attr on the element |
| html(value) | sets the contents of the element |
| html() | gets the contents of the element |
| val(value) | sets the value of the element |
| val() | gets the value of the element |

## Using client interactions in your php backend ##

Client interactions allows write basic interactions from your php backend.

You will use this functionality mainly to interact with a running application.

```php
$ui = $app_controller->client();
		
$ui->showAlertError("This is an alert!"); //bootstrap alert div
$ui->showMessage("Hello world"); //js alert()
		
$ui->onChange("emp_lname")->displayMessage("This value can not be changed")->this->focus()->done();
```

Returning and populating a view with a dataset.
```php

$a = ['start_date'=> '09/22/2015']; //you can have as many fields

$ui = $app_controller->client();
$ui->showAlertError("Incorrect start date. Field set to original hire date.");
$ui->populateSelectorWithDataset("employee", $a);
```

| Verb | Description |
| ---- | ----------- |
| onChange("elm_name") | Starts a set of verbs for the event "change" of the given element/widget. Use ```done()``` to terminate the set. |
| done() | Ends a set of verbs on an event. |
| displayMessage(string) | Shows a js alert() |
| displayAlert(string) | Shows a bootstrap alert div |
| this | reference the element of this event. An instance of ```client_interactions_element```. You can only use functions of ```client_interactions_element```. |
| populateSelectorWithDataset("name", hash) populateSelectorWithDataset("name", ui_datasource) | Populates a view with an array or a datasource. |

## Technical Notes ##

### client_action ###

A string pointing to a backend controller action:
```js
"@(/scope/controller/action)"
"@(controller/action)"
"@(action)"
```
A string pointing to a url:
```js
"url(http://localhost/url)"
```

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

