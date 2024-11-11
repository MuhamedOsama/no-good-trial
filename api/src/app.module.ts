import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignModule } from './campaign/campaign.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:m1i2d3o40@cluster0.9psumlp.mongodb.net/no-good-trial',
    ),
    CampaignModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
