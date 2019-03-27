"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const removeExtensions_1 = require("./removeExtensions");
const Yargs = require("yargs");
const argv = Yargs
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUE2RTtBQUM3RSwrQkFBK0I7QUFFL0IsTUFBTSxJQUFJLEdBQUcsS0FBSztLQUNiLE9BQU8sQ0FBQyw0QkFBNEIsRUFBRSwrREFBK0QsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQzlHLEtBQUs7U0FDQSxVQUFVLENBQUMsUUFBUSxFQUFFO1FBQ2xCLFFBQVEsRUFBRSw0REFBNEQ7UUFDdEUsUUFBUSxFQUFFLElBQUk7S0FDakIsQ0FBQztTQUNELE1BQU0sQ0FBQyxXQUFXLEVBQUU7UUFDakIsS0FBSyxFQUFFLEdBQUc7UUFDVixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxDQUFDLDZFQUE2RSxDQUFDO0tBQzNGLENBQUM7U0FDRCxNQUFNLENBQUMscUJBQXFCLEVBQUU7UUFDM0IsS0FBSyxFQUFFLEdBQUc7UUFDVixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDO0tBQ25DLENBQUMsQ0FBQztBQUNYLENBQUMsRUFBRSxDQUFDLElBQTZCLEVBQUUsRUFBRTtJQUNqQyxNQUFNLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEQsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0tBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNaLElBQUksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UmVtb3ZlRXh0ZW5zaW9ucywgUmVtb3ZlRXh0ZW5zaW9uc09wdGlvbnN9IGZyb20gJy4vcmVtb3ZlRXh0ZW5zaW9ucyc7XG5pbXBvcnQgKiBhcyBZYXJncyBmcm9tICd5YXJncyc7XG5cbmNvbnN0IGFyZ3YgPSBZYXJnc1xuICAgIC5jb21tYW5kKCdyZW1vdmUtZXh0ZW5zaW9ucyBbc2VydmVyXScsICdSZW1vdmVzIHNwZWNpZmllZCBleHRlbnNpb25zIGZyb20gdGhlIHJlc291cmNlcyBvbiB0aGUgc2VydmVyJywgKHlhcmdzKSA9PiB7XG4gICAgICAgIHlhcmdzXG4gICAgICAgICAgICAucG9zaXRpb25hbCgnc2VydmVyJywge1xuICAgICAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIEZISVIgc2VydmVyIHRvIHJlbW92ZSBleHRlbnNpb25zIGZyb20gdGhlIHJlc291cmNlcyBvbicsXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub3B0aW9uKCdleHRlbnNpb24nLCB7XG4gICAgICAgICAgICAgICAgYWxpYXM6ICdlJyxcbiAgICAgICAgICAgICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBbJ2h0dHBzOi8vdHJpZm9saWEtZmhpci5sYW50YW5hZ3JvdXAuY29tL3N0dTMvU3RydWN0dXJlRGVmaW5pdGlvbi9naXRodWItcGF0aCddXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9wdGlvbignZXhjbHVkZVJlc291cmNlVHlwZScsIHtcbiAgICAgICAgICAgICAgICBhbGlhczogJ3InLFxuICAgICAgICAgICAgICAgIG11bHRpcGxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFsnSW1wbGVtZW50YXRpb25HdWlkZSddXG4gICAgICAgICAgICB9KTtcbiAgICB9LCAoYXJndjogUmVtb3ZlRXh0ZW5zaW9uc09wdGlvbnMpID0+IHtcbiAgICAgICAgY29uc3QgcmVtb3ZlRXh0ZW5zaW9ucyA9IG5ldyBSZW1vdmVFeHRlbnNpb25zKGFyZ3YpO1xuICAgICAgICByZW1vdmVFeHRlbnNpb25zLmV4ZWN1dGUoKTtcbiAgICB9KVxuICAgIC5oZWxwKCdoZWxwJylcbiAgICAuYXJndjsiXX0=