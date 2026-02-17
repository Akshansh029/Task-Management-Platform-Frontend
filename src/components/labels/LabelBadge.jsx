import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const LabelBadge = ({ label, onRemove, className }) => {
  if (!label) return null;

  // Function to determine if color is light or dark for text contrast
  // Rough estimate: hex to RGB then luminance
  const isLight = (color) => {
    if (!color || !color.startsWith('#')) return false;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  const lightColor = isLight(label.color);

  return (
    <Badge
      style={{ 
        backgroundColor: label.color || '#e2e8f0',
        color: lightColor ? '#1e293b' : '#ffffff',
        borderColor: 'rgba(0,0,0,0.05)'
      }}
      className={cn(
        "px-2 py-0.5 font-medium flex items-center space-x-1 border",
        className
      )}
    >
      <span>{label.name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(label.id);
          }}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};

export default LabelBadge;
