import {
    HttpErrorResponse,
    HttpRequest
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
    GlobalMessageService,
    GlobalMessageType
} from '@spartacus/core';

import { MakaBadRequestHandler } from './maka-bad-request.handler';
import { MakaBaseSiteService } from '../../../../../shared/services/maka-base-site/maka-base-site.service';
import { of } from 'rxjs';

const MockRequest = {} as HttpRequest<any>;

const MockDuplicatedUserResponse = {
    error: {
        errors: [
          {
            type: 'DuplicatedUserError'
          }
        ]
    }
} as HttpErrorResponse;

const MockAssociateInvalidGrantResponse = {
  error: {
      error: 'invalid_grant',
      error_description : 'User is disabled'
  }
} as HttpErrorResponse;

const MockAssociateNotValidResponse = {
  error: {
      errors: [
        {
          type: 'AssociateNotValidError'
        }
      ]
  }
} as HttpErrorResponse;

class MockGlobalMessageService {
    add() {}
}

class MockMakaBaseSiteService {
  isPartnersSite() {
    return of(true);
  }
}

describe('MakaBadRequestHandler', () => {
    let service: MakaBadRequestHandler;
    let globalMessageService: GlobalMessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            MakaBadRequestHandler,
            {
              provide: GlobalMessageService,
              useClass: MockGlobalMessageService,
            },
            {
              provide: MakaBaseSiteService,
              useClass: MockMakaBaseSiteService,
            },
          ],
        });
        service = TestBed.inject(MakaBadRequestHandler);
        globalMessageService = TestBed.inject(GlobalMessageService);

        spyOn(globalMessageService, 'add');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should handle duplicated user error', () => {
        service.handleError(MockRequest, MockDuplicatedUserResponse);
        expect(globalMessageService.add).toHaveBeenCalledWith(
            { key: 'httpHandlers.duplicatedUser' },
            GlobalMessageType.MSG_TYPE_ERROR
        );
    });

    it('should handle associate invalid grant error', () => {
      service.handleError(MockRequest, MockAssociateInvalidGrantResponse);
      expect(globalMessageService.add).toHaveBeenCalledWith(
          { key: 'httpHandlers.associate_invalid_grant' },
          GlobalMessageType.MSG_TYPE_ERROR
      );
    });

    it('should handle associate not valid error', () => {
      service.handleError(MockRequest, MockAssociateNotValidResponse);
      expect(globalMessageService.add).toHaveBeenCalledWith(
          { key: 'httpHandlers.associateNotValidError' },
          GlobalMessageType.MSG_TYPE_ERROR
      );
    });
});
