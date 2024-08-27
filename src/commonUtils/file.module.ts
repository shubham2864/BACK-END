import { Module, forwardRef } from '@nestjs/common';
import { FileService } from './file.service';
import { BankDetailsModule } from 'src/bankDetails/banks.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/DEMO1'), // Ensure this is the correct DB connection
    forwardRef(() => BankDetailsModule), // Use forwardRef if there's a circular dependency
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
