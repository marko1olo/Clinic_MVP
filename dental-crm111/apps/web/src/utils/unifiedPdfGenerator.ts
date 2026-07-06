import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface TreatmentPlanData {
  patientName: string;
  patientAge: number;
  doctorName: string;
  clinicLogoUrl?: string; // Optional, otherwise generic text
  phases: {
    name: string;
    items: { title: string; price: number; discount?: number }[];
  }[];
  totalPrice: number;
}

export interface SurgicalGuideData {
  patientName: string;
  doctorName: string;
  boneDensity: { d1: number; d2: number; d3: number; d4: number; d5: number };
  sleeveDiameter: number;
  sleeveHeight: number;
  offset: number;
  divergenceWarning: boolean;
  collisionWarning: boolean;
}

export const unifiedPdfGenerator = {
  
  /**
   * Generates a high-quality PDF of the treatment plan
   */
  async generateTreatmentPlanPdf(data: TreatmentPlanData, odontogramElementId: string): Promise<void> {
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // 1. Header & Clinic Info
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("DENTE Healthcare", 15, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Клинический План Лечения и Смета", 15, 28);
    doc.text(`Пациент: ${data.patientName} (${data.patientAge} лет)`, 15, 34);
    doc.text(`Лечащий врач: ${data.doctorName}`, 15, 40);
    doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 15, 46);

    doc.setDrawColor(200, 200, 200);
    doc.line(15, 50, pageWidth - 15, 50);

    let currentY = 55;

    // 2. Odontogram Snapshot (if provided)
    const odontogramEl = document.getElementById(odontogramElementId);
    if (odontogramEl) {
      try {
        const canvas = await html2canvas(odontogramEl, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = pageWidth - 30;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        doc.text("Клиническая картина (Одонтограмма):", 15, currentY);
        currentY += 5;
        doc.addImage(imgData, 'PNG', 15, currentY, pdfWidth, pdfHeight);
        currentY += pdfHeight + 15;
      } catch (e) {
        console.error("Failed to capture odontogram", e);
      }
    }

    // 3. Phased Estimate Table
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Детализация стоимости лечения", 15, currentY);
    currentY += 10;

    data.phases.forEach((phase) => {
      // Phase Header
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(241, 245, 249);
      doc.rect(15, currentY - 5, pageWidth - 30, 8, 'F');
      doc.text(phase.name, 17, currentY);
      currentY += 8;

      // Phase Items
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let phaseTotal = 0;

      phase.items.forEach((item) => {
        doc.text(item.title, 20, currentY);
        const priceStr = `${item.price.toLocaleString('ru-RU')} ₽`;
        doc.text(priceStr, pageWidth - 20, currentY, { align: 'right' });
        phaseTotal += item.price;
        currentY += 6;
      });

      // Phase Subtotal
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Итого по этапу: ${phaseTotal.toLocaleString('ru-RU')} ₽`, pageWidth - 20, currentY, { align: 'right' });
      doc.setTextColor(15, 23, 42);
      currentY += 10;
    });

    // Total
    doc.setDrawColor(15, 23, 42);
    doc.line(15, currentY, pageWidth - 15, currentY);
    currentY += 8;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Общая стоимость плана:", 15, currentY);
    doc.text(`${data.totalPrice.toLocaleString('ru-RU')} ₽`, pageWidth - 15, currentY, { align: 'right' });
    currentY += 20;

    // Signatures
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Подпись врача: ____________________", 15, currentY);
    doc.text("Подпись пациента: ____________________", pageWidth - 15, currentY, { align: 'right' });

    doc.save(`Treatment_Plan_${data.patientName.replace(/\s+/g, '_')}.pdf`);
  },

  /**
   * Generates Surgical Guide PDF with WebGL canvas captures
   */
  async generateSurgicalGuidePdf(data: SurgicalGuideData, cbctViewerIds: string[]): Promise<void> {
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(20);
    doc.text("Surgical Guide & CBCT Report", 15, 20);
    doc.setFontSize(10);
    doc.text(`Пациент: ${data.patientName} | Хирург: ${data.doctorName}`, 15, 28);
    doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 15, 34);

    let currentY = 45;

    // Capture WebGL CBCT viewers
    // CRITICAL: WebGL canvases need preserveDrawingBuffer: true when created, 
    // otherwise they might render blank here.
    for (const id of cbctViewerIds) {
      const el = document.getElementById(id);
      if (el) {
        try {
          const canvas = await html2canvas(el, { scale: 1.5, useCORS: true });
          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          const pdfWidth = (pageWidth - 30) / 2 - 5; // Put 2 side by side if possible
          // Simplification for demo: just stack them
          doc.addImage(imgData, 'JPEG', 15, currentY, pageWidth - 30, 80);
          currentY += 90;
        } catch (e) {
          console.error(`Failed to capture ${id}`, e);
        }
      }
    }

    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }

    // Safety and Bone Density
    doc.setFontSize(14);
    doc.text("Анализ плотности кости (Misch Classification)", 15, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.text(`D1 (>1250 HU): ${data.boneDensity.d1}%`, 15, currentY); currentY += 6;
    doc.text(`D2 (850-1250 HU): ${data.boneDensity.d2}%`, 15, currentY); currentY += 6;
    doc.text(`D3 (350-850 HU): ${data.boneDensity.d3}%`, 15, currentY); currentY += 6;
    doc.text(`D4 (150-350 HU): ${data.boneDensity.d4}%`, 15, currentY); currentY += 6;
    doc.text(`D5 (<150 HU): ${data.boneDensity.d5}%`, 15, currentY); currentY += 15;

    doc.setFontSize(14);
    doc.text("Параметры хирургического шаблона (Sleeve)", 15, currentY);
    currentY += 10;
    doc.setFontSize(10);
    doc.text(`Диаметр втулки: ${data.sleeveDiameter} мм`, 15, currentY); currentY += 6;
    doc.text(`Высота втулки: ${data.sleeveHeight} мм`, 15, currentY); currentY += 6;
    doc.text(`Offset (Смещение): ${data.offset} мм`, 15, currentY); currentY += 15;

    // AI Verdict
    doc.setFontSize(14);
    doc.text("AI Collision Check Status", 15, currentY);
    currentY += 10;

    if (data.collisionWarning) {
      doc.setTextColor(220, 38, 38);
      doc.text("ВНИМАНИЕ: Обнаружено пересечение с IAN (Нижнечелюстной нерв) < 2мм!", 15, currentY);
    } else {
      doc.setTextColor(22, 163, 74);
      doc.text("УСПЕШНО: Безопасное расстояние до анатомических структур соблюдено.", 15, currentY);
    }
    currentY += 8;

    if (data.divergenceWarning) {
      doc.setTextColor(234, 179, 8);
      doc.text("ПРЕДУПРЕЖДЕНИЕ: Коаксиальное расхождение осей > 15 градусов.", 15, currentY);
    }

    doc.save(`Surgical_Protocol_${data.patientName.replace(/\s+/g, '_')}.pdf`);
  }
};
