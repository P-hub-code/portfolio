import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { InitializePaymentDto } from './initialize-payment.dto';

describe('InitializePaymentDto Customer Name Validation', () => {
  const baseValidPayload = {
    email: 'test@example.com',
    amount: 10000,
    customerPhone: '+2250759723109',
    description: 'Fitness',
  };

  const validateDto = async (customerName: unknown, extraProps: Record<string, unknown> = {}) => {
    const instance = plainToInstance(InitializePaymentDto, {
      ...baseValidPayload,
      customerName,
      ...extraProps,
    });
    return validate(instance);
  };

  describe('Valid francophone and real customer names (ACCEPTÉ)', () => {
    it.each([
      'Pascal Kouadio',
      'Jean Pierre',
      'Jean-Pierre',
      'Jean Pierre Kouassi',
      "N'Guessan Kouadio",
      'N’Guessan Kouadio',
      'Kouadio Éric',
      'Adama Traoré',
      'François de l’Aulnay',
      'Éric',
    ])('should accept valid name: "%s"', async (name) => {
      const errors = await validateDto(name);
      const nameErrors = errors.filter((err) => err.property === 'customerName');
      expect(nameErrors.length).toBe(0);
    });
  });

  describe('Invalid customer names (REFUSÉ)', () => {
    it('should reject empty string ""', async () => {
      const errors = await validateDto('');
      const nameErrors = errors.filter((err) => err.property === 'customerName');
      expect(nameErrors.length).toBeGreaterThan(0);
    });

    it('should reject whitespace-only string', async () => {
      const errors = await validateDto('   ');
      const nameErrors = errors.filter((err) => err.property === 'customerName');
      expect(nameErrors.length).toBeGreaterThan(0);
    });

    it('should reject value containing HTML / script tags', async () => {
      const errors = await validateDto('<script>alert("hack")</script>');
      const nameErrors = errors.filter((err) => err.property === 'customerName');
      expect(nameErrors.length).toBeGreaterThan(0);
      expect(nameErrors[0].constraints?.matches).toBe(
        'Le nom contient des caractères non autorisés.',
      );
    });

    it('should reject value with HTML tags like "Pascal <br> Kouadio"', async () => {
      const errors = await validateDto('Pascal <br> Kouadio');
      const nameErrors = errors.filter((err) => err.property === 'customerName');
      expect(nameErrors.length).toBeGreaterThan(0);
      expect(nameErrors[0].constraints?.matches).toBe(
        'Le nom contient des caractères non autorisés.',
      );
    });

    it('should reject name with special non-name characters like "@" or "$"', async () => {
      const errors = await validateDto('Pascal $ Kouadio');
      const nameErrors = errors.filter((err) => err.property === 'customerName');
      expect(nameErrors.length).toBeGreaterThan(0);
      expect(nameErrors[0].constraints?.matches).toBe(
        'Le nom contient des caractères non autorisés.',
      );
    });
  });

  describe('Boundary and trimming rules', () => {
    it('should accept name with leading/trailing spaces by trimming it', async () => {
      const instance = plainToInstance(InitializePaymentDto, {
        ...baseValidPayload,
        customerName: '   Pascal Kouadio   ',
      });
      const errors = await validate(instance);
      expect(instance.customerName).toBe('Pascal Kouadio');
      expect(errors.length).toBe(0);
    });

    it('should reject single letter name (too short)', async () => {
      const errors = await validateDto('A');
      const nameErrors = errors.filter((err) => err.property === 'customerName');
      expect(nameErrors.length).toBeGreaterThan(0);
    });
  });
});
