import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, takeUntil, switchMap, mergeMap, take, map, filter } from 'rxjs/operators';
import { Observable, Subject, of, iif, combineLatest } from 'rxjs';
import {
  GlobalMessageService,
  GlobalMessageType,
  UserService,
  AuthService
} from '@spartacus/core';

import { MakaUser, MakaPartner, AssociateStatus } from '../../../../core/models/maka-user.model';
import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { MakaActiveCartService } from '../../../../shared/services/maka-cart/maka-active-cart.service';
import { MakaCart } from '../../../../core/models/maka-cart.model';

@Component({
  selector: 'app-maka-partner-form',
  templateUrl: './maka-partner-form.component.html',
})
export class MakaPartnerFormComponent implements OnInit, OnDestroy {

  partnerForm: FormGroup = this.formBuilder.group({
    associateId: ['']
  });

  user$: Observable<MakaUser> = this.userService.get();
  cart$: Observable<MakaCart> = this.makaActiveCartService.getActive();
  userId$: Observable<string> = this.authService.getOccUserId();
  cartId$: Observable<string> = this.makaActiveCartService.getActiveCartId();
  cartParams: { userId: string, cartId: string };
  private unsubscribe$ = new Subject<void>();
  usingUserAssociateId = false;
  associateDefaultId = 'default';
  previousAssociateId = '';

  constructor(
    protected formBuilder: FormBuilder,
    protected userService: UserService,
    protected makaAssociateService: MakaAssociateService,
    protected makaActiveCartService: MakaActiveCartService,
    protected globalMessageService: GlobalMessageService,
    protected authService: AuthService,
    protected changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
      combineLatest([
        this.userId$,
        this.cartId$
      ])
      .pipe(
        take(1),
        map(([userId, cartId]) => {
          this.cartParams = { cartId, userId };
          this.makaActiveCartService.loadCart(userId, cartId); // get cart from API
        }),
        switchMap(() => this.makaActiveCartService.getLoading()),
        filter((isLoaded) => isLoaded), // wait until the cart is loaded
        take(1),
        switchMap(() => combineLatest(([this.cart$, this.user$]))),
        take(1),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(([cart, user]) => {
        if ((cart.associateId || user.associateId)) {
          this.previousAssociateId = (cart.associateId) ? cart.associateId : user.associateId;
          this.partnerForm.patchValue({
            associateId: this.previousAssociateId
          });

          this.usingUserAssociateId = !cart.associateId || (cart.associateId === user.associateId);
          this.setAssociateId();
        }
      });
  }

  addAssociateId(cartId: string, userId: string, associateId: string, preloaded: boolean): Observable<MakaPartner> {
    return this.makaActiveCartService.addAssociateId(cartId, userId, associateId)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          return of(null);
        }),
        switchMap((partner: MakaPartner) => {
          if (partner) {
            const messageKey = preloaded ? 'paymentForm.defaultPartnerSuccess' : 'paymentForm.partnerSuccess';
            this.globalMessageService.add(
              { key: messageKey, params: { name: `${partner.firstName} ${partner.lastName}` }},
              GlobalMessageType.MSG_TYPE_CONFIRMATION
            );

            if (preloaded) {
              this.partnerForm.disable();
              this.changeDetector.detectChanges();
            }

            this.previousAssociateId = associateId;
            return of(partner);

          } else {
            this.globalMessageService.add(
              { key: 'paymentForm.partnerError' },
              GlobalMessageType.MSG_TYPE_ERROR
            );
            return of(null);
          }
        })
      );
  }

  removeAssociateId(cartId: string, userId: string, associateId: string): Observable<boolean> {

    if (!this.partnerForm.get('associateId').value && !this.previousAssociateId) {
      this.globalMessageService.add(
        { key: 'paymentForm.partnerEmpty' },
        GlobalMessageType.MSG_TYPE_ERROR
      );
      return of(false);
    }

    return this.makaActiveCartService.removeAssociateId(cartId, userId, associateId).pipe(
      takeUntil(this.unsubscribe$),
      switchMap(success => {
        // TODO - uncomment if associate id needs to be removed on failure
        // this.partnerForm.get('associateId').setValue('');

        if (associateId === this.associateDefaultId) {
          this.globalMessageService.add(
            { key: 'paymentForm.partnerRemovalSuccess' },
            GlobalMessageType.MSG_TYPE_CONFIRMATION
          );
        } else {
          this.globalMessageService.add(
            { key: 'paymentForm.partnerError' },
            GlobalMessageType.MSG_TYPE_ERROR
          );
        }
        this.previousAssociateId = '';

        return of(false);
      })
    );
  }

  setAssociateId() {
    const associateId: string = this.partnerForm.get('associateId').value || this.associateDefaultId;
    const addAssociateId$ = this.addAssociateId(this.cartParams.cartId, this.cartParams.userId, associateId, this.usingUserAssociateId);
    const removeAssociateId$ = this.removeAssociateId(this.cartParams.cartId, this.cartParams.userId, associateId);
    this.makaAssociateService.search(associateId)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          return of(null);
        }),
        mergeMap(partner => iif(() => (Boolean(partner) && partner.associateStatus === AssociateStatus.ACTIVE),
          addAssociateId$,
          removeAssociateId$
        ))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
