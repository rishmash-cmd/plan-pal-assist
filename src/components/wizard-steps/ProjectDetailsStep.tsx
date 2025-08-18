import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ProjectDetails } from '../TransitionWizard';

interface ProjectDetailsStepProps {
  data: ProjectDetails;
  onChange: (data: ProjectDetails) => void;
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({ data, onChange }) => {
  const serviceTypes = [
    'Digital Factory Services',
    'Content Management Services',
    'Campaign Management Services',
    'Analytics Services'
  ];

  const subServiceOptions = [
    'Digital Email Authoring',
    'eDetail / Video Production',
    'Campaign Execution',
    'Web Authoring',
    'DAMs / Asset Management'
  ];

  const supportingToolOptions = [
    'VEM',
    'Content Studio',
    'Workfront',
    'SharePoint'
  ];

  const handleSubServiceChange = (service: string, checked: boolean) => {
    const updatedServices = checked
      ? [...data.subServices, service]
      : data.subServices.filter(s => s !== service);
    
    onChange({ ...data, subServices: updatedServices });
  };

  const handleSupportingToolChange = (tool: string, checked: boolean) => {
    const updatedTools = checked
      ? [...data.supportingTools, tool]
      : data.supportingTools.filter(t => t !== tool);
    
    onChange({ ...data, supportingTools: updatedTools });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Project Details</h2>
        <p className="text-muted-foreground">
          Let's start by gathering the basic information about your transition project
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-semibold">
            Project/Transition Start Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal transition-all duration-300",
                  !data.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? format(data.startDate, "PPP") : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.startDate}
                onSelect={(date) => onChange({ ...data, startDate: date })}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Service Type */}
        <div className="space-y-2">
          <Label htmlFor="serviceType" className="text-sm font-semibold">
            Service Type *
          </Label>
          <Select value={data.serviceType} onValueChange={(value) => onChange({ ...data, serviceType: value })}>
            <SelectTrigger className="transition-all duration-300 focus:shadow-glow">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sub-services */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Sub-services *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subServiceOptions.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={service}
                checked={data.subServices.includes(service)}
                onCheckedChange={(checked) => handleSubServiceChange(service, checked as boolean)}
                className="transition-all duration-300"
              />
              <Label
                htmlFor={service}
                className="text-sm text-foreground cursor-pointer hover:text-primary transition-colors duration-300"
              >
                {service}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Supporting Tools */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Supporting Tools</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {supportingToolOptions.map((tool) => (
            <div key={tool} className="flex items-center space-x-2">
              <Checkbox
                id={tool}
                checked={data.supportingTools.includes(tool)}
                onCheckedChange={(checked) => handleSupportingToolChange(tool, checked as boolean)}
                className="transition-all duration-300"
              />
              <Label
                htmlFor={tool}
                className="text-sm text-foreground cursor-pointer hover:text-primary transition-colors duration-300"
              >
                {tool}
              </Label>
            </div>
          ))}
        </div>

        {/* Other Tools */}
        <div className="space-y-2">
          <Label htmlFor="otherTools" className="text-sm font-medium text-muted-foreground">
            Other Tools (specify)
          </Label>
          <Input
            id="otherTools"
            placeholder="Enter additional tools..."
            value={data.otherTools}
            onChange={(e) => onChange({ ...data, otherTools: e.target.value })}
            className="transition-all duration-300 focus:shadow-glow"
          />
        </div>
      </div>

      {/* Summary */}
      {(data.serviceType || data.subServices.length > 0) && (
        <div className="mt-8 p-4 bg-gradient-muted rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">Selection Summary</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            {data.serviceType && <p>Service: {data.serviceType}</p>}
            {data.subServices.length > 0 && (
              <p>Sub-services: {data.subServices.join(', ')}</p>
            )}
            {data.supportingTools.length > 0 && (
              <p>Tools: {data.supportingTools.join(', ')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsStep;
