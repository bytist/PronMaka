import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import {
    GlobalMessageType,
    BadRequestHandler,
    GlobalMessageService
} from '@spartacus/core';

import { MakaBaseSiteService } from 'src/app/shared/services/maka-base-site/maka-base-site.service';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class MakaBadRequestHandler extends BadRequestHandler {

  constructor(
    protected baseSiteservice: MakaBaseSiteService,
    protected globalMessageService: GlobalMessageService
  ){
    super(globalMessageService);
  }

  handleError(request: HttpRequest<any>, response: HttpErrorResponse): void {
    this.baseSiteservice.isPartnersSite().pipe(take(1)).subscribe(isPartners => {
      if (isPartners && response.error.error === 'invalid_grant' && response.error.error_description === 'User is disabled'){
        this.globalMessageService
        .add({ key: 'httpHandlers.associate_invalid_grant' }, GlobalMessageType.MSG_TYPE_ERROR);
      } else {
        super.handleError(request, response);
        this.handleDuplicatedUser(response);
        this.handleAssociateIdNotValid(response);
      }
    });
  }

  protected handleDuplicatedUser(response: HttpErrorResponse){
    this.getErrors(response).filter((error) => error.type === 'DuplicatedUserError' || error.type === 'DuplicateUidError')
    .forEach(() => {
      this.globalMessageService.add({ key: 'httpHandlers.duplicatedUser' }, GlobalMessageType.MSG_TYPE_ERROR);
    });
  }

  protected handleAssociateIdNotValid(response: HttpErrorResponse)
  {
    this.getErrors(response).filter((error) => error.type === 'AssociateNotValidError')
    .forEach(() => {
      this.globalMessageService.add({ key: 'httpHandlers.associateNotValidError' }, GlobalMessageType.MSG_TYPE_ERROR);
    });
  }
}
