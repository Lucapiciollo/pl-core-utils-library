import { HomeComponent } from './home.component';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let routerStub: { navigate: jasmine.Spy };
  let activatedRouteStub: {
    params: any;
    queryParams: any;
    data: any;
    snapshot: { queryParams: Record<string, any> };
  };

  const createInjector = () => {
    activatedRouteStub = {
      params: of({}),
      queryParams: of({}),
      data: of({}),
      snapshot: {
        queryParams: {
          preservedA: 'A',
          preservedB: 'B'
        }
      }
    };

    routerStub = {
      navigate: jasmine.createSpy('navigate')
    };

    const genericServiceStub = {};

    return {
      get: (token: any) => {
        switch (token?.name) {
          case 'Router':
            return routerStub;
          case 'ActivatedRoute':
            return activatedRouteStub;
          default:
            return genericServiceStub;
        }
      }
    } as any;
  };

  beforeEach(() => {
    component = new HomeComponent(createInjector());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose params/queryParams/data subjects from base component', (done) => {
    const values: any[] = [];

    (component as any).params.subscribe(() => {
      values.push('params');
      if (values.length === 3) {
        expect(values).toContain('params');
        expect(values).toContain('queryParams');
        expect(values).toContain('data');
        done();
      }
    });

    (component as any).queryParams.subscribe(() => {
      values.push('queryParams');
      if (values.length === 3) {
        expect(values).toContain('params');
        expect(values).toContain('queryParams');
        expect(values).toContain('data');
        done();
      }
    });

    (component as any).data.subscribe(() => {
      values.push('data');
      if (values.length === 3) {
        expect(values).toContain('params');
        expect(values).toContain('queryParams');
        expect(values).toContain('data');
        done();
      }
    });
  });

  it('should execute ngOnInit without throwing', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should navigate with explicit query params', () => {
    component.goToPage('/home', {}, { q: 'test' });

    expect(routerStub.navigate).toHaveBeenCalledWith(['/home'], {
      queryParams: { q: 'test' }
    });
  });

  it('should preserve selected query params from current route', () => {
    component.goToPage('/detail', {}, { local: 'x' }, ['preservedA', 'preservedB']);

    expect(routerStub.navigate).toHaveBeenCalledWith(['/detail'], {
      queryParams: {
        local: 'x',
        preservedA: 'A',
        preservedB: 'B'
      }
    });
  });

  it('should not override explicit query params when preserving', () => {
    component.goToPage('/detail', {}, { preservedA: 'local-A' }, ['preservedA']);

    expect(routerStub.navigate).toHaveBeenCalledWith(['/detail'], {
      queryParams: {
        preservedA: 'local-A'
      }
    });
  });

  it('should pass navigation extras to router.navigate', () => {
    component.goToPage('/target', { replaceUrl: true } as any, { q: 1 });

    expect(routerStub.navigate).toHaveBeenCalledWith(['/target'], {
      replaceUrl: true,
      queryParams: { q: 1 }
    });
  });
});
