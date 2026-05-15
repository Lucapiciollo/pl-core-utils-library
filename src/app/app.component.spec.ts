import { AppComponent, GroupDtoResult, Item } from './app.component';

describe('AppComponent', () => {
  it('should create the component class', () => {
    const component = new AppComponent({} as any, {} as any);
    expect(component).toBeTruthy();
  });

  it('should initialize title as empty string', () => {
    const component = new AppComponent({} as any, {} as any);
    expect(component.title).toBe('');
  });
});

describe('GroupDtoResult', () => {
  it('should initialize items as empty array', () => {
    const result = new GroupDtoResult();
    expect(result.items).toEqual([]);
  });
});

describe('Item', () => {
  it('should create item with generated uId and empty childs by default', () => {
    const item = new Item({ name: 'Root' });

    expect(item.name).toBe('Root');
    expect(item.uId).toBeTruthy();
    expect(item.childs).toEqual([]);
  });

  it('should keep provided childs', () => {
    const child = new Item({ name: 'Child' });
    const item = new Item({ name: 'Parent', childs: [child] });

    expect(item.childs.length).toBe(1);
    expect(item.childs[0]).toBe(child);
  });
});
