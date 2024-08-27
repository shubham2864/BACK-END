import * as mongoose from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as Grid from 'gridfs-stream';

@Injectable()
export class FileService {
  private gfs: any;

  constructor(@InjectConnection() private readonly connection: Connection) {
    // Initialize GridFS with Mongoose's connection
    const db = this.connection.db;
    Grid.mongo = mongoose.mongo; // Use Mongoose's mongo
    this.gfs = Grid(db, mongoose.mongo); // Correct initialization
    this.gfs.collection('uploads'); // Set the GridFS collection
  }

  async uploadFile(
    file: Express.Multer.File,
    companyId: string,
  ): Promise<string> {
    const writeStream = this.gfs.createWriteStream({
      filename: file.originalname,
      mode: 'w',
      content_type: file.mimetype,
      metadata: { companyId },
    });

    writeStream.write(file.buffer);
    writeStream.end();

    return new Promise((resolve, reject) => {
      writeStream.on('close', (file) => {
        resolve(file._id.toString());
      });

      writeStream.on('error', (error) => {
        reject(error);
      });
    });
  }

  async getFile(fileId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gfs.files.findOne(
        { _id: new mongoose.Types.ObjectId(fileId) },
        (err, file) => {
          if (!file || err) {
            reject(new NotFoundException('File not found'));
          } else {
            const readStream = this.gfs.createReadStream({ _id: file._id });
            resolve(readStream);
          }
        },
      );
    });
  }
}
