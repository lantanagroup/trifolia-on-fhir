export interface IDatabaseConfig {
  /**
   * Mongo connection string.  ex: mongodb://user:pwd@localhost:27017
   */
  uri: string;

  /**
   * If true then "migrate-mongo up" will be run on the configured database every time the server starts
   */
  migrateAtStart: boolean;
}

