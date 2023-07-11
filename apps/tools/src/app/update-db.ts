import * as Yargs from 'yargs';
import {BaseTools} from './baseTools';
import {Collection, Db, MongoClient, UpdateResult} from 'mongodb';

interface UpdateDbArgs {
  connectionString: string;
  dbName: string;
}

export class UpdateDb extends BaseTools {
  private args: UpdateDbArgs;
  private client: MongoClient;
  private db: Db;
  private conformanceColl: Collection;

  public static commandFormat = 'update-db [connectionString] [dbName]';
  public static commandDescription = 'Update the mongo database specified in the connection string';

  public static commandBuilder(yargs: Yargs.Argv) {
    return yargs
      .positional('connectionString', {})
      .positional('dbName', {})
  }

  public static async commandHandler(args: any) {
    try {
      const updater = new UpdateDb(args);
      await updater.execute();
    } catch (ex) {
      console.error(ex.message);
      throw ex;
    }
  }

  constructor(args: UpdateDbArgs) {
    super();
    this.args = args;
  }

  async connect() {
    this.client = new MongoClient(this.args.connectionString);
    await this.client.connect();
    this.db = await this.client.db(this.args.dbName);
    this.conformanceColl = this.db.collection('conformance');
  }

  private async fixVersionIdType() {
    console.log('Updating conformance resources with a numeric meta.versionId to be a string');

    // Ensure all conformance resources have a string meta.versionId
    const results = await this.conformanceColl
      .find({ "resource.meta.versionId": { "$type": "number" }});

    const promises: Promise<UpdateResult>[] = [];
    await results
      .forEach(conformance => {
        conformance.resource.meta.versionId = conformance.resource.meta.versionId.toString();
        const next = this.conformanceColl.updateOne({ _id: conformance._id}, {
          $set: conformance
        });
        promises.push(next);
      });

    await Promise.all(promises);

    console.log(`Updated versionId's type of ${promises.length} resources`);
  }

  async execute() {
    await this.connect();

    await this.fixVersionIdType();

    process.exit(0);
  }
}
