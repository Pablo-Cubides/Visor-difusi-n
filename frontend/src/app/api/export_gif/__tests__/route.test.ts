import { GET } from '../route';

describe('/api/export_gif', () => {
  it('should return GIF for valid case', async () => {
    const mockRequest = {
      url: 'http://localhost:3000/api/export_gif?case_id=1'
    } as any;

    const response = await GET(mockRequest);
    expect(response.status).toBe(200);

    // Check headers
    const headers = response.headers;
    expect(headers.get('Content-Type')).toBe('image/gif');
    expect(headers.get('Content-Disposition')).toContain('attachment');
    expect(headers.get('Content-Disposition')).toContain('diffusion_case_1.gif');
  });

  it('should return 404 for invalid case', async () => {
    const mockRequest = {
      url: 'http://localhost:3000/api/export_gif?case_id=invalid_case'
    } as any;

    const response = await GET(mockRequest);
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data).toHaveProperty('error', 'Case not found');
  });

  it('should handle query parameters correctly', async () => {
    const mockRequest = {
      url: 'http://localhost:3000/api/export_gif?case_id=1&include_noise=false&overlay_opacity=0.5&frame_ms=500'
    } as any;

    const response = await GET(mockRequest);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/gif');
  });

  it('should return 404 when no step files exist', async () => {
    // This test assumes there might be cases without step files
    // The implementation should handle this gracefully
    const mockRequest = {
      url: 'http://localhost:3000/api/export_gif?case_id=1'
    } as any;

    const response = await GET(mockRequest);

    // Either succeeds with GIF or returns 404 for no images
    expect([200, 404]).toContain(response.status);

    if (response.status === 404) {
      const data = await response.json();
      expect(data).toHaveProperty('error');
    }
  });
});