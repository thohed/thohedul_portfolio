import { jsPDF } from 'jspdf';
import { CV_DATA, CVData } from '../data/cvData';

/**
 * Generates an ATS-friendly, multi-page vector PDF resume directly from CV_DATA.
 * All text is 100% selectable and searchable (pure vector text, zero canvas screenshots).
 * Adheres to standard A4 dimensions with 18mm margins and strict typographical hierarchy:
 *  - Name: 24pt
 *  - Section headings: 12.5pt bold uppercase
 *  - Body: 10pt
 *  - Page-budget calculations ensure page-break-inside: avoid behavior.
 */
export function generateCvPdf(data: CVData = CV_DATA): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174 mm
  const maxY = pageHeight - margin; // 279 mm
  let y = margin;

  // Helper: check space and add page if needed
  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > maxY) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // Helper: render section heading with divider line
  const renderSectionHeading = (title: string) => {
    ensureSpace(12);
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(17, 24, 39); // #111827
    doc.text(title.toUpperCase(), margin, y);
    y += 2;

    // Divider line
    doc.setDrawColor(209, 213, 219); // #d1d5db
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  // -------------------------------------------------------------
  // 1. HEADER (Name, Title, Location, Email, Phone, LinkedIn, GitHub, Portfolio)
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(17, 24, 39);
  doc.text(data.header.name, margin, y);

  // Right-aligned location
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(75, 85, 99);
  doc.text(data.header.location, pageWidth - margin, y, { align: 'right' });
  y += 7.5;

  // Professional Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(29, 78, 216); // #1d4ed8 Blue
  doc.text(data.header.title, margin, y);
  y += 5.5;

  // Contact line (Email, Phone, LinkedIn, GitHub, Portfolio)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(55, 65, 81); // #374151

  const contactItems = [
    data.header.email,
    data.header.phone,
    data.header.portfolioUrl.replace(/^https?:\/\//, ''),
    data.header.github,
    data.header.linkedin,
  ].filter(Boolean);

  const contactLine = contactItems.join('   |   ');
  const splitContact = doc.splitTextToSize(contactLine, contentWidth);
  doc.text(splitContact, margin, y);
  y += splitContact.length * 4 + 2;

  // Header bottom border
  doc.setDrawColor(17, 24, 39);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // -------------------------------------------------------------
  // 2. PROFESSIONAL SUMMARY
  // -------------------------------------------------------------
  renderSectionHeading('Professional Summary');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(31, 41, 55); // #1f2937
  const summaryLines = doc.splitTextToSize(data.summary, contentWidth);
  ensureSpace(summaryLines.length * 4.6);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.6 + 3;

  // -------------------------------------------------------------
  // 3. CORE SKILLS (grouped by category)
  // -------------------------------------------------------------
  renderSectionHeading('Core Technical Skills');

  data.skills.forEach((cat) => {
    const categoryLabel = `${cat.category}: `;
    const skillsString = cat.skills.join(', ');
    
    // Estimate height
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    const labelWidth = doc.getTextWidth(categoryLabel);
    
    doc.setFont('helvetica', 'normal');
    const availableWidthForSkills = contentWidth - labelWidth;
    const splitSkills = doc.splitTextToSize(skillsString, Math.max(availableWidthForSkills, 120));
    const blockHeight = Math.max(splitSkills.length * 4.2, 4.5);

    ensureSpace(blockHeight + 1);

    // Print Category label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);
    doc.text(categoryLabel, margin, y);

    // Print skills list
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(55, 65, 81);
    doc.text(splitSkills, margin + labelWidth, y);

    y += blockHeight + 1.2;
  });
  y += 2;

  // -------------------------------------------------------------
  // 4. WORK EXPERIENCE
  // -------------------------------------------------------------
  renderSectionHeading('Work Experience');

  data.experience.forEach((exp) => {
    // Calculate total height of this job block
    let jobHeight = 10; // role + company header
    const bulletSplitLines: string[][] = [];

    exp.bullets.forEach((b) => {
      const split = doc.splitTextToSize(`•  ${b}`, contentWidth - 4);
      bulletSplitLines.push(split);
      jobHeight += split.length * 4.2 + 1;
    });

    // Avoid cutting inside job block if possible
    ensureSpace(Math.min(jobHeight, 60));

    // Role
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(17, 24, 39);
    doc.text(exp.role, margin, y);

    // Dates (right-aligned)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(75, 85, 99);
    doc.text(exp.period, pageWidth - margin, y, { align: 'right' });
    y += 4.5;

    // Company & Location
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(29, 78, 216); // Accent blue
    doc.text(exp.company, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    doc.text(exp.location, pageWidth - margin, y, { align: 'right' });
    y += 4.5;

    // Bullets
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);

    bulletSplitLines.forEach((splitBullet) => {
      ensureSpace(splitBullet.length * 4.2);
      doc.text(splitBullet, margin + 2, y);
      y += splitBullet.length * 4.2 + 1;
    });

    y += 2.5;
  });

  // -------------------------------------------------------------
  // 5. SELECTED PROJECTS
  // -------------------------------------------------------------
  renderSectionHeading('Selected Projects');

  data.projects.forEach((proj) => {
    let projHeight = 11;
    const bulletSplitLines: string[][] = [];

    proj.bullets.forEach((b) => {
      const split = doc.splitTextToSize(`•  ${b}`, contentWidth - 4);
      bulletSplitLines.push(split);
      projHeight += split.length * 4.2 + 1;
    });

    ensureSpace(Math.min(projHeight, 45));

    // Title + Tech Stack
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(17, 24, 39);
    doc.text(proj.title, margin, y);

    // Metric or Period
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(29, 78, 216);
    doc.text(proj.impactMetric || proj.period, pageWidth - margin, y, { align: 'right' });
    y += 4.2;

    // Role & Tech stack
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    const techText = `Role: ${proj.role}  |  Tech: ${proj.techStack.join(', ')}`;
    const splitTech = doc.splitTextToSize(techText, contentWidth);
    doc.text(splitTech, margin, y);
    y += splitTech.length * 3.8 + 1;

    // Bullets
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);

    bulletSplitLines.forEach((splitBullet) => {
      ensureSpace(splitBullet.length * 4.2);
      doc.text(splitBullet, margin + 2, y);
      y += splitBullet.length * 4.2 + 1;
    });

    y += 2.5;
  });

  // -------------------------------------------------------------
  // 6. EDUCATION
  // -------------------------------------------------------------
  renderSectionHeading('Education');

  data.education.forEach((edu) => {
    ensureSpace(14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(17, 24, 39);
    doc.text(edu.institution, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(75, 85, 99);
    doc.text(edu.period, pageWidth - margin, y, { align: 'right' });
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);
    doc.text(edu.degree, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    doc.text(edu.location, pageWidth - margin, y, { align: 'right' });
    y += 4;

    if (edu.honors) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      doc.text(`Honors: ${edu.honors}`, margin, y);
      y += 4.5;
    }
  });

  // -------------------------------------------------------------
  // 7. CERTIFICATIONS
  // -------------------------------------------------------------
  if (data.certifications && data.certifications.length > 0) {
    renderSectionHeading('Certifications');

    data.certifications.forEach((cert) => {
      ensureSpace(8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(17, 24, 39);
      doc.text(cert.title, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      doc.text(cert.year, pageWidth - margin, y, { align: 'right' });
      y += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      const issuerText = cert.credentialId
        ? `${cert.issuer}  ·  Credential ID: ${cert.credentialId}`
        : cert.issuer;
      doc.text(issuerText, margin, y);
      y += 4.5;
    });
  }

  // -------------------------------------------------------------
  // 8. LANGUAGES
  // -------------------------------------------------------------
  if (data.languages && data.languages.length > 0) {
    renderSectionHeading('Languages');
    ensureSpace(8);

    const langString = data.languages
      .map((l) => `${l.name} (${l.proficiency})`)
      .join('   •   ');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);
    const splitLangs = doc.splitTextToSize(langString, contentWidth);
    doc.text(splitLangs, margin, y);
    y += splitLangs.length * 4.2;
  }

  return doc;
}

/**
 * Triggers direct browser download of the generated PDF file.
 */
export function downloadCvPdf(data: CVData = CV_DATA, filename = 'Md-Thohedul-Islam-CV.pdf'): void {
  const doc = generateCvPdf(data);
  doc.save(filename);
}
