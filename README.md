# Trifolia-on-FHIR

[![Build Status](https://travis-ci.org/lantanagroup/trifolia-on-fhir.svg?branch=master)](https://travis-ci.org/lantanagroup/trifolia-on-fhir)


## Requirements

* Angular CLI (for compiling) - See note above in "Running"
* [Java](https://www.java.com/en/download/) - to run the ig publisher
* [Jekyll](http://jekyll-windows.juthilo.com/2-jekyll-gem/) - to run the ig publisher without errors
    * Jekyll must be available to the user that is running the Node.JS server. Consider adding the Ruby installation directory to the global PATH.
* Node.JS (version 10+)

## Building/Running

```bash
npm install             # install node modules
ng build client         # build the client application (output to dist/client)
ng build server         # build the server application (output to dist/server)
or alternatively npm run build-watch:all # build the client, server, and tools application concurrently (output to dist/server)
cd dist/server          # working directory should be the output of the server
node main.js            # run the server application, which also hosts the client application
```

### Developers

```bash
ng build server --watch
ng build client --watch
```

Changes during development should be applied to the `development` branch. Once they are QA'd and approved, they are merged into the `master` branch and a release is made based on the master branch.

## Configuration

The configuration files are in the dist/server/config directory. You may create a local.json file that overwrite default.json properties. Alternatively, you may create an environment-specific config file and use the NODE_ENV environment variable to indicate the name of the environment.

Example:
```
dist/server/config/production.json
NODE_ENV=production
```

### Using NGINX as a reverse proxy for ToF

There are some rules in NGINX that are specific for WebSoocket to work properly. Specifically (proxy_http_version 1.1 & proxy_set_header Connection "Upgrade"). These are used to ensure that websocket will communicate through the proxy seemlessly to the upstream server.

Comments are in the configuration below to help illustrate the intent of each directive.

```
server {
        listen 80;
        server_name tof.example.com;

        location / {
                # Always return HTTPS
                return 301 https://$host$request_uri;
        }
}

server {
        listen          443 ssl;
        server_name     tof.example.com;
        error_log       /var/log/nginx/trifolia-fhir-error.log warn;
		
        location / {
                proxy_pass          http://someserver.local:49366;

                proxy_http_version  1.1;                                          # Because the WebSocket protocol uses the Upgrade header
                proxy_set_header    Host              $host;                      # Pass the proxied address to the upstream server
                proxy_set_header    X-Real-Ip         $remote_addr;               # Pass the origianl IP of the client
                proxy_set_header    X-Forwarded-For   $proxy_add_x_forwarded_for; 
                proxy_set_header    X-Forwarded-Proto $scheme;                    # Pass original protocol
                proxy_set_header    Upgrade           $http_upgrade;              # Upgrade connection if needed (needed by Websocket)
                proxy_set_header    Connection        "Upgrade";                  # Needed for WebSocket as an upgrade to HTTP protocol

                proxy_read_timeout  600s;                                         # Timeout for larger files

                proxy_buffers       16 4k;                                        # Buffers for larger files
                proxy_buffer_size   16k;

                client_max_body_size 200M;                                        # Request Entity Too Large
        }
}
```

### Authentication

See the Wiki's [Authentication](https://github.com/lantanagroup/trifolia-on-fhir/wiki/Authentication) page for information on how to configure authentication in ToF. 

## FHIR Server Requirements

* Must be either an STU3 or R4 server
* Must support creating resources via a PUT with an ID
* Must support the $validate operation
* Must support the $meta-delete operation
* Must support ImplementationGuide search query parameters:
  * resource
  * global
* Must support _has (reverse chaining) search criteria. For example: GET /StructureDefinition?_has:ImplementationGuide:resource:_id=<IG_ID>
* Must support _include search criteria to get a list of all resources related to an implementation guide. For example: GET /ImplementationGuide?_id=some-ig-id&_include=ImplementationGuide:resource&ImplementationGuide:global

## Features/functionality
* FHIR Versions
    * STU3
    * R4
* Switch between FHIR servers
* OAuth2 Authentication
* Person resource created for user
    * May eventually be used to auto-populate certain fields, or audit modifications to resources
* Export
    * Create FHIR IG Package from IG
    * Execute against FHIR IG Publisher (with options)
* Import (single resource text or multiple files)
* Open from file system, save back to file system
* Type-aheads for value set and code system selection
* Selection based directly on value sets from FHIR specification

### Resource UI Support

| Resource | Create | Edit | Save | Validate | Versions | Additional | Not supported | Notes |
| -------- | ------ | ---- | ---- | -------- | ------ | ------ | ----- | ------ |
| ImplementationGuide | X | X | X | X | DSTU3, R4 | | | |
| StructureDefinition | X | X | X | X | DSTU3, R4 | | | Element definitions support both DSTU3 and R4. Other properties in StructureDefinition may be different for R4. |
| ValueSet | X | X | X | X | DSTU3, R4 | $expand | .compose.include.concept.designation | |
| CodeSystem | X | X | X | X | DSTU3, R4 | | | |
| CapabilityStatement | X | X | X | X | DSTU3, R4 | | | |
| OperationDefinition | X | X | X | X | DSTU3, R4 | | | |
| Questionnaire | X | X | X | X | DSTU3, R4 | | | |

## Additional

See the [WIKI](https://github.com/lantanagroup/trifolia-on-fhir/wiki) and [Help Documentation](https://trifolia-fhir-dev.lantanagroup.com/help) for more information.
