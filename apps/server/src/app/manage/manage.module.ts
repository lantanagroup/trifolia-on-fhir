import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ManageController } from './manage.controller';

@Module({
  imports: [UsersModule],
  controllers: [ManageController]
})
export class ManageModule {}
