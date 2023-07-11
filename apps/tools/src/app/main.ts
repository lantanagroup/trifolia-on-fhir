import * as Yargs from 'yargs';
import {GenerateTypescript} from './generate-typescript';
import {MigrateDb} from './migrate-db';
import {UpdateDb} from './update-db';

Yargs
  .command(GenerateTypescript.commandFormat, GenerateTypescript.commandDescription, GenerateTypescript.commandBuilder, GenerateTypescript.commandHandler)
  .command(MigrateDb.commandFormat, MigrateDb.commandDescription, MigrateDb.commandBuilder, MigrateDb.commandHandler)
  .command(UpdateDb.commandFormat, UpdateDb.commandDescription, UpdateDb.commandBuilder, UpdateDb.commandHandler)
  .help('help')
  .demandCommand()
  .showHelpOnFail(true)
  .argv;
