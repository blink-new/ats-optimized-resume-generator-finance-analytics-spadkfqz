import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'
import { saveAs } from 'file-saver'
import { OptimizedResume, ResumeTemplate } from '../types/resume'

export const generatePDF = async (resume: OptimizedResume, template: ResumeTemplate) => {
  const element = document.getElementById('resume-template')
  if (!element) {
    throw new Error('Resume template element not found')
  }

  try {
    // Create canvas from the resume template
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    })

    const imgData = canvas.toDataURL('image/png')
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    const fileName = `${resume.contact.name.replace(/\s+/g, '_')}_Resume_${template}.pdf`
    pdf.save(fileName)
    
    return { success: true, fileName }
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}

export const generateWordDoc = async (resume: OptimizedResume, template: ResumeTemplate) => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header - Name
          new Paragraph({
            children: [
              new TextRun({
                text: resume.contact.name,
                bold: true,
                size: 32,
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          // Contact Info
          new Paragraph({
            children: [
              new TextRun({
                text: `${resume.contact.phone} | ${resume.contact.email} | ${resume.contact.linkedin}`,
                size: 20,
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Profile Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFILE',
                bold: true,
                size: 24,
                color: template === 'modern' ? '2563EB' : '000000',
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            spacing: { before: 200, after: 200 },
            border: template === 'classic' ? {
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            } : undefined
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: resume.profile,
                size: 22,
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            spacing: { after: 400 }
          }),

          // Education Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'EDUCATION',
                bold: true,
                size: 24,
                color: template === 'modern' ? '2563EB' : '000000',
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            spacing: { before: 200, after: 200 },
            border: template === 'classic' ? {
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            } : undefined
          }),

          // Education entries
          ...resume.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.institution} | ${edu.degree} | ${edu.duration}${edu.gpa ? ` | ${edu.gpa}` : ''}`,
                  size: 22,
                  font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
                })
              ],
              spacing: { after: 100 }
            })
          ]),

          // Skills Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'SKILLS',
                bold: true,
                size: 24,
                color: template === 'modern' ? '2563EB' : '000000',
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            spacing: { before: 400, after: 200 },
            border: template === 'classic' ? {
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            } : undefined
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Technical: ${resume.skills.technical.join(', ')}`,
                size: 22,
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Analytical: ${resume.skills.analytical.join(', ')}`,
                size: 22,
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Soft Skills: ${resume.skills.soft.join(', ')}`,
                size: 22,
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            spacing: { after: 400 }
          }),

          // Experience Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'EXPERIENCE',
                bold: true,
                size: 24,
                color: template === 'modern' ? '2563EB' : '000000',
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            spacing: { before: 200, after: 200 },
            border: template === 'classic' ? {
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            } : undefined
          }),

          // Experience entries
          ...resume.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.company} | ${exp.position} | ${exp.duration}`,
                  bold: true,
                  size: 22,
                  font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
                })
              ],
              spacing: { after: 100 }
            }),
            ...exp.bullets.map(bullet => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${bullet}`,
                    size: 22,
                    font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
                  })
                ],
                spacing: { after: 50 }
              })
            ),
            new Paragraph({
              children: [new TextRun({ text: '', size: 22 })],
              spacing: { after: 200 }
            })
          ]),

          // Projects Section (if exists)
          ...(resume.projects && resume.projects.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'PROJECTS',
                  bold: true,
                  size: 24,
                  color: template === 'modern' ? '2563EB' : '000000',
                  font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
                })
              ],
              spacing: { before: 200, after: 200 },
              border: template === 'classic' ? {
                bottom: {
                  color: '000000',
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6
                }
              } : undefined
            }),
            ...resume.projects.flatMap(project => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${project.title} | ${project.description}`,
                    bold: true,
                    size: 22,
                    font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
                  })
                ],
                spacing: { after: 100 }
              }),
              ...project.bullets.map(bullet => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${bullet}`,
                      size: 22,
                      font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
                    })
                  ],
                  spacing: { after: 50 }
                })
              ),
              new Paragraph({
                children: [new TextRun({ text: '', size: 22 })],
                spacing: { after: 200 }
              })
            ])
          ] : []),

          // Achievements Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'ACHIEVEMENTS',
                bold: true,
                size: 24,
                color: template === 'modern' ? '2563EB' : '000000',
                font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
              })
            ],
            spacing: { before: 200, after: 200 },
            border: template === 'classic' ? {
              bottom: {
                color: '000000',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            } : undefined
          }),

          ...resume.achievements.map(achievement => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${achievement}`,
                  size: 22,
                  font: template === 'classic' ? 'Times New Roman' : template === 'minimal' ? 'Courier New' : 'Calibri'
                })
              ],
              spacing: { after: 100 }
            })
          )
        ]
      }]
    })

    // Generate and save the document
    const buffer = await Packer.toBuffer(doc)
    const fileName = `${resume.contact.name.replace(/\s+/g, '_')}_Resume_${template}.docx`
    saveAs(new Blob([buffer]), fileName)
    
    return { success: true, fileName }
  } catch (error) {
    console.error('Error generating Word document:', error)
    throw new Error('Failed to generate Word document')
  }
}