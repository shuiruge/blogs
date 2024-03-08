---
layout: blog-post
title: 城市的物流成本
---

最近看了 G. B. West 推导代谢率随生物尺寸变化的幂律公式（[West, 1997](https://www.science.org/doi/10.1126/science.276.5309.122)）。我开始思考另外一个例子：物流系统。

从工厂或大仓将货物运送到城市的各个角落。首先是通过高速路运送到主要城市（主动脉），然后分发到区县（次级动脉），再分发到乡镇或街道，最后分发到各户人家（毛细血管）。

每一个城市的物流范围正比于城市（作为行政区域）尺寸的平方。这是因为地图是二维的。例如呼伦贝尔市的尺寸很大，它下面有很多的县城，即便它的城区（海拉尔区）非常小。而上海的尺寸就很小。一个城市里，每一个区县的物流范围正比于区县（作为行政区域）尺寸的平方。以此类推。令 $l_k$ 表示第 $k$ 级的尺寸，那么它的物流范围就是 $l_k^2$。在这个级别，一共有 $n_k$ 个物流区域（如 $n_2$ 个区县），那么总物流范围就是 $n_k l_k^2$。因为总物流范围不随级别变化，它就是总共的值，所以 $n_k l_k^2 \equiv n_{k+1} l_{k+1}^2$。对于生物的循环系统来说，范围是三维的，所以 $n_k l_k^3 \equiv n_{k+1} l_{k+1}^3$。推而广之，对 $d$ 维的范围来说，

$$ \frac{l_{k+1}}{l_k} \equiv \left( \frac{n_{k+1}}{n_k} \right)^{-\frac{1}{d}}. $$

另外，因为货车的总数保持不变，至少在量级上是近似保持不变的，那么在每次从 $k$ 级到 $k+1$ 级时，货车分流了，但总数不变。也就是说总数 $n_k f_k \equiv n_{k+1} f_{k+1}$ 对所有 $k$ 成立，其中 $f_k$ 表示 $k$ 级公路上的货车流量（单位时间内通过的货车数量）。即

$$ \frac{f_{k+1}}{f_k} \equiv \left( \frac{n_{k+1}}{n_k} \right)^{-1}. $$

假设最大的分级为 $C$，也就是 $k = 0, \ldots, C$，那么 $k=C$ 就代表最小细粒度，也就是家庭。而 $n_C$ 就表示家庭的个数，这正比于城市人口。接下来，我打算考察随着城市人口的增加，物流成本如何变化。

这里有三个不变量。第一个是每个家庭的物流需求，$f_C$。这是因为人们上网买东西的频率不会因为城市的扩张而（明显）变化。另一个是人们去快递站点取货的距离，$l_C$。这是因为人们一般是步行去拿快递，距离太远会很不方便。所以 $l_C$ 的值应该在一个固定的范围内，在农村这个值略大，在城市里则略小。第三个不变量是 $n_0=1$。

我们假设：$\nu_k := n_{k+1} / n_k$、$\lambda_k := l_{k+1} / l_k$ 以及 $\phi_k := f_{k+1} / f_k$ 都不依赖于 $k$，即 $\nu$、$\lambda$ 和 $\phi$。这个假设的含义是，物流系统具有分形结构，像西兰花那样，每一个小瓣都像是西兰花自身。这是最小化交通成本导致的，就像在生物的循环系统中最小化血液阻力，产生了血管的分形结构一样。详情参阅 West 的那篇论文或他的科普书[《规模》](https://book.douban.com/subject/30244461/)。

总的运输消耗为 $\sum_{k=0}^C n_{k} f_{k} l_{k}$。根据上面的假设，总运输消耗就可以写成 $f_C l_C \sum_{k=0}^C \nu^k (\phi \lambda)^{k-C}$。上文中我们已经知道 $\phi = \nu^{-1}$，$\lambda = \nu^{-1/d}$，因此总运输消耗变为 $f_C l_C \nu^{C (1+1/d)} \sum_{k=0}^C \nu^{-k/d}$。这个等比级数等于 $f_C l_C \nu^{C (1+1/d)} \left( 1 - \nu^{-C/d + 1} \right)\left( 1 - \nu^{-1/d} \right)$。因为 $\nu > 1$，所以当 $C \gg 1$ 时，它约等于 $f_C l_C \nu^{C (1+1/d)} / (1-\nu^{-1/d})$。此外，人口总数正比于 $n_C = \nu^{C-1}$。这意味着，存在幂律形式

$$ \text{总运输消耗} \propto \text{总人口数}^{\alpha}, $$

其中 $\alpha = 1+1/d$。对于二维的城市来说，$\alpha=3/2$。也就是说，随着城市人口的增加，总运输消耗的增速大于人口增速。

在推导过程中，我们做了近似。例如，当货车进入乡镇或街道时，车的尺寸显然变小了。不过，从量级上看，近似是合理的。车子虽然变小了，但是载货量并没有差很多个量级（例如一百倍）。