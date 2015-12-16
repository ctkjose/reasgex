

```
	/api/<scope>/<controller>/<action>/
```

```
	/api/<scope>/<controller>/<action>/?<arguments>
```

### Arguments ###

Use ```api-return``` to set the output format.

```any``` Payload is returned as is.
```json``` Payload is json encoded.
```jsonp``` A js callback as defined by the argument ```api-callback```.
```php``` A php serialized data.


Arguments can be send as standard HTTP value pairs using GET/POST.

A json payload can be send in the argument ```api-json-data```.

