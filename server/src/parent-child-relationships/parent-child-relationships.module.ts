import { Module } from '@nestjs/common';
import { ParentChildRelationshipsService } from './parent-child-relationships.service';
import { ParentChildRelationshipsController } from './parent-child-relationships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentChildRelationship } from './entities/parent-child-relationship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParentChildRelationship])],
  controllers: [ParentChildRelationshipsController],
  providers: [ParentChildRelationshipsService],
  exports: [TypeOrmModule],
})
export class ParentChildRelationshipsModule {}
