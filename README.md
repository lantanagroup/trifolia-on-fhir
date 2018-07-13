# Trifolia-on-FHIR

## Running
1. Modify configuration to specify server port and authentication
2. Compile Angular2 application with `ng build` or `ng build --watch` for development
    1. The results of `ng build` are stored in the wwwroot folder, which is served by the server in the next step.
3. Run the server with `node server.js`

## Features/functionality
* Select server
* OAuth2 Authentication
* Export
    * Create FHIR IG Package
    * Execute against FHIR IG Publisher
* Import (TODO)
* Type-aheads for value set and code system selection

### Resource UI Support

| Resource | Create | Edit | Save | Validate | Additional | Not supported |
| -------- | ------ | ---- | ---- | -------- | ---------- | ----- |
| ImplementationGuide | X | X | X | X | | |
| StructureDefinition | X | X | X | X | | |
| ValueSet | X | X | X | X | Expand | ValueSet.compose.include.concept.designation |
| CodeSystem | X | X | X | X | | |
| CapabilityStatement | X | X | X | X | | |
| OperationDefinition | X | X | X | X | | |