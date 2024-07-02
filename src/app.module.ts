import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_CONNECTION_STRING'),
        ...getMongoOptions(configService),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

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
