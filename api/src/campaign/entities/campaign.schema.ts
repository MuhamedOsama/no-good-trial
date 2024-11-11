import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema()
export class Campaign {
  @Prop({ required: true })
  adId: number;

  @Prop({ required: true })
  xyzCampaignId: number;

  @Prop({ required: true })
  fbCampaignId: number;

  @Prop({ required: true })
  age: string;

  @Prop({ required: true, enum: ['M', 'F'] })
  gender: string;

  @Prop({ required: true })
  interest: number;

  @Prop({ required: true })
  impressions: number;

  @Prop({ required: true })
  clicks: number;

  @Prop({ required: true })
  spent: number;

  @Prop({ required: true })
  totalConversion: number;

  @Prop({ required: true })
  approvedConversion: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
