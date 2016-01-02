
### Buttons ###

Use class ```btn```

These color classes are available: ```blue```, ```lblue```, ```orange``` and ```red```.

Optionally: To style the button use one of these classes:
```btn-default```, ```btn-primary```, ```btn-success```, ```btn-info```, ```btn-warning```, ```btn-danger```

Optionally: To change the size of the button use one of the classes:
```btn-xs```, ```btn-sm```, ```btn-lg```
	
Use class ```disabled``` to make button disabled.

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



