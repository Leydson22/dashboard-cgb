import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plane, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-sky-900 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-900 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-400 text-sky-950 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
            <Plane className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Gestão de Pátio
          </h1>
          <p className="text-sky-300 font-bold text-xs uppercase tracking-widest mt-1">
            Aeroporto de Cuiabá • COA
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-[40px] shadow-2xl space-y-5 border border-white/20">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Acesso Restrito</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-600 outline-none font-bold text-slate-800 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-600 outline-none font-bold text-slate-800 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-xs font-bold animate-in fade-in zoom-in-95">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-sky-900 text-white font-black rounded-2xl shadow-xl shadow-sky-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>

        <p className="text-center text-sky-400/60 text-[10px] font-bold uppercase tracking-widest">
          v1.5.0 • © 2026 COA Operações
        </p>
      </div>
    </div>
  );
};
