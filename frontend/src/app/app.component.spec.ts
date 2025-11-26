import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent,
                RouterTestingModule,
                HttpClientTestingModule,   
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Servicio Técnico de Informática CCT Tandil' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Servicio Técnico de Informática CCT Tandil');
  });
// ✅ Test generalizado: no depende del texto literal
  it('should render the title property inside an h1', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const h1Text = compiled.querySelector('h1')?.textContent?.trim();

    expect(h1Text).toBe(app.title); // compara con la propiedad del componente
  });
  //it('should render title', () => {
    //const fixture = TestBed.createComponent(AppComponent);
    //fixture.detectChanges();
    //const compiled = fixture.nativeElement as HTMLElement;
    //expect(compiled.querySelector('h1')?.textContent).toContain('Hello, STI-CCT');
  //});
});
