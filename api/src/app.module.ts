import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignModule } from './campaign/campaign.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:m1i2d3o40@cluster0.9psumlp.mongodb.net/no-good-trial',
    ),
    CampaignModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
