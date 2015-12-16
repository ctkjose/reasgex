### Assets ###

You place js, css, images and other files in your ```assests``` folder.

You can create a ```js``` folder inside your ```assests``` to organize your content even more. You can also do the same with ```css``` and a ```media``` folder for images and others things.

You can access your ```assets``` using the following url:

/assets/```appname```/```file.js```

/assets/```appname```/```css/file.css```

You can use the following short-forms for your ```js```, ```css```, and ```media``` folders using the following urls:

/js/```appname```/```file.js```

/css/```appname```/```file.css```

/media/```appname```/```file.png```


### Controller File ###

An application folder needs at least one controller file.

The name of a controller file is made up of a ```name``` followed by ```.controller.php```. For Example ```myapp.controller.php```.

The ```name``` of your controller is the same as the name of your controller class.

For example if my controller class is named ```employee``` then the controller file is named ```employee.controller.php```.

IMPORTANT: It is crucial that you follow this convention to ensure that the framework can use your controllers.

### Controller ###

A controller file always declares a namespace. The namesapce must be the ```appname```.

A controller class extends from ```\reasg\app\controller```.

A controller class must implement a ```init($values)``` and ```main($values)``` functions.

```php
namespace myapp;

class employee extends \reasg\app\controller {
	public function init($values){
		print "--- @employee->init() ---\n";
	}
	public function main($values){
		print "--- @employee->default() ---\n";
	}
}
```

