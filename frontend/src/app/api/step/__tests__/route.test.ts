import { POST } from '../route';

describe('/api/step', () => {
  it('should return step data for valid request', async () => {
    const mockRequest = {
      json: async () => ({ prompt_id: '1', step: 1 })
    } as any;

    const response = await POST(mockRequest);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('step');
    expect(data).toHaveProperty('intermediate_image');
    expect(data).toHaveProperty('educational_text');
    expect(data).toHaveProperty('is_finished');
    expect(data).toHaveProperty('total_steps');
    expect(typeof data.intermediate_image).toBe('string');
    expect(typeof data.educational_text).toBe('string');
    expect(typeof data.is_finished).toBe('boolean');
  });

  it('should return 404 for invalid case', async () => {
    const mockRequest = {
      json: async () => ({ prompt_id: 'invalid_case', step: 1 })
    } as any;

    const response = await POST(mockRequest);
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Case not found');
  });

  it('should handle step bounds correctly', async () => {
    const mockRequest = {
      json: async () => ({ prompt_id: '1', step: 100 }) // Very high step
    } as any;

    const response = await POST(mockRequest);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.step).toBeLessThanOrEqual(data.total_steps);
  });
});