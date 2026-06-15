import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, CheckCircle2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  suggestion?: string;
  sizeSuggestion?: string;
}

export default function ImageUpload({ value, onChange, label, suggestion, sizeSuggestion }: ImageUploadProps) {
  const [mode, setMode] = useState<'url' | 'upload'>(value.startsWith('http') || !value ? 'url' : 'upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size too large. Please upload an image smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">{label}</label>
        <div className="flex flex-col items-end gap-1">
          {suggestion && (
            <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
              Dim: {suggestion}
            </span>
          )}
          {sizeSuggestion && (
            <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              Size: {sizeSuggestion}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-900 border border-slate-700 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'url' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <LinkIcon className="w-3 h-3" />
          URL Link
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'upload' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Upload className="w-3 h-3" />
          Upload File
        </button>
      </div>

      {mode === 'url' ? (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
            placeholder="https://example.com/image.jpg"
          />
          {value && (
            <button 
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all h-32 flex flex-col items-center justify-center gap-2 ${
            value && !value.startsWith('http') 
              ? 'border-primary/50 bg-primary/5' 
              : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-900'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {value && !value.startsWith('http') ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <p className="text-xs font-bold text-white">Image Uploaded Successfully</p>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="text-xs text-red-400 hover:underline font-bold mt-1"
              >
                Remove Image
              </button>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-primary transition-colors" />
              <p className="text-xs font-bold text-slate-500 group-hover:text-white transition-colors">Click to Select File</p>
            </>
          )}
        </div>
      )}

      {value && (
        <div className="mt-4 relative group">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Preview</p>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-700">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-contain bg-slate-950" 
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
