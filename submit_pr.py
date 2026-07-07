import json

data = {
    "title": "🧪 Add tests for isForbiddenRuntimeResponse in sw.js",
    "description": """🎯 **What:** The testing gap addressed
This PR addresses the lack of tests for the `isForbiddenRuntimeResponse` function in the service worker (`apps/web/public/sw.js`). Since it's a pure function containing vital logic to prevent caching API responses and sensitive medical data, it is critical to ensure it behaves correctly.

📊 **Coverage:** What scenarios are now tested
Using the `node:test` framework and the `node:vm` module to securely evaluate the service worker file without modification, the test suite now verifies:
- Correct rejection of `/api/` endpoints
- Protection for sensitive data directories (`/documents`, `/patients`, `/imaging`, `/dicom`, `/files`, `/uploads`, `/medical-documents`)
- Match of exact paths vs substrings (e.g. `/documents` is blocked, but `/documents-info` is allowed)
- Strict case-insensitive blocking for medical/3D extensions (e.g., `.dcm`, `.stl`, `.glb`)
- Expected passing for regular web app shell assets (e.g., `/`, `index.html`, `/assets/styles.css`)

✨ **Result:** The improvement in test coverage
We now have reliable, deterministic tests ensuring that our sensitive user paths and dynamic API routes are not mistakenly subjected to service worker caching, improving the overall reliability and security of the client application.
"""
}

with open("pr.json", "w") as f:
    json.dump(data, f)
