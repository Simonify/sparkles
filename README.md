# sparkles
A vanilla canvas based lib for DOM sparkles ported from [jQuery-canvas-sparkles](https://github.com/simeydotme/jQuery-canvas-sparkles) *Based on v1.0.1*

### Disclaimer
I've removed/added a few methods which I find making more sense to this lib.

## Install
You can install via npm or via Bower, query-object is also provided as AMD if you use requireJS:

```javascript
npm install sparklesjs
bower install sparklesjs
```

## Usage
Simply pass in a valid DOM node as the first argument. The sparkles effect is triggered by hovering the element.
If you provide an element which isn't appendable (Such as an img or input) the canvas will be placed right after the element.

```javascript
new Sparkles(document.querySelector('.element'), options);
```

## Methods
This is where this lib differs from the original one (*Based on v1.0.1*)

### Start
Starts the sparkles effect manually:

```javascript
var element = new Sparkles(document.querySelector('.element'));
element.start();
```

### Stop
Stops the sparkles effect manually:

```javascript
var element = new Sparkles(document.querySelector('.element'));
element.stop();
```

### Update (object)
Accepts an object to update the current instance of Sparkles:

```javascript
var element = new Sparkles(document.querySelector('.element'), {
  color: '#ffffff'
});

element.update({
  color: 'rainbow'
});
```

### Remove
Removes all event listeners from the current Sparkles instance:

```javascript
var element = new Sparkles(document.querySelector('.element'));
element.remove();
```

## Options
You can provide an object with the options you would like to define for the Sparkles instance:

```javascript
new Sparkles(DOMnode, {
  color: '#000000',
  count: 30,
  direction: 'both',
  minSize: 4,
  maxSize: 7,
  overlap: 0,
  speed: 1
})
```

### Color (string|array)
Accepts a HEX string, a 'rainbow' string (which will basically randomize the color), or an array or HEX strings to pick through.

```javascript
color: '#ffffff'

color: 'rainbow'

color: ['#ffffff', '#000000']
```

### Count (integer)
An integer of sparkles to be rendered on that element. Be careful to not chunk up the canvas with sparkles.

```javascript
counter = 10
```

### Direction (string)
Accepts a string of 'up', 'down' or 'both' to set which direction the sparkles will travel in.

```javascript
direction: 'up',

direction: 'down',

direction: 'both'
```

### MinSize/MaxSize (integer)
Accepts an integer for both min/max to set the size in pixels of the sparkles. Sizes are randomized between min and max.

```javascript
minSize: 1,
maxSize: 10
```

### Overlap (integer)
Defines the overlap limit where sparkles can move away from the canvas

```javascript
overlap: 10
```

### Speed (integer|float)
Defines the sparkles moving speed multiplier.

```javascript
speed: 2.3
```

## Browser Support
<table>
  <tbody>
    <tr>
      <td><img src="http://ie.microsoft.com/testdrive/ieblog/2010/Sep/16_UserExperiencesEvolvingthebluee_23.png" height="40"></td>
      <td><img src="http://img3.wikia.nocookie.net/__cb20120330024137/logopedia/images/d/d7/Google_Chrome_logo_2011.svg" height="40"></td>
      <td><img src="http://media.idownloadblog.com/wp-content/uploads/2014/06/Safari-logo-OS-X-Yosemite.png" height="40"></td>
      <td><img src="http://th09.deviantart.net/fs71/200H/f/2013/185/e/b/firefox_2013_vector_icon_by_thegoldenbox-d6bxsye.png" height="40"></td>
      <td><img src="http://upload.wikimedia.org/wikipedia/commons/d/d4/Opera_browser_logo_2013.png" height="40"></td>

    </tr>
    <tr>
      <td align="center">9+</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
    </tr>
  </tbody>
</table>

## License

[MIT License](http://mit-license.org/)
