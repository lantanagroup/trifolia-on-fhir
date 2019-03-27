import {RemoveExtensions, RemoveExtensionsOptions} from './removeExtensions';
import * as Yargs from 'yargs';

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
    }, (argv: RemoveExtensionsOptions) => {
        const removeExtensions = new RemoveExtensions(argv);
        removeExtensions.execute();
    })
    .help('help')
    .argv;