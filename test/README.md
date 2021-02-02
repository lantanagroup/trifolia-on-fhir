## Overview

`tof.xml` is a SOAPUI project file. The tests in this SOAPUI project are intended to ensure that a given FHIR server has the capabilities necessary to be used with ToF.

The SOAPUI project contains the following tests:

### Check capabilities

Ensures that `/metadata` returns information about the FHIR server 

### Create from update

Ensures that a resource can be created using `PUT <base>/<resourceType>/<id>`

### Search

Tests that the FHIR server can be searched using query parameters

### _has

Ensures that the `_has` search parameter works as expected. This is used to find all resources references by an implementation guide in ToF.

### _include

Ensures that the `_include` search parameter works as expected.

### patch

Ensures that the FHIR server supports PATCHing resources with changes. This is used specifically by the "Bulk Edit IG" screen.

### $validate

Ensures that the server supports the ability to $validate resources.

### $meta-delete

Ensures that the server supports the custom operation for `$meta-delete`, which is used to remove security tags from resources when permissions change.

### $snapshot

Ensures that the server supports the `$snapshot` operation, which is used to generate a snapshot for base resources that don't have one alrady. This is important for the profile editor.