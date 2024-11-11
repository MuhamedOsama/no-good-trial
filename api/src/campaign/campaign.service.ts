import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './entities/campaign.entity';
import { CampaignDocument } from './entities/campaign.schema';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  // Function to transform raw data to fit the schema
  transformData(rawData: any): Partial<Campaign> {
    return {
      adId: rawData.ad_id,
      xyzCampaignId: rawData.xyz_campaign_id,
      fbCampaignId: rawData.fb_campaign_id,
      age: rawData.age,
      gender: rawData.gender,
      interest: rawData.interest,
      impressions: rawData.Impressions,
      clicks: rawData.Clicks,
      spent: rawData.Spent,
      totalConversion: rawData.Total_Conversion,
      approvedConversion: rawData.Approved_Conversion,
      startDate: new Date(rawData['Start Date']),
      endDate: new Date(rawData['End Date']),
    };
  }

  // Insert transformed data into the database
  async insertCampaign(rawData: any): Promise<Campaign> {
    const transformedData = this.transformData(rawData);
    const createdCampaign = new this.campaignModel(transformedData);
    return createdCampaign.save();
  }

  // Insert multiple campaigns (useful for batch insert)
  async insertCampaigns(rawDataArray: any[]): Promise<Campaign[]> {
    const transformedDataArray = rawDataArray.map((data) =>
      this.transformData(data),
    );
    return this.campaignModel.insertMany(transformedDataArray);
  }

  async getCampaigns(): Promise<Campaign[]> {
    return this.campaignModel.find().exec();
  }

  async getAdsByFbCampaignId(id: string): Promise<Campaign[]> {
    return this.campaignModel.find({ fbCampaignId: id }).exec();
  }
  async getAdsByXyzCampaignId(xyzCampaignId: string): Promise<Campaign[]> {
    return this.campaignModel.find({ xyzCampaignId }).exec();
  }
  async getAggregatedCampaignData(
    groupBy: string,
    startDate?: string,
    endDate?: string,
  ): Promise<any> {
    const match: any = {};
    if (startDate && endDate) {
      match.startDate = { $gte: new Date(startDate) };
      match.endDate = { $lte: new Date(endDate) };
    }

    const groupByField = `$${groupBy}`;

    return this.campaignModel
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: groupByField,
            totalImpressions: { $sum: '$impressions' },
            totalClicks: { $sum: '$clicks' },
            totalSpent: { $sum: '$spent' },
            totalConversions: { $sum: '$totalConversion' },
            totalApprovedConversions: { $sum: '$approvedConversion' },
          },
        },
      ])
      .exec();
  }
  async filterCampaigns(query: any): Promise<Campaign[]> {
    const filter: any = {};
    if (query.age) {
      filter.age = query.age;
    }
    if (query.gender) {
      filter.gender = query.gender;
    }
    if (query.interest) {
      filter.interest = parseInt(query.interest);
    }
    if (query.startDate && query.endDate) {
      filter.startDate = { $gte: new Date(query.startDate) };
      filter.endDate = { $lte: new Date(query.endDate) };
    }

    return this.campaignModel.find(filter).exec();
  }
  async getCampaignById(adId: number): Promise<Campaign> {
    return this.campaignModel.findOne({ adId: adId }).exec();
  }

  async getFacebookCampaignsIds(): Promise<number[]> {
    return this.campaignModel.distinct('fbCampaignId').exec();
  }
  async getXyzCampaignsIds(): Promise<number[]> {
    return this.campaignModel.distinct('xyzCampaignId').exec();
  }
}
