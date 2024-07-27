import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { S3Module } from './s3/s3.module';
import { RestModule } from './rest/rest.module';
import { AppStateModule } from './app-state/app-state.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'))
        return connection
      }
    }),
    AuthModule,
    TokenModule,
    UserModule,
    RolesModule,
    S3Module,
    RestModule,
    AppStateModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
