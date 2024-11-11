import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { Campaign } from './entities/campaign.entity';
import { CampaignSchema } from './entities/campaign.schema';
import { Archive, ArchiveSchema } from './entities/campaign-archive.schema';
import { ArchiveService } from './archive.service';
import { CleanupService } from './cleanup.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Archive.name, schema: ArchiveSchema },
    ]),
  ],
  controllers: [CampaignController],
  providers: [CampaignService, ArchiveService, CleanupService],
})
export class CampaignModule {}
