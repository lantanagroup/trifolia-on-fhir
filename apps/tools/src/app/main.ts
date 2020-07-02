import {RemoveExtensions} from './removeExtensions';
import {AddPermission, RemovePermission} from './permissions';
import * as Yargs from 'yargs';
import {RemoveExtras} from './removeExtras';
import {UserListCommand} from './user-list';
import {PopulateFromAuth0} from './populateFromAuth0';
import {Migrate} from './migrate';

const populateFromAuth0Format = 'populate-from-auth0 <server> <domain> <token>';
const populateFromAuth0Description = 'Populates user (Practitioner) information in ToF based on user information entered in a matching Auth0 domain.';

const modifyPermissionFormat = 'modify-permission <server> <modify> <type> <permission> [id]';
const modifyPermissionDescription = 'Adds/removes a permission to one or all resources';

const removeExtensionsFormat = 'remove-extensions [server]';
const removeExtensionsDescription = 'Removes specified extensions from all resources on the server';

const removeExtrasFormat = 'remove-extras <directory>';
const removeExtrasDescription = 'Removes extra properties from resources that aren\'t used by ToF. This should typically be executed only be ToF developers on resources in the tof-lib assets folder.';

const userListFormat = 'users';
const userListDescription = 'Gets a list of all distinct users (Practitioner resources) in all of the FHIR servers specified';

const migrateFormat = 'migrate <server>';
const migrateDescription = 'Migrates data in previous versions of ToF to new versions of ToF';

const argv = Yargs
  .command(migrateFormat, migrateDescription, (yargs: Yargs.Argv) => {
    return yargs
      .positional('server', {
        description: 'The FHIR server to migrate',
        required: true
      })
      .positional('output', {
        description: 'File path to where the migrated content should be stored as a transaction bundle to commit to the FHIR server after inspection',
        required: true
      });
  }, async (args: any) => {
    try {
      const migrator = new Migrate(args);
      await migrator.init();
      await migrator.migrate();
    } catch (ex) {
      console.error(ex.message);
    }
  })
  .command(populateFromAuth0Format, populateFromAuth0Description, (yargs: Yargs.Argv) => {
    return yargs
      .positional('server', {
        describe: 'The FHIR server that contains the Practitioner resources to populate',
        required: true
      })
      .positional('domain', {
        describe: 'The auth0 domain to connect to and get more information about the user.',
        example: 'trifolia'
      })
      .positional('token', {
        describe: 'The auth0 token to use for authorization.'
      });
  }, (args: any) => {
    const executor = new PopulateFromAuth0(args);
    executor.execute();
  })
  .command(modifyPermissionFormat, modifyPermissionDescription, (yargs: Yargs.Argv) => {
    return yargs
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
        conflicts: 'allResources'
      })
      .option('resourceId', {
        describe: 'The id of the resource to grant/revoke the permission to/from',
        implies: 'resourceType',
        conflicts: 'allResources'
      });
  }, (args: any) => {
    if (args.modify === 'add') {
      const addPermission = new AddPermission(args);
      addPermission.execute();
    } else if (args.modify === 'remove') {
      const removePermission = new RemovePermission(args);
      removePermission.execute();
    }
  })
  .command(removeExtensionsFormat, removeExtensionsDescription, (yargs: Yargs.Argv) => {
    return yargs
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
  .command(removeExtrasFormat, removeExtrasDescription, (yargs: Yargs.Argv) => {
    return yargs
      .positional('directory', {
        description: 'The directory of all json resource files that should have extra properties removed from'
      });
  }, async (args: any) => {
    const removeExtras = new RemoveExtras(args);
    await removeExtras.execute();
  })
  .command(userListFormat, userListDescription, (yargs: Yargs.Argv) => {
    return yargs
      .option('fhirServer', {
        alias: 'f',
        description: 'The fhir server(s) to search for users in. Specify this parameter for each FHIR server to include.',
        multiple: true,
        required: true
      })
      .option('auth0export', {
        description: 'A file exported from the Auth0 import/export plugin that should provide additional data to this tool.'
      })
      .option('tabs', {
        description: 'Dump the results as a TXT with tab delims',
        boolean: true
      });
  }, async (args: any) => {
    const command = new UserListCommand(args);
    await command.execute();
  })
  .help('help')
  .demandCommand()
  .argv;
