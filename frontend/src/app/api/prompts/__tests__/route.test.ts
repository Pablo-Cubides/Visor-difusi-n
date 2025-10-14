import { GET } from '../route';

describe('/api/prompts', () => {
  it('should return list of prompts', async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      const firstItem = data[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('prompt');
      expect(firstItem).toHaveProperty('description');
      expect(typeof firstItem.id).toBe('string');
      expect(typeof firstItem.prompt).toBe('string');
      expect(typeof firstItem.description).toBe('string');
    }
  });
});