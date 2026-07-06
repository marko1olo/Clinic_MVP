import React, { useRef, useState, useEffect } from 'react';
import { Crosshair, Filter, Image as ImageIcon, CheckCircle, Ruler } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface ShadowAnalyst2DProps {
  src?: string;
  onAnalysisComplete?: (result: { diagnosis: string; lesionSizeMm?: number }) => void;
}

export function ShadowAnalyst2D({ src, onAnalysisComplete }: ShadowAnalyst2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [filterMode, setFilterMode] = useState<'normal' | 'invert' | 'edge'>('normal');
  const [measuring, setMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<Point[]>([]);
  const [lesionSize, setLesionSize] = useState<number | null>(null);

  // Load image
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImage(img);
    img.src = src;
  }, [src]);

  // Render canvas
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Resize canvas to match image aspect ratio but fit container
    const maxWidth = 800;
    const maxHeight = 600;
    let width = image.width;
    let height = image.height;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;

    // Draw base image
    ctx.drawImage(image, 0, 0, width, height);

    // Apply filters
    if (filterMode !== 'normal') {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      if (filterMode === 'invert') {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i]!;       // R
          data[i + 1] = 255 - data[i + 1]!; // G
          data[i + 2] = 255 - data[i + 2]!; // B
        }
      } else if (filterMode === 'edge') {
        // Simple edge detection (Sobel-like)
        const tempData = new Uint8ClampedArray(data);
        const w = width;
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = (y * w + x) * 4;
            const up = ((y - 1) * w + x) * 4;
            const down = ((y + 1) * w + x) * 4;
            const left = (y * w + (x - 1)) * 4;
            const right = (y * w + (x + 1)) * 4;

            const val = 
              Math.abs(tempData[left]! - tempData[right]!) + 
              Math.abs(tempData[up]! - tempData[down]!);

            data[idx] = val;
            data[idx + 1] = val;
            data[idx + 2] = val;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Draw measurement line
    if (measurePoints.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444'; // red-500
      ctx.lineWidth = 2;
      ctx.moveTo(measurePoints[0]!.x, measurePoints[0]!.y);
      if (measurePoints.length > 1) {
        ctx.lineTo(measurePoints[1]!.x, measurePoints[1]!.y);
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(measurePoints[0]!.x, measurePoints[0]!.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(measurePoints[1]!.x, measurePoints[1]!.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

  }, [image, filterMode, measurePoints]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!measuring) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (measurePoints.length === 0 || measurePoints.length === 2) {
      setMeasurePoints([{ x, y }]);
      setLesionSize(null);
    } else {
      setMeasurePoints([...measurePoints, { x, y }]);
      // Rough pixel-to-mm conversion for demo (assuming 0.1mm per pixel)
      const dx = measurePoints[0]!.x - x;
      const dy = measurePoints[0]!.y - y;
      const pxDist = Math.sqrt(dx * dx + dy * dy);
      const mm = Math.round(pxDist * 0.1 * 10) / 10;
      setLesionSize(mm);
    }
  };

  const handleSendToOdontogram = () => {
    if (onAnalysisComplete) {
      onAnalysisComplete({
        diagnosis: "Очаг разрежения костной ткани в области апекса",
        ...(lesionSize !== null ? { lesionSizeMm: lesionSize } : {})
      });
    }
  };

  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
        <ImageIcon size={32} className="mb-2 opacity-50" />
        <p>Выберите 2D-снимок (ОПТГ/Прицельный) для анализа</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between p-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Crosshair size={18} className="text-blue-400" />
          <h3 className="text-sm font-medium text-zinc-200">Shadow Analyst 2D</h3>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setFilterMode('normal')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterMode === 'normal' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            Normal
          </button>
          <button 
            onClick={() => setFilterMode('invert')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterMode === 'invert' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            <Filter size={12} className="inline mr-1" />
            Invert
          </button>
          <button 
            onClick={() => setFilterMode('edge')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterMode === 'edge' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            <Filter size={12} className="inline mr-1" />
            Bone Edge
          </button>
          <div className="w-px h-4 bg-zinc-700 mx-1" />
          <button 
            onClick={() => { setMeasuring(!measuring); if(!measuring) setMeasurePoints([]); }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${measuring ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            <Ruler size={12} className="inline mr-1" />
            {measuring ? 'Измерение...' : 'Измерить'}
          </button>
        </div>
      </div>

      <div className="relative bg-black flex items-center justify-center p-4 min-h-[400px]" ref={containerRef}>
        <canvas 
          ref={canvasRef} 
          onClick={handleCanvasClick}
          className={`max-w-full max-h-[600px] object-contain ${measuring ? 'cursor-crosshair' : 'cursor-default'}`}
        />
        
        {lesionSize !== null && measurePoints.length === 2 && (
          <div 
            className="absolute bg-zinc-900 border border-red-500/30 text-white px-2 py-1 rounded-md text-xs font-mono shadow-lg pointer-events-none"
            style={{
              left: Math.max(0, (measurePoints[0]!.x + measurePoints[1]!.x) / 2 - 20) + (containerRef.current?.offsetLeft || 0),
              top: Math.max(0, (measurePoints[0]!.y + measurePoints[1]!.y) / 2 - 30) + (containerRef.current?.offsetTop || 0),
            }}
          >
            {lesionSize} мм
          </div>
        )}
      </div>

      <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
        <div className="text-xs text-zinc-400">
          {lesionSize ? `Периапикальный очаг: ${lesionSize} мм` : 'Выберите инструмент для анализа'}
        </div>
        <button 
          onClick={handleSendToOdontogram}
          disabled={!lesionSize}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-colors"
        >
          <CheckCircle size={14} />
          В план лечения
        </button>
      </div>
    </div>
  );
}
