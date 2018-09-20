# Trifolia-on-FHIR

## Running
1. Run npm install
2. Modify configuration to specify server port and authentication
3. Compile Angular2 application with `ng build` or `ng build --watch` for development
    1. The results of `ng build` are stored in the wwwroot folder, which is served by the server in the next step.
4. Run the server with `node server.js`

## Deploying

Requirements:
* [Java](https://www.java.com/en/download/) - to run the ig publisher
* [Jekyll](http://jekyll-windows.juthilo.com/2-jekyll-gem/) - to run the ig publisher without errors
    * Jekyll must be available to the user that is running the Node.JS server. Consider adding the Ruby installation directory to the global PATH.
* Node.JS

1. Run `ng build -prod`
    1. This will build the client application in production mode, making the packages much smaller. However, debugging a "prod" build is nearly impossible...
2. Run `powershell tools\publish.ps1`
    1. This will create the client.zip and server.zip packages in the "dist" folder and copy the dist folder to the server
    2. You must be connected to VPN and have access to the \\DEV7 file system as an admin to have the copy succeed
3. Login to server and run `powershell .\installPackages.ps1` as an administrator

## Features/functionality
* FHIR Versions
    * DSTU3
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
| ImplementationGuide | X | X | X | X | DSTU3 | | | |
| StructureDefinition | X | X | X | X | DSTU3 | | | Element definitions support both DSTU3 and R4. Other properties in StructureDefinition may be different for R4. |
| ValueSet | X | X | X | X | DSTU3 | $expand | .compose.include.concept.designation | |
| CodeSystem | X | X | X | X | DSTU3 | | | |
| CapabilityStatement | X | X | X | X | DSTU3, R4 | | | |
| OperationDefinition | X | X | X | X | DSTU3 | | | |

## Additional

See the [WIKI](https://github.com/lantanagroup/trifolia-on-fhir/wiki) for more information.
