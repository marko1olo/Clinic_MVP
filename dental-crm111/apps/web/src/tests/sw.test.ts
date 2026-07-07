import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swPath = path.join(__dirname, '..', '..', 'public', 'sw.js');
const swCode = fs.readFileSync(swPath, 'utf8');

// Extract the isNetworkFirstShellAsset function
const isNetworkFirstShellAssetMatch = swCode.match(/function isNetworkFirstShellAsset\([^)]+\) {[^}]+}/);
if (!isNetworkFirstShellAssetMatch) {
  throw new Error('Could not find isNetworkFirstShellAsset in sw.js');
}

const isNetworkFirstShellAsset = new Function('url', `
  ${isNetworkFirstShellAssetMatch[0]}
  return isNetworkFirstShellAsset(url);
`);

describe('Service Worker - isNetworkFirstShellAsset', () => {
    it('returns true for JS and CSS files', () => {
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/assets/app.js' }), true);
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/assets/style.css' }), true);
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/main.JS' }), true);
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/main.CSS' }), true);
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/some/deep/path/file.js' }), true);
    });

    it('returns true for root and index.html', () => {
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/' }), true);
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/index.html' }), true);
    });

    it('returns false for other file types', () => {
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/assets/icon.svg' }), false);
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/assets/logo.png' }), false);
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/assets/font.woff2' }), false);
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/offline.html' }), false);
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/manifest.webmanifest' }), false);
    });

    it('returns false for API requests and document routes', () => {
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/api/patients' }), false);
        assert.strictEqual(isNetworkFirstShellAsset({ pathname: '/documents/123' }), false);
    });
});
