export interface OptimizedResume {
  contact: {
    name: string
    phone: string
    email: string
    linkedin: string
  }
  profile: string
  education: Array<{
    institution: string
    degree: string
    duration: string
    gpa?: string
  }>
  skills: {
    technical: string[]
    analytical: string[]
    soft: string[]
  }
  experience: Array<{
    company: string
    position: string
    duration: string
    bullets: string[]
  }>
  projects?: Array<{
    title: string
    description: string
    bullets: string[]
  }>
  achievements: string[]
  atsScore: number
}

export type ResumeTemplate = 'modern' | 'classic' | 'minimal'