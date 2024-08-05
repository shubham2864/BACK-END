import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export const AgreementDatabaseModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('AGREEMENT_DB_CONNECTION_STRING'),
    ...getMongoOptions(configService),
  }),
  inject: [ConfigService],
});

function getMongoOptions(
  configService: ConfigService,
): mongoose.ConnectOptions {
  return {
    connectTimeoutMS: 3000,
    directConnection: false,
    enableUtf8Validation: true,
    localThresholdMS: 15,
    maxIdleTimeMS: 0,
    maxPoolSize: 20,
    maxConnecting: 2,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 3000,
    ssl: false,
    tls: false,
  };
}
