Title: Exploring Interaction Effects in Ensemble Models
Author: Seppe "Macuyiko" vanden Broucke
Date: 2018-10-02 20:10
Subtitle: Using Friedman's H-statistic

Over the past months, both R and Python focused data science practioners have picked up on a [paper by Friedman and Popescu](https://arxiv.org/pdf/0811.1679.pdf) from 2008 entitled Predictive Learning Via Rule Ensembles. Interestingly enough, the "meat" of the paper -- at least in the context we'll discuss here -- is found in the latter half, where a helpful statistic is proposed to assess interaction effects between variables in an ensemble model [^fn1].

Together with feature importance rankings, getting an idea of which variables interact is an effective means to make black-box models more understandable.

The reason why I initially became interested in an idea was in a setting where a well-performing random forest model had to be converted to a (hopefully just as well performing) logistic regression model for deployment reasons. In this setting, getting some insights from the ensemble model in terms of which variables to keep is a good starting point.

## The Basic Idea

Let us begin with outlining some basic concepts first, assuming some knowledge regarding predictive (ensemble) models.

First, there's the idea of **feature importance ranking**. We don't necessarily need it to discuss the remainder of this post, though it's still a good idea to discuss it as we'll see later where it falls short.

Say you have trained a complex ensemble model (e.g. a random forest containing a couple hundred decision trees) and you want to get an idea of which features were "important" in the model. In a univariate setting, one might simply take a look at a χ2 test or correlations, though given how a base learner like a decision tree is good to pick up on non-linearities, most practitioners prefer to "let the model do the talking" instead.

A common method to do so is to use a particular implementation of "feature importance" based on "permutations". The idea is as such. Say you've just trained a model using a feature set X, row/column indexed as X[i,j]. To assess the importance of a variable j, we can compare a metric of interest (accuracy or AUC, or anything else really) on X with a modified instance of X, X', where we shuffle the column j.

This idea was already described by [Breiman and Cutler in their original random forest paper](https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf). In other words, the idea is to permute the column values of a single feature and then pass all samples back through the model and recompute the accuracy (or AUC, or R2, or...) The importance of that feature is the difference between the baseline and the drop in overall accuracy caused by permuting the column. The more important that feature was for the model, the higher the drop in accuracy will be.

This is a very simple mechanism, though computationally expensive, but very much -- again -- the preferred approach in practice. In fact, alternative implementations such as "drop-column" importance have been proved to be quite biased (wrong, even) in many implementations, also see [this fantastic post from earlier 2018](http://explained.ai/rf-importance/index.html#5). I fully recommended going to the post, in fact, if you've been using feature importance in your working, as many implementations (both in R and Python) will default to using the biased technique. Let me even go ahead and quote:

> The scikit-learn Random Forest feature importance and R's default Random Forest feature importance strategies are biased. To get reliable results in Python, use permutation importance, provided here and in our `rfpimp` package (via pip). For R, use importance=T in the Random Forest constructor then type=1 in R's importance() function. In addition, your feature importance measures will only be reliable if your model is trained with suitable hyper-parameters.

In Python, take a look at [eli5](https://eli5.readthedocs.io/en/latest/index.html) to get solid feature importance rankings. An implementation in [scikit-learn](http://scikit-learn.org/stable/modules/generated/sklearn.model_selection.permutation_test_score.html) is also available, though a bit more cumbersome. (Also see [this issue on GitHub](https://github.com/scikit-learn/scikit-learn/issues/11187).)

To get back on track, the permutation based feature importance ranking is solid and easy to understand, with the drawback that it is quite computationally expensive. A theme which will remain for other things we'll visit in this post as well, though which is a fair constraints whilst in the "model inspection" phase of your model development pipeline. (Jeremy Howard has also spoken quite a bit about this topic in the latest fast.ai courses on structured machine learning, and also indicates that sampling is fine... you're doing inspection after all.)

As a final note, it's even better to use out-of-bag (OOB) or a validation set to assess feature importance rankings, though I've commonly encountered usage of the training set as well (again, we're not necessarily trying to assess generalization performance, we just want to get an insight on our model, based on how -- and on which data -- it was trained).

## The Trouble with Single-variable Importance Rankings

Feature importance rankings are great, but they're not all-revealing. A common practice for instance is to use random forests or other ensemble models as a feature selection tool by first training them on the full feature set, and then using the feature importance rankings to select the top-n variables to keep in the productionized model (and hence retraining the model on the selected model). Think data-driven feature selection. This is a somewhat common approach which has been operationalized in packages such as [Boruta](https://cran.r-project.org/web/packages/Boruta/index.html).

The problem, however, is that it is easy to drop features using this strategy in case when they interact with other features.

As an example, let us construct a synthetic data set where `y ~ x0 * x1 + x2 + noise`. I.e. x0 and x1 interact. If we train a random forest or gradient boosting model even such a simple data set and assess the feature importance scores using scikit-learn, the problem becomes clear:

	gradient boosting rankings:		[ 0.3536106   0.31387868  0.33251072]
	random forest rankings:			[ 0.19048085  0.18652217  0.62299698]

Again, as we've stated, one needs to be careful using feature importance implementations as-is, but especially the random forest rankings show a skewed view: variable x2 gets all the attention whilst the importance of the first two variables seems rather weak.

Nevertheless, by just looking at our data and plotting x0 and x1 versus the target (colored), we do see a strong interaction effect:

![x0 and x1 interact with the target](/images/2018/hstat1.png)

The question is now how we can uncover such effects by stepping beyond feature importance. One idea we could explore is to modify the feature importance mechanism by permuting more than one variable at once.

This is an interesting idea not widely explored in practice (it's funny how even practioners never step outside of the even rudimentary bounds implementations are offering), though might nevertheless become wieldy for data sets with a considerable amount of features.

(As an aside, for ensemble models using decision trees as their base learner, i.e. the majority, other interesting investigations such as looking at the number of times a feature appears over the trees and how high it appears in the trees can provde valuable insights as well. [Airbnb already played around with such ideas in 2015](https://medium.com/airbnb-engineering/unboxing-the-random-forest-classifier-the-threshold-distributions-22ea2bb58ea6). It speaks highly to their engineering team that they were working on such things before "interpretable machine learning" was rediscovered by the rest of the community.)

There is an alternative offered by Friedman and Popescu, however, which can be implemented in a more systematic manner, and what we will focus on hereafter. First, we need to introduce two further closely related concepts.

## Partial Dependence Plots

Knowing which features play an important role is helpful. But the next question one will be asked is commonly "why" or "how" these are important. An easy mistake to make is to think linearly and to think that if x goes up, y will go up (or down), though this ignores all those non-linear effects these black-box models are so good at extracting.

Instead, it makes more sence to draw up a **partial dependence plot**. The basic idea is simple as well. Given a variable j you are interested in (e.g. one established as being important, though any works), we construct a synthetic data set as follows:

- For all variables k =/= j, we take their average value (or mode, for categoricals)
- Next, we "slide" over the variable j between its min and max values observed in the data
- Note that this can either be grid based (e.g. a stepwise slide), or based on the actual values observed in the data
- In any case, we ask the model to predict a probability for each row in our synthetic data set (average values are constant for all k =/= j and different values for j) and plot the results

The idea is to get a [ceteris paribus](https://en.wikipedia.org/wiki/Ceteris_paribus) effects plot for this variable.

Trying this on our synthetic data set, we get:

![Partial dependence plots for each variable](/images/2018/hstat2.png)

This idea works well in practice, though basically suffers from the same drawback as feature importance: we're looking at the ceteris paribus effect per variable, in a univariate manner. Indeed, looking at the partial dependence plots above, one might get the impression that the effects of x0 and x1 are "less strong" than x2. This is a dangerous mistake to make. In general, one should understand that if you see a relationship, this indeed indicates presence of an effect on the target, though absence of a relationship does not indicate absence of an effect. It might even occur for very strong interaction effects than one observes a flat line for the variables involved in the interaction in the partial dependence plots, even though those variables together do impose a strong effect on the target.

Again, people have been aware of this drawback for quite a while. [Forest floor](http://forestfloor.dk/) was one of the first to pick up on this in the R world (since 2015 and a [paper in 2016](https://arxiv.org/abs/1605.09196)), and produced a package to plot two-way interaction effects. [The pdp R package](https://cran.r-project.org/web/packages/pdp/pdp.pdf) does something similar.

The idea remains the same: keep everything ceteris paribus except for -- now -- two variables which we assess over a grid, either stepwise generated or based on the real values observed in the data.

Nevertheless, this is somewhat limited to two dimensions only; for three-way interaction effects and higher, one needs to get quite creative with colors and shapes to visually inspect the results.

## ICE (Individual Conditional Expectation) Plots

**ICE plots** are a newer though very similar idea to partial dependence plots, but offer a bit more in terms of avoiding the "interaction" trap.

The idea here is not to average over variables k =/= j outside the variable of interest, but instead to keep every instance as is and slide over variable j of interest. Every original observation in the data set at hand is hence duplicated and slided over for every potential value of variable j, again either over a grid or based on the values observed in the data. The idea is then to plot a separate line for each original observation as we slide through the values of j.

This allows us to easily spot deviations across different segments of our population. For instance, this is the ICE plot for sliding over x0 in our synthetic data set:

![ICE plot for x0](/images/2018/hstat3.png)

This is a very powerful concept, as it allows us to get the best results so far in a univariate setting. First, in case there are interaction effects (or general instabilities in predictive results) present, we can observe this in the ICE lines being "spread out" over the different values of j.

(Note: it is common practice to "center" the ICE lines at zero to make this comparison easier, as seen in the picture.)

Second, we can stil easily extract a general partial dependence style plot by averaging over each value of j, as displayed by the center yellow line in the picture above.

(Not that there would necessarily be any guarantee for this average ICE line to be the same as the partial dependence plot as described above. It depends somewhat on the intricacies of the learner, though averages are such a... well, central, concept in virtually all learners that the results will be virtually similar. Again, this would make for a nice topic to explore further both from an empirical and theoretical perspective.)

In any case, we now have the building blocks required to finally delve into what we're interested in here. As one can observe, ICE plots are better suited to warn a user against interpreting a "partial dependency", though can still make it quite hard to uncover the full extent of interactions. Again, when limiting oneself to the setting of two dimensions, the concept of ICE plots is easily ported. This is the result for x0 * x1, for instance. The ICE plot clearly indicates the presence of an interaction, as would a standard partial dependence plot:

![ICE plot for x0*x1](/images/2018/hstat4.png)

Though again, the question remains: how do we systematically extract deeper interactions, given that visualizations cannot help us much in this setting [^fn2]?

## Implementations in R

As is common -- and this isn't a particularly popular statement these days -- R is ahead in terms of picking up on "bleeding edge" ideas, at least those with roots in statistics. Not surprisingly, there are 

[^fn1]: Or in fact any predictive model.

[^fn2]: "Deep" being a quip to deep learning, of course. One could argue that the bulk of deep learning consists of (i) extracting very non-linear effects, (ii) extracting very deep interactions [^fn3] and (iii) performing complex feature transformations.

[^fn3]: There is a lot of folklore around how deep interactions can go. Some practitioners indicate that everything beyond two-way interactions is either non-existent or simply a sign of overfitting when working with real-life data. Often the same practitioners who indicate that most data sets are linearly separable anyway. For most industry-based tabular data sets, I'm in fact still inclined to believe them, though exceptions can and do make the rule.
