import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft, Users, Crown, Zap, BookOpen, CheckCircle,
  Search, Shield, Trash2, Star, Coins, TrendingUp,
  Plus, Eye, Save, X
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  premium: boolean;
  created_at: string;
}

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  totalLessons: number;
  totalCompletions: number;
  revenueEstimate: number;
}

const modules = ['ingles', 'matematica', 'enem', 'portugues', 'quimica', 'fisica'];
const categories: Record<string, string[]> = {
  ingles: ['vocabulario', 'gramatica', 'conversacao', 'listening', 'flashcards', 'quiz'],
  matematica: ['basica', 'algebra', 'geometria', 'porcentagem', 'estatistica', 'simulados'],
  enem: ['matematica', 'linguagens', 'redacao', 'ciencias_natureza', 'ciencias_humanas'],
  portugues: ['gramatica', 'interpretacao', 'redacao', 'literatura'],
  quimica: ['basica', 'tabela_periodica', 'reacoes', 'organica'],
  fisica: ['mecanica', 'termodinamica', 'otica', 'eletricidade'],
};

const lessonTemplate = `{
  "questions": [
    {
      "type": "choice",
      "prompt": "Sua pergunta aqui",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "answer": 0,
      "explanation": "Explicação da resposta correta"
    }
  ]
}`;

function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim();
}

