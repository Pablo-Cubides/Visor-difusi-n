import { GET } from '../route';

describe('/api/noise/[step]', () => {
  it('should return noise image for valid step', async () => {
    const mockParams = { step: '2' };
    const mockRequest = {} as any;

    const response = await GET(mockRequest, { params: mockParams });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('step', 2);
    expect(data).toHaveProperty('noise_image');
    expect(typeof data.noise_image).toBe('string');
    expect(data.noise_image.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('should return 404 for invalid step', async () => {
    const mockParams = { step: '15' }; // Invalid step
    const mockRequest = {} as any;

    const response = await GET(mockRequest, { params: mockParams });
    expect(response.status).toBe(404);
  });
});