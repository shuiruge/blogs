---
layout: blog-post
comments: true
title: Name Scope and Variable Scope
category: programming
---

Suppose you want to define a function `f(x, w)`, where `x` is an input and `w` a parameter (maybe trainable). For instance, `f(x, w)` is a neural network, with `x` the inputs` and `w` the weights. In TensorFlow, parameters of function are implicit, and you cannot directly get or set the parameters like the weights and biases in `tf.layers.dense`.

# TODO
