form-errors
===========

[![browser support](https://ci.testling.com/loop-recur/form-errors.png)
](https://ci.testling.com/loop-recur/form-errors)
[![Build Status](https://travis-ci.org/loop-recur/form-errors.svg?branch=master)](https://travis-ci.org/loop-recur/form-errors)

A javascript object for aggregating user errors on forms.

Installation
------------

### Node
`npm install form-error`

then

`var FormError = require('form-error');`

### AMD / browser global

`bower install form-error`

then

```javascript
require.config({
  paths: {
    "form-error": "path/to/form-error",
  }
});
define(["form-error"], function (FormError) {
  //aggregate those errors.
});
```

Or, if you're stuck in the bad old days of managing dependencies by hand and
exporting dependencies through `window`

```html
<script src="path/to/form-error.js"></script>
<script> /*use window.FormError*/ </script>
```

Usage
-----

FormError doesn't help you validate your forms. It helps you aggregate the all the
validation failures you find when your users inevitably make mistakes.

All methods below return an object that is an `instanceof FormError`. They all return
new objects and have no other effects.

- `FormError(field, message)`: returns object with `field`
    as its sole own property, and an array containing just `message` as its value.
- `FormError.empty()`: returns an empty object.
- `FormError.fromObject(plainObject)`: returns a `FormError` with all of `plainObject`'s properties.
    This is particularly useful when you want to combine your own validation failures with validation
    failures returned from libraries like [sequelize](http://sequelizejs.com/docs/1.7.8/models#validations).
- `formErrorInstance.concat(otherInstance)`: returns a `FormError` that is the union of `formErrorInstance`
    and `otherInstance`. If both argument instances have the same property, that property in the result
    is the concatenation of the property values in the arguments.

    Eg: `FormError('x', 'bad').concat(FormError('x', 'good'))` is equivalent to
    `FormError.fromObject({x: ['bad', 'good']})`


Here's a bigger example illustrating how you might use this.

```javascript
function validate(user){
  return (
    user.name ? FormError.empty() : FormError('name', 'must not be blank.')
  ).concat(
    isValidEmail(user.email) ? FormError.empty() : FormError('email', 'must be a valid email address.')
  ).concat(
    isOneOf(user.gender, ['male', 'female', 'both', 'neither', 'undead', 'other']) ?
      FormError.empty() :
      FormError('gender', 'must be one of "male", "female", "both", "neither", "undead", or "other."')
  ).concat(
    isOneOf(user.occupation, ['wizard', 'programmer', 'automoton', '']) ?
      FormError.empty() :
      FormError('occpupation', 'is not recognized.')
  ).concat(
    user.gender == 'undead' && user.occupation ?
      FormError('occupation', 'is not available for the undead.') :
      FormError.empty()
  );
}

validate({gender: 'undead', 'occupation': 'surrenderer'})
/* => FormError.fromObject({
        name: ['must not be blank.'],
        email: ['must be a valid email address.'],
        occupation: ['is not recognized.', 'is not available for the undead.']
      })
*/
```

Algebraic JS
------------

`FormError`s form a monoid, and conforms to the
[fantasy land specification](https://github.com/fantasyland/fantasy-land)
for monoids.

![](logo.png)

License
-------

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

The software is provided "as is", without warranty of any kind,
express or implied, including but not limited to the warranties of
merchantability, fitness for a particular purpose and noninfringement.
In no event shall the authors be liable for any claim, damages or
other liability, whether in an action of contract, tort or otherwise,
arising from, out of or in connection with the software or the use or
other dealings in the software.

For more information, please refer to http://unlicense.org/
