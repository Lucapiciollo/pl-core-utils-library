import { Node } from './node';

describe('Node', () => {
  it('should parse name and title from first line', () => {
    const node = new Node(['Root (CEO)']);

    expect(node.name).toBe('Root');
    expect(node.title).toBe('CEO');
  });

  it('should create child nodes from indented structure', () => {
    const node = new Node([
      'Root (CEO)',
      ' Child 1 (Lead)',
      ' Child 2 (Manager)'
    ]);

    expect(node.childs.length).toBe(2);
    expect(node.childs[0].name).toBe('Child 1');
    expect(node.childs[1].name).toBe('Child 2');
  });

  it('should keep parent reference in child nodes', () => {
    const node = new Node([
      'Root (CEO)',
      ' Child 1 (Lead)'
    ]);

    expect(node.childs[0].parent).toBe(node);
  });

  it('should build nested hierarchy with deeper indentation', () => {
    const node = new Node([
      'Root (CEO)',
      ' Child 1 (Lead)',
      '  Grand Child (Dev)'
    ]);

    expect(node.childs.length).toBe(1);
    expect(node.childs[0].childs.length).toBe(1);
    expect(node.childs[0].childs[0].name).toBe('Grand Child');
    expect(node.childs[0].childs[0].title).toBe('Dev');
  });
});
