import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeuPerfilColaboradorComponent } from './meu-perfil-colaborador.component';

describe('MeuPerfilColaboradorComponent', () => {
  let component: MeuPerfilColaboradorComponent;
  let fixture: ComponentFixture<MeuPerfilColaboradorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeuPerfilColaboradorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeuPerfilColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
