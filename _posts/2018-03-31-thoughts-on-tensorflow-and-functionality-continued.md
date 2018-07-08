---
layout: blog-post
comments: true
title: Thoughts on TensorFlow and Functionality (Continued)
category: programming
---

Following [this blog](https://shuiruge.github.io/programming/2018/02/10/thoughts-on-tensorflow-and-functionality/).

One way of recoving the functionality in tensorflow is the [`edward.copy`](http://edwardlib.org/api/ed/copy) trick.

For instance, consider the hard-coded "function" `y(x)` in tensorflow:

    import numpy as np
    import tensorflow as tf

    x = tf.constant(2.0)
    y = 3 * x
   
For making the `y` a function of an abstract `x`, we employ the `edward.copy` trick:

    import edward as ed
    
    def y_fn(x_var, x=x, y=y):
        """Function version of `y`, with the `x_var` an abstract argument."""
        y_var = ed.copy(y, {x: x_var},
                        scope='functionality')
        return y_var
        
This makes the functionality forsooth. E.g.,

    xs = tf.constant([float(i) for i in range(100)])
    ys = tf.map_fn(y_fn, xs)
    
    with tf.Session() as sess:
        writer = tf.summary.FileWriter('./logdir', sess.graph)
        ys_value = sess.run(ys)
        print(ys_value)
        
Since `tf.map_fn` accept a function as its first argument, `y_fn` does be so. In addition, by visualizing the computational graph with TensorBoard, we find that `tf.map_fn` does map `y_fn` as a function, without any redundancy like re-copying.
