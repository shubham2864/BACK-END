import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AgreementModule } from './agreement/agreement.module';
import { CompaniesModule } from './company/company.module';
import { BankDetailsModule } from './bankDetails/banks.module';
import { FileModule } from './commonUtils/file.module';

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
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    AgreementModule,
    CompaniesModule,
    BankDetailsModule,
    FileModule
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
    // enableUtf8Validation: true,
    localThresholdMS: 15,
    maxIdleTimeMS: 0,
    maxPoolSize: 20,
    // maxConnecting: 2,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 3000,
    ssl: false,
    tls: false,
  };
}
