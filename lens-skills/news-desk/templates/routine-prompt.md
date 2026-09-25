Run today's <BRAND> news desk.

You are working in a fresh checkout of <REPO URL>. Get today's date with
`date -u +%Y-%m-%d` and use it throughout.

1. Preconditions. Make sure you are on an up-to-date `<DEFAULT BRANCH>`. Check
   that `.lens/news-desk.json` exists. If it doesn't, stop, write nothing, open
   no pull request, and end with the single line
   `BLOCKED: news desk not set up`.
2. Read `.lens/news-desk.json` and follow the news-desk process exactly: scan
   the configured sources for the last 48 hours, score against the configured
   rubric, and post only if a story clears the bar. The rules override
   everything else. No post beats a weak post. Every fact is verified at a
   primary source you opened in this run. Never claim first-hand experience.
   Never push to `<DEFAULT BRANCH>`.
3. Avoid duplicates. Read the ledger and the titles of existing posts, and
   treat every story in an open pull request titled with the configured
   prefix as already covered.
4. No-post days. If nothing clears the bar, change nothing in the repo. No
   branch, commit or pull request. Just finish with the summary in step 6.
5. Post days only. Install dependencies, run the configured build and
   `node <check_script> <post>`, and make sure all of them pass, including
   every required translation. Commit the post, its translations and the
   ledger update on a branch with the configured prefix, push, and open a
   pull request with the configured title.
6. Finish with a short summary: the story chosen (or `no post`) and its
   score, the pull request URL if there is one, and every rejected candidate
   with its score and a one-line reason.
