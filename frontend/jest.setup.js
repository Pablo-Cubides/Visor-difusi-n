require('@testing-library/jest-dom');

// Mock Web APIs for Next.js
const MockRequest = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = new Map();
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        this.headers.set(key, value);
      });
    }
  }

  async json() {
    return {};
  }

  async text() {
    return '';
  }
};

const MockResponse = class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.statusText = options.statusText || '';
    this.headers = new Map();
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        this.headers.set(key, value);
      });
    }
  }

  async json() {
    if (typeof this.body === 'string') {
      try {
        return JSON.parse(this.body);
      } catch {
        return this.body;
      }
    }
    return this.body;
  }

  async text() {
    if (typeof this.body === 'string') {
      return this.body;
    }
    return JSON.stringify(this.body);
  }

  get ok() {
    return this.status >= 200 && this.status < 300;
  }

  // Add static method if Next.js expects it
  static json(data, options = {}) {
    return new MockResponse(JSON.stringify(data), {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  }
};

global.Request = MockRequest;
global.Response = MockResponse;

// Mock NextRequest and NextResponse
global.NextRequest = global.Request;
global.NextResponse = {
  json: (data, options = {}) => new global.Response(JSON.stringify(data), {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  }),
  redirect: (url) => new global.Response('', { status: 302, headers: { Location: url } })
};
