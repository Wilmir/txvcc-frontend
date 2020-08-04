import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNetworkComponent } from './update-network.component';

describe('UpdateNetworkComponent', () => {
  let component: UpdateNetworkComponent;
  let fixture: ComponentFixture<UpdateNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
