---
layout: blog-post
comments: true
title: Name Scope and Variable Scope
category: programming
---


```python
import collections
import tensorflow as tf
```


```python
# Util

def get_dependent_variables(tensor):
  """Returns all variables that the tensor `tensor` depends on.
  
  Forked from: https://stackoverflow.com/a/42861919/1218716
  
  Args:
    tensor: Tensor.
    
  Returns:
    List of variables.
  """
  # Initialize
  starting_op = tensor.op
  dependent_vars = []
  queue = collections.deque()
  queue.append(starting_op)
  op_to_var = {var.op: var for var in tf.trainable_variables()}
  visited = set([starting_op])

  while queue:
    op = queue.popleft()
    try:
      dependent_vars.append(op_to_var[op])
    except KeyError:
      # `op` is not a variable, so search its inputs (if any). 
      for op_input in op.inputs:
        if op_input.op not in visited:
          queue.append(op_input.op)
          visited.add(op_input.op)

  return dependent_vars
```

## Implicit Variables

In TensorFlow, the parameters are implicitly involved in a function. For instance, the weights and biases in `tf.layers.dense`. Now suppose you have defined a function by composition of `tf.layers.dense`, like


```python
def f(x):
  hidden = tf.layers.dense(x, 256, activation=tf.nn.relu)
  return tf.layers.dense(hidden, 1, activation=None)
```

And you employ this function 


```python
x = tf.placeholder(shape=[None, 64], dtype='float32', name='x')
y = f(x)
```

The variables are implicit forsooth:


```python
get_dependent_variables(y)
```




    [<tf.Variable 'dense_1/bias:0' shape=(1,) dtype=float32_ref>,
     <tf.Variable 'dense_1/kernel:0' shape=(256, 1) dtype=float32_ref>,
     <tf.Variable 'dense/bias:0' shape=(256,) dtype=float32_ref>,
     <tf.Variable 'dense/kernel:0' shape=(64, 256) dtype=float32_ref>]



## When Using Variable-scope

Sometimes we want to reuse the variables. The implicitness of them forces the non-triviality of the reuse. Indeed, we have to employ a `tf.variable_scope`:


```python
def f(x, reuse=None):
  with tf.variable_scope('f', reuse=reuse):
    return tf.layers.dense(x, 1, activation=tf.nn.relu)
```

Since the `reuse` flag in `tf.layers.dense` e.t.c. defaults to be `None`, inheriting the `reuse` of the variable-scope it locates in, this implementation simply reuse those implicit variable in the dense-layers.


```python
y_1 = f(x, reuse=tf.AUTO_REUSE)
y_2 = f(x, reuse=tf.AUTO_REUSE)
print(get_dependent_variables(y_1) == get_dependent_variables(y_2))
```

    True


## When NOT Using Variable-scope

It seems that it's convenient to substitute `tf.name_scope` and to use `tf.variable_scope` instead everywhere. This is NOT true.

Suppose we want to pass a function `f(x; w)` into two operators `g` and `h`, both of which accept a function and return a new function, and to make the variable `w` reused.


```python
# Wrong implementation

def g(f):
  def _g(x):
    with tf.variable_scope('g'):
      return f(x) + 1
  return _g

def h(f):
  def _h(x):
    with tf.variable_scope('h'):
      return f(x) + 2
  return _h
```

We would expect that the variable in `f` is reused if the `reuse` flat is set to `tf.AUTO_REUSE`. But the fact is not so:


```python
_f = lambda x: f(x, reuse=tf.AUTO_REUSE)
z_1 = g(_f)(x)
z_2 = h(_f)(x)
```


```python
print(get_dependent_variables(z_1) == get_dependent_variables(z_2))
```

    False


Let's check reason explicitly:


```python
get_dependent_variables(z_1)
```




    [<tf.Variable 'g/f/dense/bias:0' shape=(1,) dtype=float32_ref>,
     <tf.Variable 'g/f/dense/kernel:0' shape=(64, 1) dtype=float32_ref>]




```python
get_dependent_variables(z_2)
```




    [<tf.Variable 'h/f/dense/bias:0' shape=(1,) dtype=float32_ref>,
     <tf.Variable 'h/f/dense/kernel:0' shape=(64, 1) dtype=float32_ref>]



As it's seen, the additional variable-scopes of "h" and "g" are pre-pended to the variable-scope of "f", and then renamed the variables. When the computer tried to reuse the variables named "f/dense/...", but now with "g/" pre-pended, later in operator `h()`, it found different names (i.e. "h/f/dense/..."). By the definition of `tf.get_variable()`, it created new variables instead of reusing the created.

In this case, we shall use `tf.name_scope` to group together the node in the graph, instead of using `tf.variable_scope`:


```python
# Correct implementation

def g(f):
  def _g(x):
    with tf.name_scope('g'):
      return f(x) + 1
  return _g

def h(f):
  def _h(x):
    with tf.name_scope('h'):
      return f(x) + 2
  return _h
```


```python
_f = lambda x: f(x, reuse=tf.AUTO_REUSE)
z_1 = g(_f)(x)
z_2 = h(_f)(x)
```


```python
get_dependent_variables(z_1)
```




    [<tf.Variable 'f/dense/bias:0' shape=(1,) dtype=float32_ref>,
     <tf.Variable 'f/dense/kernel:0' shape=(64, 1) dtype=float32_ref>]




```python
get_dependent_variables(z_2)
```




    [<tf.Variable 'f/dense/bias:0' shape=(1,) dtype=float32_ref>,
     <tf.Variable 'f/dense/kernel:0' shape=(64, 1) dtype=float32_ref>]




```python
print(get_dependent_variables(z_1) == get_dependent_variables(z_2))
```

    True


Now as expected forsooth.

