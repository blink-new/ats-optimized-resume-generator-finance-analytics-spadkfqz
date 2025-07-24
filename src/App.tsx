import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Separator } from './components/ui/separator'
import { Progress } from './components/ui/progress'
import { FileText, Download, Copy, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from './hooks/use-toast'
import { Toaster } from './components/ui/toaster'

interface User {
  id: string
  email: string
  displayName?: string
}

interface OptimizedResume {
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

const formatResumeAsText = (resume: OptimizedResume): string => {
  return `${resume.contact.name}
${resume.contact.phone} | ${resume.contact.email} | ${resume.contact.linkedin}

PROFILE
${resume.profile}

EDUCATION
${resume.education.map(edu => 
  `• ${edu.institution} | ${edu.degree} | ${edu.duration}${edu.gpa ? ` | ${edu.gpa}` : ''}`
).join('\n')}

SKILLS
Technical: ${resume.skills.technical.join(', ')}
Analytical: ${resume.skills.analytical.join(', ')}
Soft Skills: ${resume.skills.soft.join(', ')}

EXPERIENCE
${resume.experience.map(exp => 
  `${exp.company} | ${exp.position} | ${exp.duration}\n${exp.bullets.map(bullet => `• ${bullet}`).join('\n')}`
).join('\n\n')}

${resume.projects && resume.projects.length > 0 ? `PROJECTS
${resume.projects.map(proj => 
  `${proj.title} | ${proj.description}\n${proj.bullets.map(bullet => `• ${bullet}`).join('\n')}`
).join('\n\n')}

` : ''}ACHIEVEMENTS
${resume.achievements.map(achievement => `• ${achievement}`).join('\n')}`
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [rawResume, setRawResume] = useState(`Aman Kumar Verma  
+91-7667124977 | amankumarverma957@gmail.com | linkedin.com/in/amanverma2/

PROFILE  
Quantitative Economics and Data Science student with an analytical mindset and experience in content writing, research, case competitions, and lead generation. Passionate about leveraging data-driven insights for growth.

EDUCATION  
• Birla Institute of Technology, Mesra | Integrated MSc in Quantitative Economics and Data Science | 2024 – 2029 | 7.51 CGPA in 1st Year  
• Millenium Public School, Nagar Untari | 12th (CBSE) | 2022 – 2024  
• Aditya Birla Public School, Rehla | Xth (CBSE) | 2021 – 2022  

SKILLS  
Programming Languages: C, C++, R, Python  
Quantitative & Analytical Skills: Statistical analysis, economics, quantitative methods  
Other Skills: Case solving, analytical thinking, research, content writing  

EXPERIENCE  
Finance Club, BIT Mesra | Member | Oct 2024 – Present  
• Led content strategy and research initiatives on Indian financial markets  
• Developed and edited market-focused content for social media and forums  
• Assisted sponsorship lead generation and volunteered in two events  

EvePaper, Delhi | Research Intern (Remote) | Aug 2024 – Oct 2024  
• Conducted research on emerging market trends supporting strategic planning  
• Analyzed datasets to provide insights that improved internal performance  

Qrill, Bengaluru | Lead Generator (Remote) | Apr 2024 – Jun 2024  
• Identified qualified leads across industries and geographies  
• Shared actionable lead information with business development team  

ACHIEVEMENTS  
• 1st Prize, Enigma Case Competition – Conducted comprehensive case study on the Indian EV Market`)
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const generateOptimizedResume = async () => {
    if (!rawResume.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste your raw resume content first.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `You are an expert resume writer specialized in creating ATS-optimized resumes for students applying to competitive internships and entry-level roles in finance, analytics, and strategy.

Transform this raw resume content into a modern, clean, keyword-rich resume that passes ATS and appeals to recruiters:

Requirements:
- Use strong action verbs and quantified achievements
- Optimize for finance, consulting, analytics, and research roles
- Include keywords: "data analysis", "financial modeling", "business insights", "strategic research", "problem-solving", "data-driven decision-making", "market analysis"
- Make Skills keyword-dense (technical + analytical + soft skills)
- Enhance bullet points for clarity and impact
- Generate relevant projects if needed based on background
- Calculate ATS score (0-100) based on keyword density, formatting, and content quality

Raw Resume Content:
${rawResume}`,
        schema: {
          type: 'object',
          properties: {
            contact: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                phone: { type: 'string' },
                email: { type: 'string' },
                linkedin: { type: 'string' }
              },
              required: ['name', 'phone', 'email', 'linkedin']
            },
            profile: { type: 'string' },
            education: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  institution: { type: 'string' },
                  degree: { type: 'string' },
                  duration: { type: 'string' },
                  gpa: { type: 'string' }
                },
                required: ['institution', 'degree', 'duration']
              }
            },
            skills: {
              type: 'object',
              properties: {
                technical: { type: 'array', items: { type: 'string' } },
                analytical: { type: 'array', items: { type: 'string' } },
                soft: { type: 'array', items: { type: 'string' } }
              },
              required: ['technical', 'analytical', 'soft']
            },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  company: { type: 'string' },
                  position: { type: 'string' },
                  duration: { type: 'string' },
                  bullets: { type: 'array', items: { type: 'string' } }
                },
                required: ['company', 'position', 'duration', 'bullets']
              }
            },
            projects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  bullets: { type: 'array', items: { type: 'string' } }
                },
                required: ['title', 'description', 'bullets']
              }
            },
            achievements: { type: 'array', items: { type: 'string' } },
            atsScore: { type: 'number', minimum: 0, maximum: 100 }
          },
          required: ['contact', 'profile', 'education', 'skills', 'experience', 'achievements', 'atsScore']
        }
      })

      setOptimizedResume(object as OptimizedResume)
      toast({
        title: "Resume Optimized!",
        description: `ATS Score: ${object.atsScore}/100`,
      })
    } catch (error) {
      console.error('Error generating resume:', error)
      toast({
        title: "Generation Failed",
        description: "Please try again or check your input.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (!optimizedResume) return
    
    const resumeText = formatResumeAsText(optimizedResume)
    navigator.clipboard.writeText(resumeText)
    toast({
      title: "Copied!",
      description: "Resume copied to clipboard.",
    })
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>ATS Resume Generator</CardTitle>
            <p className="text-gray-600">Please sign in to optimize your resume</p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => blink.auth.login()} 
              className="w-full"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ATS Resume Generator</h1>
                <p className="text-sm text-gray-500">Finance & Analytics Optimized</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => blink.auth.logout()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>Raw Resume Input</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Paste your current resume content below. Include contact info, education, experience, and skills.
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your raw resume content here..."
                  value={rawResume}
                  onChange={(e) => setRawResume(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {rawResume.length} characters
                  </p>
                  <Button 
                    onClick={generateOptimizedResume}
                    disabled={isGenerating || !rawResume.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate ATS Resume
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ATS Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ATS Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Use strong action verbs (Analyzed, Developed, Led)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Include quantified achievements with numbers</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Add finance keywords: financial modeling, data analysis</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Keep formatting simple (no tables or graphics)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Panel */}
          <div className="space-y-6">
            {optimizedResume ? (
              <>
                {/* ATS Score */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">ATS Compatibility Score</CardTitle>
                      <Badge 
                        variant={optimizedResume.atsScore >= 80 ? "default" : optimizedResume.atsScore >= 60 ? "secondary" : "destructive"}
                        className="text-lg px-3 py-1"
                      >
                        {optimizedResume.atsScore}/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={optimizedResume.atsScore} className="mb-2" />
                    <p className="text-sm text-gray-600">
                      {optimizedResume.atsScore >= 80 ? "Excellent! Your resume is highly ATS-optimized." :
                       optimizedResume.atsScore >= 60 ? "Good score. Consider adding more keywords." :
                       "Needs improvement. Add more quantified achievements and keywords."}
                    </p>
                  </CardContent>
                </Card>

                {/* Resume Preview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Optimized Resume</CardTitle>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={copyToClipboard}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const resumeText = formatResumeAsText(optimizedResume)
                            const blob = new Blob([resumeText], { type: 'text/plain' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${optimizedResume.contact.name.replace(/\s+/g, '_')}_Resume.txt`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border rounded-lg p-6 font-mono text-sm space-y-4 max-h-[600px] overflow-y-auto">
                      {/* Contact */}
                      <div className="text-center">
                        <h2 className="text-lg font-bold">{optimizedResume.contact.name}</h2>
                        <p>{optimizedResume.contact.phone} | {optimizedResume.contact.email} | {optimizedResume.contact.linkedin}</p>
                      </div>

                      <Separator />

                      {/* Profile */}
                      <div>
                        <h3 className="font-bold mb-2">PROFILE</h3>
                        <p className="text-gray-700">{optimizedResume.profile}</p>
                      </div>

                      {/* Education */}
                      <div>
                        <h3 className="font-bold mb-2">EDUCATION</h3>
                        {optimizedResume.education.map((edu, idx) => (
                          <p key={idx} className="text-gray-700">
                            • {edu.institution} | {edu.degree} | {edu.duration}
                            {edu.gpa && ` | ${edu.gpa}`}
                          </p>
                        ))}
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="font-bold mb-2">SKILLS</h3>
                        <p className="text-gray-700"><strong>Technical:</strong> {optimizedResume.skills.technical.join(', ')}</p>
                        <p className="text-gray-700"><strong>Analytical:</strong> {optimizedResume.skills.analytical.join(', ')}</p>
                        <p className="text-gray-700"><strong>Soft Skills:</strong> {optimizedResume.skills.soft.join(', ')}</p>
                      </div>

                      {/* Experience */}
                      <div>
                        <h3 className="font-bold mb-2">EXPERIENCE</h3>
                        {optimizedResume.experience.map((exp, idx) => (
                          <div key={idx} className="mb-3">
                            <p className="font-medium">{exp.company} | {exp.position} | {exp.duration}</p>
                            {exp.bullets.map((bullet, bulletIdx) => (
                              <p key={bulletIdx} className="text-gray-700 ml-2">• {bullet}</p>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Projects */}
                      {optimizedResume.projects && optimizedResume.projects.length > 0 && (
                        <div>
                          <h3 className="font-bold mb-2">PROJECTS</h3>
                          {optimizedResume.projects.map((project, idx) => (
                            <div key={idx} className="mb-3">
                              <p className="font-medium">{project.title} | {project.description}</p>
                              {project.bullets.map((bullet, bulletIdx) => (
                                <p key={bulletIdx} className="text-gray-700 ml-2">• {bullet}</p>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Achievements */}
                      <div>
                        <h3 className="font-bold mb-2">ACHIEVEMENTS</h3>
                        {optimizedResume.achievements.map((achievement, idx) => (
                          <p key={idx} className="text-gray-700">• {achievement}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Resume Generated Yet</h3>
                  <p className="text-gray-600 text-center max-w-sm">
                    Paste your raw resume content and click "Generate ATS Resume" to see your optimized resume here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App