import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Audit, AuditSchema} from './audit.schema';

import {AuditController} from './audit.controller';
import {AuditService} from './audit.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Audit.name, schema: AuditSchema }])],
  exports: [AuditService],
  providers: [AuditService],
  controllers: [AuditController]
})
export class AuditModule {
}
