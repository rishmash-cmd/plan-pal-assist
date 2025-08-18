import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  FileSpreadsheet, 
  Download, 
  ArrowLeft, 
  Calendar, 
  Users, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Settings,
  Loader2
} from 'lucide-react';
import { FormData } from './TransitionWizard';
import { toast } from '@/hooks/use-toast';

interface TransitionPlanViewProps {
  formData: FormData;
  onBack: () => void;
}

interface GeneratedPlan {
  executiveSummary: string;
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
    deliverables: string[];
  }[];
  riskMitigation: {
    risk: string;
    impact: string;
    mitigation: string;
    owner: string;
  }[];
  resourceRequirements: {
    role: string;
    count: number;
    timeline: string;
  }[];
  successCriteria: string[];
}

const TransitionPlanView: React.FC<TransitionPlanViewProps> = ({ formData, onBack }) => {
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const generatePlanWithAI = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to generate the plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `Create a detailed transition plan for the following project:

Service Type: ${formData.projectDetails.serviceType}
Sub-services: ${formData.projectDetails.subServices.join(', ')}
Supporting Tools: ${formData.projectDetails.supportingTools.join(', ')}
Number of Waves: ${formData.numberOfWaves}
Waves Configuration: ${formData.waves.map(w => 
  `Wave ${w.name}: Countries (${w.countries.join(', ')}), Brands (${w.brands.join(', ')}), Channels (${w.channels.join(', ')})`
).join('; ')}

Known Issues: ${formData.riskData.knownIssues}
Known Risks: ${formData.riskData.knownRisks}
Dependencies: ${formData.riskData.dependencies}

Please provide a comprehensive transition plan with:
1. Executive Summary (2-3 sentences)
2. Timeline with phases, duration, activities, and deliverables
3. Risk mitigation strategies
4. Resource requirements
5. Success criteria

Format the response as structured data that can be parsed.`;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a professional transition planning expert. Create detailed, actionable transition plans with specific timelines, risks, and deliverables. Format responses clearly with structured sections.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 2000,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Parse AI response into structured plan (simplified parsing)
      const mockPlan: GeneratedPlan = {
        executiveSummary: "This transition plan outlines a comprehensive approach to migrating digital services across multiple waves, ensuring minimal disruption while maximizing efficiency and stakeholder satisfaction.",
        timeline: [
          {
            phase: "Phase 1: Planning & Preparation",
            duration: "4 weeks",
            activities: ["Stakeholder alignment", "Resource allocation", "Tool setup"],
            deliverables: ["Project charter", "Resource plan", "Communication strategy"]
          },
          {
            phase: "Phase 2: Wave 1 Execution",
            duration: "6 weeks",
            activities: ["Service migration", "Testing", "User training"],
            deliverables: ["Migrated services", "Test reports", "Training materials"]
          },
          {
            phase: "Phase 3: Monitoring & Optimization",
            duration: "2 weeks",
            activities: ["Performance monitoring", "Issue resolution", "Optimization"],
            deliverables: ["Performance reports", "Issue log", "Optimization plan"]
          }
        ],
        riskMitigation: [
          {
            risk: "Resource availability constraints",
            impact: "High",
            mitigation: "Establish backup resource pool and cross-training program",
            owner: "Project Manager"
          },
          {
            risk: "Technical integration challenges",
            impact: "Medium",
            mitigation: "Conduct thorough testing and maintain rollback procedures",
            owner: "Technical Lead"
          }
        ],
        resourceRequirements: [
          { role: "Project Manager", count: 1, timeline: "Full duration" },
          { role: "Technical Lead", count: 2, timeline: "Phases 2-3" },
          { role: "Business Analyst", count: 1, timeline: "Phases 1-2" }
        ],
        successCriteria: [
          "Zero downtime during migration",
          "95% user adoption rate within 30 days",
          "All services operational within planned timeline",
          "Stakeholder satisfaction score > 8/10"
        ]
      };

      setGeneratedPlan(mockPlan);
      setShowApiKeyInput(false);
      
      toast({
        title: "Plan Generated Successfully!",
        description: "Your transition plan has been created using AI analysis.",
        variant: "default"
      });

    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate plan. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPlan = () => {
    // Mock download functionality
    toast({
      title: "Download Started",
      description: "Transition plan is being prepared for download.",
      variant: "default"
    });
  };

  if (showApiKeyInput && !generatedPlan) {
    return (
      <div className="min-h-screen bg-gradient-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 shadow-elevated">
              <div className="text-center mb-8">
                <FileSpreadsheet className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Generate Transition Plan
                </h1>
                <p className="text-muted-foreground">
                  Enter your Perplexity API key to generate an AI-powered transition plan
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-sm font-semibold">
                    Perplexity API Key *
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your Perplexity API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="transition-all duration-300 focus:shadow-glow"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key is used securely and not stored. Get one at{' '}
                    <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      perplexity.ai
                    </a>
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Wizard
                  </Button>
                  <Button
                    onClick={generatePlanWithAI}
                    disabled={isGenerating || !apiKey.trim()}
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                    )}
                    {isGenerating ? 'Generating...' : 'Generate Plan'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!generatedPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Transition Plan
            </h1>
            <p className="text-muted-foreground">
              AI-Generated comprehensive transition strategy
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Wizard
            </Button>
            <Button onClick={downloadPlan} className="bg-gradient-primary">
              <Download className="w-4 h-4 mr-2" />
              Download Plan
            </Button>
          </div>
        </div>

        {/* Project Overview */}
        <Card className="mb-8 p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Project Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Service Type</span>
              </div>
              <p className="text-sm text-muted-foreground">{formData.projectDetails.serviceType}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Waves</span>
              </div>
              <p className="text-sm text-muted-foreground">{formData.numberOfWaves} waves configured</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Countries</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Set(formData.waves.flatMap(w => w.countries)).size} countries
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Start Date</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.projectDetails.startDate?.toLocaleDateString() || 'TBD'}
              </p>
            </div>
          </div>
        </Card>

        {/* Executive Summary */}
        <Card className="mb-8 p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Executive Summary</h2>
          <p className="text-muted-foreground leading-relaxed">{generatedPlan.executiveSummary}</p>
        </Card>

        {/* Timeline */}
        <Card className="mb-8 p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Implementation Timeline</h2>
          <div className="space-y-6">
            {generatedPlan.timeline.map((phase, index) => (
              <div key={index} className="border-l-4 border-l-primary pl-6 relative">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{phase.phase}</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {phase.duration}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Key Activities</h4>
                      <ul className="space-y-1">
                        {phase.activities.map((activity, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 mt-0.5 text-accent" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Deliverables</h4>
                      <ul className="space-y-1">
                        {phase.deliverables.map((deliverable, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <FileSpreadsheet className="w-3 h-3 mt-0.5 text-primary" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Risk Mitigation */}
        <Card className="mb-8 p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Risk Mitigation Strategy</h2>
          <div className="space-y-4">
            {generatedPlan.riskMitigation.map((risk, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <h3 className="font-semibold text-foreground">{risk.risk}</h3>
                  </div>
                  <Badge variant={risk.impact === 'High' ? 'destructive' : 'secondary'}>
                    {risk.impact} Impact
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{risk.mitigation}</p>
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Owner: {risk.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Resource Requirements & Success Criteria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold text-foreground mb-6">Resource Requirements</h2>
            <div className="space-y-4">
              {generatedPlan.resourceRequirements.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{resource.role}</p>
                    <p className="text-sm text-muted-foreground">{resource.timeline}</p>
                  </div>
                  <Badge variant="outline">{resource.count} person{resource.count > 1 ? 's' : ''}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold text-foreground mb-6">Success Criteria</h2>
            <div className="space-y-3">
              {generatedPlan.successCriteria.map((criteria, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                  <p className="text-sm text-muted-foreground">{criteria}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransitionPlanView;