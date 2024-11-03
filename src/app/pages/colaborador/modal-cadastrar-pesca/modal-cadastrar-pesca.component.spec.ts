import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalCadastrarPescaComponent } from './modal-cadastrar-pesca.component';

describe('ModalCadastrarPescaComponent', () => {
  let component: ModalCadastrarPescaComponent;
  let fixture: ComponentFixture<ModalCadastrarPescaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCadastrarPescaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCadastrarPescaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
