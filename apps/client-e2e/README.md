For the client/browser application to work, it needs the server. There is a lot of information provided to the browser application from the server, such as the FHIR models and the conformance statement for the selected FHIR server.

The proxy.conf.json file tells "ng" (angular) to proxy requests to /api to a different server. You can either:

1. Run the server on your own machine and make sure the proxy.conf.json file redirects requests from /api (in the client/browser application) to the server you are running.
2. Update the proxy.conf.json to point to a publicly available DEV server. Note that the e2e tests *will* modify data on the server, so make sure you don't point it to a production server.

The apps/client-e2e/protractor.conf.js file contains a "baseUrl" property that tells Protractor what the starting location of the application should be. This can be either a locally-running installation of the client/browser application (supported by a server), or it can point to a public DEV installation of ToF (ex: https://trifolia-fhir-dev.lantanagroup.com).

## Running e2e tests using command-line

The e2e tests can be run from the command line using `ng e2e`

This will automatically build & host the client/browser application first, and then use that for the e2e tests.

## Running e2e tests using WebStorm

1. Edit the debug configurations
2. Create a new "Protractor" configuration called "Client Tests"
3. The configuration file should point to the apps/client-e2e/protractor.conf.js file

Now you can debug the "Client Tests" build, and create breakpoints in the various tests.
