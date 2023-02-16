import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { modelDefinitions } from "./schemas";
import { ConfigService } from "./config.service";
import { DatabaseConfigService } from "./database-config.service";
import { ProjectsService } from "./services/projects/projects.service";
import { UsersService } from "./services/users/users.service";




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
        ProjectsService,
        UsersService
    ],
    providers: [
        ConfigService,
        DatabaseConfigService,
        ProjectsService,
        UsersService
    ]
})
export class SharedModule {}

