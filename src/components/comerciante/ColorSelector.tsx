
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorSelector = ({ selectedColor, onColorChange }: ColorSelectorProps) => {
  const colors = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Roxo', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Laranja', value: '#F59E0B' },
    { name: 'Vermelho', value: '#EF4444' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Índigo', value: '#6366F1' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {colors.map((color) => (
          <button
            key={color.value}
            className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
              selectedColor === color.value ? 'border-gray-400' : 'border-gray-200'
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorChange(color.value)}
          >
            {selectedColor === color.value && (
              <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-white" />
            )}
            <div className="h-8"></div>
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: selectedColor }}
          ></div>
          <span className="text-sm font-medium">Cor Selecionada:</span>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedColor}</code>
        </div>
      </div>
    </div>
  );
};
