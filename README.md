# Library - Labyrinth
Generate labyrinth on based method backtracking.

To use, create an instance of the object and use method "generate" for create maze matrix.

```javascript
let lab = new Labyrinth();
let mtx = lab.generate();

// Preview example default 11x11
[
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

```

The constructor accepts an object with the following parameters.

| Name | Value | Description |
| ------ | ------ | ------ |
| width | 7 | The width of the maze should be an odd number and greater than seven. |
| height | 7 | The height of the maze should be an odd number and greater than seven. |
| border | 0 | A number for the outer border. |
| inside | 1 | A number for the inner border. |
| starting | lt | The starting position for creating the maze. lt - Left top, rt - Right top, lb - Left bottom, rb - Right bottom, cc - Center). |

An example of using the settings.

```javascript
let lab = new Labyrinth({
    width: 21,
    height: 15,
    border: 0,
    inside: 1,
    starting: 7
});
```

Also, the matrix size can be specified in the "generate" method.

```javascript
let mtx = lab.generate(21, 15);
```

Preview example in realisation.

![labyrinth](https://user-images.githubusercontent.com/44906253/55749441-95920d00-5a49-11e9-9dcb-e2f3a6be2cf1.png)
