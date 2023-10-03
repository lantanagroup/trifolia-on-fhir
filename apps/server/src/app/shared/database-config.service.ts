import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { ConfigService } from "../config.service";


@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
  
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {


    mongoose.set('toJSON', { 
      transform: (doc, ret) => {

        // remove the "_id" property from the returned JSON in favor of the virtual "id" property
        if ('id' in doc && !('id' in ret) && '_id' in doc) {
          ret.id = doc._id.toString();
        }
        delete ret['_id'];

        // remove migratedFrom property from returned JSON
        if ('migratedFrom' in ret) {
          delete ret['migratedFrom'];
        }

        // remove any property starting with "__" from returned JSON
        Object.keys(ret).forEach(key => {
          if (key.startsWith('__')) {
            delete ret[key];
          }
        });
      }
    });

    return {
      uri: this.configService.database.uri
    };
  }
  
}

