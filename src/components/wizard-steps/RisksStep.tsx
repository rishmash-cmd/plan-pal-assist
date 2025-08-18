import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertTriangle, FileText, Link as LinkIcon } from 'lucide-react';
import { RiskData } from '../TransitionWizard';

interface RisksStepProps {
  data: RiskData;
  onChange: (data: RiskData) => void;
}

const RisksStep: React.FC<RisksStepProps> = ({ data, onChange }) => {
  const handleFieldChange = (field: keyof RiskData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Known Information & Risks</h2>
        <p className="text-muted-foreground">
          Document any known challenges, risks, and dependencies for your transition
        </p>
      </div>

      <div className="space-y-6">
        {/* Known Issues / Challenges */}
        <Card className="p-6 border-l-4 border-l-warning shadow-card">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <Label htmlFor="knownIssues" className="text-sm font-semibold">
                Known Issues / Challenges
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Document any current issues, technical challenges, or obstacles that may impact the transition
            </p>
            <Textarea
              id="knownIssues"
              placeholder="Describe any known issues, technical challenges, or current problems that need to be addressed during the transition..."
              value={data.knownIssues}
              onChange={(e) => handleFieldChange('knownIssues', e.target.value)}
              className="min-h-[120px] transition-all duration-300 focus:shadow-glow resize-none"
            />
            <div className="text-xs text-muted-foreground">
              {data.knownIssues.length}/1000 characters
            </div>
          </div>
        </Card>

        {/* Known Risks */}
        <Card className="p-6 border-l-4 border-l-destructive shadow-card">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <Label htmlFor="knownRisks" className="text-sm font-semibold">
                Known Risks
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Identify potential risks that could affect timeline, budget, or project success
            </p>
            <Textarea
              id="knownRisks"
              placeholder="List potential risks such as resource constraints, technical limitations, stakeholder concerns, timeline pressures, etc..."
              value={data.knownRisks}
              onChange={(e) => handleFieldChange('knownRisks', e.target.value)}
              className="min-h-[120px] transition-all duration-300 focus:shadow-glow resize-none"
            />
            <div className="text-xs text-muted-foreground">
              {data.knownRisks.length}/1000 characters
            </div>
          </div>
        </Card>

        {/* Dependencies */}
        <Card className="p-6 border-l-4 border-l-info shadow-card">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-info" />
              <Label htmlFor="dependencies" className="text-sm font-semibold">
                Dependencies Identified
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Document dependencies on other projects, teams, systems, or external factors
            </p>
            <Textarea
              id="dependencies"
              placeholder="Describe dependencies on other teams, systems, external vendors, approvals, or any prerequisite work that must be completed..."
              value={data.dependencies}
              onChange={(e) => handleFieldChange('dependencies', e.target.value)}
              className="min-h-[120px] transition-all duration-300 focus:shadow-glow resize-none"
            />
            <div className="text-xs text-muted-foreground">
              {data.dependencies.length}/1000 characters
            </div>
          </div>
        </Card>
      </div>

      {/* Summary */}
      {(data.knownIssues || data.knownRisks || data.dependencies) && (
        <div className="mt-8 p-4 bg-gradient-muted rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Documentation Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-warning">Issues Documented</p>
              <p className="text-muted-foreground">
                {data.knownIssues ? 'Yes' : 'None specified'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-destructive">Risks Identified</p>
              <p className="text-muted-foreground">
                {data.knownRisks ? 'Yes' : 'None specified'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-info">Dependencies Listed</p>
              <p className="text-muted-foreground">
                {data.dependencies ? 'Yes' : 'None specified'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <Card className="p-4 bg-muted border-none">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">💡 Tips for Better Risk Management</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Be specific about timelines and impact levels</li>
            <li>• Consider both technical and business risks</li>
            <li>• Include stakeholder and communication dependencies</li>
            <li>• Think about resource availability and competing priorities</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default RisksStep;