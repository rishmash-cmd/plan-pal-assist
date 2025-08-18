import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Waves } from 'lucide-react';
import { Wave } from '../TransitionWizard';

interface TransitionStructureStepProps {
  numberOfWaves: number;
  waves: Wave[];
  onNumberOfWavesChange: (num: number) => void;
  onWavesChange: (waves: Wave[]) => void;
}

const TransitionStructureStep: React.FC<TransitionStructureStepProps> = ({ 
  numberOfWaves, 
  waves, 
  onNumberOfWavesChange, 
  onWavesChange 
}) => {
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
    'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland',
    'Australia', 'Japan', 'Brazil', 'Mexico', 'Argentina'
  ];

  const brandsOptions = [
    'Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E',
    'Global Brand', 'Regional Brand', 'Local Brand'
  ];

  const channelsOptions = [
    'Email', 'Website', 'Mobile App', 'Social Media', 'Print',
    'Digital Display', 'Video', 'SMS', 'Push Notifications'
  ];

  // Initialize waves when numberOfWaves changes
  useEffect(() => {
    const newWaves = Array.from({ length: numberOfWaves }, (_, i) => {
      const existingWave = waves[i];
      return existingWave || {
        id: `wave-${i + 1}`,
        name: `Wave ${i + 1}`,
        countries: [],
        brands: [],
        channels: []
      };
    });
    onWavesChange(newWaves.slice(0, numberOfWaves));
  }, [numberOfWaves]);

  const updateWave = (index: number, field: keyof Wave, value: any) => {
    const updatedWaves = waves.map((wave, i) => 
      i === index ? { ...wave, [field]: value } : wave
    );
    onWavesChange(updatedWaves);
  };

  const toggleArrayItem = (waveIndex: number, field: 'countries' | 'brands' | 'channels', item: string) => {
    const wave = waves[waveIndex];
    const currentArray = wave[field];
    const updatedArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updateWave(waveIndex, field, updatedArray);
  };

  const addCustomItem = (waveIndex: number, field: 'brands' | 'channels', value: string) => {
    if (value.trim()) {
      const wave = waves[waveIndex];
      const currentArray = wave[field];
      if (!currentArray.includes(value.trim())) {
        updateWave(waveIndex, field, [...currentArray, value.trim()]);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Transition Structure</h2>
        <p className="text-muted-foreground">
          Define the waves and their scope for your transition project
        </p>
      </div>

      {/* Number of Waves */}
      <div className="space-y-2">
        <Label htmlFor="numberOfWaves" className="text-sm font-semibold">
          Number of Waves *
        </Label>
        <div className="flex items-center gap-4">
          <Input
            id="numberOfWaves"
            type="number"
            min="1"
            max="10"
            value={numberOfWaves}
            onChange={(e) => onNumberOfWavesChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-32 transition-all duration-300 focus:shadow-glow"
          />
          <span className="text-sm text-muted-foreground">
            Configure {numberOfWaves} wave{numberOfWaves !== 1 ? 's' : ''} below
          </span>
        </div>
      </div>

      {/* Wave Configurations */}
      <div className="space-y-6">
        {waves.map((wave, index) => (
          <Card key={wave.id} className="p-6 shadow-card border-l-4 border-l-primary">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Waves className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Wave {index + 1}</h3>
              </div>

              {/* Wave Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Wave Name</Label>
                <Input
                  value={wave.name}
                  onChange={(e) => updateWave(index, 'name', e.target.value)}
                  placeholder={`Wave ${index + 1}`}
                  className="transition-all duration-300 focus:shadow-glow"
                />
              </div>

              {/* Countries */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Countries *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {countries.map((country) => (
                    <div key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${wave.id}-${country}`}
                        checked={wave.countries.includes(country)}
                        onCheckedChange={() => toggleArrayItem(index, 'countries', country)}
                        className="transition-all duration-300"
                      />
                      <Label
                        htmlFor={`${wave.id}-${country}`}
                        className="text-xs cursor-pointer hover:text-primary transition-colors duration-300"
                      >
                        {country}
                      </Label>
                    </div>
                  ))}
                </div>
                {wave.countries.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {wave.countries.map((country) => (
                      <Badge key={country} variant="secondary" className="text-xs">
                        {country}
                        <X
                          className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive transition-colors duration-300"
                          onClick={() => toggleArrayItem(index, 'countries', country)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Brands */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Brands</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {brandsOptions.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${wave.id}-${brand}`}
                        checked={wave.brands.includes(brand)}
                        onCheckedChange={() => toggleArrayItem(index, 'brands', brand)}
                        className="transition-all duration-300"
                      />
                      <Label
                        htmlFor={`${wave.id}-${brand}`}
                        className="text-xs cursor-pointer hover:text-primary transition-colors duration-300"
                      >
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
                <CustomItemInput
                  placeholder="Add custom brand..."
                  onAdd={(value) => addCustomItem(index, 'brands', value)}
                />
                {wave.brands.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {wave.brands.map((brand) => (
                      <Badge key={brand} variant="outline" className="text-xs">
                        {brand}
                        <X
                          className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive transition-colors duration-300"
                          onClick={() => toggleArrayItem(index, 'brands', brand)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Channels */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Channels</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {channelsOptions.map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${wave.id}-${channel}`}
                        checked={wave.channels.includes(channel)}
                        onCheckedChange={() => toggleArrayItem(index, 'channels', channel)}
                        className="transition-all duration-300"
                      />
                      <Label
                        htmlFor={`${wave.id}-${channel}`}
                        className="text-xs cursor-pointer hover:text-primary transition-colors duration-300"
                      >
                        {channel}
                      </Label>
                    </div>
                  ))}
                </div>
                <CustomItemInput
                  placeholder="Add custom channel..."
                  onAdd={(value) => addCustomItem(index, 'channels', value)}
                />
                {wave.channels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {wave.channels.map((channel) => (
                      <Badge key={channel} variant="outline" className="text-xs">
                        {channel}
                        <X
                          className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive transition-colors duration-300"
                          onClick={() => toggleArrayItem(index, 'channels', channel)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      {waves.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-muted rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">Transition Summary</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Total Waves: {numberOfWaves}</p>
            <p>Total Countries: {new Set(waves.flatMap(w => w.countries)).size}</p>
            <p>Total Brands: {new Set(waves.flatMap(w => w.brands)).size}</p>
            <p>Total Channels: {new Set(waves.flatMap(w => w.channels)).size}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for adding custom items
const CustomItemInput: React.FC<{ placeholder: string; onAdd: (value: string) => void }> = ({ 
  placeholder, 
  onAdd 
}) => {
  const [value, setValue] = React.useState('');

  const handleAdd = () => {
    onAdd(value);
    setValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onKeyPress={handleKeyPress}
        className="text-xs transition-all duration-300 focus:shadow-glow"
      />
      <Button
        type="button"
        size="sm"
        onClick={handleAdd}
        disabled={!value.trim()}
        className="px-3 transition-all duration-300"
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default TransitionStructureStep;