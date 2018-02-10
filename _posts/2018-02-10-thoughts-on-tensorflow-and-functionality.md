---
layout: blog-post
comments: true
title: Thoughts on TensorFlow and Functionality
category: programming
---

Recently, I've read the [`learning-to-learn`](https://github.com/deepmind/learning-to-learn), including its codes and paper. It's aiming at designing a general optimizer, like `tf.train.AdamOptimizer`, not by human, but instead by machine.

The idea herein is simple. First we construct a trainable (rather than a fixed as usual) optimizer, naturally a recurrent neural network (RNN), since optimization process is sequential. The parameters of the RNN are opened up and trainable. Next, we construct a performance (or say, loss), which, also naturally, is the total loss along the optimization sequence. Verily, a better optimizer expects a smaller total loss. Then all is done. We train the parameters in the optimizer as a RNN by gradient descent as usual. They did so on dataset like CIFAR-10 with some specific model. As a result, it is found that the trained optimizer can be roubustly generalized to other datasets and models.

Let `f(theta, D)` the loss of some specific model with parameter `theta`, and `D` some dataset. Let `m(phi)` the trainable optimizer, as a RNN, with `phi` its paramters, trainable. It accepts a gradient of `f` and returns a difference of `theta`, telling how `theta` should be updated in the optimization proess. The total loss `L`, as the loss for training `m`, is

    n_iters = ...  # The number of iterations of the optimization of `f`.

    def L(phi, n_iters=n_iters):

        # Initialize
        theta = ...
        total_loss = f(theta, D)
        
        for i in range(n_iters):
            theta += m(phi)(theta)
            total_loss += f(theta, D)

        return total_loss

And then we use gradient descent method to train the `phi`, like

    best_phi = argmin(L, method='gradient_descent')
    
This looks simple and dull, but challangeable in TensorFlow. Indeed, in TensorFlow, the general work-flow likes:

    graph = ...

    with tf.graph.as_default():

      model = ...
      
      theta = tf.Variable(...)
      data = tf.placeholder(...)
      targets = tf.placeholder(...)

      predictions = model(data, theta)
      loss = tf.reduce_sum(tf.square(predictions - targets))
        
      ...  # Optimizer, train-Op, etc.

    with tf.Session(graph=graph) as sess:
      ...  # initialization, run the train-Op iteratively, etc.
      
As you see, the `loss` (the `f` in our notations) is not a function, as the name "loss-function" promises, but a quantity (a `Tensor` explicitly). However, in the training of the RNN optimizer in the previous, the `theta` that feeds into the loss `f` is not a trainable (i.e. `Variable`), but non-trainable and is kept updating by `m(phi)`. This demands that, if you use this loss-quantity in training the RNN optimizer, you have to inspect the code and try to substitude the `theta` from `tf.Variable(...)` to `tf.placeholder(...)`. This is what `learning-to-learn` have done, by employing a magic: the `mock` module. However, this is forbidden by your elegent programming habit: package codes and then treat as a black box.

A preferable way of implemeting this is using function. That is, using an "operation constructor", like the `tf.multiply`. For instance,

    def make_loss(theta, data, targets, model, name=None)
      """Implements the loss `f`, as an operator constructor."""
      
      # Some pre-defined function, for checking tensor, shape, dtype, etc.
      # This function substitudes the function `tf.convert_to_tensor`, which
      # will convert trainable tensor to non-trainable.
      check_arguments(theta, data, targets) 

      with tf.name_scope(name, 'loss', [theta, data]):
        # Just copy-and-paste the previous codes
        predictions = model(data, theta)
        loss = tf.reduce_sum(tf.square(predictions - targets))
          
      return loss
      
    graph = ...
    
    with graph.as_default():
    
      model = ...

      theta_var = tf.Variable(...)
      data = tf.placeholder(...)
      targets = tf.placeholder(...)
      loss = make_loss(theta_var, data, target, model)
      
      ...  # Optimizer, train-Op, etc.

    with tf.Session(graph=graph) as sess:
      ...  # initialization, run the train-Op iteratively, etc.
      
The `loss` now becomes a reusable function. For instance, if we expect `theta` a `tf.placeholder`, then just

    with graph.as_default():
    
      theta_ph = tf.placeholder(...)
      new_loss = make_loss(theta_ph, data, target, model)
      
This process create a new sub-graph in the `graph`, wherein the common parts, i.e. the `data`, `target`, and `model`, are reused.

In the end, a piece of codes declares what I mean:

    import numpy as np
    import tensorflow as tf

    def my_multiply(x, y, name=None):
      """Returns an `Op` for `x * y + 2`."""
      with tf.name_scope(name, 'my_multiply', [x, y]):
        return tf.multiply(x, y) + 2.

    graph = tf.Graph()

    with graph.as_default():
        xs = [
            tf.placeholder('float32', shape=[], name='x_1'),
            tf.Variable(initial_value=1.5, name='x_2'),
        ]
        y = tf.placeholder('float32', shape=[], name='y'),
        my_multiply_ops = [my_multiply(x, y) for x in xs]

        init = tf.global_variables_initializer()

    with tf.Session(graph=graph) as sess:
      sess.run(init)
      writer = tf.summary.FileWriter('logs', sess.graph)

      vals = sess.run(my_multiply_ops, feed_dict={xs[0]: 1., y: 2.})
      print(vals)

      writer.close()

which returns `[array([4.], dtype=float32), array([5.], dtype=float32)]`, as expected. You can simply copy-and-paste, and then run it. With running in terminal `tensorboard --logdir=logs`, can you visualize the graph, showing up what I said forsooth.

PS: About the style, the [official documentation](https://www.tensorflow.org/community/style_guide#python_operations) is highly suggested. It leaks nothing but one point, that is the usage of `tf.convert_to_tensor`. It convert trainable tensor to non-trainable, which is not preferable.
