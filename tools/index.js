"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const removeExtensions_1 = require("./removeExtensions");
const permissions_1 = require("./permissions");
const Yargs = require("yargs");
const argv = Yargs
    .command('modify-permission <server> <modify> <type> <permission> [id]', 'Adds a permission to one or all resources', (yargs) => {
    yargs
        .positional('server', {
        describe: 'The FHIR server',
        required: true
    })
        .positional('modify', {
        describe: 'Whether ot add or remove the permission',
        choices: ['add', 'remove'],
        required: true
    })
        .positional('type', {
        describe: 'The type of permission type grant/revoke',
        choices: ['everyone', 'group', 'user'],
        required: true
    })
        .positional('permission', {
        describe: 'The permission type to grant/revoke (read vs. write)',
        choices: ['read', 'write'],
        required: true
    })
        .positional('id', {
        describe: 'If the type is not everyone, this is the ID of the group or user to add the permission for'
    })
        .option('allResources', {
        describe: 'DANGEROUS: Grant this permission to all resources. Either this or "resourceType" and "resourceId" are required.',
        boolean: true,
        conflicts: ['resourceType', 'resourceId']
    })
        .option('resourceType', {
        describe: 'The resource type for the resource to grant/revoke the permission to/from',
        implies: 'resourceId',
        conflicts: 'allResources'
    })
        .option('resourceId', {
        describe: 'The id of the resource to grant/revoke the permission to/from',
        implies: 'resourceType',
        conflicts: 'allResources'
    });
}, (argv) => {
    if (argv.modify === 'add') {
        const addPermission = new permissions_1.AddPermission(argv);
        addPermission.execute();
    }
    else if (argv.modify === 'remove') {
        const removePermission = new permissions_1.RemovePermission(argv);
        removePermission.execute();
    }
})
    .command('remove-extensions [server]', 'Removes specified extensions from the resources on the server', (yargs) => {
    yargs
        .positional('server', {
        describe: 'The FHIR server to remove extensions from the resources on',
        required: true
    })
        .option('extension', {
        alias: 'e',
        multiple: true,
        default: ['https://trifolia-fhir.lantanagroup.com/stu3/StructureDefinition/github-path']
    })
        .option('excludeResourceType', {
        alias: 'r',
        multiple: true,
        default: ['ImplementationGuide']
    });
}, (argv) => {
    const removeExtensions = new removeExtensions_1.RemoveExtensions(argv);
    removeExtensions.execute();
})
    .help('help')
    .argv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUFvRDtBQUNwRCwrQ0FBOEQ7QUFDOUQsK0JBQStCO0FBRS9CLE1BQU0sSUFBSSxHQUFHLEtBQUs7S0FDZixPQUFPLENBQUMsOERBQThELEVBQUUsMkNBQTJDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtJQUM5SCxLQUFLO1NBQ0YsVUFBVSxDQUFDLFFBQVEsRUFBRTtRQUNwQixRQUFRLEVBQUUsaUJBQWlCO1FBQzNCLFFBQVEsRUFBRSxJQUFJO0tBQ2YsQ0FBQztTQUNELFVBQVUsQ0FBQyxRQUFRLEVBQUU7UUFDcEIsUUFBUSxFQUFFLHlDQUF5QztRQUNuRCxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO1FBQzFCLFFBQVEsRUFBRSxJQUFJO0tBQ2YsQ0FBQztTQUNELFVBQVUsQ0FBQyxNQUFNLEVBQUU7UUFDbEIsUUFBUSxFQUFFLDBDQUEwQztRQUNwRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztRQUN0QyxRQUFRLEVBQUUsSUFBSTtLQUNmLENBQUM7U0FDRCxVQUFVLENBQUMsWUFBWSxFQUFFO1FBQ3hCLFFBQVEsRUFBRSxzREFBc0Q7UUFDaEUsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQztRQUMxQixRQUFRLEVBQUUsSUFBSTtLQUNmLENBQUM7U0FDRCxVQUFVLENBQUMsSUFBSSxFQUFFO1FBQ2hCLFFBQVEsRUFBRSw0RkFBNEY7S0FDdkcsQ0FBQztTQUNELE1BQU0sQ0FBQyxjQUFjLEVBQUU7UUFDdEIsUUFBUSxFQUFFLGlIQUFpSDtRQUMzSCxPQUFPLEVBQUUsSUFBSTtRQUNiLFNBQVMsRUFBRSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUM7S0FDMUMsQ0FBQztTQUNELE1BQU0sQ0FBQyxjQUFjLEVBQUU7UUFDdEIsUUFBUSxFQUFFLDJFQUEyRTtRQUNyRixPQUFPLEVBQUUsWUFBWTtRQUNyQixTQUFTLEVBQUUsY0FBYztLQUMxQixDQUFDO1NBQ0QsTUFBTSxDQUFDLFlBQVksRUFBRTtRQUNwQixRQUFRLEVBQUUsK0RBQStEO1FBQ3pFLE9BQU8sRUFBRSxjQUFjO1FBQ3ZCLFNBQVMsRUFBRSxjQUFjO0tBQzFCLENBQUMsQ0FBQztBQUNQLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO0lBQ1YsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLEtBQUssRUFBRTtRQUN6QixNQUFNLGFBQWEsR0FBRyxJQUFJLDJCQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3pCO1NBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtRQUNuQyxNQUFNLGdCQUFnQixHQUFHLElBQUksOEJBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDNUI7QUFDSCxDQUFDLENBQUM7S0FDRCxPQUFPLENBQUMsNEJBQTRCLEVBQUUsK0RBQStELEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtJQUNoSCxLQUFLO1NBQ0YsVUFBVSxDQUFDLFFBQVEsRUFBRTtRQUNwQixRQUFRLEVBQUUsNERBQTREO1FBQ3RFLFFBQVEsRUFBRSxJQUFJO0tBQ2YsQ0FBQztTQUNELE1BQU0sQ0FBQyxXQUFXLEVBQUU7UUFDbkIsS0FBSyxFQUFFLEdBQUc7UUFDVixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxDQUFDLDZFQUE2RSxDQUFDO0tBQ3pGLENBQUM7U0FDRCxNQUFNLENBQUMscUJBQXFCLEVBQUU7UUFDN0IsS0FBSyxFQUFFLEdBQUc7UUFDVixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDO0tBQ2pDLENBQUMsQ0FBQztBQUNQLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO0lBQ1YsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BELGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLENBQUMsQ0FBQztLQUNELElBQUksQ0FBQyxNQUFNLENBQUM7S0FDWixJQUFJLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JlbW92ZUV4dGVuc2lvbnN9IGZyb20gJy4vcmVtb3ZlRXh0ZW5zaW9ucyc7XHJcbmltcG9ydCB7QWRkUGVybWlzc2lvbiwgUmVtb3ZlUGVybWlzc2lvbn0gZnJvbSAnLi9wZXJtaXNzaW9ucyc7XHJcbmltcG9ydCAqIGFzIFlhcmdzIGZyb20gJ3lhcmdzJztcclxuXHJcbmNvbnN0IGFyZ3YgPSBZYXJnc1xyXG4gIC5jb21tYW5kKCdtb2RpZnktcGVybWlzc2lvbiA8c2VydmVyPiA8bW9kaWZ5PiA8dHlwZT4gPHBlcm1pc3Npb24+IFtpZF0nLCAnQWRkcyBhIHBlcm1pc3Npb24gdG8gb25lIG9yIGFsbCByZXNvdXJjZXMnLCAoeWFyZ3MpID0+IHtcclxuICAgIHlhcmdzXHJcbiAgICAgIC5wb3NpdGlvbmFsKCdzZXJ2ZXInLCB7XHJcbiAgICAgICAgZGVzY3JpYmU6ICdUaGUgRkhJUiBzZXJ2ZXInLFxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICAgIC5wb3NpdGlvbmFsKCdtb2RpZnknLCB7XHJcbiAgICAgICAgZGVzY3JpYmU6ICdXaGV0aGVyIG90IGFkZCBvciByZW1vdmUgdGhlIHBlcm1pc3Npb24nLFxyXG4gICAgICAgIGNob2ljZXM6IFsnYWRkJywgJ3JlbW92ZSddLFxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICAgIC5wb3NpdGlvbmFsKCd0eXBlJywge1xyXG4gICAgICAgIGRlc2NyaWJlOiAnVGhlIHR5cGUgb2YgcGVybWlzc2lvbiB0eXBlIGdyYW50L3Jldm9rZScsXHJcbiAgICAgICAgY2hvaWNlczogWydldmVyeW9uZScsICdncm91cCcsICd1c2VyJ10sXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgfSlcclxuICAgICAgLnBvc2l0aW9uYWwoJ3Blcm1pc3Npb24nLCB7XHJcbiAgICAgICAgZGVzY3JpYmU6ICdUaGUgcGVybWlzc2lvbiB0eXBlIHRvIGdyYW50L3Jldm9rZSAocmVhZCB2cy4gd3JpdGUpJyxcclxuICAgICAgICBjaG9pY2VzOiBbJ3JlYWQnLCAnd3JpdGUnXSxcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgICAucG9zaXRpb25hbCgnaWQnLCB7XHJcbiAgICAgICAgZGVzY3JpYmU6ICdJZiB0aGUgdHlwZSBpcyBub3QgZXZlcnlvbmUsIHRoaXMgaXMgdGhlIElEIG9mIHRoZSBncm91cCBvciB1c2VyIHRvIGFkZCB0aGUgcGVybWlzc2lvbiBmb3InXHJcbiAgICAgIH0pXHJcbiAgICAgIC5vcHRpb24oJ2FsbFJlc291cmNlcycsIHtcclxuICAgICAgICBkZXNjcmliZTogJ0RBTkdFUk9VUzogR3JhbnQgdGhpcyBwZXJtaXNzaW9uIHRvIGFsbCByZXNvdXJjZXMuIEVpdGhlciB0aGlzIG9yIFwicmVzb3VyY2VUeXBlXCIgYW5kIFwicmVzb3VyY2VJZFwiIGFyZSByZXF1aXJlZC4nLFxyXG4gICAgICAgIGJvb2xlYW46IHRydWUsXHJcbiAgICAgICAgY29uZmxpY3RzOiBbJ3Jlc291cmNlVHlwZScsICdyZXNvdXJjZUlkJ11cclxuICAgICAgfSlcclxuICAgICAgLm9wdGlvbigncmVzb3VyY2VUeXBlJywge1xyXG4gICAgICAgIGRlc2NyaWJlOiAnVGhlIHJlc291cmNlIHR5cGUgZm9yIHRoZSByZXNvdXJjZSB0byBncmFudC9yZXZva2UgdGhlIHBlcm1pc3Npb24gdG8vZnJvbScsXHJcbiAgICAgICAgaW1wbGllczogJ3Jlc291cmNlSWQnLFxyXG4gICAgICAgIGNvbmZsaWN0czogJ2FsbFJlc291cmNlcydcclxuICAgICAgfSlcclxuICAgICAgLm9wdGlvbigncmVzb3VyY2VJZCcsIHtcclxuICAgICAgICBkZXNjcmliZTogJ1RoZSBpZCBvZiB0aGUgcmVzb3VyY2UgdG8gZ3JhbnQvcmV2b2tlIHRoZSBwZXJtaXNzaW9uIHRvL2Zyb20nLFxyXG4gICAgICAgIGltcGxpZXM6ICdyZXNvdXJjZVR5cGUnLFxyXG4gICAgICAgIGNvbmZsaWN0czogJ2FsbFJlc291cmNlcydcclxuICAgICAgfSk7XHJcbiAgfSwgKGFyZ3YpID0+IHtcclxuICAgIGlmIChhcmd2Lm1vZGlmeSA9PT0gJ2FkZCcpIHtcclxuICAgICAgY29uc3QgYWRkUGVybWlzc2lvbiA9IG5ldyBBZGRQZXJtaXNzaW9uKGFyZ3YpO1xyXG4gICAgICBhZGRQZXJtaXNzaW9uLmV4ZWN1dGUoKTtcclxuICAgIH0gZWxzZSBpZiAoYXJndi5tb2RpZnkgPT09ICdyZW1vdmUnKSB7XHJcbiAgICAgIGNvbnN0IHJlbW92ZVBlcm1pc3Npb24gPSBuZXcgUmVtb3ZlUGVybWlzc2lvbihhcmd2KTtcclxuICAgICAgcmVtb3ZlUGVybWlzc2lvbi5leGVjdXRlKCk7XHJcbiAgICB9XHJcbiAgfSlcclxuICAuY29tbWFuZCgncmVtb3ZlLWV4dGVuc2lvbnMgW3NlcnZlcl0nLCAnUmVtb3ZlcyBzcGVjaWZpZWQgZXh0ZW5zaW9ucyBmcm9tIHRoZSByZXNvdXJjZXMgb24gdGhlIHNlcnZlcicsICh5YXJncykgPT4ge1xyXG4gICAgeWFyZ3NcclxuICAgICAgLnBvc2l0aW9uYWwoJ3NlcnZlcicsIHtcclxuICAgICAgICBkZXNjcmliZTogJ1RoZSBGSElSIHNlcnZlciB0byByZW1vdmUgZXh0ZW5zaW9ucyBmcm9tIHRoZSByZXNvdXJjZXMgb24nLFxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICAgIC5vcHRpb24oJ2V4dGVuc2lvbicsIHtcclxuICAgICAgICBhbGlhczogJ2UnLFxyXG4gICAgICAgIG11bHRpcGxlOiB0cnVlLFxyXG4gICAgICAgIGRlZmF1bHQ6IFsnaHR0cHM6Ly90cmlmb2xpYS1maGlyLmxhbnRhbmFncm91cC5jb20vc3R1My9TdHJ1Y3R1cmVEZWZpbml0aW9uL2dpdGh1Yi1wYXRoJ11cclxuICAgICAgfSlcclxuICAgICAgLm9wdGlvbignZXhjbHVkZVJlc291cmNlVHlwZScsIHtcclxuICAgICAgICBhbGlhczogJ3InLFxyXG4gICAgICAgIG11bHRpcGxlOiB0cnVlLFxyXG4gICAgICAgIGRlZmF1bHQ6IFsnSW1wbGVtZW50YXRpb25HdWlkZSddXHJcbiAgICAgIH0pO1xyXG4gIH0sIChhcmd2KSA9PiB7XHJcbiAgICBjb25zdCByZW1vdmVFeHRlbnNpb25zID0gbmV3IFJlbW92ZUV4dGVuc2lvbnMoYXJndik7XHJcbiAgICByZW1vdmVFeHRlbnNpb25zLmV4ZWN1dGUoKTtcclxuICB9KVxyXG4gIC5oZWxwKCdoZWxwJylcclxuICAuYXJndjtcclxuIl19