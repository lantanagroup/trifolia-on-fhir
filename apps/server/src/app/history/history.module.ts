import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryController } from './history.controller';
import { History, HistorySchema } from './history.schema';
import { HistoryService } from './history.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: History.name, schema: HistorySchema }
        ])
    ],
    controllers: [HistoryController],
    exports: [HistoryService],
    providers: [HistoryService]
})
export class HistoryModule { }
