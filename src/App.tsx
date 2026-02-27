import { useState, useEffect } from 'react';
import { Settings, Gamepad2, Coffee, Quote, Maximize, Trophy, RefreshCw } from 'lucide-react';
import { useMoyuData, formatTime } from './hooks/useMoyuData';
import { getRandomQuote } from './data/quotes';
import { useCamouflage } from './hooks/useCamouflage';
import { useKeyPress } from './hooks/useKeyPress';
import { DashboardSkin } from './components/skins/DashboardSkin';
import { MdnDocSkin } from './components/skins/MdnDocSkin';
import { WinUpdateSkin } from './components/skins/WinUpdateSkin';
import { RockPaperScissors } from './components/games/RockPaperScissors';
import { DinoRun } from './components/games/DinoRun';
import { TaskCrusher } from './components/games/TaskCrusher';

function App() {
  const [activeTab, setActiveTab] = useState<'games' | 'stats' | 'settings'>('games');
  const [activeGame, setActiveGame] = useState<'menu' | 'rps' | 'dino' | 'crush'>('menu');
  const { data, sessionSeconds, achievements, newUnlock } = useMoyuData();
  const [currentQuote, setCurrentQuote] = useState('');
  const [isCamouflaged, setIsCamouflaged] = useState(false);

  // Apply camouflage tab title & icon
  useCamouflage(isCamouflaged, data.currentSkin);

  // Toggle camouflage on Esc
  const toggleCamouflage = () => setIsCamouflaged(prev => !prev);
  useKeyPress('Escape', toggleCamouflage);

  useEffect(() => {
    setCurrentQuote(getRandomQuote());
    const interval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 60000); // Change quote every minute
    return () => clearInterval(interval);
  }, []);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const nextAchievement = achievements.find(a => !a.isUnlocked && a.id !== 'lawless');
  const latestAchievement = [...achievements].reverse().find(a => a.isUnlocked && a.id !== 'lawless');

  if (isCamouflaged) {
    if (data.currentSkin === 'dashboard') return <DashboardSkin />;
    if (data.currentSkin === 'doc') return <MdnDocSkin />;
    if (data.currentSkin === 'winupdate') return <WinUpdateSkin />;
    return <DashboardSkin />; // fallback
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-purple-500/30">

      {/* Toast Notification for Achievements */}
      {newUnlock && (
        <div className="fixed top-20 right-8 z-50 bg-slate-800 border border-yellow-500/50 rounded-xl p-4 shadow-2xl flex items-center gap-4 animate-bounce">
          <div className="text-3xl">{newUnlock.icon}</div>
          <div>
            <div className="text-sm text-yellow-500 font-bold tracking-wider">成就解锁！</div>
            <div className="font-medium text-slate-100">{newUnlock.name}</div>
            <div className="text-xs text-slate-400 mt-1">{newUnlock.description}</div>
          </div>
        </div>
      )}

      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400">
              <Coffee size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              摸鱼工作台
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleCamouflage}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
            >
              <span className="hidden sm:inline mr-2">按 <kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-xs">Esc</kbd> 或</span>
              <Maximize size={16} className="inline sm:hidden" />
              一键伪装
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Sidebar: Status & Quotes */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Timer Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">本次摸鱼时长</h2>
            <div className="text-5xl font-mono font-light tracking-tight text-white mb-4">
              {formatTime(sessionSeconds)}
            </div>
            <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-700/50 pt-4 mt-2">
              <span>历史总计：</span>
              <span className="text-slate-200 font-mono font-medium">{formatTime(data.totalSeconds)}</span>
            </div>
          </div>

          {/* Quotes Card */}
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 relative">
            <div className="absolute -top-3 -right-3 text-6xl opacity-5 text-purple-500 rotate-12">"</div>
            <div className="flex items-center justify-between mb-4 text-purple-400">
              <div className="flex items-center gap-2">
                <Quote size={20} />
                <h3 className="font-medium">每日金句</h3>
              </div>
              <button
                onClick={() => setCurrentQuote(getRandomQuote())}
                className="text-slate-500 hover:text-purple-400 p-1 rounded transition-colors"
                title="换一句"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed italic text-lg min-h-[5rem] flex items-center">
              {currentQuote}
            </p>
          </div>

          {/* Achievements Preview */}
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-200 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" />
                我的成就 ({unlockedCount}/{achievements.length})
              </h3>
            </div>

            {latestAchievement ? (
              <div className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl border border-yellow-500/30 shrink-0">
                  {latestAchievement.icon}
                </div>
                <div>
                  <div className="font-medium text-slate-200 text-sm tracking-wide">{latestAchievement.name}</div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1">{latestAchievement.description}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">暂无成就，继续摸鱼吧！</div>
            )}

            {nextAchievement && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="text-xs text-slate-500 mb-2">下一目标: {nextAchievement.name}</div>
                <div className="w-full bg-slate-900 rounded-full h-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (data.totalSeconds / nextAchievement.thresholdSeconds) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Main Area: Tabs & Content */}
        <section className="lg:col-span-8">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-800/50 backdrop-blur-sm rounded-xl mb-6 w-max border border-slate-700/50">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'games' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              <Gamepad2 size={18} />
              游戏厅
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'stats' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              <Trophy size={18} />
              成就墙
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              <Settings size={18} />
              设置
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-8 min-h-[500px]">
            {activeTab === 'games' && (
              <div>
                {activeGame !== 'menu' && (
                  <button
                    onClick={() => setActiveGame('menu')}
                    className="mb-6 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors font-medium text-sm"
                  >
                    ← 返回游戏大厅
                  </button>
                )}

                {activeGame === 'menu' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => setActiveGame('dino')}
                      className="group relative rounded-xl h-48 overflow-hidden bg-slate-800 border border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity text-9xl">🦖</div>
                      <div className="absolute bottom-0 left-0 p-6 z-20">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">恐龙跑酷</h3>
                        <p className="text-sm text-slate-400">经典再现，断网必备</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveGame('rps')}
                      className="group relative rounded-xl h-48 overflow-hidden bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity text-9xl">✌️</div>
                      <div className="absolute bottom-0 left-0 p-6 z-20">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">石头剪刀布</h3>
                        <p className="text-sm text-slate-400">最纯粹的实力对决</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveGame('crush')}
                      className="group relative rounded-xl h-48 overflow-hidden bg-slate-800 border border-slate-700 hover:border-red-500/50 transition-all cursor-pointer md:col-span-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/20 z-10"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity text-9xl">🤬</div>
                      <div className="absolute bottom-0 left-0 p-6 z-20">
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">需求粉碎机</h3>
                        <p className="text-slate-400">老板又来加需求了？给我碎碎碎碎！</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeGame === 'rps' && <RockPaperScissors />}
                {activeGame === 'dino' && <DinoRun />}
                {activeGame === 'crush' && <TaskCrusher />}
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-200">我的成就墙</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements.map(ach => (
                    <div key={ach.id} className={`p-4 rounded-xl border ${ach.isUnlocked ? 'bg-slate-800/80 border-purple-500/30' : 'bg-slate-900/50 border-slate-800 opacity-60'} flex items-start gap-4`}>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0 ${ach.isUnlocked ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300' : 'bg-slate-800 text-slate-600'}`}>
                        {ach.isUnlocked ? ach.icon : '🔒'}
                      </div>
                      <div>
                        <div className={`font-bold ${ach.isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>{ach.name}</div>
                        <div className="text-sm text-slate-400 mt-1 leading-snug">{ach.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-slate-200">伪装设置</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="font-medium text-slate-200 mb-2 border-b border-slate-700 pb-2">当前系统皮肤</div>
                    <label className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded cursor-pointer">
                      <input
                        type="radio" name="skin" value="dashboard"
                        checked={data.currentSkin === 'dashboard'}
                        onChange={e => {
                          const newSkin = e.target.value;
                          localStorage.setItem('moyu_data_v2', JSON.stringify({ ...data, currentSkin: newSkin }));
                          window.location.reload();
                        }}
                        className="text-purple-500 accent-purple-500 w-4 h-4"
                      />
                      <span className="text-slate-300">📈 企业数据看板 Dashboard (推荐)</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded cursor-pointer mt-1">
                      <input
                        type="radio" name="skin" value="doc"
                        checked={data.currentSkin === 'doc'}
                        onChange={e => {
                          const newSkin = e.target.value;
                          localStorage.setItem('moyu_data_v2', JSON.stringify({ ...data, currentSkin: newSkin }));
                          window.location.reload();
                        }}
                        className="text-purple-500 accent-purple-500 w-4 h-4"
                      />
                      <span className="text-slate-300">💻 MDN 技术文档风格</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded cursor-pointer mt-1">
                      <input
                        type="radio" name="skin" value="winupdate"
                        checked={data.currentSkin === 'winupdate'}
                        onChange={e => {
                          const newSkin = e.target.value;
                          localStorage.setItem('moyu_data_v2', JSON.stringify({ ...data, currentSkin: newSkin }));
                          window.location.reload();
                        }}
                        className="text-purple-500 accent-purple-500 w-4 h-4"
                      />
                      <span className="text-slate-300">🔄 Windows 更新加载 (搞怪)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Hidden Camouflage Trigger for emergency clicks in corner */}
      <div
        onClick={toggleCamouflage}
        className="fixed bottom-0 right-0 w-8 h-8 opacity-0 hover:opacity-10 cursor-pointer bg-red-500 z-50 transition-opacity"
        title="紧急伪装按钮 (点我)"
      ></div>
    </div>
  );
}

export default App;
