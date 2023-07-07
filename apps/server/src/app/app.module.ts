import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment.development';

@Module({
  imports: [TasksModule, MongooseModule.forRoot(environment.MONGODB)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

console.log('MONGODB');
