import React from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const DEFAULT_COLORS = [
  '#059669',
  '#4f46e5',
  '#475569',
  '#2563eb',
  '#dc2626',
  '#d97706',
  '#9333ea',
  '#db2777',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  presetColors = DEFAULT_COLORS,
}) => {
  return (
    <div className="form-group">
      <label className="form-label">Cor de Identificação</label>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {presetColors.map((color) => (
          <div
            key={color}
            onClick={() => onChange(color)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: color,
              cursor: 'pointer',
              border: value === color ? '2px solid white' : '2px solid transparent',
              boxShadow: value === color ? '0 0 0 2px var(--accent-color)' : 'none',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ou escolha outra:</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  );
};
