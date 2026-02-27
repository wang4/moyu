import React, { useEffect, useState } from 'react';

// A fake Echarts-like Dashboard Component
export const DashboardSkin: React.FC = () => {
    const [dataPoints, setDataPoints] = useState<number[]>(Array(12).fill(0).map(() => Math.random() * 100));

    useEffect(() => {
        // Simulate real-time data updates
        const interval = setInterval(() => {
            setDataPoints(prev => {
                const next = [...prev.slice(1), Math.random() * 100];
                return next;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
            <header className="flex items-center justify-between border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Q4 Enterprise Overview</h1>
                <div className="flex gap-4 items-center">
                    <div className="bg-white px-4 py-2 border rounded shadow-sm text-sm">Last updated: Just now</div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="text-sm text-slate-500 mb-2">Total Revenue</div>
                    <div className="text-3xl font-bold">$1,245,670</div>
                    <div className="text-green-500 text-sm mt-2">↑ 14% vs last month</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="text-sm text-slate-500 mb-2">Active Users</div>
                    <div className="text-3xl font-bold">45,211</div>
                    <div className="text-green-500 text-sm mt-2">↑ 5.2% vs last month</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="text-sm text-slate-500 mb-2">Server Load</div>
                    <div className="text-3xl font-bold">{Math.floor(dataPoints[11])}%</div>
                    <div className={`${dataPoints[11] > 80 ? 'text-red-500' : 'text-slate-500'} text-sm mt-2`}>
                        {dataPoints[11] > 80 ? 'Warning: High Load' : 'Stable'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-80 flex flex-col">
                    <h3 className="font-bold mb-4">Traffic Acquisition</h3>
                    <div className="flex-1 flex items-end gap-2 text-xs text-center text-slate-500">
                        {dataPoints.map((val, i) => (
                            <div key={i} className="flex-1 relative h-full flex items-end justify-center group">
                                <div
                                    className="w-full bg-blue-500 rounded-t transition-all duration-500 ease-in-out hover:bg-blue-600"
                                    style={{ height: `${val}%` }}
                                ></div>
                                <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 text-white px-2 py-1 rounded text-[10px] z-10">
                                    {Math.floor(val)}k
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-80">
                    <h3 className="font-bold mb-4">Recent Activity Logs</h3>
                    <div className="space-y-4 text-sm">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex gap-4 border-b border-slate-100 pb-3 last:border-0">
                                <span className="text-slate-400 font-mono">14:{20 + i}:00</span>
                                <span className="text-slate-700">User authentication successful - Region: US-East-{i % 3 + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
