set -e
echo bulid client ...
cd notes-client
npm run build
cd ..
git checkout -b gh-pages
git add -f notes-client/build
git commit -m "deploy to gh-pages"
echo push to remote gh-pages
git push origin `git subtree split --prefix notes-client/build`:gh-pages --force
git checkout master
git branch -D gh-pages
echo done
