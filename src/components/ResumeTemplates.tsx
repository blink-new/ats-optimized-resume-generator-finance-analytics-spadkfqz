import React from 'react'
import { OptimizedResume } from '../types/resume'

interface ResumeTemplateProps {
  resume: OptimizedResume
  template: 'modern' | 'classic' | 'minimal'
}

export const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ resume, template }) => {
  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return {
          container: 'bg-white p-8 max-w-4xl mx-auto font-sans text-gray-800',
          header: 'text-center mb-6 pb-4 border-b-2 border-blue-600',
          name: 'text-3xl font-bold text-gray-900 mb-2',
          contact: 'text-gray-600 text-sm',
          section: 'mb-6',
          sectionTitle: 'text-xl font-bold text-blue-600 mb-3 uppercase tracking-wide',
          subsection: 'mb-4',
          company: 'font-semibold text-gray-900',
          position: 'text-gray-700 italic',
          duration: 'text-gray-600 text-sm',
          bullet: 'text-gray-700 ml-4 mb-1',
          skills: 'flex flex-wrap gap-2',
          skillTag: 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm'
        }
      case 'classic':
        return {
          container: 'bg-white p-8 max-w-4xl mx-auto font-serif text-gray-900',
          header: 'text-center mb-6',
          name: 'text-3xl font-bold mb-2',
          contact: 'text-gray-700',
          section: 'mb-6',
          sectionTitle: 'text-lg font-bold mb-3 border-b border-gray-300 pb-1',
          subsection: 'mb-4',
          company: 'font-bold',
          position: 'font-medium',
          duration: 'text-gray-600',
          bullet: 'text-gray-800 ml-4 mb-1',
          skills: 'text-gray-800',
          skillTag: ''
        }
      case 'minimal':
        return {
          container: 'bg-white p-8 max-w-4xl mx-auto font-mono text-gray-900',
          header: 'mb-8',
          name: 'text-2xl font-bold mb-1',
          contact: 'text-gray-600 text-sm',
          section: 'mb-6',
          sectionTitle: 'text-sm font-bold uppercase tracking-widest mb-3',
          subsection: 'mb-3',
          company: 'font-medium',
          position: 'text-gray-700',
          duration: 'text-gray-500 text-sm',
          bullet: 'text-gray-800 text-sm mb-1',
          skills: 'text-gray-800 text-sm',
          skillTag: ''
        }
      default:
        return {
          container: 'bg-white p-8 max-w-4xl mx-auto font-sans text-gray-800',
          header: 'text-center mb-6',
          name: 'text-3xl font-bold mb-2',
          contact: 'text-gray-600',
          section: 'mb-6',
          sectionTitle: 'text-xl font-bold mb-3',
          subsection: 'mb-4',
          company: 'font-semibold',
          position: 'text-gray-700',
          duration: 'text-gray-600',
          bullet: 'text-gray-700 mb-1',
          skills: 'text-gray-800',
          skillTag: ''
        }
    }
  }

  const styles = getTemplateStyles()

  return (
    <div className={styles.container} id="resume-template">
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.name}>{resume.contact.name}</h1>
        <div className={styles.contact}>
          {resume.contact.phone} | {resume.contact.email} | {resume.contact.linkedin}
        </div>
      </div>

      {/* Profile */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <p className="text-gray-700 leading-relaxed">{resume.profile}</p>
      </div>

      {/* Education */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>
        {resume.education.map((edu, idx) => (
          <div key={idx} className={styles.subsection}>
            <div className="flex justify-between items-start">
              <div>
                <div className={styles.company}>{edu.institution}</div>
                <div className={styles.position}>{edu.degree}</div>
              </div>
              <div className={styles.duration}>
                {edu.duration} {edu.gpa && `| ${edu.gpa}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        {template === 'modern' ? (
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-900">Technical: </span>
              <div className={styles.skills}>
                {resume.skills.technical.map((skill, idx) => (
                  <span key={idx} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Analytical: </span>
              <div className={styles.skills}>
                {resume.skills.analytical.map((skill, idx) => (
                  <span key={idx} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Soft Skills: </span>
              <div className={styles.skills}>
                {resume.skills.soft.map((skill, idx) => (
                  <span key={idx} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.skills}>
            <p><strong>Technical:</strong> {resume.skills.technical.join(', ')}</p>
            <p><strong>Analytical:</strong> {resume.skills.analytical.join(', ')}</p>
            <p><strong>Soft Skills:</strong> {resume.skills.soft.join(', ')}</p>
          </div>
        )}
      </div>

      {/* Experience */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        {resume.experience.map((exp, idx) => (
          <div key={idx} className={styles.subsection}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className={styles.company}>{exp.company}</div>
                <div className={styles.position}>{exp.position}</div>
              </div>
              <div className={styles.duration}>{exp.duration}</div>
            </div>
            <ul className="list-none">
              {exp.bullets.map((bullet, bulletIdx) => (
                <li key={bulletIdx} className={styles.bullet}>• {bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          {resume.projects.map((project, idx) => (
            <div key={idx} className={styles.subsection}>
              <div className={styles.company}>{project.title}</div>
              <div className={styles.position}>{project.description}</div>
              <ul className="list-none mt-2">
                {project.bullets.map((bullet, bulletIdx) => (
                  <li key={bulletIdx} className={styles.bullet}>• {bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Achievements</h2>
        <ul className="list-none">
          {resume.achievements.map((achievement, idx) => (
            <li key={idx} className={styles.bullet}>• {achievement}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}