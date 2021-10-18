import { PaginationModel } from '@spartacus/core/src/model/misc.model';
import { AssociateCommissionRecord } from './maka-associate-commission-record.model';
import { Filter } from './maka-filters.model';

export interface AssociateCommissionRecordHistoryPage {
  records: AssociateCommissionRecord[];
  pagination: PaginationModel;
  filters: Filter[];
}
