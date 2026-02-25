import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Ruler, Weight, ArrowRight } from 'lucide-react';

export default function App() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setPhoto(file);
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo || !height || !weight) {
      alert("Please provide all required information (photo, height, and weight).");
      return;
    }
    // Proceed with logic, maybe mock loading
    console.log("Submitting:", { photo, height, weight });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 sm:p-8 font-sans text-slate-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
      >
        <div className="p-8 pb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center rounded-b-[2rem] shadow-sm relative">
          <div className="absolute inset-0 bg-black/10 rounded-b-[2rem]"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">AI Personal Stylist</h1>
            <p className="text-indigo-100 text-sm font-medium">Find your perfect look tailored to you.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">
              Upload Full Body Photo
            </label>
            <div 
              className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' 
                  : photoUrl 
                    ? 'border-slate-200 bg-slate-50' 
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
              }`}
              style={{ minHeight: '200px' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !photoUrl && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {photoUrl ? (
                <div className="relative w-full h-full group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={photoUrl} alt="Uploaded" className="w-full h-full object-cover max-h-[250px]" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-medium flex items-center gap-2">
                      <Camera size={18} /> Change Photo
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 flex flex-col items-center cursor-pointer">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Drag & drop your photo here</p>
                  <p className="text-xs text-slate-500 mt-1">or click to browse from your device</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Ruler size={16} className="text-indigo-500" /> Height
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
                  cm
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Weight size={16} className="text-purple-500" /> Weight
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
                  kg
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group hover:shadow-indigo-300 transition-all"
          >
            Get Style Analysis 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}