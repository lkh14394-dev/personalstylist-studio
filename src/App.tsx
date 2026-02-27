import { useState, useRef } from 'react';
import { 
  Upload, Camera, Ruler, Weight, ArrowRight, 
  User, Palette, CheckCircle, XCircle, Lightbulb,
  RefreshCw, ChevronLeft
} from 'lucide-react';

// 분석 결과 타입 정의
interface AnalysisReport {
  body: string;
  color: string;
  styles: string[];
  avoid: string[];
  tips: string[];
}

export default function App() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
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
    if (!height || !weight) {
      alert("키와 몸무게를 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);

    // AI 분석 시뮬레이션 (2초 후 결과 표시)
    setTimeout(() => {
      setReport({
        body: `${height}cm / ${weight}kg의 수치를 바탕으로 분석한 결과, 균형 잡힌 애슬레틱 체형으로 추정됩니다. 상체 어깨 라인을 살리면서 하체는 스트레이트 핏으로 밸런스를 잡는 것이 베스트입니다.`,
        color: "사진 분석 결과, 차가운 톤의 실버 액세서리와 네이비, 차콜 컬러가 잘 어울리는 '겨울 쿨톤' 가능성이 높습니다.",
        styles: [
          "데일리 미니멀: 싱글 코트, 맥코트, 테이퍼드 슬랙스",
          "스마트 캐주얼: 싱글 2버튼 블레이저, 독일군 스니커즈",
          "클래식 무드: 레더 재킷, 다크 워시 스트레이트 데님"
        ],
        avoid: [
          "초슬림 스키니: 다리가 너무 가늘어 보여 비율이 깨질 수 있음",
          "과도한 드롭숄더: 체격이 둔해 보일 수 있는 위험",
          "상/하의 모두 과한 오버핏"
        ],
        tips: [
          "바지 기장은 신발 발등에 살짝 닿는 '원 브레이크'가 가장 깔끔합니다.",
          "어깨선 -> 소매 길이 -> 바지 기장 순으로 수선에 신경 써보세요.",
          "네이비와 아이보리 조합은 언제나 실패 없는 선택입니다."
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const reset = () => {
    setReport(null);
    setPhotoUrl(null);
    setHeight('');
    setWeight('');
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="text-blue-600 animate-pulse" size={32} />
          </div>
        </div>
        <h2 className="mt-8 text-xl font-bold text-gray-800">스타일 분석 중...</h2>
        <p className="mt-2 text-gray-500 text-center">AI가 신체 비율과 컬러 밸런스를 <br/>정밀하게 계산하고 있습니다.</p>
      </div>
    );
  }

  if (report) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={reset}
            className="mb-6 flex items-center text-gray-500 hover:text-gray-800 transition-colors font-medium"
          >
            <ChevronLeft size={20} /> 다시 입력하기
          </button>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
              <span className="bg-blue-400/30 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">Analysis Report</span>
              <h1 className="text-3xl font-extrabold mt-4">나의 스타일 분석 리포트</h1>
              <p className="text-blue-100 mt-2 opacity-90">당신을 위한 맞춤형 패션 가이드라인입니다.</p>
            </div>

            <div className="p-8 space-y-10">
              {/* 체형 분석 */}
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                  <User className="text-blue-600" size={22} /> 1. 체형 분석
                </h3>
                <div className="bg-blue-50 rounded-2xl p-5 text-gray-700 leading-relaxed border border-blue-100">
                  {report.body}
                </div>
              </section>

              {/* 퍼스널 컬러 */}
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                  <Palette className="text-pink-500" size={22} /> 2. 퍼스널 컬러
                </h3>
                <div className="bg-pink-50 rounded-2xl p-5 text-gray-700 leading-relaxed border border-pink-100">
                  {report.color}
                </div>
              </section>

              {/* 추천 스타일 */}
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                  <CheckCircle className="text-green-500" size={22} /> 3. 추천 아이템
                </h3>
                <div className="grid gap-3">
                  {report.styles.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <span className="bg-green-100 text-green-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                      <span className="text-gray-700 font-medium">{s}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 피해야 할 스타일 */}
              <section>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                  <XCircle className="text-red-500" size={22} /> 4. 피해야 할 스타일
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                  {report.avoid.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </section>

              {/* 코디 팁 */}
              <section>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                  <Lightbulb className="text-yellow-500" size={22} /> 5. 스타일링 팁
                </h3>
                <div className="space-y-3">
                  {report.tips.map((t, i) => (
                    <p key={i} className="text-gray-700 flex gap-2">
                      <span className="text-yellow-500">•</span> {t}
                    </p>
                  ))}
                </div>
              </section>

              <button 
                onClick={reset}
                className="w-full mt-8 py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
              >
                <RefreshCw size={20} /> 분석 다시 하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-10 text-white text-center">
          <h1 className="text-3xl font-extrabold mb-3 tracking-tight">AI Personal Stylist</h1>
          <p className="text-blue-100 font-medium text-sm leading-relaxed">당신의 체형과 컬러를 분석하여<br/>최적의 스타일을 찾아드립니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              전신 사진 업로드 (선택사항)
            </label>
            <div 
              className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all group"
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
                <div className="relative h-64 w-full">
                  <img src={photoUrl} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                    <span className="text-white font-semibold flex items-center gap-2">
                      <Camera size={20}/> 사진 변경
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <p className="text-base font-bold text-gray-700">사진을 업로드하세요</p>
                  <p className="text-xs mt-2">정면 전신 사진이 가장 정확합니다</p>
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
                  placeholder="예: 185"
                  className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                  required
                />
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
                  placeholder="예: 80"
                  className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-200"
          >
            무료 스타일 분석 시작 <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
