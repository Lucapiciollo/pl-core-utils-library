import { Utils } from './utils';

describe('Utils', () => {
  describe('UUIDCODE', () => {
    it('should return a UUID-like string', () => {
      const value = Utils.UUIDCODE();

      expect(typeof value).toBe('string');
      expect(value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate different values across consecutive calls', () => {
      const first = Utils.UUIDCODE();
      const second = Utils.UUIDCODE();

      expect(first).not.toEqual(second);
    });
  });
});
