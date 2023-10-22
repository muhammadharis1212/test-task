import { Service } from 'typedi';
import { EntityRepository, getRepository } from 'typeorm';
import { Locus } from '@/entities/locus.entity';
import { Options } from '@/controllers/locus.controller';

@Service()
@EntityRepository()
export class LocusService {
  public getAllLocus = async (options: Options, sideLoading: string, userRole: 'normal' | 'admin' | 'limited') => {
    console.log('options: ', options);
    const locusRepository = getRepository(Locus);

    // Use the query builder to build the query
    const query = locusRepository.createQueryBuilder('rl');
    // .leftJoinAndSelect('locus.locus_members', 'locusMembers') // Perform the join
    switch (userRole) {
      case 'admin':
        console.log('In admin switch');
        if (sideLoading) query.leftJoinAndSelect('rl.locus_members', 'rld');
        if (options.filter) {
          // Assuming options.filter is an enum key (e.g., 'Id', 'AssemblyId', 'RegionId')
          query.where(qb => {
            if (options.filter.assemblyId) {
              qb.andWhere(`rl.assembly_id = :assemblyId`, { assemblyId: options.filter.assemblyId });
            }
            if (options.filter.Id) {
              qb.andWhere(`rl.id = :Id`, { Id: options.filter.Id });
            }

            if (options.filter && (options.filter.regionId || options.filter.membershipStatus)) {
              console.log('regionId : ', options.filter.regionId);
              console.log('membershipStatus : ', options.filter.membershipStatus);

              qb.innerJoin('rl.locus_members', 'qb_rld', 'qb_rld.locus_id = rl.id');

              if (options.filter.regionId) {
                qb.andWhere(`qb_rld.region_id = :regionId`, { regionId: options.filter.regionId });
              }

              if (options.filter.membershipStatus) {
                qb.andWhere(`qb_rld.membership_status = :membershipStatus`, { membershipStatus: options.filter.membershipStatus });
              }
            }
          });

          // Rest of the ordering and pagination logic
          query.orderBy(`rl.${options.sortColumn}`, options.order || 'DESC');
          query.skip(options.skip).take(options.take);
        } else {
          // Default ordering if no filter is specified
          query.orderBy(`rl.${options.sortColumn || 'id'}`, options.order || 'DESC');
          query.skip(options.skip).take(options.take);
        }
        break;
      case 'normal':
        console.log('In normal switch');
        query
          .select()
          .orderBy(`${options.sortColumn || 'id'}`, options.order || 'DESC')
          .skip(options.skip)
          .take(options.take);
        break;
      case 'limited':
        query
          .innerJoinAndSelect('rl.locus_members', 'rld', 'rld.locus_id = rl.id')
          .where('rld.region_id = :regionId', { regionId: options.filter.regionId })

          .orderBy(`rl.${options.sortColumn || 'id'}`, options.order || 'DESC')
          .skip(options.skip)
          .take(options.take);
        break;
    }

    return await query.getMany();
  };
}