export function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, premiumUsers: 0, totalLessons: 0, totalCompletions: 0, revenueEstimate: 0 });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [filterPremium, setFilterPremium] = useState<'all' | 'premium' | 'free'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editXp, setEditXp] = useState(0);
  const [editCoins, setEditCoins] = useState(0);
  const [editLevel, setEditLevel] = useState(1);
  const [tab, setTab] = useState<'stats' | 'users' | 'lessons'>('stats');

  // Lesson creator
  const [newModule, setNewModule] = useState('ingles');
  const [newCategory, setNewCategory] = useState('vocabulario');
  const [newLevel, setNewLevel] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [newXpReward, setNewXpReward] = useState(50);
  const [newContent, setNewContent] = useState(lessonTemplate);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchStats();
    fetchUsers();
  }, [isAdmin]);

  const fetchStats = async () => {
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: premiumUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('premium', true);
    const { count: totalLessons } = await supabase.from('lessons').select('*', { count: 'exact', head: true });
    const { count: totalCompletions } = await supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('completed', true);

    setStats({
      totalUsers: totalUsers || 0,
      premiumUsers: premiumUsers || 0,
      totalLessons: totalLessons || 0,
      totalCompletions: totalCompletions || 0,
      revenueEstimate: (premiumUsers || 0) * 19.9,
    });
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setUsers(data as AdminUser[]);
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterPremium === 'all' || (filterPremium === 'premium' && u.premium) || (filterPremium === 'free' && !u.premium);
    return matchSearch && matchFilter;
  });

  const togglePremium = async (userId: string, currentPremium: boolean) => {
    await supabase.from('profiles').update({ premium: !currentPremium }).eq('id', userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, premium: !currentPremium } : u));
    if (selectedUser?.id === userId) setSelectedUser((prev) => prev ? { ...prev, premium: !currentPremium } : null);
    fetchStats();
  };

  const updateUserStats = async () => {
    if (!selectedUser) return;
    await supabase.from('profiles').update({
      xp: editXp,
      coins: editCoins,
      level: editLevel,
    }).eq('id', selectedUser.id);
    setUsers((prev) => prev.map((u) => u.id === selectedUser.id ? { ...u, xp: editXp, coins: editCoins, level: editLevel } : u));
    setSelectedUser((prev) => prev ? { ...prev, xp: editXp, coins: editCoins, level: editLevel } : null);
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta conta? Esta ação é irreversível.')) return;
    await supabase.from('profiles').delete().eq('id', userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setSelectedUser(null);
    fetchStats();
  };

  const selectUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEditXp(user.xp);
    setEditCoins(user.coins);
    setEditLevel(user.level);
  };

  const saveLesson = async () => {
    setSaving(true);
    const sanitizedTitle = sanitizeInput(newTitle);
    let parsedContent;
    try {
      parsedContent = JSON.parse(newContent);
    } catch {
      alert('JSON inválido. Verifique o formato do conteúdo.');
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('lessons').insert({
      module: newModule,
      category: newCategory,
      level: newLevel,
      title: sanitizedTitle,
      content_json: parsedContent,
      xp_reward: newXpReward,
    });

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      alert('Lição criada com sucesso!');
      setNewTitle('');
      setNewContent(lessonTemplate);
      fetchStats();
    }
    setSaving(false);
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-primary-400" />
            <h1 className="text-white font-bold text-lg">Admin Panel</h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 p-1 glass rounded-xl">
          {[
            { key: 'stats' as const, label: 'Stats', icon: TrendingUp },
            { key: 'users' as const, label: 'Usuários', icon: Users },
            { key: 'lessons' as const, label: 'Criar Lição', icon: Plus },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === t.key ? 'gradient-purple text-white shadow-lg' : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {tab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in">
            {[
              { label: 'Total Usuários', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
              { label: 'Premium', value: stats.premiumUsers, icon: Crown, color: 'text-accent-400' },
              { label: 'Receita Est.', value: `R$${stats.revenueEstimate.toFixed(0)}`, icon: Coins, color: 'text-success-400' },
              { label: 'Lições', value: stats.totalLessons, icon: BookOpen, color: 'text-primary-400' },
              { label: 'Completions', value: stats.totalCompletions, icon: CheckCircle, color: 'text-emerald-400' },
            ].map((s, i) => (
              <div key={i} className="card p-5 text-center">
                <s.icon size={24} className={`${s.color} mx-auto mb-2`} />
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-dark-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="space-y-4 animate-fade-in">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(sanitizeInput(e.target.value))}
                  className="input-field pl-10"
                  placeholder="Buscar por nome ou email..."
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'premium', 'free'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterPremium(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      filterPremium === f ? 'gradient-purple text-white' : 'glass text-dark-300'
                    }`}
                  >
                    {f === 'all' ? 'Todos' : f === 'premium' ? 'Premium' : 'Grátis'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Users List */}
              <div className="md:col-span-2 space-y-2 max-h-[600px] overflow-y-auto">
                {filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => selectUser(u)}
                    className={`w-full card p-4 flex items-center gap-3 text-left ${
                      selectedUser?.id === u.id ? 'border-primary-500/40' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      u.premium ? 'gradient-gold text-dark-900' : 'bg-dark-600 text-dark-200'
                    }`}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm truncate">{u.name || 'Sem nome'}</span>
                        {u.premium && <Crown size={12} className="text-accent-400" />}
                      </div>
                      <div className="text-dark-400 text-xs truncate">{u.email}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-primary-400 text-xs font-semibold">Nv. {u.level}</div>
                      <div className="text-dark-400 text-xs">{u.xp} XP</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* User Detail */}
              <div className="space-y-4">
                {selectedUser ? (
                  <div className="card p-5 space-y-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        selectedUser.premium ? 'gradient-gold text-dark-900' : 'bg-dark-600 text-dark-200'
                      }`}>
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-bold">{selectedUser.name || 'Sem nome'}</div>
                        <div className="text-dark-400 text-xs">{selectedUser.email}</div>
                        <div className="text-dark-500 text-[10px] font-mono mt-0.5">{selectedUser.id}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-dark-700 rounded-lg p-2">
                        <div className="text-primary-400 font-bold text-sm">{selectedUser.xp}</div>
                        <div className="text-dark-400 text-[10px]">XP</div>
                      </div>
                      <div className="bg-dark-700 rounded-lg p-2">
                        <div className="text-accent-400 font-bold text-sm">{selectedUser.coins}</div>
                        <div className="text-dark-400 text-[10px]">Moedas</div>
                      </div>
                      <div className="bg-dark-700 rounded-lg p-2">
                        <div className="text-orange-400 font-bold text-sm">{selectedUser.streak}</div>
                        <div className="text-dark-400 text-[10px]">Streak</div>
                      </div>
                    </div>

                    {/* Edit Stats */}
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold text-sm">Ajustar Stats</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-dark-400 text-[10px]">XP</label>
                          <input type="number" value={editXp} onChange={(e) => setEditXp(Number(e.target.value))} className="input-field text-sm py-1.5" />
                        </div>
                        <div>
                          <label className="text-dark-400 text-[10px]">Moedas</label>
                          <input type="number" value={editCoins} onChange={(e) => setEditCoins(Number(e.target.value))} className="input-field text-sm py-1.5" />
                        </div>
                        <div>
                          <label className="text-dark-400 text-[10px]">Nível</label>
                          <input type="number" value={editLevel} onChange={(e) => setEditLevel(Number(e.target.value))} min={1} className="input-field text-sm py-1.5" />
                        </div>
                      </div>
                      <button onClick={updateUserStats} className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-1">
                        <Save size={14} />
                        Salvar
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => togglePremium(selectedUser.id, selectedUser.premium)}
                        className={`w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                          selectedUser.premium
                            ? 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                            : 'gradient-gold text-dark-900'
                        }`}
                      >
                        <Crown size={14} />
                        {selectedUser.premium ? 'Revogar Premium' : 'Conceder Premium'}
                      </button>
                      <button
                        onClick={() => deleteUser(selectedUser.id)}
                        className="w-full py-2 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center gap-2 transition-all"
                      >
                        <Trash2 size={14} />
                        Deletar Conta
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card p-8 text-center">
                    <Users size={32} className="text-dark-500 mx-auto mb-3" />
                    <p className="text-dark-400 text-sm">Selecione um usuário para ver detalhes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lesson Creator Tab */}
        {tab === 'lessons' && (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            <div className="space-y-4">
              <div className="card p-5 space-y-4">
                <h3 className="text-white font-bold">Nova Lição</h3>

                <div>
                  <label className="text-dark-200 text-sm font-medium mb-1 block">Módulo</label>
                  <select value={newModule} onChange={(e) => { setNewModule(e.target.value); setNewCategory(categories[e.target.value]?.[0] || ''); }} className="input-field">
                    {modules.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-dark-200 text-sm font-medium mb-1 block">Categoria</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="input-field">
                    {(categories[newModule] || []).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-dark-200 text-sm font-medium mb-1 block">Nível</label>
                    <input type="number" value={newLevel} onChange={(e) => setNewLevel(Number(e.target.value))} min={1} max={5} className="input-field" />
                  </div>
                  <div>
                    <label className="text-dark-200 text-sm font-medium mb-1 block">XP Recompensa</label>
                    <input type="number" value={newXpReward} onChange={(e) => setNewXpReward(Number(e.target.value))} min={10} className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="text-dark-200 text-sm font-medium mb-1 block">Título</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(sanitizeInput(e.target.value))} className="input-field" placeholder="Nome da lição" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-dark-200 text-sm font-medium">Conteúdo (JSON)</label>
                    <button onClick={() => setPreviewMode(!previewMode)} className="text-primary-400 text-xs font-semibold flex items-center gap-1">
                      <Eye size={12} />
                      {previewMode ? 'Editar' : 'Preview'}
                    </button>
                  </div>
                  {previewMode ? (
                    <pre className="p-4 rounded-xl bg-dark-800 text-dark-200 text-xs overflow-auto max-h-64 border border-white/5">
                      {(() => { try { return JSON.stringify(JSON.parse(newContent), null, 2); } catch { return 'JSON inválido'; } })()}
                    </pre>
                  ) : (
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full h-64 p-4 rounded-xl bg-dark-800 border border-white/8 text-dark-200 text-xs font-mono outline-none focus:border-primary-500 transition-all resize-none"
                    />
                  )}
                </div>

                <button
                  onClick={saveLesson}
                  disabled={saving || !newTitle.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={16} />
                      Criar Lição
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Template Reference */}
            <div className="card p-5 space-y-4">
              <h3 className="text-white font-bold">Referência de Template</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-xl bg-dark-800 border border-white/5">
                  <div className="text-primary-400 font-semibold text-xs mb-1">Tipo: choice (Múltipla Escolha)</div>
                  <pre className="text-dark-300 text-[10px] overflow-x-auto">{`{
  "type": "choice",
  "prompt": "Pergunta",
  "options": ["A", "B", "C", "D"],
  "answer": 0,
  "explanation": "Explicação"
}`}</pre>
                </div>
                <div className="p-3 rounded-xl bg-dark-800 border border-white/5">
                  <div className="text-primary-400 font-semibold text-xs mb-1">Tipo: fill (Complete a Frase)</div>
                  <pre className="text-dark-300 text-[10px] overflow-x-auto">{`{
  "type": "fill",
  "prompt": "Complete: I ___ coffee",
  "options": ["drink", "eats", "sleeping", "ran"],
  "answer": 0,
  "explanation": "Explicação"
}`}</pre>
                </div>
                <div className="p-3 rounded-xl bg-dark-800 border border-white/5">
                  <div className="text-primary-400 font-semibold text-xs mb-1">Tipo: match (Relacione Pares)</div>
                  <pre className="text-dark-300 text-[10px] overflow-x-auto">{`{
  "type": "match",
  "prompt": "Relacione",
  "pairs": [
    {"left": "Hello", "right": "Olá"},
    {"left": "Bye", "right": "Tchau"}
  ],
  "explanation": "Explicação"
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
