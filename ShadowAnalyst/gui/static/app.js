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

    let inverted = false;
    let isDragging = false;
    let startX, startY;
    let translateX = 0, translateY = 0;
    let scale = 1;

    // Apply CSS filters
    const updateFilters = () => {
        const b = brightnessSlider.value;
        const c = contrastSlider.value;
        const inv = inverted ? 100 : 0;
        imgElement.style.filter = `brightness(${b}%) contrast(${c}%) invert(${inv}%)`;
    };

    // Apply Transform (Zoom/Pan)
    const updateTransform = () => {
        imgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
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

    // Zoom
    imgElement.parentElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        if (e.deltaY < 0) {
            scale += zoomIntensity;
        } else {
            scale -= zoomIntensity;
        }
        scale = Math.max(0.1, Math.min(scale, 10)); // Limits 0.1x to 10x
        updateTransform();
    });

    // Pan
    imgElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Show API Data
    window.loadData = function(imageUrl, markdownText) {
        // Hide loader
        loaderOverlay.classList.remove('active');
        statusBadge.textContent = "Analysis Complete";
        statusBadge.classList.add('active');

        // Show Image
        emptyState.style.display = 'none';
        imgElement.style.display = 'block';
        imgElement.src = imageUrl + "?t=" + new Date().getTime(); // cache bust

        // Render Markdown
        reportContent.innerHTML = marked.parse(markdownText);
    };

    window.showLoader = function() {
        loaderOverlay.classList.add('active');
        statusBadge.textContent = "Processing...";
        statusBadge.classList.remove('active');
        reportContent.innerHTML = '<div class="empty-state"><p>Ожидайте ответ от ИИ...</p></div>';
    };

    // Polling for updates (fallback if pywebview can't push directly)
    let currentImage = "";
    setInterval(async () => {
        try {
            const res = await fetch('/api/status');
            const data = await res.json();
            
            if (data.is_processing) {
                if (!loaderOverlay.classList.contains('active')) {
                    window.showLoader();
                }
            } else if (data.latest_image && data.latest_image !== currentImage) {
                currentImage = data.latest_image;
                window.loadData(data.latest_image, data.latest_report);
            }
        } catch (e) {
            console.log("Waiting for backend...");
        }
    }, 1000);
});
