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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUE2RTtBQUM3RSwrQkFBK0I7QUFFL0IsTUFBTSxJQUFJLEdBQUcsS0FBSztLQUNiLE9BQU8sQ0FBQyw0QkFBNEIsRUFBRSwrREFBK0QsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQzlHLEtBQUs7U0FDQSxVQUFVLENBQUMsUUFBUSxFQUFFO1FBQ2xCLFFBQVEsRUFBRSw0REFBNEQ7UUFDdEUsUUFBUSxFQUFFLElBQUk7S0FDakIsQ0FBQztTQUNELE1BQU0sQ0FBQyxXQUFXLEVBQUU7UUFDakIsS0FBSyxFQUFFLEdBQUc7UUFDVixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxDQUFDLDZFQUE2RSxDQUFDO0tBQzNGLENBQUM7U0FDRCxNQUFNLENBQUMscUJBQXFCLEVBQUU7UUFDM0IsS0FBSyxFQUFFLEdBQUc7UUFDVixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDO0tBQ25DLENBQUMsQ0FBQztBQUNYLENBQUMsRUFBRSxDQUFDLElBQTZCLEVBQUUsRUFBRTtJQUNqQyxNQUFNLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEQsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0tBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNaLElBQUksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UmVtb3ZlRXh0ZW5zaW9ucywgUmVtb3ZlRXh0ZW5zaW9uc09wdGlvbnN9IGZyb20gJy4vcmVtb3ZlRXh0ZW5zaW9ucyc7XHJcbmltcG9ydCAqIGFzIFlhcmdzIGZyb20gJ3lhcmdzJztcclxuXHJcbmNvbnN0IGFyZ3YgPSBZYXJnc1xyXG4gICAgLmNvbW1hbmQoJ3JlbW92ZS1leHRlbnNpb25zIFtzZXJ2ZXJdJywgJ1JlbW92ZXMgc3BlY2lmaWVkIGV4dGVuc2lvbnMgZnJvbSB0aGUgcmVzb3VyY2VzIG9uIHRoZSBzZXJ2ZXInLCAoeWFyZ3MpID0+IHtcclxuICAgICAgICB5YXJnc1xyXG4gICAgICAgICAgICAucG9zaXRpb25hbCgnc2VydmVyJywge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpYmU6ICdUaGUgRkhJUiBzZXJ2ZXIgdG8gcmVtb3ZlIGV4dGVuc2lvbnMgZnJvbSB0aGUgcmVzb3VyY2VzIG9uJyxcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vcHRpb24oJ2V4dGVuc2lvbicsIHtcclxuICAgICAgICAgICAgICAgIGFsaWFzOiAnZScsXHJcbiAgICAgICAgICAgICAgICBtdWx0aXBsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFsnaHR0cHM6Ly90cmlmb2xpYS1maGlyLmxhbnRhbmFncm91cC5jb20vc3R1My9TdHJ1Y3R1cmVEZWZpbml0aW9uL2dpdGh1Yi1wYXRoJ11cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9wdGlvbignZXhjbHVkZVJlc291cmNlVHlwZScsIHtcclxuICAgICAgICAgICAgICAgIGFsaWFzOiAncicsXHJcbiAgICAgICAgICAgICAgICBtdWx0aXBsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFsnSW1wbGVtZW50YXRpb25HdWlkZSddXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSwgKGFyZ3Y6IFJlbW92ZUV4dGVuc2lvbnNPcHRpb25zKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVtb3ZlRXh0ZW5zaW9ucyA9IG5ldyBSZW1vdmVFeHRlbnNpb25zKGFyZ3YpO1xyXG4gICAgICAgIHJlbW92ZUV4dGVuc2lvbnMuZXhlY3V0ZSgpO1xyXG4gICAgfSlcclxuICAgIC5oZWxwKCdoZWxwJylcclxuICAgIC5hcmd2OyJdfQ==