<script
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
  type="text/javascript">
</script>
# Playing Guess the Number with an optimal opponent

While preparing for quant interviews, one of my friends gave me the following question: "Your opponent chooses an integer from 1 to $$n$$, and if you guess it right you win that amount of dollars. Given that your opponent plays optimally, what is your expected profit?"

For example, say your opponent chooses $$n-1$$. Then if you happen to guess $$n-1$$, you get $$n-1$$ dollars (which is pretty rewarding for huge $$n$$!). So how do we solve this problem?

The point of this game is that your opponent is playing the best they can; that is, they are playing in a way that minimizes your profit. Thus, they cannot favor one number more than usual, otherwise we can exploit them by picking that number over and over (assuming we're able to determine it). 

Let's say our opponent picks number $$i$$ with probability $$p(i)$$. Then our "edge" in picking number $$i$$ is the expected profit in picking it, or $$i*p(i)$$. In order to make sure we cannot exploit the game, our opponent who is playing optimally will seek to minimize the largest "edge" we can get. Therefore, they make our "edge" $$i*p(i)$$ equal across all $$1\le i\le n$$, and since we know $$\sum_i p(i) = 1$$ we can now determine our opponent's distribution (here, $$H_i$$ is the $$i$$th Harmonic number).
<p style="text-align: center;">$$p(i) = \frac{1}{iH_i}$$</p>

That means, for $$n=10$$, we can expect to gain $$H_{10}^{-1}\approx 34$$ cents every game. That isn't much, but it's also hard to guess the number exactly... so let's make it so the player receives $$k$$ dollars if they guess $$k$$ and the opponent picks a number that is greater than or equal to $$k$$. What would be the expected result of this game?

Now our "edge" from picking number $$i$$ goes from $$E_{old}(i) = i*p(i)$$ to $$E(i) = \sum_{j=i}^n i*p(j)$$. To solve, we once again set all $$E(i)$$ equal:
<p style="text-align: center;">$$E(i) = E(i+1)$$</p>
<p style="text-align: center;">$$\sum_{j=i}^n i*p(j) = \sum_{j=i+1}^n (i+1)*p(j)$$</p>
<p style="text-align: center;">$$i * p(i) = \sum_{j=i+1}^n p(j)$$</p>

Thus $$p(1) = p(2)+\dots+p(n)$$, $$p(2) = p(3)+\dots+p(n)$$, which imply $$p(1) = 2p(2) = 4p(3) = \dots = 2^{n-1}p(n)$$. Solving yields $$p(i) = 2^{-i}$$, which is certainly a nice answer. The expected profit from this game is calculated to be 1 dollar. We could've seen this right at the start, however. Since our "edge" should be the same across all $$i$$, our expected profit is just $$E(1) = \sum_{j=1}^n p(j) = 1$$. 