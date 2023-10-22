import Container from 'typedi';
import { NextFunction, Response } from 'express';
import { LocusService } from '@/services/locus.service';
import { AuthRequest } from '@/interfaces/auth.interface';
import { convertKeysToCamelCase } from '@/utils/snaketocamel';

enum Sorting {
  // Add sorting options as needed
  Ascending = 'asc',
  Descending = 'desc',
}

enum Filters {
  Id = 'Id',
  AssemblyId = 'assemblyId',
  RegionId = 'regionId',
  MembershipStatus = 'membershipStatus',
}
enum SideLoading {
  LocusMembers = 'locusMembers',
}
export interface Options {
  take: number;
  skip: number;
  filter?: Record<Filters, any>;
  order?: 'ASC' | 'DESC';
  sortColumn: 'id' | 'assembly_id' | 'region_id' | 'membership_status';
}

export class LocusController {
  public locus = Container.get(LocusService);

  public getLocuses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Get filter parameters from the query string
      const { sideLoading, page, limit, sort, sortColumn } = req.query;
      const { role } = req?.user;

      // Define default values for page and limit
      const defaultPage = 1;
      const defaultLimit = 1000;

      // Parse page and limit as integers, or use default values
      const pageNumber = parseInt(page as string, 10) || defaultPage;
      const limitNumber = parseInt(limit as string, 10) || defaultLimit;
      const sortingOrder = (sort as Sorting) || Sorting.Ascending; // Use a default value if needed
      const sortingColumn = (sortColumn as Options['sortColumn']) || 'id';
      const sideLoad = (sideLoading as SideLoading) || undefined;

      // Calculate the offset based on the page and limit
      const offset = (pageNumber - 1) * limitNumber;

      // Initialize the filter object
      const filter: Record<string, any> = {};

      // Extract specific filter parameters from the query
      if (req.query.assemblyId) {
        filter[Filters.AssemblyId] = req.query.assemblyId as string;
      }
      if (req.query.Id) {
        filter[Filters.Id] = parseInt(req.query.Id as string, 10);
      }
      if (req.query.regionId) {
        filter[Filters.RegionId] = parseInt(req.query.regionId as string, 10);
      }
      if (req.query.membershipStatus) {
        filter[Filters.MembershipStatus] = req.query.membershipStatus as string;
      }
      // Validate if the provided filter values belong to the Filters enum
      for (const key of Object.keys(filter)) {
        if (!Object.values(Filters).includes(key as Filters)) {
          return res.status(400).json({ error: `Invalid filter parameter: ${key}` });
        }
      }

      console.log('SideLoading : ', sideLoading);
      // Check if "sideloading" is specified as "locusMembers"
      if (sideLoading === SideLoading.LocusMembers) {
        // Handle sideloading permission
        if (role !== 'admin') {
          return res.status(403).json({ error: 'Permission denied' });
        }
      }
      if (role === 'normal') {
        // Normal user can only access data from the 'rl' table
        if (filter.regionId || filter.membershipStatus) return res.status(403).json({ error: 'Permission denied' });
      } else if (role === 'limited') {
        // Limited user can only access data for specific 'regionId' values
        const specificRegionId = [86118093, 86696489, 88186467];
        if (!specificRegionId.includes(filter.regionId)) {
          return res.status(403).json({ error: 'Permission denied, Can only access data of region: 86118093, 86696489, 88186467' });
        }
      }
      console.log('FIlter : ', filter);

      const options: Options = {
        take: limitNumber,
        skip: offset,
        filter: filter,
        sortColumn: sortingColumn,
      };

      if (filter) {
        options.order = sortingOrder.toUpperCase() as Options['order'];
        // options.filter = filter as Filters;
      }
      console.log('Options : ', options);
      const locusData = await this.locus.getAllLocus(options, sideLoad, role);
      const camelCaseLocusData = convertKeysToCamelCase(locusData);

      res.json(camelCaseLocusData);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
