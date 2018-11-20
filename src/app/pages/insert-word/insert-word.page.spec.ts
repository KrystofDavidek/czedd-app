import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertWordPage } from './insert-word.page';

describe('InsertWordPage', () => {
  let component: InsertWordPage;
  let fixture: ComponentFixture<InsertWordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertWordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertWordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
