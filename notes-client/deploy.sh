set -e
echo bulid client ...
npm run build
git checkout -b gh-pages
git add -f build
git commit -m "deploy to gh-pages"
echo push to remote gh-pages
git push origin `git subtree split --prefix build`:gh-pages --force
git checkout master
git branch -D gh-pages
echo done
