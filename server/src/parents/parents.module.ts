import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parent])],
  providers: [ParentsService],
  exports: [TypeOrmModule],
})
export class ParentsModule {}
