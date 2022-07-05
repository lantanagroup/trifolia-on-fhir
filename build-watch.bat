node ./node_modules/concurrently/dist/bin/concurrently.js "ng build server -c development --poll 1000 --watch" "ng build client -c development --poll 1000 --watch"
