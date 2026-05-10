import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { BottomNav } from '../components/BottomNav';
import {
  ArrowLeft, Award, Download, Share2, BookOpen, Calculator,
  GraduationCap, Flame, Star
} from 'lucide-react';

interface Certificate {
  id: string;
  type: string;
  title: string;
  description: string;
  module: string;
  issued_at: string;
}

const certificateTypes = [
  { type: 'ingles_iniciante', title: 'Inglês Iniciante', description: 'Completou todas as lições de Inglês Nível 1', module: 'ingles', icon: BookOpen, color: 'from-blue-500 to-cyan-400' },
  { type: 'matematica_basica', title: 'Matemática Básica', description: 'Completou todas as lições de Matemática Nível 1', module: 'matematica', icon: Calculator, color: 'from-emerald-500 to-teal-400' },
  { type: 'enem_ready', title: 'ENEM Ready', description: 'Completou todas as lições do módulo ENEM', module: 'enem', icon: GraduationCap, color: 'from-amber-500 to-orange-400' },
  { type: 'streak_master_30', title: 'Streak Master 30 Dias', description: 'Manteve 30 dias consecutivos de estudo', module: 'geral', icon: Flame, color: 'from-red-500 to-rose-400' },
];

export function CertificadosPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });
      if (data) setCertificates(data as Certificate[]);
    };
    fetchCertificates();
  }, [user]);

  const earnedTypes = new Set(certificates.map((c) => c.type));

  const generateCertificateImage = (cert: typeof certificateTypes[0]): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
      gradient.addColorStop(0, '#0a0a0f');
      gradient.addColorStop(1, '#111118');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 800);

      // Border
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1120, 720);
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, 1100, 700);

      // Glow
      const glow = ctx.createRadialGradient(600, 300, 0, 600, 300, 400);
      glow.addColorStop(0, 'rgba(124, 58, 237, 0.15)');
      glow.addColorStop(1, 'rgba(124, 58, 237, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 1200, 800);

      // Title
      ctx.fillStyle = '#7c3aed';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('STUDYBOOST AI', 600, 140);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillText('CERTIFICADO DE CONQUISTA', 600, 180);

      // Certificate name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px Inter, sans-serif';
      ctx.fillText(cert.title, 600, 300);

      // Description
      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px Inter, sans-serif';
      ctx.fillText(cert.description, 600, 360);

      // User name
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillText(profile?.name || 'Estudante', 600, 460);

      // Date
      ctx.fillStyle = '#64748b';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText(`Emitido em ${new Date().toLocaleDateString('pt-BR')}`, 600, 520);

      // Stars
      ctx.fillStyle = '#f59e0b';
      ctx.font = '28px sans-serif';
      ctx.fillText('★  ★  ★  ★  ★', 600, 580);

      // Footer
      ctx.fillStyle = '#475569';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('studyboost.ai — Aprenda Inglês e Matemática com IA', 600, 680);

      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  const downloadCertificate = async (cert: typeof certificateTypes[0]) => {
    setGenerating(true);
    const blob = await generateCertificateImage(cert);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificado-${cert.type}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setGenerating(false);
  };

  const shareCertificate = async (cert: typeof certificateTypes[0]) => {
    const blob = await generateCertificateImage(cert);
    if (blob && navigator.share) {
      const file = new File([blob], `certificado-${cert.type}.png`, { type: 'image/png' });
      try {
        await navigator.share({ files: [file], title: `Certificado: ${cert.title}` });
      } catch {
        // Fallback to download
        downloadCertificate(cert);
      }
    } else {
      downloadCertificate(cert);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-white font-bold text-lg">Certificados</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="text-center mb-4">
          <Award size={40} className="text-accent-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Suas Conquistas</h2>
          <p className="text-dark-300 text-sm mt-1">{certificates.length} de {certificateTypes.length} certificados conquistados</p>
        </div>

        <div className="space-y-3">
          {certificateTypes.map((cert) => {
            const earned = earnedTypes.has(cert.type);
            const earnedCert = certificates.find((c) => c.type === cert.type);
            const CertIcon = cert.icon;

            return (
              <div
                key={cert.type}
                className={`card p-5 relative overflow-hidden ${earned ? 'border-accent-500/20' : 'opacity-60'}`}
              >
                {!earned && (
                  <div className="absolute inset-0 bg-dark-900/30 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700 border border-white/10">
                      <Star size={14} className="text-dark-400" />
                      <span className="text-dark-300 text-sm font-semibold">Bloqueado</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center shrink-0 ${
                    earned ? '' : 'grayscale'
                  }`}>
                    <CertIcon size={28} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold">{cert.title}</h3>
                    <p className="text-dark-400 text-sm">{cert.description}</p>
                    {earned && earnedCert && (
                      <p className="text-dark-500 text-xs mt-1">
                        Conquistado em {new Date(earnedCert.issued_at).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>

                {earned && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => downloadCertificate(cert)}
                      disabled={generating}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm py-2"
                    >
                      <Download size={14} />
                      Baixar
                    </button>
                    <button
                      onClick={() => shareCertificate(cert)}
                      disabled={generating}
                      className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2"
                    >
                      <Share2 size={14} />
                      Compartilhar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <BottomNav />
    </div>
  );
}
