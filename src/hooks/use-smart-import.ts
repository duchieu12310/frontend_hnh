import { useState } from 'react';
import ApplicationConstants from 'constants/ApplicationConstants';

interface SmartImportProps {
  endpoint: string;
  onSuccess: (suggestions: any) => void;
}

export function useSmartImport({ endpoint, onSuccess }: SmartImportProps) {
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const smartImport = async (rawText: string) => {
    if (!rawText.trim()) return;

    setIsAutoFilling(true);
    try {
      const response = await fetch(`${ApplicationConstants.API_PATH}/ai/parse-${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });

      if (response.ok) {
        const data = await response.json();
        // Extract JSON from the raw response (handling markdown etc)
        const jsonMatch = data.raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const suggestions = JSON.parse(jsonMatch[0]);
          onSuccess(suggestions);
        }
      }
    } catch (error) {
      console.error(`Error smart importing for ${endpoint}:`, error);
    } finally {
      setIsAutoFilling(false);
    }
  };

  return { smartImport, isAutoFilling };
}
