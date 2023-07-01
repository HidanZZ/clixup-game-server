import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { PrizeLog } from '@/interfaces/prizeLog.interface';
import { PrizeLogModel } from '@/models/prizeLog.model';

@Service()
export class PrizeLogService {
  public async create(data: PrizeLog): Promise<PrizeLog> {
    try {
      const log = await PrizeLogModel.create(data);
      return log;
    } catch (err) {
      throw new HttpException(500, err.message);
    }
  }
}
