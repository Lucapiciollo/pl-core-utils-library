import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Item, ListItemComponent } from './list-item.component';

describe('ListItemComponent', () => {
  let component: ListItemComponent;

  beforeEach(() => {
    component = new ListItemComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty drop list ids', () => {
    expect(component.allDropListsIds).toEqual([]);
  });

  it('should disable drag when parentItem is missing', () => {
    component.item = new Item({ name: 'Item A' });

    expect(component.dragDisabled).toBeTrue();
    expect(component.parentItemId).toBe('');
  });

  it('should enable drag when parentItem is present', () => {
    component.item = new Item({ name: 'Child' });
    component.parentItem = new Item({ name: 'Parent' });

    expect(component.dragDisabled).toBeFalse();
    expect(component.parentItemId).toBe(component.parentItem.uId);
  });

  it('should exclude own item id from connectedDropListsIds', () => {
    component.item = new Item({ name: 'Main' });
    component.connectedDropListsIds = ['list-1', component.item.uId, 'list-2'];

    expect(component.connectedDropListsIds).toEqual(['list-1', 'list-2']);
  });

  it('should emit itemDrop on drag drop', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1,
      item: {} as any,
      container: {} as any,
      previousContainer: {} as any,
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 }
    } as CdkDragDrop<Item, Item>;

    const emitSpy = spyOn(component.itemDrop, 'emit');

    component.onDragDrop(event);

    expect(emitSpy).toHaveBeenCalledWith(event);
  });
});
