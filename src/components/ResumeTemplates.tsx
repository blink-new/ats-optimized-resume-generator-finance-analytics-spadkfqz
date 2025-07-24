import React from 'react';
import { Card } from './ui/card';
import { OptimizedResume, ResumeTemplate as ResumeTemplateType } from '../types/resume';

interface ResumeTemplateProps {
  resume: OptimizedResume;
  template: ResumeTemplateType;
}

export const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ resume, template }) => {
  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return {
          container: 'bg-white p-8 max-w-4xl mx-auto font-sans text-gray-800 leading-relaxed',
          header: 'border-b-2 border-blue-600 pb-4 mb-6',
          name: 'text-3xl font-bold text-gray-900 mb-2',
          contact: 'text-sm text-gray-600 flex flex-wrap gap-4',
          section: 'mb-6',
          sectionTitle: 'text-lg font-semibold text-blue-600 uppercase tracking-wide mb-3 border-b border-gray-200 pb-1',
          subsection: 'mb-4',
          jobTitle: 'font-semibold text-gray-900',
          company: 'text-gray-700 font-medium',
          duration: 'text-sm text-gray-500',
          bullet: 'text-sm text-gray-700 ml-4 mb-1'
        };
      case 'classic':
        return {
          container: 'bg-white p-8 max-w-4xl mx-auto font-serif text-gray-800 leading-relaxed',
          header: 'text-center border-b border-gray-400 pb-4 mb-6',
          name: 'text-3xl font-bold text-gray-900 mb-2',
          contact: 'text-sm text-gray-600 justify-center flex flex-wrap gap-4',
          section: 'mb-6',
          sectionTitle: 'text-lg font-bold text-gray-900 uppercase tracking-wide mb-3',
          subsection: 'mb-4',
          jobTitle: 'font-bold text-gray-900',
          company: 'text-gray-700 font-medium',
          duration: 'text-sm text-gray-500',
          bullet: 'text-sm text-gray-700 ml-4 mb-1'
        };
      case 'minimal':
        return {
          container: 'bg-white p-8 max-w-4xl mx-auto font-sans text-gray-800 leading-relaxed',
          header: 'mb-8',
          name: 'text-2xl font-light text-gray-900 mb-2',
          contact: 'text-sm text-gray-500 flex flex-wrap gap-4',
          section: 'mb-6',
          sectionTitle: 'text-base font-medium text-gray-900 mb-3',
          subsection: 'mb-4',
          jobTitle: 'font-medium text-gray-900',
          company: 'text-gray-600',
          duration: 'text-sm text-gray-400',
          bullet: 'text-sm text-gray-600 ml-4 mb-1'
        };
      default:
        return getTemplateStyles();
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className={styles.container} id="resume-template">
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.name}>{resume.contact.name}</h1>
        <div className={styles.contact}>
          <span>{resume.contact.phone}</span>
          <span>•</span>
          <span>{resume.contact.email}</span>
          <span>•</span>
          <span>{resume.contact.linkedin}</span>
        </div>
      </div>

      {/* Profile */}
      {resume.profile && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Professional Summary</h2>
          <p className="text-sm text-gray-700">{resume.profile}</p>
        </div>
      )}

      {/* Education */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className={styles.subsection}>
            <div className="flex justify-between items-start">
              <div>
                <div className={styles.jobTitle}>{edu.institution}</div>
                <div className={styles.company}>{edu.degree}</div>
              </div>
              <div className="text-right">
                <div className={styles.duration}>{edu.duration}</div>
                {edu.gpa && <div className="text-sm text-gray-500">{edu.gpa}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Technical Skills</h2>
        <div className="grid grid-cols-1 gap-2">
          {resume.skills.technical.length > 0 && (
            <div>
              <span className="font-medium text-gray-900">Technical: </span>
              <span className="text-sm text-gray-700">{resume.skills.technical.join(', ')}</span>
            </div>
          )}
          {resume.skills.analytical.length > 0 && (
            <div>
              <span className="font-medium text-gray-900">Analytical: </span>
              <span className="text-sm text-gray-700">{resume.skills.analytical.join(', ')}</span>
            </div>
          )}
          {resume.skills.soft.length > 0 && (
            <div>
              <span className="font-medium text-gray-900">Soft Skills: </span>
              <span className="text-sm text-gray-700">{resume.skills.soft.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Professional Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className={styles.subsection}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className={styles.jobTitle}>{exp.position}</div>
                <div className={styles.company}>{exp.company}</div>
              </div>
              <div className={styles.duration}>{exp.duration}</div>
            </div>
            <ul className="list-none">
              {exp.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className={styles.bullet}>
                  • {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          {resume.projects.map((project, index) => (
            <div key={index} className={styles.subsection}>
              <div className={styles.jobTitle}>{project.title}</div>
              <p className="text-sm text-gray-700 mb-1">{project.description}</p>
              <ul className="list-none mt-2">
                {project.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className={styles.bullet}>
                    • {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {resume.achievements.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Achievements</h2>
          <ul className="list-none">
            {resume.achievements.map((achievement, index) => (
              <li key={index} className={styles.bullet}>
                • {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const TemplateSelector: React.FC<{
  selectedTemplate: ResumeTemplateType;
  onTemplateChange: (template: ResumeTemplateType) => void;
}> = ({ selectedTemplate, onTemplateChange }) => {
  const templates = [
    {
      id: 'modern' as const,
      name: 'Modern',
      description: 'Clean design with blue accents, perfect for tech and finance roles',
      preview: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      id: 'classic' as const,
      name: 'Classic',
      description: 'Traditional serif font layout, ideal for consulting and banking',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100'
    },
    {
      id: 'minimal' as const,
      name: 'Minimal',
      description: 'Ultra-clean design focusing on content, great for analytics roles',
      preview: 'bg-gradient-to-br from-slate-50 to-slate-100'
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Choose Template</h3>
      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            <div className={`h-20 rounded mb-3 ${template.preview}`} />
            <h4 className="font-medium text-sm">{template.name}</h4>
            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};