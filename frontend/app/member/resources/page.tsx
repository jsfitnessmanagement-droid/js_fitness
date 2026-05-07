"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FileText, Download, Dumbbell, Apple } from 'lucide-react';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/resources');
        setResources(res.data?.data ?? res.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'Diet Plan': return <Apple className="w-8 h-8 text-green-500" />;
      case 'Workout Plan': return <Dumbbell className="w-8 h-8 text-blue-500" />;
      default: return <FileText className="w-8 h-8 text-slate-400" />;
    }
  };

  if (loading) return <div className="text-white">Loading resources...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Member Resources</h2>
        <p className="text-slate-400">Download your assigned diet and workout plans below.</p>
      </div>

      {resources.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">
          <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-300">No Resources Found</h3>
          <p className="text-slate-500 mt-2">Your trainer hasn't assigned any plans to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res: any) => (
            <div key={res._id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col h-full hover:border-orange-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-900 rounded-lg">
                  {getIcon(res.type)}
                </div>
                <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-xs text-slate-300 font-medium">
                  {res.type}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{res.title}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow">{res.description}</p>
              
              <a 
                href={res.fileUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-3 bg-slate-700 hover:bg-orange-500 text-white rounded-lg transition-colors group"
              >
                <Download size={18} className="mr-2 group-hover:animate-bounce" />
                Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
