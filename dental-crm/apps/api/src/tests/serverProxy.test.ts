import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupProxyAndTunnels } from '../server.js';
import * as tunnelModule from '../speech/tunnel.js';
import * as keyPoolModule from '../speech/keyPool.js';
import net from "node:net";

vi.mock('../speech/tunnel.js', () => ({
  ensureSshTunnel: vi.fn(),
}));

vi.mock('../speech/keyPool.js', () => ({
  getProxyAgent: vi.fn(),
}));

vi.mock('node:net', () => {
    return {
        default: {
            connect: vi.fn(),
        }
    }
});


describe('setupProxyAndTunnels', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.HTTPS_PROXY;
    delete process.env.HTTP_PROXY;
    delete process.env.PROXY_URL;
  });

  afterEach(() => {
    delete (globalThis as any)._dentalProxyAgent;
    process.env = { ...originalEnv };
  });

  it('sets up proxy if SSH tunnel is successful', async () => {
    vi.mocked(tunnelModule.ensureSshTunnel).mockResolvedValue(true);
    vi.mocked(keyPoolModule.getProxyAgent).mockReturnValue('mock-agent' as any);

    await setupProxyAndTunnels();

    expect(process.env.HTTPS_PROXY).toBe('socks5://127.0.0.1:1080');
    expect(process.env.HTTP_PROXY).toBe('socks5://127.0.0.1:1080');
    expect(process.env.PROXY_URL).toBe('socks5://127.0.0.1:1080');
    expect((globalThis as any)._dentalProxyAgent).toBe('mock-agent');
  });

  it('handles SSH tunnel failure gracefully and unsets env vars if proxy offline', async () => {
    vi.mocked(tunnelModule.ensureSshTunnel).mockRejectedValue(new Error('SSH Error'));
    vi.mocked(keyPoolModule.getProxyAgent).mockReturnValue(undefined as any);

    process.env.HTTPS_PROXY = 'socks5://127.0.0.1:9999';

    // Mock proxy check to return false (offline)
    const mockSocket = {
      end: vi.fn(),
      setTimeout: vi.fn(),
      on: vi.fn((event, cb) => {
        if (event === 'error') cb(new Error('connection failed'));
      }),
      destroy: vi.fn()
    };
    vi.mocked(net.connect).mockImplementation(() => mockSocket as any);

    await setupProxyAndTunnels();

    expect(process.env.HTTPS_PROXY).toBeUndefined();
    expect(process.env.HTTP_PROXY).toBeUndefined();
    expect(process.env.PROXY_URL).toBeUndefined();
    expect((globalThis as any)._dentalProxyAgent).toBeUndefined();
  });

  it('leaves env vars if SSH tunnel fails but configured proxy is online', async () => {
    vi.mocked(tunnelModule.ensureSshTunnel).mockResolvedValue(false);

    process.env.HTTPS_PROXY = 'socks5://127.0.0.1:8888';

    // Mock proxy check to return true (online)
    const mockSocket = {
      end: vi.fn(),
      setTimeout: vi.fn(),
      on: vi.fn(),
      destroy: vi.fn()
    };
    vi.mocked(net.connect).mockImplementation((port, host, cb) => {
      if(typeof cb === 'function') {
         setImmediate(cb);
      } else if (typeof host === 'function') {
         setImmediate(host);
      }
      return mockSocket as any;
    });

    await setupProxyAndTunnels();

    expect(process.env.HTTPS_PROXY).toBe('socks5://127.0.0.1:8888');
  });

  it('unsets env vars if SSH tunnel fails, proxy configured but offline by timeout', async () => {
    vi.mocked(tunnelModule.ensureSshTunnel).mockResolvedValue(false);

    process.env.HTTPS_PROXY = 'socks5://127.0.0.1:8888';

    // Mock proxy check to timeout
    const mockSocket = {
      end: vi.fn(),
      setTimeout: vi.fn(),
      on: vi.fn((event, cb) => {
        if (event === 'timeout') cb();
      }),
      destroy: vi.fn()
    };
    vi.mocked(net.connect).mockImplementation(() => mockSocket as any);

    await setupProxyAndTunnels();

    expect(process.env.HTTPS_PROXY).toBeUndefined();
  });

  it('handles bad URL gracefully during proxy check', async () => {
    vi.mocked(tunnelModule.ensureSshTunnel).mockResolvedValue(false);
    process.env.HTTPS_PROXY = 'invalid url structure';
    await setupProxyAndTunnels();
    expect(process.env.HTTPS_PROXY).toBeUndefined();
  });
});
