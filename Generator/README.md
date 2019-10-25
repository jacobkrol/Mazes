# Mazes: Generator

This showcases an animation of the sequence used to generate mazes using a recursive backtracker of a depth-first search. The speed of the animation can be adjusted using the frames per second variable, and the size of the maze can be adjusted using the scale value.

**Speed**: modify the `fps` variable declared in the `onload` function at the top of the program to adjust the speed of the animation. The default value is 25, while it can be adjusted to a range of 1 to 60 to modify the tracing rate.

**Size**: modify the value passed as a parameter into the `setup` function, called in the `onload` function at the top of the program to adjust the maze dimensions of the animation. The default value is 15, while it can be adjusted to a value as low as 1 and up to 400 theoretically, the best display and performance are between 10 and 75.
