# Trifolia-on-FHIR

## Running
1. Modify configuration to specify server port and authentication
2. Compile Angular2 application with `ng build` or `ng build --watch` for development
    1. The results of `ng build` are stored in the wwwroot folder, which is served by the server in the next step.
3. Run the server with `node server.js`

## Deploying

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

## FHIR assets and versioning

* FHIR profiles and value sets are stored in src/assets/<VERSION>
* Handling multiple FHIR versions is required in both the server and client
    * *src/app/services/fhir.service.ts*: The client creates a Fhir class (from FHIR.js) and loads it with the appropriate resources for the selected FHIR version
    * *fhirHelper.js*: The server also creates a Fhir class in the same way, depending on which server is specified in the headers of each request. **Improvements are needed here for caching instances of Fhir so that it does not need to be re-created for each request**
* A different screen may be loaded depending on the FHIR server by creating a wrapper component. Example of this is in src/app/capability-statement-wrapper
    * The capability-statement-wrapper contains two sub-components (one for DSTU3 and one for R4)
    
## TODO

* Allow the user to specify the templates to use for their FHIR IG Publisher build package, instead of what is provided by default.
* ImplementationGuide
    * When creating a page, a Binary resource is created to represent the page. Delete the Binary resource if the ImplementationGuide is not saved when the user leaves the screen.
    * Consider, instead, creating a contained resource for the Binary page.
* tools/publish.ps1 and tools/installPackages.ps1
    * The script should copy the client.zip file to the root directory of the server, so that we don't assume the wwwroot folder already exists