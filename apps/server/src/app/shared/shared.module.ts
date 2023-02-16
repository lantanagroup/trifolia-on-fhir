import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "../config.service";
import { DatabaseConfigService } from "./database-config.service";




@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [SharedModule],
            useClass: DatabaseConfigService
        })
    ],
    exports: [
        ConfigService,
        DatabaseConfigService
    ],
    providers: [
        ConfigService,
        DatabaseConfigService
    ]
})
export class SharedModule {}

