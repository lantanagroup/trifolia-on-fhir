import {RemoveExtensions} from './removeExtensions';
import {AddPermission, RemovePermission} from './permissions';
import * as Yargs from 'yargs';
import {Argv} from 'yargs';

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
  }, (args: any) => {
    if (argv.modify === 'add') {
      const addPermission = new AddPermission(args);
      addPermission.execute();
    } else if (argv.modify === 'remove') {
      const removePermission = new RemovePermission(argv);
      removePermission.execute();
    }
  })
  .command('remove-extensions [server]', 'Removes specified extensions from the resources on the server', (yargs: Argv) => {
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
  }, (args: any) => {
    const removeExtensions = new RemoveExtensions(args);
    removeExtensions.execute();
  })
  .help('help')
  .argv;
