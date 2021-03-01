import {Mock} from './mock.model';
import {AbstractRepository} from '../lib/repository/abstract.repository';

export class MockRepository extends AbstractRepository<Mock, any, any, any> {
  public constructor() {
    super(null, null, null, null, null, null, null, null);
  }

}
