import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CampaignService } from './campaign.service';
import { ArchiveService } from './archive.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  private readonly archivePath = path.join(__dirname, '..', 'archive');

  constructor(
    private readonly campaignService: CampaignService,
    private readonly archiveService: ArchiveService,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  async handleCron() {
    this.logger.debug('Running weekly cleanup and archival task');

    // Check if the archive directory exists, and create it if not
    try {
      await fs.mkdir(this.archivePath, { recursive: true });
    } catch (err) {
      this.logger.error(`Error creating archive directory: ${err.message}`);
      return;
    }

    // Get grouped campaigns
    const groupedCampaigns =
      await this.campaignService.getGroupedOldCampaigns();

    for (const group of groupedCampaigns) {
      const { campaignType, campaigns } = group as any;
      const campaignData = JSON.stringify(campaigns, null, 2);
      const campaignName = campaigns[0][`${campaignType}CampaignId`]; // xyzCampaignId or fbCampaignId based on type
      const fileName = `${campaignType}-${campaignName}.json`;
      const filePath = path.join(this.archivePath, fileName);

      try {
        // Write the grouped campaigns to a file
        await fs.writeFile(filePath, campaignData);

        // Save to archive collection
        await this.archiveService.createArchive({
          campaignName: `${campaignType}-${campaignName}`,
          data: campaignData,
          archivedAt: new Date(),
        });

        // Delete campaigns from the original collection
        const campaignIds = campaigns.map((campaign) => campaign._id);
        await this.campaignService.deleteCampaignsByIds(campaignIds);
      } catch (err) {
        this.logger.error(`Error archiving campaign group: ${err.message}`);
        continue;
      }
    }

    this.logger.debug('Cleanup and archival task completed');
  }
}
