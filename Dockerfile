FROM node:10-alpine AS build-ToF

# Python and G++ are required for some of the node devDependencies
# Java is required for Trifolia-on-FHIR to "Publish" implementation guides
# (Java is used to executed the FHIR IG Publisher)
RUN apk add --no-cache --virtual python make .gyp gcc g++ openjdk8-jre build-base

RUN mkdir /build

WORKDIR /build

# Only copy the package definitions at first, so that Docker uses a cached version
# of the image when possible. Docker only updates the cached version when the package
# definition files change.
COPY package.json /build/
COPY package-lock.json /build/

RUN npm ci

# Docker should (most of the time) skip the above (when rebuilding) and go straight here
# where actual code files have changed, and need to be re-built.
COPY . .

# Need --max_old_space_size to allocate more ram to node when building. Without it,
# you get an error "Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory"
RUN node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build client --prod
RUN node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build server --prod
RUN node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build tools --prod

RUN npm prune --production

FROM node:10-alpine

RUN apk update && apk --update add ruby-full ruby-dev build-base
RUN gem install jekyll bundler
RUN rm -rf /var/cache/apk/*

RUN mkdir -p /ToF/client && mkdir /ToF/server && mkdir /ToF/tools

USER 1000

COPY --from=build-ToF --chown=1000:1000 /build/node_modules/. /ToF/node_modules/
COPY --from=build-ToF --chown=1000:1000 /build/dist/apps/client/. /ToF/client/
COPY --from=build-ToF --chown=1000:1000 /build/dist/apps/server/. /ToF/server/
COPY --from=build-ToF --chown=1000:1000 /build/dist/apps/tools/. /ToF/tools/

WORKDIR /ToF/server

EXPOSE 49366

ENTRYPOINT ["node", "main.js"]
