import json

config_path = r"C:\Clinic_MVP\config.json"

config_data = {
    "watch_dir": "C:\\Clinic_MVP\\Dropzone_XRay",
    "groq_api_keys": [
        "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",
        "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",
        "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",
        "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",
        "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"
    ],
    "groq_vision_model": "meta-llama/llama-4-scout-17b-16e-instruct",
    "google_api_keys": [
        "AQ.Ab8RN6I0rdGYG0hCAGheByDr_2X-QEHVHq3Xx5wAdi9lOo2qbw",
        "AQ.Ab8RN6IzvkaJlttBQbkNVnYjPVbWt1PqJca7gXjHCgLWKix4bA",
        "AQ.Ab8RN6LBgRdHOyiWdFGfs9OA9BWg8dWJE--D2yu2Urjp38CkMw",
        "AQ.Ab8RN6Jj6m3j5aJJwexuarqu6UxdGveXzieWtsjr5TSDUTyR8A"
    ],
    "use_gemini": True,
    "gemini_vision_model": "gemini-3.5-flash",
    "mqtt_host": "62.84.100.97",
    "mqtt_port": 1883,
    "mqtt_user": "clinic",
    "mqtt_pass": "clinic2024",
    "mqtt_topic_xray": "clinic/xray/result",
    "auto_analyze": True,
    "auto_enhance": False,
    "theme": "theme-noir",
    "tts_voice": "ru-RU-DmitryNeural",
    "model_tier": 2,  # Recommended default: Qwen 3.6 + Llama 4
    "comparison_slider": True,
    "tts_provider": "edge",
    "elevenlabs_api_key": "sk_7ec26dd2067a1110f4cd27a2d2ea18e9f536a7256d9065e4",
    "elevenlabs_api_keys": [
        "sk_7ec26dd2067a1110f4cd27a2d2ea18e9f536a7256d9065e4",
        "sk_f891c9ef32d99fa018749f081d00f84d092ea2120bf5db1a",
        "sk_f71e9d767c1b151745f78117aad2a9678c84ea23881e5544"
    ],
    "elevenlabs_voice_id": "pNInz6obpgq54HWK483c"
}

with open(config_path, "w", encoding="utf-8") as f:
    json.dump(config_data, f, indent=4, ensure_ascii=False)

print("SUCCESS: config.json has been rebuilt perfectly with new Gemini keys and recommended model tier!")
