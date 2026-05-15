import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;

  beforeEach(() => {
    component = new UserComponent();
    component.user = {
      id: 'root',
      uId: 'root-uid',
      name: 'Root',
      fathers: [],
      sons: [],
      users: [],
      approvers: []
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set input user into internal _user', () => {
    const user = { id: 'x', uId: 'x-uid', name: 'X' } as any;

    component.user = user;

    expect(component._user).toBe(user);
  });

  it('should move item within same container', () => {
    const containerData = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const sameContainer = { id: 'sonsToAdd', data: containerData };
    const event = {
      previousContainer: sameContainer,
      container: sameContainer,
      previousIndex: 0,
      currentIndex: 2
    } as any as CdkDragDrop<any[]>;

    component.drop(event);

    expect(containerData.map(x => x.id)).toEqual(['b', 'c', 'a']);
  });

  it('should transfer between fathersToAdd and sonsToAdd when item is not duplicate', () => {
    const previous = [{ id: 'a' }];
    const current: any[] = [];

    const event = {
      previousContainer: { id: 'fathersToAdd', data: previous },
      container: { id: 'sonsToAdd', data: current },
      previousIndex: 0,
      currentIndex: 0
    } as any as CdkDragDrop<any[]>;

    component.drop(event);

    expect(previous.length).toBe(0);
    expect(current.length).toBe(1);
    expect(current[0].id).toBe('a');
  });

  it('should copy item for non fathers/sons lists', () => {
    const previous = [{ id: 'x' }];
    const current: any[] = [];

    const event = {
      previousContainer: { id: 'users', data: previous },
      container: { id: 'approvalToAdd', data: current },
      previousIndex: 0,
      currentIndex: 0
    } as any as CdkDragDrop<any[]>;

    component.drop(event);

    expect(previous.length).toBe(1);
    expect(current.length).toBe(1);
    expect(current[0].id).toBe('x');
  });

  it('should not copy duplicate id into destination list', () => {
    const previous = [{ id: 'dup' }];
    const current: any[] = [{ id: 'dup' }];

    const event = {
      previousContainer: { id: 'users', data: previous },
      container: { id: 'approvalToAdd', data: current },
      previousIndex: 0,
      currentIndex: 1
    } as any as CdkDragDrop<any[]>;

    component.drop(event);

    expect(current.length).toBe(1);
  });

  it('should not copy when dragged item id equals current user uId', () => {
    component.user = {
      id: 'self-id',
      uId: 'self-id',
      name: 'Self',
      fathers: [],
      sons: []
    } as any;

    const previous = [{ id: 'self-id' }];
    const current: any[] = [];

    const event = {
      previousContainer: { id: 'users', data: previous },
      container: { id: 'approvalToAdd', data: current },
      previousIndex: 0,
      currentIndex: 0
    } as any as CdkDragDrop<any[]>;

    component.drop(event);

    expect(current.length).toBe(0);
  });
});
