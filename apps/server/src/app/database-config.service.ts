import { Inject, Injectable, Module } from "@nestjs/common";
import { MongooseModule, MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import { ConfigService } from "./config.service";


@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
  
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.database.uri
    };
  }
  
}

