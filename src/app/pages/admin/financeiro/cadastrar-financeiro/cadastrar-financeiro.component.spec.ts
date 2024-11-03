import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadastrarFinanceiroComponent } from './cadastrar-financeiro.component';

describe('CadastrarFinanceiroComponent', () => {
  let component: CadastrarFinanceiroComponent;
  let fixture: ComponentFixture<CadastrarFinanceiroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastrarFinanceiroComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
