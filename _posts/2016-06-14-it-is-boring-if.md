---
layout: blog-post
comments: true
title: It is Boring, if......
---


The algorithm of constructing EFT is simple, as follow. (Remark that this algorithm holds not only for fields, but also for any other physical object which has a _spectrum_.)

1. Propose the fields and their types (such as tensor, or spinor) that the theory involves; and symmetries that the theory must keep. This can be *guessed* via physical situation.

2. Write down the *most general* action constructed by those fields, satisfying all symmetry restrictions in 1, with a UV and IR cut-off of the spectra of fields. Usually, this action has infinitely many terms; but not always so.

3. By re-definitions of quantities in the action, s.t.:
	1. the UV cut-off is re-defined to unit;
	2. the action is *numerically* invariant;
	3. the re-definitions of field-configurations does not change the integral-measurement in path-integral,
and may also s.t.:
	4. the action is invariant in its form.
	
4. By 3, the energy-scale of the physical process the theory describes (which is of the order of the UV cut-off) does *not* appear explicitly in the action. But, the coefficients in the action now is implicitly UV cut-off dependent. This dependence can effect which terms dominate the theory and which are negligible under a given energy-scale of physical process. (For different energy-scale, it maybe different terms that dominate.)

	This is how you construct and reduce your theory. Next is how to determine your theory further by experiments.

5. First pick out the dominate term, neglecting others; do calculation with it; comparing your results with experiments, fixing the parameters (now you have the least number of parameters).

6. If it fits, that OK. If not, then involve the sub-dominate term into your calculation, still neglecting others that were neglected. Then re-do all the procedure, to see if your theory fits the experiments.

7. Re-do step 6 again and again, until it does fit, or until your theory contains so many parameters so that it is "non-trust-able".


P.S. for 3 and 4:

> For a given set of values of coefficients of the terms the action involves, which dominate and which are negligible (in 4)? This can be given by numerical computation. This is why we do the re-definitions (in 3) so as to eliminate (all, if we can) redundant parameters; it reduces the redundant numerical computations caused by running over the parameter-space of the redundant ones.



So, this is the "truth" we are seeking for. If so, it's boring.
