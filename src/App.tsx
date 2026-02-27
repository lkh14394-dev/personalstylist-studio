import { useState, useRef } from 'react';
import { 
  Upload, Camera, Ruler, Weight, ArrowRight, 
  User, Palette, CheckCircle, XCircle, Lightbulb,
  RefreshCw, ChevronLeft, Scissors, Home, Layout, 
  Camera as CameraIcon, ShoppingBag, User as UserIcon,
  Menu, Zap
} from 'lucide-react';

// 분석 결과 타입 정의
interface AnalysisReport {
  body: string;
  color: string;
  styles: string[];
  avoid: string[];
  tips: string[];
  hairImageUrl?: string;
}

type ViewState = 'landing' | 'form' | 'analyzing' | 'report';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setPhotoFile(file);
      setPhotoUrl(URL.createObjectURL(file));
    } else {
      alert("이미지 파일만 업로드 가능합니다.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight) {
      alert("키와 몸무게를 입력해주세요.");
      return;
    }

    setView('analyzing');

    try {
      const formData = new FormData();
      formData.append('height', height);
      formData.append('weight', weight);
      if (photoFile) {
        formData.append('image', photoFile);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '분석에 실패했습니다.');
      }

      setReport(result);
      setView('report');
    } catch (error: any) {
      console.error(error);
      alert(`분석 오류: ${error.message}`);
      setView('form');
    }
  };

  const reset = () => {
    setReport(null);
    setPhotoUrl(null);
    setPhotoFile(null);
    setHeight('');
    setWeight('');
    setView('landing');
  };

  // --- UI Components ---

  const Header = () => (
    <header className="flex items-center bg-[#191022] p-4 justify-between sticky top-0 z-50 border-b border-purple-500/10">
      <div className="text-[#7f13ec] flex size-10 shrink-0 items-center justify-center">
        <Menu size={24} />
      </div>
      <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">AI Stylist</h2>
      <div className="flex w-10 items-center justify-end">
        <button className="flex cursor-pointer items-center justify-center rounded-full size-10 bg-[#7f13ec]/10 text-[#7f13ec]">
          <UserIcon size={20} />
        </button>
      </div>
    </header>
  );

  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#191022]/80 backdrop-blur-lg border-t border-purple-500/10 px-6 py-2 pb-6 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        <button onClick={() => setView('landing')} className={`flex flex-col items-center gap-1 ${view === 'landing' ? 'text-[#7f13ec]' : 'text-slate-500'}`}>
          <Home size={24} fill={view === 'landing' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <Layout size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Looks</span>
        </button>
        <button onClick={() => setView('form')} className={`flex flex-col items-center gap-1 ${view === 'form' || view === 'report' ? 'text-[#7f13ec]' : 'text-slate-500'}`}>
          <CameraIcon size={24} fill={view === 'form' || view === 'report' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Scan</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <ShoppingBag size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Shop</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <UserIcon size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </button>
      </div>
    </nav>
  );

  if (view === 'landing') {
    return (
      <div className="bg-[#191022] text-slate-100 min-h-screen flex flex-col font-sans pb-24">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <section className="px-4 py-8 flex flex-col gap-8 md:flex-row md:items-center md:px-12 md:py-16">
            <div className="w-full md:w-1/2 aspect-[4/5] bg-cover bg-center rounded-2xl shadow-2xl shadow-purple-500/20" 
                 style={{backgroundImage: 'url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop")'}}>
            </div>
            <div className="flex flex-col gap-6 md:w-1/2">
              <div className="flex flex-col gap-3">
                <span className="text-[#7f13ec] font-bold tracking-widest text-xs uppercase">Curated by Intelligence</span>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
                  Your AI Personal <span className="text-[#7f13ec]">Stylist</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                  Elevate your wardrobe with personalized body analysis and style recommendations tailored just for your silhouette.
                </p>
              </div>
              <button 
                onClick={() => setView('form')}
                className="flex w-full md:w-max cursor-pointer items-center justify-center rounded-full h-16 px-10 bg-[#7f13ec] text-white text-lg font-bold shadow-lg shadow-purple-500/30 active:scale-95 transition-all"
              >
                Get Started
              </button>
            </div>
          </section>

          {/* The Experience */}
          <section className="px-4 py-12 md:px-12">
            <div className="flex flex-col gap-2 mb-10">
              <h2 className="text-2xl font-bold">The Experience</h2>
              <p className="text-slate-500 text-sm">Three steps to your perfect look</p>
            </div>
            <div className="space-y-0 relative">
              {[
                { icon: <Ruler size={20} />, title: "Input Body Data", desc: "Simply enter your height and weight for accurate base measurements." },
                { icon: <CameraIcon size={20} />, title: "Upload Photo", desc: "Provide a full-body photo to let our AI analyze your unique proportions." },
                { icon: <Zap size={20} className="fill-white" />, title: "Get AI Styling", desc: "Receive instant, curated fashion guides designed specifically for you.", highlight: true }
              ].map((step, i, arr) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`size-10 rounded-full flex items-center justify-center z-10 border ${
                      step.highlight ? "bg-[#7f13ec] text-white border-[#7f13ec] shadow-md shadow-purple-500/40" : "bg-[#7f13ec]/10 text-[#7f13ec] border-purple-500/20"
                    }`}>
                      {step.icon}
                    </div>
                    {i !== arr.length - 1 && <div className="w-[2px] bg-purple-500/10 flex-1 min-h-[40px]"></div>}
                  </div>
                  <div className={`pb-10 pt-1`}>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed max-w-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (view === 'form') {
    return (
      <div className="bg-[#191022] text-slate-100 min-h-screen flex flex-col font-sans pb-24">
        <Header />
        <main className="flex-1 p-4 md:p-12 flex flex-col items-center justify-center">
          <div className="max-w-md w-full bg-white/5 rounded-3xl shadow-2xl overflow-hidden border border-purple-500/10">
            <div className="bg-[#7f13ec] p-10 text-white text-center">
              <h1 className="text-2xl font-extrabold mb-2 tracking-tight">Style Analysis</h1>
              <p className="text-purple-100 font-medium text-sm opacity-90">당신의 신체 데이터와 사진을 분석합니다.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Photo Upload</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all group ${
                    isDragging ? "border-[#7f13ec] bg-[#7f13ec]/10 scale-[1.02]" : "border-white/10 hover:bg-white/5 hover:border-[#7f13ec]"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  {photoUrl ? (
                    <div className="relative h-64 w-full">
                      <img src={photoUrl} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                        <span className="text-white font-semibold flex items-center gap-2"><Camera size={20}/> 사진 변경</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 flex flex-col items-center justify-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragging ? "bg-[#7f13ec] text-white" : "bg-[#7f13ec]/10 text-[#7f13ec]"}`}>
                        <Upload size={32} />
                      </div>
                      <p className="text-base font-bold text-slate-300">Drag or click to upload</p>
                      <p className="text-xs mt-2 text-slate-500 font-medium">전신 사진이 가장 좋습니다.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Height (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="185" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#7f13ec] font-bold text-lg transition-all" required />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Weight (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="80" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#7f13ec] font-bold text-lg transition-all" required />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#7f13ec] hover:bg-purple-700 active:scale-[0.98] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 text-lg">
                분석 시작하기 <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (view === 'analyzing') {
    return (
      <div className="min-h-screen bg-[#191022] flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-purple-500/10 border-t-[#7f13ec] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-[#7f13ec] animate-pulse" size={32} fill="currentColor" />
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-bold text-white">AI Analyzing...</h2>
        <p className="mt-2 text-slate-500 text-center font-medium">당신의 유니크한 스타일을 <br/>찾아내고 있습니다.</p>
      </div>
    );
  }

  if (view === 'report' && report) {
    return (
      <div className="bg-[#191022] text-slate-100 min-h-screen flex flex-col font-sans pb-24">
        <Header />
        <main className="flex-1 p-4 md:p-12 max-w-3xl mx-auto w-full">
          <button 
            onClick={() => setView('form')}
            className="mb-6 flex items-center text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-tighter text-xs"
          >
            <ChevronLeft size={18} /> Back to scan
          </button>

          <div className="bg-white/5 rounded-[2rem] shadow-2xl overflow-hidden border border-purple-500/10">
            <div className="bg-gradient-to-r from-[#7f13ec] to-[#4c0b8e] p-10 text-white">
              <span className="bg-white/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">Analysis Complete</span>
              <h1 className="text-3xl font-black mt-4 tracking-tight">Style Analysis Report</h1>
            </div>

            <div className="p-8 space-y-12">
              {report.hairImageUrl && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6 uppercase tracking-wider">
                    <Scissors className="text-indigo-500" size={22} /> Recommended Hair
                  </h3>
                  <div className="bg-black/40 rounded-3xl overflow-hidden border border-white/5 p-1 shadow-inner">
                    <img src={report.hairImageUrl} alt="Hairstyle Grid" className="w-full h-auto rounded-2xl" />
                  </div>
                </section>
              )}

              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4 uppercase tracking-wider">
                  <User className="text-[#7f13ec]" size={22} /> 1. Body Analysis
                </h3>
                <div className="bg-[#7f13ec]/5 rounded-2xl p-6 text-slate-300 leading-relaxed border border-purple-500/10">
                  {report.body}
                </div>
              </section>

              <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4 uppercase tracking-wider">
                  <Palette className="text-pink-500" size={22} /> 2. Personal Color
                </h3>
                <div className="bg-pink-500/5 rounded-2xl p-6 text-slate-300 leading-relaxed border border-pink-500/10">
                  {report.color}
                </div>
              </section>

              <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6 uppercase tracking-wider">
                  <CheckCircle className="text-green-500" size={22} /> 3. Must-have Items
                </h3>
                <div className="grid gap-4">
                  {report.styles.map((s, i) => (
                    <div key={i} className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <span className="bg-green-500/20 text-green-500 font-black text-xs size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                      <span className="text-slate-200 font-medium">{s}</span>
                    </div>
                  ))}
                </div>
              </section>

              <button 
                onClick={reset}
                className="w-full mt-8 py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-xl"
              >
                <RefreshCw size={20} /> New Analysis
              </button>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return null;
}
