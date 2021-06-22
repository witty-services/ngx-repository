import {NgxRepositoryService} from './ngx-repository.service';
import {TestRepositoryBuilder} from '../testing/test-repository.builder';

describe('NgxRepositoryService', () => {
  let ngxRepositoryService: NgxRepositoryService;

  beforeEach(() => {
    ngxRepositoryService = new NgxRepositoryService(
      null,
      [new TestRepositoryBuilder()]
    );
  });

  it('should return a new repository', () => {

  });
});
