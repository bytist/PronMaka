import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { GlobalMessageService, GlobalMessageType } from '@spartacus/core';

import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { MakaPartner } from '../../../../core/models/maka-user.model';
import { MakaCfdiUploadService} from '../../../../shared/services/maka-common/cfdi-upload-service';
import { MakaError } from '../../../../core/models/maka-misc.model';
import { MakaCommissionPaymentService } from './maka-commission-payment.service';


@Component({
  selector: 'app-maka-commission-payment',
  templateUrl: './maka-commission-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaCommissionPaymentComponent {
  @ViewChild('fileUpload', { static: false })
  fileUpload: ElementRef;

  currentFile: File;
  progress = 0;
  disableForm = false;
  invalidFileType = false;
  imputableErrors = ['101'];

  partner$: Observable<MakaPartner> = this.makaAssociateService.getCurrentAssociate();
  commissionRecord$ = this.makaAssociateService.getLastPayableCommissionRecordForCurrentAssociate();

  constructor(private makaAssociateService: MakaAssociateService,
              private makaCfdiUploadService: MakaCfdiUploadService,
              private globalMessageService: GlobalMessageService,
              private makaCommissionPaymentService: MakaCommissionPaymentService,
              private changeDetector: ChangeDetectorRef) {}

  onLoadCfdiClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.click();
  }

  selectFile(event) {
    if (event.target.files.item(0)) {
      this.invalidFileType = !event.target.files.item(0).type.match(/xml/);
      this.currentFile = null;
      if (!this.invalidFileType) {
        this.currentFile = event.target.files.item(0);
      }
    }
  }

  getErrorMessage(errors: MakaError[]) {
    return errors.map(error => error.message).join(' ');
  }

  showGlobalMessage(event) {
    if (event.body.errors && event.body.errors.length > 0) {
      const errorMessage = this.imputableErrors.indexOf(event.body.errors[0].errorCode) >= 0 ?
        this.getErrorMessage(event.body.errors) : { key: 'partner.commissions.errors.errorUpload' };
      this.globalMessageService.add(
        errorMessage,
        GlobalMessageType.MSG_TYPE_ERROR
      );
    } else {
      this.globalMessageService.add(
        { key: 'partner.commissions.cfdiSuccess' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    }
  }

  onCollectClick(){
    this.progress = 10;

    this.makaCfdiUploadService.uploadFile(this.currentFile)
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.showGlobalMessage(event);
          this.progress = 0;
          this.disableForm = (event.body.commissionRecord) ? !event.body.commissionRecord.isPayable : false;
          this.fileUpload.nativeElement.value = '';
          this.currentFile = null;
          this.makaCommissionPaymentService.updateCommissionPaymentStatus(true);
        }
        this.changeDetector.detectChanges();
      },
      (err) => {
        this.progress = 0;
        this.disableForm = false;
        this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
        this.globalMessageService.add(
          { key: 'partner.commissions.errors.errorUpload' },
          GlobalMessageType.MSG_TYPE_ERROR
        );
        this.changeDetector.detectChanges();
      }
    );
  }

}
