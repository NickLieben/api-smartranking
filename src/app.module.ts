import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import 'dotenv/config';

@Module({
  imports: [PlayersModule, MongooseModule.forRoot(process.env.DATABASE_URL)],
  controllers: [],
  providers: [],
})
export class AppModule {}
