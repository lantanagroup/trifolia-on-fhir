FROM node:16-alpine AS build-ToF

# Python and G++ are required for some of the node devDependencies
# Java is required for Trifolia-on-FHIR to "Publish" implementation guides
# (Java is used to executed the FHIR IG Publisher)
RUN apk add --no-cache --virtual .gyp make py3-pip gcc g++ openjdk8-jre build-base fontconfig

RUN mkdir /build

WORKDIR /build

# Only copy the package definitions at first, so that Docker uses a cached version
# of the image when possible. Docker only updates the cached version when the package
# definition files change.
COPY package.json /build/
COPY package-lock.json /build/

RUN npm ci --verbose

# Docker should (most of the time) skip the above (when rebuilding) and go straight here
# where actual code files have changed, and need to be re-built.
COPY . .

RUN ./node_modules/.bin/nx dep-graph --file dep-graph.json

# Need --max_old_space_size to allocate more ram to node when building. Without it,
# you get an error "Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory"
RUN node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build client --prod
RUN node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build server --prod
RUN node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build tools --prod

RUN npm prune --production

FROM node:16-alpine

# Install ruby, open-jdk
RUN apk update && apk --update --no-cache add ruby-full ruby-dev build-base openjdk8-jre
# Install fonts that are used by ig publisher. Without these, ig publisher throws a bunch of exceptions
RUN apk add --no-cache fontconfig ttf-dejavu
RUN gem install sassc -- --disable-march-tune-native
RUN gem install jekyll bundler --no-document
RUN jekyll -v

COPY --from=build-ToF /build/dist/. /ToF/
COPY --from=build-ToF /build/node_modules/. /ToF/node_modules/

VOLUME /ToF/apps/server/logs
VOLUME /ToF/apps/server/igs

WORKDIR /ToF/apps/server

EXPOSE 49366

ENTRYPOINT ["node", "main.js"]
