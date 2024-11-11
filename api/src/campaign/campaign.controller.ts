import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Campaign } from './entities/campaign.entity';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async createCampaign(@Body() rawData: any): Promise<Campaign> {
    return this.campaignService.insertCampaign(rawData);
  }

  @Post('bulk')
  async createCampaigns(@Body() rawDataArray: any[]): Promise<Campaign[]> {
    return this.campaignService.insertCampaigns(rawDataArray);
  }

  @Get()
  async getCampaigns(): Promise<Campaign[]> {
    return this.campaignService.getCampaigns();
  }
  @Get('facebook/:fbCampaignId')
  async getAdsByFbCampaignId(
    @Param('fbCampaignId') fbCampaignId: string,
  ): Promise<Campaign[]> {
    console.log(fbCampaignId);
    return this.campaignService.getAdsByFbCampaignId(fbCampaignId);
  }
  @Get('xyz/:xyzCampaignId')
  async getAdsByXyzCampaignId(
    @Param('xyzCampaignId') xyzCampaignId: string,
  ): Promise<Campaign[]> {
    return this.campaignService.getAdsByXyzCampaignId(xyzCampaignId);
  }
  @ApiQuery({
    name: 'groupBy',
    required: true,
    description: 'Field to group by: xyzCampaignId, fbCampaignId, age, gender',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering campaigns (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering campaigns (YYYY-MM-DD)',
  })
  @Get('aggregate-summary')
  async getCampaignSummary(
    @Query('groupBy') groupBy: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.campaignService.getAggregatedCampaignData(
      groupBy,
      startDate,
      endDate,
    );
  }
  @ApiQuery({
    name: 'age',
    required: false,
    description: 'Filter by age range, e.g., age=30-34',
  })
  @ApiQuery({
    name: 'gender',
    required: false,
    description: 'Filter by gender, e.g., gender=M',
  })
  @ApiQuery({
    name: 'interest',
    required: false,
    description: 'Filter by interest, e.g., interest=sports',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description:
      'Start date for filtering (required if endDate is provided), format: YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description:
      'End date for filtering (required if startDate is provided), format: YYYY-MM-DD',
  })
  @Get('filter')
  async filterCampaigns(@Query() query: any): Promise<Campaign[]> {
    return this.campaignService.filterCampaigns(query);
  }
  @Get('campaignByAdId/:adId')
  async getCampaignByAdId(@Param('adId') adId: number): Promise<Campaign> {
    return this.campaignService.getCampaignById(adId);
  }
  @Get('facebook-campaign-ids')
  async getFacebookCampaignsIds(): Promise<number[]> {
    return this.campaignService.getFacebookCampaignsIds();
  }

  @Get('xyz-campaign-ids')
  async getXyzCampaignsIds(): Promise<number[]> {
    return this.campaignService.getXyzCampaignsIds();
  }
}
