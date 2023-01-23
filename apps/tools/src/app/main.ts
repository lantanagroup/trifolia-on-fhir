import { RemoveExtensions } from './removeExtensions';
import { AddPermission, RemovePermission } from './permissions';
import * as Yargs from 'yargs';
import { RemoveExtras } from './removeExtras';
import { UserListCommand } from './user-list';
import { PopulateFromAuth0 } from './populateFromAuth0';
import { Migrate } from './migrate';
import { ChangeId } from './change-id';
import { ChangeExtensionUrl } from './change-extension-url';
import { ReplacePackageList } from './replace-package-list';
import { MigrateDb } from './migrate-db';

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

const migrateFormat = 'migrate [server] [output]';
const migrateDescription = 'Migrates data in previous versions of ToF to new versions of ToF';

const changeIdFormat = 'change-id [directory] [resourceType] [oldId] [newId]';
const changeIdDescription = 'Changes the ID of a resource in one or more files in a directory';

const changeExtensionUrlFormat = 'change-ext-url [server]';
const changeExtensionUrlDescription = 'Changes the url of an extension';

const replacePackageListFormat = 'replace-package-list [server] [fhirVersion]';
const replacePackageListDescription = 'Replaces all ImplementationGuide package-list.json with publishing-request.json';

const migrateDbFormat = 'migrate-db [mysqlHost] [mysqlDb] [mysqlUser] [mysqlPass] [fhirVersion] [dbServer] [dbName] [migratedFromLabel]';
const migrateDbDescription = 'Migrate the specific FHIR server to mongo database';

const argv = Yargs
  .command(migrateDbFormat, migrateDbDescription, (yargs: Yargs.Argv) => {
    return yargs
      .positional('mysqlHost', {})
      .positional('mysqlDb', {})
      .positional('mysqlUser', {})
      .positional('mysqlPass', {})
      .positional('fhirVersion', {})
      .positional('dbServer', {})
      .positional('dbName', {})
      .positional('migratedFromLabel', {})
      .option('out', {
        description: 'The file to store log output to'
      });
  }, async (args: any) => {
    try {
      const migrator = new MigrateDb(args);
      await migrator.migrate();
    } catch (ex) {
      console.error(ex.message);
    }
  })
  .command(replacePackageListFormat, replacePackageListDescription, (yargs: Yargs.Argv) => {
    return yargs
      .positional('server', {
        description: 'The FHIR server to replace implementation guide package-list\'s on',
        required: true
      })
      .positional('fhirVersion', {
        description: 'The version of the FHIR server',
        required: true,
        choices: ['STU3', 'R4']
      });
  }, (args: any) => {
    const replacePackageList = new ReplacePackageList(args);
    replacePackageList.execute();
  })
  .command(changeExtensionUrlFormat, changeExtensionUrlDescription, (yargs: Yargs.Argv) => {
    return yargs
      .positional('server', {
        description: 'The FHIR server to change extension urls on',
        required: true
      })
      .option('currentUrl', {
        description: 'The URL of the extension that should be changed and is currently set to'
      })
      .option('newUrl', {
        description: 'The URL that the extension should be changed to'
      })
      .option('file', {
        description: 'A comma-separated text file (CSV) that lists "currentUrl" and "newUrl" for each line, allowing multiple extension changes'
      })
      .option('resourceType', {
        type: 'string',
        description: 'Only change extensions for this resource type'
      });
  }, async (args: any) => {
    const changeExtensionUrl = new ChangeExtensionUrl(args);
    await changeExtensionUrl.execute();
  })
  .command(changeIdFormat, changeIdDescription, (yargs: Yargs.Argv) => {
    return yargs
      .positional('directory', {
        required: true,
        description: 'The directory that .json and .xml resource files should be updated.'
      })
      .positional('resourceType', {
        required: true,
        description: 'The resource type of the resource to change the ID for.'
      })
      .positional('oldId', {
        required: true,
        description: 'The old ID to change from.'
      })
      .positional('newId', {
        required: true,
        description: 'The new ID to change to.'
      })
      .option('version', {
        required: false,
        choices: ['stu3', 'r4'],
        description: 'The version of FHIR that these resources are based on.'
      })
      .option('silent', {
        type: 'boolean',
        description: 'Runs the tool without prompting the user to confirm that files should be changed.',
        default: false
      });
  }, async (args: any) => {
    const changeId = new ChangeId(args);
    changeId.execute();
  })
  .command(migrateFormat, migrateDescription, (yargs: Yargs.Argv) => {
    return yargs
      .positional('server', {
        description: 'The FHIR server to migrate',
        required: true
      })
      .positional('output', {
        description: 'File path to where the migrated content should be stored as a transaction bundle to commit to the FHIR server after inspection',
        required: true
      })
      .option('backup', {
        description: "File path to where to store the backup of the fhir server, prior to making any changes."
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
      .option('auth0Domain', {
        alias: 'd',
        description: 'Domain for auth0 (ex: "trifolia" for trifolia.auth0.com)'
      })
      .option('auth0ApiKey', {
        alias: 'a',
        description: 'An API key to use with auth0 to query for more information related to users of ToF'
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
