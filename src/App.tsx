import { useState, useRef } from 'react';
import { Upload, Camera, Ruler, Weight, ArrowRight } from 'lucide-react';

export default function App() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setPhotoUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl || !height || !weight) {
      alert("사진, 키, 몸무게를 모두 입력해주세요.");
      return;
    }
    alert(`분석 시작: 키 ${height}cm, 몸무게 ${weight}kg`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">AI 퍼스널 스타일리스트</h1>
          <p className="text-blue-100 font-medium text-sm">당신의 체형에 딱 맞는 맞춤형 스타일을 제안합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              전신 사진 업로드
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              {photoUrl ? (
                <div className="relative h-64 w-full group">
                  <img src={photoUrl} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <span className="text-white font-semibold flex items-center gap-2">
                      <Camera size={20}/> 사진 변경
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                  <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                    <Upload size={28} />
                  </div>
                  <p className="text-base font-semibold text-gray-700">사진을 선택하거나 드래그하세요</p>
                  <p className="text-xs text-gray-400 mt-2">정면 전신 사진을 권장합니다</p>
                </div>
              )}
            </div>
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-bold text-gray-800 mb-2">
                <Ruler size={18} className="text-blue-500"/> 키 (cm)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="예: 170"
                  className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium transition-all"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">cm</span>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-bold text-gray-800 mb-2">
                <Weight size={18} className="text-blue-500"/> 몸무게 (kg)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="예: 60"
                  className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium transition-all"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            스타일 분석 시작하기 <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
