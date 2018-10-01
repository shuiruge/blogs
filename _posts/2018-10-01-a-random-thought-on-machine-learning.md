---
layout: blog-post
comments: true
title: A Random Thought on Machine Learning
category: programming,machine-learning
---


It should be kept in mind that machine-learning is auxiliary, helping us solve problem by computationally searching the representation-space of the proposed form of solution. **Once found, the solution can never be promised as the most optimized.**

Indeed, the optimization algorithm cannot ensure the most optimized. So is the universality of the representation of solution. Combination of the both aspects causes further problem. Enlarging the power of representation makes the optimization harder. C.f. [this notebook](https://github.com/shuiruge/generative_models/blob/master/related_topics/Reusing%20Pre-trained%20Sub-graph.ipynb).

So, what we are doing is adjusting the algorithm, so that the loss, if having any physical meaning, or the error, e.g. in the classification tasks, decreases further and further, without a promise of the ending.

**And machine-learning is not made for the task, e.g. solving equations like ODEs, seeking for a unique, thus the most optimized, solution.**
