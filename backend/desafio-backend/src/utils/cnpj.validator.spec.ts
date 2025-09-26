import { isValidCNPJ, formatCNPJ } from './cnpj.validator';

describe('CNPJ Validator', () => {
  describe('isValidCNPJ', () => {
    it('should validate correct CNPJ', () => {
      const validCNPJs = [
        '11.222.333/0001-81',
        '11222333000181',
        '12.345.678/0001-95',
      ];

      validCNPJs.forEach(cnpj => {
        expect(isValidCNPJ(cnpj)).toBe(true);
      });
    });

    it('should reject invalid CNPJ', () => {
      const invalidCNPJs = [
        '11.222.333/0001-80', // wrong check digit
        '11111111111111', // all same digits
        '123456789', // too short
        '123456789012345', // too long
        '12.345.678/0001-00', // wrong check digit
        '', // empty
        'abc.def.ghi/jklm-no', // non-numeric
      ];

      invalidCNPJs.forEach(cnpj => {
        expect(isValidCNPJ(cnpj)).toBe(false);
      });
    });

    it('should handle CNPJ with and without formatting', () => {
      const formattedCNPJ = '11.222.333/0001-81';
      const unformattedCNPJ = '11222333000181';

      expect(isValidCNPJ(formattedCNPJ)).toBe(true);
      expect(isValidCNPJ(unformattedCNPJ)).toBe(true);
    });
  });

  describe('formatCNPJ', () => {
    it('should format CNPJ correctly', () => {
      const unformattedCNPJ = '11222333000181';
      const expectedFormat = '11.222.333/0001-81';

      expect(formatCNPJ(unformattedCNPJ)).toBe(expectedFormat);
    });

    it('should handle already formatted CNPJ', () => {
      const formattedCNPJ = '11.222.333/0001-81';
      const expectedFormat = '11.222.333/0001-81';

      expect(formatCNPJ(formattedCNPJ)).toBe(expectedFormat);
    });

    it('should remove non-numeric characters before formatting', () => {
      const messyCNPJ = '11.222.333/0001-81';
      const expectedFormat = '11.222.333/0001-81';

      expect(formatCNPJ(messyCNPJ)).toBe(expectedFormat);
    });
  });
});