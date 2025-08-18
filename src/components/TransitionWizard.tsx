import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import ProjectDetailsStep from './wizard-steps/ProjectDetailsStep';
import TransitionStructureStep from './wizard-steps/TransitionStructureStep';
import RisksStep from './wizard-steps/RisksStep';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/transition-hero.jpg';

export interface ProjectDetails {
  startDate: Date | undefined;
  serviceType: string;
  subServices: string[];
  supportingTools: string[];
  otherTools: string;
}

export interface Wave {
  id: string;
  name: string;
  countries: string[];
  brands: string[];
  channels: string[];
}

export interface RiskData {
  knownIssues: string;
  knownRisks: string;
  dependencies: string;
}

export interface FormData {
  projectDetails: ProjectDetails;
  waves: Wave[];
  numberOfWaves: number;
  riskData: RiskData;
}

const TransitionWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    projectDetails: {
      startDate: undefined,
      serviceType: '',
      subServices: [],
      supportingTools: [],
      otherTools: ''
    },
    waves: [],
    numberOfWaves: 1,
    riskData: {
      knownIssues: '',
      knownRisks: '',
      dependencies: ''
    }
  });

  const steps = [
    { number: 1, title: 'Project Details', completed: false },
    { number: 2, title: 'Transition Structure', completed: false },
    { number: 3, title: 'Risks & Dependencies', completed: false }
  ];

  const getCurrentStepData = () => {
    return steps.map((step, index) => ({
      ...step,
      completed: index < currentStep - 1,
    }));
  };
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateFiles = () => {
    // Mock file generation
    toast({
      title: "Files Generated Successfully!",
      description: "Transition Plan and Risk Log have been created.",
      variant: "default"
    });

    // In a real implementation, this would generate and download actual Excel files
    console.log('Generating files with data:', formData);
  };

  const handleSubmit = () => {
    generateFiles();
  };

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6 rounded-lg overflow-hidden shadow-elevated">
            <img 
              src={heroImage} 
              alt="Professional transition planning dashboard" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-2">
                  Transition Planning Wizard
                </h1>
                <p className="text-xl opacity-90">
                  Generate comprehensive transition plans and risk assessments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            {getCurrentStepData().map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step.completed 
                      ? 'bg-accent border-accent text-accent-foreground' 
                      : currentStep === step.number 
                        ? 'bg-primary border-primary text-primary-foreground shadow-glow' 
                        : 'bg-background border-border text-muted-foreground'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.number}</span>
                    )}
                  </div>
                  <span className={`text-sm mt-2 transition-colors duration-300 ${
                    currentStep === step.number ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                    step.completed ? 'bg-accent' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="w-full" />
        </Card>

        {/* Step Content */}
        <Card className="mb-8 shadow-elevated">
          <div className="p-8">
            {currentStep === 1 && (
              <ProjectDetailsStep 
                data={formData.projectDetails}
                onChange={(data) => updateFormData('projectDetails', data)}
              />
            )}
            {currentStep === 2 && (
              <TransitionStructureStep 
                numberOfWaves={formData.numberOfWaves}
                waves={formData.waves}
                onNumberOfWavesChange={(num) => updateFormData('numberOfWaves', num)}
                onWavesChange={(waves) => updateFormData('waves', waves)}
              />
            )}
            {currentStep === 3 && (
              <RisksStep 
                data={formData.riskData}
                onChange={(data) => updateFormData('riskData', data)}
              />
            )}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="transition-all duration-300"
          >
            Previous
          </Button>

          <div className="flex gap-4">
            {currentStep === steps.length ? (
              <div className="flex gap-4">
                <Button
                  onClick={generateFiles}
                  className="bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-glow"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Generate Transition Plan
                </Button>
                <Button
                  onClick={generateFiles}
                  variant="outline"
                  className="border-warning text-warning hover:bg-warning hover:text-warning-foreground transition-all duration-300"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Generate Risk Log
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitionWizard;