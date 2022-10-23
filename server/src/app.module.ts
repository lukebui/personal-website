import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CaslModule } from './casl/casl.module';
import { IndividualsModule } from './individuals/individuals.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: 'personal',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    CaslModule,
    IndividualsModule,
  ],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
