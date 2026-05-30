import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Accessibility, 
  Type, 
  Eye, 
  Contrast, 
  Volume2,
  Settings,
  X
} from 'lucide-react';

interface AccessibilityState {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

export const AccessibilityEnhancer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilityState>({
    fontSize: 100,
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  });

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    }
  }, []);

  const applySettings = (newSettings: AccessibilityState) => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${newSettings.fontSize}%`;
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  const updateSetting = (key: keyof AccessibilityState, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilityState = {
      fontSize: 100,
      highContrast: false,
      reducedMotion: false,
      screenReader: false
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  };

  return (
    <>
      {/* Accessibility Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="icon"
        className="fixed bottom-20 right-4 z-50 bg-primary text-primary-foreground hover:bg-primary-hover shadow-floating"
        aria-label="Abrir opções de acessibilidade"
      >
        <Accessibility className="w-5 h-5" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Acessibilidade
                </h3>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  aria-label="Fechar painel de acessibilidade"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Font Size */}
                <div>
                  <label className="flex items-center text-sm font-medium text-foreground mb-2">
                    <Type className="w-4 h-4 mr-2" />
                    Tamanho do Texto: {settings.fontSize}%
                  </label>
                  <input
                    type="range"
                    min="80"
                    max="150"
                    step="10"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                    className="w-full"
                    aria-label="Ajustar tamanho do texto"
                  />
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm font-medium text-foreground">
                    <Contrast className="w-4 h-4 mr-2" />
                    Alto Contraste
                  </label>
                  <Button
                    onClick={() => updateSetting('highContrast', !settings.highContrast)}
                    variant={settings.highContrast ? "default" : "outline"}
                    size="sm"
                  >
                    {settings.highContrast ? "Ativo" : "Inativo"}
                  </Button>
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm font-medium text-foreground">
                    <Eye className="w-4 h-4 mr-2" />
                    Reduzir Animações
                  </label>
                  <Button
                    onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                    variant={settings.reducedMotion ? "default" : "outline"}
                    size="sm"
                  >
                    {settings.reducedMotion ? "Ativo" : "Inativo"}
                  </Button>
                </div>

                {/* Screen Reader Mode */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm font-medium text-foreground">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Modo Leitor de Tela
                  </label>
                  <Button
                    onClick={() => updateSetting('screenReader', !settings.screenReader)}
                    variant={settings.screenReader ? "default" : "outline"}
                    size="sm"
                  >
                    {settings.screenReader ? "Ativo" : "Inativo"}
                  </Button>
                </div>

                {/* Reset Button */}
                <Button
                  onClick={resetSettings}
                  variant="outline"
                  className="w-full"
                >
                  Restaurar Padrões
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </>
  );
};