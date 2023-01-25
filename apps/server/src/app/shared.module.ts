import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { modelDefinitions } from "./db/schemas";
import { ConfigService } from "./config.service";
import { DatabaseConfigService } from "./database-config.service";
import { ProjectsService } from "./services/projects.service";




@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [SharedModule],
            useClass: DatabaseConfigService
        }),
        MongooseModule.forFeature(modelDefinitions)
    ],
    exports: [
        ConfigService,
        DatabaseConfigService,
        ProjectsService
    ],
    providers: [
        ConfigService,
        DatabaseConfigService,
        ProjectsService
    ]
})
export class SharedModule {}

