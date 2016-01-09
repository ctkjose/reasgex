### Buttons ###

Use class ```btn```

These color classes are available: ```blue```, ```lblue```, ```orange``` and ```red```.

Optionally: To style the button use one of these classes:
```btn-default```, ```btn-primary```, ```btn-success```, ```btn-info```, ```btn-warning```, ```btn-danger```

Optionally: To change the size of the button use one of the classes:
```btn-xs```, ```btn-sm```, ```btn-lg```
	
Use class ```disabled``` to make button disabled.

### Textbox ###

```html
<input class='text' name='field01'>

<input class='email' name='user_email'>

<input class='password' name='user_pass'>

```
Notice we use the ```class``` attribute instead of the regular ```type``` attribute.


### Checkbox ###

Shorthands for checkboxes and radios let you create multiple options with only one div entry by using the ```checkbox``` or ```radio``` class.

```html
<div class='checkbox' name='field01' default='1' options='{"1":"Option 1", "2":"Option 2"}'></div>
```

```html
<div class='radio' name='field02' default='1' options='{"1":"Option 1", "2":"Option 2"}'></div>
```

Use the ```options``` attribute to specify a ```json``` with a list of value pairs used to create multiple options.

The ```default``` attribute sets the initial value.

```html
<div class='checkbox yesno' name='field02' default='1'></div>
```

Add the class ```yesno``` to create a basic "Yes"/"No" pair. A ```yesno``` will use the values "0" and "1".

```html
<div class='checkbox bool' name='field02' default='1' label='Enabled'></div>
```
The ```bool``` class defines a basic checkbox. You specify a caption using a ```label``` attribute. A ```bool``` checkbox will either have a value of "0" or "1".

Use &quot; to escape double quotes on options or in your ```label``` attribute.

## Switch ##

The switch is a checkbox substitude for simple yes no option. The switch always use a ```1``` or ```0``` value.  

```html
<div class='switch' name='field_enabled' default='1'></div>
```

```html
<div class='switch' name='field_yesno' default='1' label-yes='Yes' label-no='No'></div>
```

```html
<div class='switch' name='field_keep' default='1'>
	<i class="fa fa-check label-yes" title="Keep Record"></i>
	<i class="fa fa-trash label-no" title="Delete Record"></i>
</div>
```

## Select ##

```html
<div class='select size-auto' name='cities' default='ag' options='{"ag":"Aguadilla", "mc":"Moca", "ri" : "Rincon", "my" : "Mayaguez"}'></div>
```
We use the ```default``` attribute to set the initial value.

Use the attribute ```options``` to populate the list of options with a ```json``` of key-value pairs.

You can also bind the select to a datasource:
```html
<div class='select size-auto' name='fld_town01' default='ag' datasource='cities'></div>
```
A select field will bind to an entry named ```options``` in the specified datasource. The ```options``` entry is a list of key-value pairs.

## Buttons ##

```html 
<button class='btn' name='btn-save'>Save</button>
```

Use any of the Bootstrap classes 'btn-default', 'btn-primary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger' to style the button or use one of these corresponding color classes 'blue', 'green', 'lblue', 'orange', 'red'.

Add a ```confirm``` attribute to prompt the user to accept the action of the button.
```html 
<button class='btn lblue' name='btn-save' confirm="Do you want to save this record?">Save</button>
```

Send an action to your backend using the ```action-with-data``` attribute.

```html 
<button class='btn lblue' name='btn-save' confirm="Do you want to save this record?" action-with-data="@(save)">Save</button>
```
In this sample the ```save``` action of your current backend controller will be called and the form data sent to it.

To send an action without data use the attribute ```action```.



## Forms ##

### Header Row ###

Use a div with class ```header``` to create a new row.


### Form Rows ###

Use a div with classes ```form row``` to create a new row.

Add a label using the attribute ```data-label```.

```html
<div class="form row" data-label='Name:'>
	<input type='text' class='form-control' name='emp_name' placeholder='Employee name' data-validate="empty" data-error-message="Please provide a name">
</div>
```

If no label is given with ```data-label``` or an actual ```<label>``` element the row will be indented without a label. To have a row without a label and the indentation add the class ```without-label```.

```html
<div class="form row without-label">
	<input type='text' class='form-control' name='emp_name' placeholder='Employee name' data-validate="empty" data-error-message="Please provide a name">
</div>
```


## Section ##

A div with class ```section``` to create a panel like area.

Use the classes ```with-border``` and ```round``` to style the section.

Create section header with a div using the class ```header```. You can style a header div with the class ```grey```.

Define the body of a section with a div using the class ```body```. A section body may also have headers inside.

Create section footer with a div using the class ```footer```.


## Technical Notes ##

### Attributes Used ###

| Attribute | Used By | Value | Description |
| ---------- | ---------- | :------- | :---------|
| data-type | engine | "text", "bool", "date" | |
| data-ignore |engine | 1-0 | ignored when reading values |
| default | user | text | default value shown, value returned on empty check/radios |
| uiwd | engine | "text" | type of data provided by a widget |

### Classes Used ###
| Attribute | Used By | Description |
| ---------- | ---------- | :---------|
| uiw | engine | identifies a widget |
| uiwc | engine | identifies a widget container |
| uiwe | engine | identifies a child element of a widget |
| uiwd-* | engine | "text", "checkbox", "radio", "html", "date" |
