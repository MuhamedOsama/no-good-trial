import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Archive, ArchiveDocument } from './entities/campaign-archive.schema';

@Injectable()
export class ArchiveService {
  constructor(
    @InjectModel(Archive.name) private archiveModel: Model<ArchiveDocument>,
  ) {}

  async createArchive(data: {
    campaignName: string;
    data: string;
    archivedAt: Date;
  }): Promise<void> {
    await new this.archiveModel(data).save();
  }
}
