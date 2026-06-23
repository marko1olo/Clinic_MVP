// Global Toast Notification System
window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = '<svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else if (type === 'error') {
        iconSvg = '<svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
        iconSvg = '<svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-content">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Trigger reflow for transition
    toast.offsetHeight;
    toast.classList.add('show');
    
    // Auto remove after 4 seconds
    const timeout = setTimeout(() => {
        closeToast();
    }, 4000);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        closeToast();
    });
    
    function closeToast() {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300); // Wait for CSS transition
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const imgElement = document.getElementById('xray-image');
    const emptyState = document.getElementById('empty-state');
    const brightnessSlider = document.getElementById('brightness');
    const contrastSlider = document.getElementById('contrast');
    const btnInvert = document.getElementById('btn-invert');
    const btnReset = document.getElementById('btn-reset');
    const reportContent = document.getElementById('report-content');
    const loaderOverlay = document.getElementById('loader-overlay');
    const statusBadge = document.getElementById('ai-status');

    // Zoomable & Slider Elements
    const imageWrapper = document.getElementById('image-wrapper');
    const comparisonContainer = document.getElementById('comparison-container');
    const xrayImageOriginal = document.getElementById('xray-image-original');
    const xrayImageEnhanced = document.getElementById('xray-image-enhanced');
    const sliderHandle = document.getElementById('slider-handle');
    const toggleSliderOption = document.getElementById('toggle-slider-option');
    const toggleAutorun = document.getElementById('toggle-autorun');

    // Floating Tools elements
    const btnToggleTools = document.getElementById('btn-toggle-tools');
    const btnCloseTools = document.getElementById('btn-close-tools');
    const floatingToolsPanel = document.getElementById('floating-tools-panel');

    // Panel Elements
    const viewerPanel = document.querySelector('.viewer-panel');
    const reportPanel = document.querySelector('.report-panel');
    const resizer = document.getElementById('resizer');

    // Settings & Toggles
    const toggleAutoAnalyze = document.getElementById('toggle-auto-analyze');
    const toggleAutoSpeak = document.getElementById('toggle-auto-speak');
    const toggleAutoEnhance = document.getElementById('toggle-auto-enhance');
    
    const btnSettings = document.getElementById('btn-settings');
    const btnAnalyze = document.getElementById('btn-analyze');
    const btnSpeak = document.getElementById('btn-speak');
    const btnPrint = document.getElementById('btn-print');
    
    // Modal Elements
    const settingsModal = document.getElementById('settings-modal');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnCancelSettings = document.getElementById('btn-cancel-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const inputWatchDir = document.getElementById('input-watch-dir');
    const selectTheme = document.getElementById('select-theme');
    const selectVoice = document.getElementById('select-voice');
    
    // ElevenLabs elements
    const selectTtsProvider = document.getElementById('select-tts-provider');
    const inputElevenlabsKeys = document.getElementById('input-elevenlabs-keys');
    const selectElevenlabsVoice = document.getElementById('select-elevenlabs-voice');
    const inputElevenlabsVoiceCustom = document.getElementById('input-elevenlabs-voice-custom');
    const elevenlabsApiKeyGroup = document.getElementById('elevenlabs-api-key-group');
    const elevenlabsVoiceIdGroup = document.getElementById('elevenlabs-voice-id-group');
    const edgeVoiceGroup = document.getElementById('edge-voice-group');

    // Keys and Help buttons
    const inputGeminiKeys = document.getElementById('input-gemini-keys');
    const inputGroqKeys = document.getElementById('input-groq-keys');
    const btnGeminiHelp = document.getElementById('btn-gemini-help');
    const btnGroqHelp = document.getElementById('btn-groq-help');
    const btnElevenHelp = document.getElementById('btn-eleven-help');
    const blockGeminiHelp = document.getElementById('block-gemini-help');
    const blockGroqHelp = document.getElementById('block-groq-help');
    const blockElevenHelp = document.getElementById('block-eleven-help');

    // Summary Card Elements
    const summaryCard = document.getElementById('summary-card');
    const summaryText = document.getElementById('summary-text');
    const fullReportText = document.getElementById('full-report-text');

    // Patient Form & History Drawer Elements
    const patientCard = document.getElementById('patient-card');
    const patientName = document.getElementById('patient-name');
    const patientAge = document.getElementById('patient-age');
    const patientGender = document.getElementById('patient-gender');
    const btnSaveHistory = document.getElementById('btn-save-history');
    
    const btnOpenHistory = document.getElementById('btn-open-history');
    const btnCloseHistory = document.getElementById('btn-close-history');
    const historyDrawer = document.getElementById('history-drawer');
    const historyEmpty = document.getElementById('history-empty');
    const historyList = document.getElementById('history-list');

    let inverted = false;
    let currentScanId = null;
    let isDraggingImage = false;
    let startX, startY;
    let translateX = 0, translateY = 0;
    let scale = 1;
    let initialTouchDist = 0;
    let initialScale = 1;
    let lastLoadedImage = "";

    // TTS State
    let currentAudio = null;
    let audioQueue = [];
    let queueIndex = 0;
    let isSpeaking = false;
    let lastReportText = "";

    // --- PANEL RESIZING (Splitter) ---
    let isResizing = false;
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const containerWidth = document.querySelector('.app-container').clientWidth;
        let percentage = (e.clientX / containerWidth) * 100;
        
        // Limits: 20% min, 80% max
        percentage = Math.max(20, Math.min(percentage, 80));
        
        viewerPanel.style.flex = `0 0 ${percentage}%`;
        reportPanel.style.flex = `0 0 ${99 - percentage}%`;
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });

    // Toggle ElevenLabs configuration fields visibility
    const updateTtsProviderFields = () => {
        const provider = selectTtsProvider ? selectTtsProvider.value : 'edge';
        if (provider === 'elevenlabs') {
            if (elevenlabsApiKeyGroup) elevenlabsApiKeyGroup.style.display = 'flex';
            if (elevenlabsVoiceIdGroup) elevenlabsVoiceIdGroup.style.display = 'flex';
            if (edgeVoiceGroup) edgeVoiceGroup.style.display = 'none';
        } else {
            if (elevenlabsApiKeyGroup) elevenlabsApiKeyGroup.style.display = 'none';
            if (elevenlabsVoiceIdGroup) elevenlabsVoiceIdGroup.style.display = 'none';
            if (edgeVoiceGroup) edgeVoiceGroup.style.display = 'flex';
        }
    };
    if (selectTtsProvider) {
        selectTtsProvider.addEventListener('change', updateTtsProviderFields);
    }

    if (selectElevenlabsVoice) {
        selectElevenlabsVoice.addEventListener('change', () => {
            if (selectElevenlabsVoice.value === 'custom') {
                if (inputElevenlabsVoiceCustom) inputElevenlabsVoiceCustom.style.display = 'block';
            } else {
                if (inputElevenlabsVoiceCustom) inputElevenlabsVoiceCustom.style.display = 'none';
            }
        });
    }

    // --- SETTINGS MODAL BINDINGS ---
    btnSettings.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/status');
            const data = await res.json();
            
            inputWatchDir.value = data.watch_dir || '';
            selectTheme.value = data.theme || 'theme-noir';
            if (selectVoice) selectVoice.value = data.tts_voice || 'ru-RU-DmitryNeural';
            if (toggleSliderOption) toggleSliderOption.checked = data.comparison_slider !== false;
            if (toggleAutorun) toggleAutorun.checked = data.autorun === true;
            
            if (selectTtsProvider) selectTtsProvider.value = data.tts_provider || 'edge';
            
            // Populate ElevenLabs keys textarea
            if (inputElevenlabsKeys) {
                const keysList = data.elevenlabs_api_keys || (data.elevenlabs_api_key ? [data.elevenlabs_api_key] : []);
                inputElevenlabsKeys.value = keysList.join('\n');
            }
            
            // Populate ElevenLabs voice selector
            if (selectElevenlabsVoice) {
                const currentVoice = data.elevenlabs_voice_id || 'pNInz6obpgq54HWK483c';
                const preloadedValues = ['pNInz6obpgq54HWK483c', '21m00Tcm4TlvDq8ikWAM', 'ErXwobaYiN019PkySvjV', 'piTKgcLEGmPEe14mmc4w'];
                if (preloadedValues.includes(currentVoice)) {
                    selectElevenlabsVoice.value = currentVoice;
                    if (inputElevenlabsVoiceCustom) {
                        inputElevenlabsVoiceCustom.style.display = 'none';
                        inputElevenlabsVoiceCustom.value = '';
                    }
                } else {
                    selectElevenlabsVoice.value = 'custom';
                    if (inputElevenlabsVoiceCustom) {
                        inputElevenlabsVoiceCustom.style.display = 'block';
                        inputElevenlabsVoiceCustom.value = currentVoice;
                    }
                }
            }
            
            updateTtsProviderFields();

            if (inputGeminiKeys) {
                inputGeminiKeys.value = (data.google_api_keys || []).join('\n');
            }
            if (inputGroqKeys) {
                inputGroqKeys.value = (data.groq_api_keys || []).join('\n');
            }
            
            const modelTierInput = document.getElementById('range-model-tier');
            if (modelTierInput) {
                const tier = data.model_tier || 4;
                modelTierInput.value = tier;
                updateModelTierLabel(tier);
            }

            settingsModal.classList.add('active');
        } catch (e) {
            console.error("Failed to load settings status", e);
        }
    });

    const closeModal = () => {
        settingsModal.classList.remove('active');
        // Hide all instruction blocks on close
        if (blockGeminiHelp) blockGeminiHelp.style.display = 'none';
        if (blockGroqHelp) blockGroqHelp.style.display = 'none';
        if (blockElevenHelp) blockElevenHelp.style.display = 'none';
        if (btnGeminiHelp) btnGeminiHelp.textContent = 'Инструкция';
        if (btnGroqHelp) btnGroqHelp.textContent = 'Инструкция';
        if (btnElevenHelp) btnElevenHelp.textContent = 'Инструкция';
    };

    btnCloseSettings.addEventListener('click', closeModal);
    btnCancelSettings.addEventListener('click', closeModal);

    // Help buttons logic
    if (btnGeminiHelp && blockGeminiHelp) {
        btnGeminiHelp.addEventListener('click', () => {
            const isVisible = blockGeminiHelp.style.display === 'block';
            blockGeminiHelp.style.display = isVisible ? 'none' : 'block';
            btnGeminiHelp.textContent = isVisible ? 'Инструкция' : 'Скрыть';
        });
    }
    if (btnGroqHelp && blockGroqHelp) {
        btnGroqHelp.addEventListener('click', () => {
            const isVisible = blockGroqHelp.style.display === 'block';
            blockGroqHelp.style.display = isVisible ? 'none' : 'block';
            btnGroqHelp.textContent = isVisible ? 'Инструкция' : 'Скрыть';
        });
    }
    if (btnElevenHelp && blockElevenHelp) {
        btnElevenHelp.addEventListener('click', () => {
            const isVisible = blockElevenHelp.style.display === 'block';
            blockElevenHelp.style.display = isVisible ? 'none' : 'block';
            btnElevenHelp.textContent = isVisible ? 'Инструкция' : 'Скрыть';
        });
    }

    btnSaveSettings.addEventListener('click', async () => {
        const watchDir = inputWatchDir.value.trim();
        const theme = selectTheme.value;
        const voice = selectVoice ? selectVoice.value : 'ru-RU-DmitryNeural';
        const modelTierInput = document.getElementById('range-model-tier');
        const modelTier = modelTierInput ? parseInt(modelTierInput.value) : 4;

        const googleKeys = inputGeminiKeys ? inputGeminiKeys.value.split('\n').map(k => k.trim()).filter(k => k.length > 0) : [];
        const groqKeys = inputGroqKeys ? inputGroqKeys.value.split('\n').map(k => k.trim()).filter(k => k.length > 0) : [];
        const elevenKeys = inputElevenlabsKeys ? inputElevenlabsKeys.value.split('\n').map(k => k.trim()).filter(k => k.length > 0) : [];
        
        let voiceId = 'pNInz6obpgq54HWK483c';
        if (selectElevenlabsVoice) {
            if (selectElevenlabsVoice.value === 'custom') {
                voiceId = (inputElevenlabsVoiceCustom ? inputElevenlabsVoiceCustom.value.trim() : '') || 'pNInz6obpgq54HWK483c';
            } else {
                voiceId = selectElevenlabsVoice.value;
            }
        }

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    watch_dir: watchDir,
                    theme: theme,
                    tts_voice: voice,
                    model_tier: modelTier,
                    auto_analyze: toggleAutoAnalyze.checked,
                    auto_enhance: toggleAutoEnhance.checked,
                    comparison_slider: toggleSliderOption ? toggleSliderOption.checked : true,
                    autorun: toggleAutorun ? toggleAutorun.checked : false,
                    tts_provider: selectTtsProvider ? selectTtsProvider.value : 'edge',
                    elevenlabs_api_key: elevenKeys[0] || '', // keep for legacy compatibility
                    elevenlabs_api_keys: elevenKeys,
                    elevenlabs_voice_id: voiceId,
                    google_api_keys: googleKeys,
                    groq_api_keys: groqKeys
                })
            });
            const data = await res.json();
            if (data.status === 'ok') {
                // Apply theme immediately
                document.body.className = theme;
                closeModal();
                if (res.ok) {
                    window.loadData(currentImage, currentReport, currentSummary);
                }
            }
        } catch (e) {
            window.showToast("Ошибка сохранения настроек: " + e.message, "error");
        }
    });

    const updateModelTierLabel = (value) => {
        const label = document.getElementById('model-tier-label');
        if (!label) return;
        const val = parseInt(value);
        if (val === 4) {
            label.textContent = "Максимальный (Gemini 3.5 Flash)";
        } else if (val === 3) {
            label.textContent = "Продвинутый (Gemini 3 Flash)";
        } else if (val === 2) {
            label.textContent = "Базовый (Gemini 3.1 Flash Lite)";
        } else {
            label.textContent = "Минимальный (Llama 4 Scout / Groq)";
        }
    };

    const modelTierInput = document.getElementById('range-model-tier');
    if (modelTierInput) {
        modelTierInput.addEventListener('input', (e) => {
            updateModelTierLabel(e.target.value);
        });
    }

    // --- COLLAPSIBLE FLOATING TOOLS ---
    if (btnToggleTools && floatingToolsPanel) {
        btnToggleTools.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = floatingToolsPanel.style.display === 'flex';
            floatingToolsPanel.style.display = isVisible ? 'none' : 'flex';
        });
    }

    if (btnCloseTools && floatingToolsPanel) {
        btnCloseTools.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingToolsPanel.style.display = 'none';
        });
    }

    // Hide panel if clicking outside it on the canvas
    document.addEventListener('mousedown', (e) => {
        if (floatingToolsPanel && floatingToolsPanel.style.display === 'flex') {
            if (!floatingToolsPanel.contains(e.target) && !btnToggleTools.contains(e.target)) {
                floatingToolsPanel.style.display = 'none';
            }
        }
    });

    // Prevent dragging image when interacting inside the tools panel
    if (floatingToolsPanel) {
        floatingToolsPanel.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        floatingToolsPanel.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });
    }

    // --- FILTERS & CONTROLS ---
    const updateFilters = () => {
        const b = brightnessSlider.value;
        const c = contrastSlider.value;
        const inv = inverted ? 100 : 0;
        imageWrapper.style.filter = `brightness(${b}%) contrast(${c}%) invert(${inv}%)`;
    };

    const updateTransform = () => {
        imageWrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    brightnessSlider.addEventListener('input', updateFilters);
    contrastSlider.addEventListener('input', updateFilters);

    btnInvert.addEventListener('click', () => {
        inverted = !inverted;
        btnInvert.style.background = inverted ? 'rgba(16, 185, 129, 0.2)' : '';
        btnInvert.style.color = inverted ? '#10b981' : '';
        btnInvert.style.borderColor = inverted ? 'rgba(16, 185, 129, 0.4)' : '';
        updateFilters();
    });

    btnReset.addEventListener('click', () => {
        brightnessSlider.value = 100;
        contrastSlider.value = 100;
        inverted = false;
        btnInvert.style.background = '';
        btnInvert.style.color = '';
        btnInvert.style.borderColor = '';
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateFilters();
        updateTransform();
    });

    // Zoom & Pan
    imageWrapper.parentElement.addEventListener('wheel', (e) => {
        if (comparisonContainer.style.display === 'flex') return;
        e.preventDefault();
        const zoomIntensity = 0.1;
        scale += (e.deltaY < 0 ? zoomIntensity : -zoomIntensity);
        scale = Math.max(0.1, Math.min(scale, 10));
        updateTransform();
    });

    imageWrapper.addEventListener('mousedown', (e) => {
        if (comparisonContainer.style.display === 'flex') return;
        if (e.target.closest('#slider-handle')) return;
        isDraggingImage = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    });

    imageWrapper.addEventListener('touchstart', (e) => {
        if (comparisonContainer.style.display === 'flex') return;
        if (e.target.closest('#slider-handle')) return;
        if (e.touches.length === 1) {
            isDraggingImage = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        } else if (e.touches.length === 2) {
            isDraggingImage = false;
            initialTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            initialScale = scale;
        }
    });

    // Slider dragging logic
    let isDraggingSlider = false;
    
    const handleSliderMove = (clientX) => {
        const rect = comparisonContainer.getBoundingClientRect();
        let posX = clientX - rect.left;
        let percentage = (posX / rect.width) * 100;
        percentage = Math.max(0, Math.min(percentage, 100));
        
        sliderHandle.style.left = `${percentage}%`;
        xrayImageEnhanced.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    };
    
    sliderHandle.addEventListener('mousedown', (e) => {
        isDraggingSlider = true;
        e.stopPropagation();
        e.preventDefault();
    });
    
    sliderHandle.addEventListener('touchstart', (e) => {
        isDraggingSlider = true;
        e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingImage) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        } else if (isDraggingSlider) {
            handleSliderMove(e.clientX);
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (isDraggingImage) {
            if (e.cancelable) e.preventDefault();
            if (e.touches.length === 1) {
                translateX = e.touches[0].clientX - startX;
                translateY = e.touches[0].clientY - startY;
                updateTransform();
            }
        } else if (e.touches.length === 2 && initialTouchDist > 0) {
            if (e.cancelable) e.preventDefault();
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const factor = dist / initialTouchDist;
            scale = Math.max(0.1, Math.min(initialScale * factor, 10));
            updateTransform();
        } else if (isDraggingSlider && e.touches.length > 0) {
            if (e.cancelable) e.preventDefault();
            handleSliderMove(e.touches[0].clientX);
        }
    }, { passive: false });

    document.addEventListener('mouseup', () => {
        isDraggingImage = false;
        isDraggingSlider = false;
    });

    document.addEventListener('touchend', () => {
        isDraggingImage = false;
        isDraggingSlider = false;
        initialTouchDist = 0;
    });

    // --- AUTO ENHANCE TOGGLE ---
    toggleAutoEnhance.addEventListener('change', async () => {
        const enhanceMode = toggleAutoEnhance.checked;
        
        // Save settings to backend
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ auto_enhance: enhanceMode })
            });
        } catch (e) {
            console.error("Failed to save auto_enhance state:", e);
        }

        // Reload data to show or hide the slider
        if (currentImage) {
            window.showLoader();
            try {
                const res = await fetch('/api/enhance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename: currentImage, enable: enhanceMode })
                });
                const data = await res.json();
                if (data.url) {
                    // Update current image path in state (cached urls will load)
                    currentImage = data.url;
                    window.loadData(currentImage, currentReport, currentSummary);
                }
            } catch (e) {
                console.error("Enhancement toggle failed", e);
            } finally {
                loaderOverlay.classList.remove('active');
            }
        }
    });

    // Auto analyze toggle listener
    toggleAutoAnalyze.addEventListener('change', async () => {
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ auto_analyze: toggleAutoAnalyze.checked })
            });
        } catch (e) {
            console.error(e);
        }
    });

    // --- SHOW DATA & RENDERING ---
    window.loadData = (imageUrl, reportText, summaryContent) => {
        loaderOverlay.classList.remove('active');

        emptyState.style.display = 'none';
        imageWrapper.style.display = 'flex';
        if (patientCard) patientCard.style.display = 'block';

        const cleanUrl = imageUrl.split('?')[0];
        const baseImageUrl = cleanUrl.replace('_enhanced', '');
        if (baseImageUrl !== lastLoadedImage) {
            lastLoadedImage = baseImageUrl;
            scale = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();

            // Reset patient info inputs on new image
            if (patientName) patientName.value = '';
            if (patientAge) patientAge.value = '';
            if (patientGender) patientGender.value = 'Не указан';
        }

        if (btnToggleTools) btnToggleTools.style.display = 'flex';
        if (floatingToolsPanel) floatingToolsPanel.style.display = 'none';

        // Only show slider if autoEnhance is checked
        const showSlider = toggleAutoEnhance.checked && (toggleSliderOption ? toggleSliderOption.checked : true);

        if (showSlider) {
            imgElement.style.display = 'none';
            comparisonContainer.style.display = 'flex';
            
            let originalUrl = cleanUrl;
            let enhancedUrl = cleanUrl;
            
            if (cleanUrl.includes('_enhanced')) {
                originalUrl = cleanUrl.replace('_enhanced', '');
            } else {
                const extIndex = cleanUrl.lastIndexOf('.');
                if (extIndex !== -1) {
                    const base = cleanUrl.substring(0, extIndex);
                    const ext = cleanUrl.substring(extIndex);
                    enhancedUrl = `${base}_enhanced${ext}`;
                } else {
                    enhancedUrl = cleanUrl + '_enhanced';
                }
            }
            
            const timestamp = new Date().getTime();
            xrayImageOriginal.src = originalUrl + "?t=" + timestamp;
            xrayImageEnhanced.src = enhancedUrl + "?t=" + timestamp;
            
            // Default 50% split on load
            sliderHandle.style.left = '50%';
            xrayImageEnhanced.style.clipPath = 'inset(0 0 0 50%)';
        } else {
            comparisonContainer.style.display = 'none';
            imgElement.style.display = 'block';
            imgElement.src = cleanUrl + "?t=" + new Date().getTime();
        }

        // Render Summary
        if (summaryContent && summaryContent.trim() !== "") {
            summaryText.textContent = summaryContent;
            summaryCard.style.display = 'block';
        } else {
            summaryCard.style.display = 'none';
        }

        // Render Main Report
        if (reportText && reportText.trim() !== "") {
            statusBadge.textContent = "Analysis Complete";
            statusBadge.classList.add('active');
            
            fullReportText.innerHTML = marked.parse(reportText);
            
            btnSpeak.style.display = 'flex';
            btnAnalyze.style.display = 'none';
            if (btnPrint) btnPrint.style.display = 'block';
            
            // Speak if text changed and auto speak is on
            if (reportText !== lastReportText) {
                lastReportText = reportText;
                if (toggleAutoSpeak.checked) {
                    speakText(summaryContent, reportText);
                }
            }
        } else {
            statusBadge.textContent = "Image Loaded";
            statusBadge.classList.remove('active');
            
            fullReportText.innerHTML = '<div class="empty-state"><p>Снимок загружен. Нажмите "Анализировать снимок" для запуска ИИ.</p></div>';
            
            btnSpeak.style.display = 'none';
            btnAnalyze.style.display = 'block';
            if (btnPrint) btnPrint.style.display = 'none';
            
            stopSpeaking();
            lastReportText = "";
        }
    };

    window.showLoader = function() {
        loaderOverlay.classList.add('active');
        statusBadge.textContent = "Processing...";
        statusBadge.classList.remove('active');
        fullReportText.innerHTML = '<div class="empty-state"><p>Ожидайте ответ от ИИ...</p></div>';
        summaryCard.style.display = 'none';
    };

    btnAnalyze.addEventListener('click', async () => {
        window.showLoader();
        try {
            await fetch('/api/analyze', { method: 'POST' });
        } catch (e) {
            window.showToast("Ошибка анализа: " + e.message, "error");
            statusBadge.innerText = 'Analysis failed';
        }
    });

    if (btnPrint) {
        btnPrint.addEventListener('click', () => {
            window.print();
        });
    }

    // --- HIGH QUALITY TTS PLAYER (Google neural via backend proxy + local fallback) ---
    btnSpeak.addEventListener('click', () => {
        if (isSpeaking) {
            stopSpeaking();
        } else {
            speakText(currentSummary, currentReport);
        }
    });

    const stopSpeaking = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        audioQueue = [];
        queueIndex = 0;
        isSpeaking = false;
        btnSpeak.classList.remove('active');
        btnSpeak.title = "Озвучить отчет";
    };

    const speakText = (summaryText, reportText) => {
        stopSpeaking();
        
        isSpeaking = true;
        btnSpeak.classList.add('active');
        btnSpeak.title = "Остановить озвучку";

        tryOnlineTTS(summaryText, reportText);
    };

    const tryOnlineTTS = (summary, report) => {
        const cleanSummary = summary ? summary.replace(/[*#_`~-]/g, '').replace(/\[.*?\]\(.*?\)/g, '').replace(/:\s*/g, '. ').trim() : "";
        const cleanReport = report ? report.replace(/[*#_`~-]/g, '').replace(/\[.*?\]\(.*?\)/g, '').replace(/:\s*/g, '. ').trim() : "";
        
        if (!cleanSummary && !cleanReport) {
            stopSpeaking();
            return;
        }

        audioQueue = [];
        
        // 1. Summary voiced with ElevenLabs (if selected as provider)
        if (cleanSummary) {
            const provider = (selectTtsProvider && selectTtsProvider.value === 'elevenlabs') ? 'elevenlabs' : 'edge';
            const summaryChunks = splitTextIntoSpeakableChunks(cleanSummary, 180);
            summaryChunks.forEach(chunk => {
                const url = `/api/tts?text=${encodeURIComponent(chunk)}&provider=${provider}`;
                audioQueue.push(new Audio(url));
            });
        }
        
        // 2. Report voiced with Edge TTS (always 'edge')
        if (cleanReport) {
            const reportChunks = splitTextIntoSpeakableChunks(cleanReport, 180);
            reportChunks.forEach(chunk => {
                const url = `/api/tts?text=${encodeURIComponent(chunk)}&provider=edge`;
                audioQueue.push(new Audio(url));
            });
        }
        
        if (audioQueue.length === 0) {
            fallbackToLocalTTS(cleanSummary + " " + cleanReport);
            return;
        }
        
        queueIndex = 0;
        playNextChunk(cleanSummary + " " + cleanReport);
    };

    const playNextChunk = (fullText) => {
        if (!isSpeaking) return;
        
        if (queueIndex >= audioQueue.length) {
            stopSpeaking();
            return;
        }
        
        currentAudio = audioQueue[queueIndex];
        currentAudio.play().then(() => {
            currentAudio.onended = () => {
                queueIndex++;
                playNextChunk(fullText);
            };
        }).catch(err => {
            console.warn("Online TTS failed, using fallback:", err);
            fallbackToLocalTTS(fullText);
        });
    };

    const fallbackToLocalTTS = (text) => {
        if (!window.speechSynthesis) {
            stopSpeaking();
            return;
        }
        
        const speechUtterance = new SpeechSynthesisUtterance(text);
        speechUtterance.lang = 'ru-RU';
        speechUtterance.rate = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const ruVoice = voices.find(v => v.lang.includes('ru') || v.lang.includes('RU'));
        if (ruVoice) {
            speechUtterance.voice = ruVoice;
        }
        
        speechUtterance.onend = () => {
            stopSpeaking();
        };
        speechUtterance.onerror = () => {
            stopSpeaking();
        };
        
        window.speechSynthesis.speak(speechUtterance);
    };

    const splitTextIntoSpeakableChunks = (text, maxLength) => {
        const regex = /[^.!?]+[.!?]+/g;
        let sentences = text.match(regex) || [text];
        let chunks = [];
        let currentChunk = "";
        
        for (let sentence of sentences) {
            sentence = sentence.trim();
            if ((currentChunk + " " + sentence).length > maxLength) {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                }
                currentChunk = sentence;
            } else {
                currentChunk += (currentChunk ? " " : "") + sentence;
            }
        }
        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }
        
        let finalChunks = [];
        for (let chunk of chunks) {
            if (chunk.length > maxLength) {
                let parts = chunk.split(/[,;]/);
                let currentPart = "";
                for (let part of parts) {
                    part = part.trim();
                    if ((currentPart + ", " + part).length > maxLength) {
                        if (currentPart) finalChunks.push(currentPart);
                        currentPart = part;
                    } else {
                        currentPart += (currentPart ? ", " : "") + part;
                    }
                }
                if (currentPart) finalChunks.push(currentPart);
            } else {
                finalChunks.push(chunk);
            }
        }
        
        return finalChunks.filter(c => c.length > 0);
    };

    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {};
    }

    // --- STATE POLLING ---
    let currentImage = "";
    let currentReport = "";
    let currentSummary = "";
    
    // Load initial settings and theme at start
    const loadInitialState = async () => {
        try {
            const res = await fetch('/api/status');
            const data = await res.json();
            
            toggleAutoAnalyze.checked = data.auto_analyze;
            toggleAutoEnhance.checked = data.auto_enhance;
            if (toggleSliderOption) {
                toggleSliderOption.checked = data.comparison_slider !== false;
            }
            if (toggleAutorun) {
                toggleAutorun.checked = data.autorun === true;
            }
            
            // Set initial theme
            document.body.className = data.theme || 'theme-noir';
        } catch(e) {
            console.error("Failed to load initial theme", e);
        }
    };
    loadInitialState();

    const incomingTray = document.getElementById('incoming-tray');
    
    const renderIncomingTray = (scans) => {
        if (!incomingTray) return;
        if (!scans || scans.length === 0) {
            incomingTray.classList.remove('active');
            return;
        }
        
        incomingTray.classList.add('active');
        incomingTray.innerHTML = '';
        
        scans.forEach(scan => {
            const thumb = document.createElement('div');
            thumb.className = 'incoming-thumb';
            // Use original image for thumbnail
            const thumbUrl = scan.image.replace('_enhanced', '');
            thumb.style.backgroundImage = `url('${thumbUrl}?t=${scan.timestamp}')`;
            
            if (currentImage && scan.image === currentImage) {
                thumb.classList.add('active-scan');
            } else {
                const badge = document.createElement('div');
                badge.className = 'incoming-badge';
                thumb.appendChild(badge);
            }
            
            thumb.addEventListener('click', () => {
                currentImage = scan.image;
                currentReport = scan.report;
                currentSummary = scan.summary;
                currentScanId = scan.id;
                window.loadData(scan.image, scan.report, scan.summary);
                renderIncomingTray(scans); 
            });
            
            incomingTray.appendChild(thumb);
        });
    };

    let previousRecentScansLength = 0;

    setInterval(async () => {
        if (document.hidden) return; // Optimize CPU when window is in tray
        
        try {
            const res = await fetch('/api/status');
            const data = await res.json();
            
            if (data.recent_scans && incomingTray) {
                const hasNewScans = data.recent_scans.length > previousRecentScansLength;
                previousRecentScansLength = data.recent_scans.length;
                
                renderIncomingTray(data.recent_scans);
                
                // Auto switch only if we are on empty state
                if (hasNewScans && emptyState.style.display !== 'none' && data.recent_scans.length > 0) {
                    const latest = data.recent_scans[data.recent_scans.length - 1];
                    currentImage = latest.image;
                    currentReport = latest.report;
                    currentSummary = latest.summary;
                    currentScanId = latest.id;
                    window.loadData(latest.image, latest.report, latest.summary);
                    renderIncomingTray(data.recent_scans);
                }
                
                // If the currently viewed image gets a report update, show it
                const activeScan = data.recent_scans.find(s => s.image === currentImage);
                if (activeScan) {
                    if (activeScan.report !== currentReport || activeScan.summary !== currentSummary) {
                        currentReport = activeScan.report;
                        currentSummary = activeScan.summary;
                        window.loadData(currentImage, currentReport, currentSummary);
                    }
                }
            } else {
                // Fallback if recent_scans is missing
                if (data.latest_image && emptyState.style.display === 'none') {
                    if (data.latest_image !== currentImage || data.latest_report !== currentReport || data.latest_summary !== currentSummary) {
                        currentImage = data.latest_image;
                        currentReport = data.latest_report;
                        currentSummary = data.latest_summary;
                        currentScanId = data.current_scan_id || null;
                        window.loadData(data.latest_image, data.latest_report, data.latest_summary);
                    }
                }
            }

            if (data.error_message) {
                window.showToast(data.error_message, "error");
                fetch('/api/clear_error', { method: 'POST' });
            }

            if (data.is_processing) {
                if (!loaderOverlay.classList.contains('active')) {
                    window.showLoader();
                }
                const loaderText = document.querySelector('.loader-text');
                if (loaderText) {
                    if (data.queue_length > 0) {
                        loaderText.textContent = `Читаем снимок... (В очереди: ${data.queue_length})`;
                    } else {
                        loaderText.textContent = `Читаем снимок...`;
                    }
                }
            } else {
                if (loaderOverlay.classList.contains('active')) {
                    loaderOverlay.classList.remove('active');
                }
            }
        } catch (e) {
            console.log("Waiting for backend...");
        }
    }, 1000);

    // --- UPLOADS & PASTING ---
    const fileInput = document.getElementById('file-input');
    const appContainer = document.querySelector('.app-container');

    if (emptyState) {
        emptyState.addEventListener('click', () => {
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                uploadFile(e.target.files[0]);
            }
        });
    }

    appContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        appContainer.style.opacity = '0.7';
    });

    appContainer.addEventListener('dragleave', (e) => {
        e.preventDefault();
        appContainer.style.opacity = '1';
    });

    appContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        appContainer.style.opacity = '1';
        if (e.dataTransfer.files.length > 0) {
            uploadFile(e.dataTransfer.files[0]);
        }
    });

    document.addEventListener('paste', (e) => {
        const items = (e.clipboardData || window.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file' && item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                const file = new File([blob], `clipboard_${Date.now()}.png`, { type: blob.type });
                uploadFile(file);
                break;
            }
        }
    });

    async function uploadFile(file) {
        window.showLoader();
        const formData = new FormData();
        formData.append('file', file);
        try {
            await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
        } catch (e) {
            window.showToast('Ошибка загрузки: ' + e.message, "error");
            console.error('Upload error:', e);
        }
    }

    // --- AUTOMATIC GENDER DETECTION ---
    function detectGender(name) {
        const lowercaseName = name.toLowerCase();
        const words = lowercaseName.split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return 'Не указан';
        
        let pointsMale = 0;
        let pointsFemale = 0;
        
        const maleFirstNames = ['никита', 'илья', 'данила', 'даниил', 'савва', 'миша', 'гриша', 'саша', 'петя', 'ваня', 'дима', 'леша', 'коля', 'юра', 'вова', 'толя', 'женя', 'сережа'];
        const femaleFirstNames = ['маша', 'даша', 'лена', 'оля', 'света', 'наташа', 'катя', 'ира', 'таня', 'аня', 'юля', 'вера', 'надя', 'люба'];
        
        for (const word of words) {
            // Check patronymics
            if (word.endsWith('ович') || word.endsWith('евич') || word.endsWith('ич')) {
                pointsMale += 5;
            } else if (word.endsWith('овна') || word.endsWith('евна') || word.endsWith('ична')) {
                pointsFemale += 5;
            }
            
            // Check surnames
            else if (word.endsWith('ова') || word.endsWith('ева') || word.endsWith('ина') || word.endsWith('ая')) {
                pointsFemale += 3;
            } else if (word.endsWith('ов') || word.endsWith('ев') || word.endsWith('ин') || word.endsWith('ий') || word.endsWith('ый')) {
                pointsMale += 3;
            }
            
            // Check first names
            else if (maleFirstNames.includes(word)) {
                pointsMale += 4;
            } else if (femaleFirstNames.includes(word)) {
                pointsFemale += 4;
            } else {
                // Ending characters
                const lastChar = word.slice(-1);
                if (['а', 'я'].includes(lastChar)) {
                    pointsFemale += 1.5;
                } else if (['б', 'в', 'г', 'д', 'ж', 'з', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'й'].includes(lastChar)) {
                    pointsMale += 1.5;
                }
            }
        }
        
        if (pointsMale > pointsFemale) return 'Мужской';
        if (pointsFemale > pointsMale) return 'Женский';
        return 'Не указан';
    }

    let genderTimeout = null;
    if (patientName) {
        patientName.addEventListener('input', () => {
            clearTimeout(genderTimeout);
            genderTimeout = setTimeout(() => {
                const name = patientName.value.trim();
                if (!name) return;
                const detectedGender = detectGender(name);
                if (patientGender) {
                    patientGender.value = detectedGender;
                }
            }, 2000);
        });
    }

    // --- SAVE RECORD TO HISTORY ---
    if (btnSaveHistory) {
        btnSaveHistory.addEventListener('click', async () => {
            const nameVal = patientName.value.trim();
            const ageVal = patientAge.value ? parseInt(patientAge.value) : null;
            const genderVal = patientGender.value;

            if (!nameVal) {
                window.showToast("Укажите Имя и Фамилию пациента.", "error");
                return;
            }

            const bVal = parseInt(brightnessSlider.value);
            const cVal = parseInt(contrastSlider.value);
            const invVal = inverted ? 1 : 0;
            const sliderPosVal = parseFloat(sliderHandle.style.left) || 50.0;

            const payload = {
                patient_name: nameVal,
                patient_age: ageVal,
                patient_gender: genderVal,
                original_image: currentImage,
                enhanced_image: currentImage.includes('_enhanced') ? currentImage : currentImage.replace(/\.([a-zA-Z0-9]+)$/, '_enhanced.$1'),
                brightness: bVal,
                contrast: cVal,
                inverted: invVal,
                scale: scale,
                translate_x: translateX,
                translate_y: translateY,
                slider_position: sliderPosVal,
                summary: currentSummary,
                report: currentReport
            };

            if (currentScanId) {
                payload.id = currentScanId;
            }

            btnSaveHistory.disabled = true;
            btnSaveHistory.textContent = "Сохранение...";

            try {
                const res = await fetch('/api/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.status === 'success' || data.status === 'ok') {
                    window.showToast("Снимок успешно сохранен в историю!", "success");
                    currentScanId = data.id;
                    loadHistory();
                } else {
                    window.showToast("Ошибка сохранения: " + data.message, "error");
                }
            } catch (e) {
                console.error(e);
                window.showToast("Сбой подключения при сохранении: " + e.message, "error");
            } finally {
                btnSaveHistory.disabled = false;
                btnSaveHistory.textContent = "Сохранить в историю";
            }
        });
    }

    // --- LOAD RECORD FROM HISTORY ---
    const loadScan = (scan) => {
        if (patientName) patientName.value = scan.patient_name || '';
        if (patientAge) patientAge.value = scan.patient_age || '';
        if (patientGender) patientGender.value = scan.patient_gender || 'Не указан';
        
        currentImage = scan.original_image;
        currentReport = scan.report || '';
        currentSummary = scan.summary || '';
        currentScanId = scan.id;

        // Sync with backend to prevent status polling overwrite
        fetch('/api/active_scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                original_image: scan.original_image,
                report: scan.report,
                summary: scan.summary,
                id: scan.id
            })
        }).catch(err => console.error("Failed to sync active scan to backend", err));
        
        // Restore adjustments
        brightnessSlider.value = scan.brightness !== undefined ? scan.brightness : 100;
        contrastSlider.value = scan.contrast !== undefined ? scan.contrast : 100;
        inverted = !!scan.inverted;
        
        btnInvert.style.background = inverted ? 'rgba(16, 185, 129, 0.2)' : '';
        btnInvert.style.color = inverted ? '#10b981' : '';
        btnInvert.style.borderColor = inverted ? 'rgba(16, 185, 129, 0.4)' : '';
        
        updateFilters();
        
        // Restore viewport scale & pan
        scale = scan.scale !== undefined ? scan.scale : 1.0;
        translateX = scan.translate_x !== undefined ? scan.translate_x : 0.0;
        translateY = scan.translate_y !== undefined ? scan.translate_y : 0.0;
        updateTransform();
        
        // Render data
        window.loadData(scan.original_image, scan.report, scan.summary);
        
        // Apply split slider position after loading images
        const sliderPos = scan.slider_position !== undefined ? scan.slider_position : 50.0;
        sliderHandle.style.left = `${sliderPos}%`;
        xrayImageEnhanced.style.clipPath = `inset(0 0 0 ${sliderPos}%)`;
        
        // Auto-play TTS if checked
        if (toggleAutoSpeak.checked) {
            speakText(scan.summary, scan.report);
        }
        
        // Close history drawer
        if (historyDrawer) {
            historyDrawer.classList.remove('active');
        }
    };

    // --- FETCH & RENDER HISTORY ---
    const loadHistory = async () => {
        if (!historyDrawer) return;
        try {
            const res = await fetch('/api/history');
            const scans = await res.json();
            
            if (!scans || scans.length === 0) {
                if (historyEmpty) historyEmpty.style.display = 'block';
                if (historyList) historyList.style.display = 'none';
                return;
            }
            
            if (historyEmpty) historyEmpty.style.display = 'none';
            if (historyList) {
                historyList.style.display = 'flex';
                historyList.innerHTML = '';
                
                scans.forEach(scan => {
                    const card = document.createElement('div');
                    card.className = 'history-card';
                    if (scan.patient_gender === 'Мужской') card.classList.add('male');
                    else if (scan.patient_gender === 'Женский') card.classList.add('female');
                    else card.classList.add('other');
                    
                    const genderLabel = scan.patient_gender === 'Мужской' ? 'М' : (scan.patient_gender === 'Женский' ? 'Ж' : '-');
                    const genderClass = scan.patient_gender === 'Мужской' ? 'male' : (scan.patient_gender === 'Женский' ? 'female' : 'other');
                    const ageText = scan.patient_age ? `${scan.patient_age} лет` : 'возраст не указан';
                    const formattedDate = new Date(scan.created_at).toLocaleString('ru-RU', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    });
                    
                    card.innerHTML = `
                        <div class="history-card-header">
                            <span class="history-patient-name" title="${scan.patient_name}">${scan.patient_name}</span>
                            <button class="history-delete-btn" title="Удалить запись">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                        <div class="history-details">
                            <span class="gender-badge ${genderClass}">${genderLabel}</span>
                            <span>•</span>
                            <span>${ageText}</span>
                        </div>
                        <div class="history-date">${formattedDate}</div>
                    `;
                    
                    card.addEventListener('click', () => loadScan(scan));
                    
                    const delBtn = card.querySelector('.history-delete-btn');
                    delBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        if (confirm(`Удалить запись пациента ${scan.patient_name}?`)) {
                            try {
                                const delRes = await fetch(`/api/history/${scan.id}`, { method: 'DELETE' });
                                const delData = await delRes.json();
                                if (delData.status === 'ok') {
                                    loadHistory();
                                }
                            } catch (err) {
                                console.error(err);
                            }
                        }
                    });
                    
                    historyList.appendChild(card);
                });
            }
        } catch (e) {
            console.error("Failed to load history list", e);
        }
    };

    // --- DRAWER TOGGLE LISTENERS ---
    if (btnOpenHistory) {
        btnOpenHistory.addEventListener('click', () => {
            if (historyDrawer) {
                historyDrawer.classList.add('active');
                loadHistory();
            }
        });
    }

    if (btnCloseHistory) {
        btnCloseHistory.addEventListener('click', () => {
            if (historyDrawer) {
                historyDrawer.classList.remove('active');
            }
        });
    }

    document.addEventListener('mousedown', (e) => {
        if (historyDrawer && historyDrawer.classList.contains('active')) {
            if (!historyDrawer.contains(e.target) && !btnOpenHistory.contains(e.target)) {
                historyDrawer.classList.remove('active');
            }
        }
    });
    
    // Logs Modal Logic
    const btnOpenLogs = document.getElementById('btn-open-logs');
    const logsModal = document.getElementById('logs-modal');
    const btnCloseLogs = document.getElementById('btn-close-logs');
    const btnRefreshLogs = document.getElementById('btn-refresh-logs');
    const logsContent = document.getElementById('logs-content');

    if (btnOpenLogs && logsModal) {
        btnOpenLogs.addEventListener('click', () => {
            logsModal.style.display = 'flex';
            refreshLogs();
        });
    }

    if (btnCloseLogs) {
        btnCloseLogs.addEventListener('click', () => {
            logsModal.style.display = 'none';
        });
    }

    if (btnRefreshLogs) {
        btnRefreshLogs.addEventListener('click', refreshLogs);
    }

    async function refreshLogs() {
        try {
            const res = await fetch('/api/logs');
            const data = await res.json();
            if (logsContent) {
                logsContent.textContent = data.logs.join('\n');
                logsContent.scrollTop = logsContent.scrollHeight;
            }
        } catch (e) {
            console.error("Failed to load logs", e);
        }
    }
});
