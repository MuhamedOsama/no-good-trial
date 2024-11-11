import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArchiveDocument = Archive & Document;

@Schema()
export class Archive {
  @Prop({ required: true })
  campaignName: string;

  @Prop({ required: true })
  data: string; // This will store the JSON string of archived data

  @Prop({ required: true })
  archivedAt: Date;
}

export const ArchiveSchema = SchemaFactory.createForClass(Archive);
