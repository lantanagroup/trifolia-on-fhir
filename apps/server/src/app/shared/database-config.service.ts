import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { ConfigService } from "../config.service";


@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
  
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {

    // remove the "_id" property from the returned JSON in favor of the virtual "id" property
    mongoose.set('toJSON', { 
      transform: (doc, ret) => {
        if ('id' in doc && !('id' in ret) && '_id' in doc) {
          ret.id = doc._id.toString();
        }
        delete ret['_id'];
      }
    });

    return {
      uri: this.configService.database.uri
    };
  }
  
}

