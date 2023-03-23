import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Example, ExampleSchema } from './example.schema';
import { ExamplesController } from './examples.controller';
import { ExamplesService } from './examples.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Example.name, schema: ExampleSchema }
        ])
    ],
    controllers: [ExamplesController],
    exports: [ExamplesService],
    providers: [ExamplesService]
})
export class ExamplesModule { }
