---
layout: blog-post
comments: true
title: Proper GPU Usage in TensorFlow
category: programming
---

Suppose you have multiple GPU devices.

To specify a GPU to use (or specify no GPU to use), changing the `CUDA_VISIBLE_DEVICES` is dangerous, since it's an environment variable, changing which causes **side-effect**. A better way is to set (suppose we are to use `\device:GPU:1`)

    config = tf.ConfigProto()
    config.gpu_options.visible_device_list = '1'
    sess = tf.Session(config=config)
    
    with sess:
        ...  # the rest of your code.
        
This will not change the environment variable (tested), thus safe.
