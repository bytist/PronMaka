import { DebugElement } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  I18nTestingModule,
  User
} from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaUpdateProfileFormComponent } from './maka-update-profile-form.component';
import { MakaUser } from '../../../../core/models/maka-user.model';


const mockUser: MakaUser = {
  titleCode: 'dr',
  firstName: 'N',
  lastName: 'Z',
  uid: 'xxx@xxx.xxx',
  associateId: 'TTT'
};

describe('MakaUpdateProfileFormComponent', () => {
  let component: MakaUpdateProfileFormComponent;
  let fixture: ComponentFixture<MakaUpdateProfileFormComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        I18nTestingModule,
        FormErrorsModule
      ],
      declarations: [ MakaUpdateProfileFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaUpdateProfileFormComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    fixture.detectChanges();
    component.user = mockUser;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call onSubmit() when submit button is clicked', () => {
      spyOn(component, 'onSubmit').and.stub();
      fixture.detectChanges();

      const submitBtn = el.query(By.css('button[type="submit"]'));
      submitBtn.nativeElement.dispatchEvent(new MouseEvent('click'));
      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should NOT emit submitted event if the form is not valid', () => {
      spyOn(component.submitted, 'emit').and.stub();

      const invalidUser: MakaUser = {
        ...mockUser,
        firstName: '',
      };
      component.user = invalidUser;
      component.ngOnInit();

      component.onSubmit();
      expect(component.submitted.emit).not.toHaveBeenCalled();
    });

    it('should emit submitted event', () => {
      spyOn(component.submitted, 'emit').and.stub();
      component.user = mockUser;
      component.ngOnInit();

      component.onSubmit();
      expect(component.submitted.emit).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should call onCancel() on click event', () => {
      spyOn(component, 'onCancel').and.stub();
      const cancelBtn = el.query(By.css('button[type="button"]'));
      cancelBtn.nativeElement.dispatchEvent(new MouseEvent('click'));
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should emit cancelled event', () => {
      spyOn(component.cancelled, 'emit').and.stub();
      component.onCancel();
      expect(component.cancelled.emit).toHaveBeenCalled();
    });
  });
});
