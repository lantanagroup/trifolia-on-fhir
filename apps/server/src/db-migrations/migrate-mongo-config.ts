import { ConfigService } from "../app/config.service";
import * as defaultConfig from "../config/migration-default.json";



export interface MigrateMongoConfig {
    mongodb: {
        url: string;
        options: {
            useNewUrlParser: boolean;
            useUnifiedTopology: boolean;
        }
    }
    migrationsDir: string;
    changelogCollectionName: string;
    migrationFileExtension: string;
    useFileHash: boolean;
    moduleSystem: string;
}


export class MigrateMongoConfigService {

    private _config: MigrateMongoConfig;

    constructor(private configService: ConfigService) {

        let config: MigrateMongoConfig = { ...defaultConfig };
        config.mongodb.url = this.configService.database.uri;
        config.migrationsDir = "db-migrations/migrations";

        this.setConfig(config);
    }

    public setConfig(config: MigrateMongoConfig) {
        this._config = config;
    }
    public getConfig(): MigrateMongoConfig {
        return this._config;
    }
}
