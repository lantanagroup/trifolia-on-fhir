import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConformanceController} from './conformance.controller';
import { ConformanceService } from './conformance.service';
import {UsersModule} from '../users/users.module';
import {Conformance, ConformanceSchema} from './conformance.schema';

@Module({
    imports: [UsersModule, MongooseModule.forFeature([{name: Conformance.name, schema: ConformanceSchema}])],
    controllers: [ConformanceController],
    exports: [ConformanceService],
    providers: [ConformanceService]
})
export class ConformanceModule {}
