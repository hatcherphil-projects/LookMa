import { useState } from 'react';
import { ArrowLeft, Share2, Download, RotateCcw, Monitor } from 'lucide-react';
import { Team, SeatInfo, CaptureData } from '../types';
import { SPONSOR } from '../data';
import { supabase } from '../lib/supabase';

interface Props {
  team: Team;
  seat: SeatInfo;
  capture: CaptureData;
  onRetake: () => void;
  onBack: () => void;
  onShowContest: () => void;
}

export default function PreviewScreen({ team, seat, capture, onRetake, onBack, onShowContest }: Props) {
  const [shareError, setShareError] = useState('');
  const [submittingJumbotron, setSubmittingJumbotron] = useState(false);
  const [jumbotronSubmitted, setJumbotronSubmitted] = useState(false);

  const getFile = (): File | null => {
    if (!capture.blob) return null;
    const ext = capture.type === 'photo' ? 'png' : 'webm';
    const mime = capture.type === 'photo' ? 'image/png' : 'video/webm';
    return new File([capture.blob], `fancam.${ext}`, { type: mime });
  };

  const handleShare = async () => {
    const file = getFile();
    setShareError('');

    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: 'FanCam',
          text: 'Check out my game moment! #FanCam',
        };
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
        await navigator.share(shareData);
        onShowContest();
        return;
      } catch {
        // fall through to download
      }
    }

    handleDownload();
    onShowContest();
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = capture.url;
    a.download = capture.type === 'photo' ? 'fancam-moment.png' : 'fancam-moment.webm';
    a.click();
    onShowContest();
  };

  const handleSubmitJumbotron = async () => {
    setSubmittingJumbotron(true);
    try {
      const { error } = await supabase.from('jumbotron_submissions').insert({
        team_id: team.id,
        team_name: team.name,
        team_color: team.color,
        section: seat.section,
        row: seat.row,
        seat: seat.seat,
        clip_url: capture.url,
        clip_type: capture.type,
        email: '',
      });

      if (error) {
        console.error('Jumbotron submission error:', error);
      } else {
        setJumbotronSubmitted(true);
        setTimeout(() => setJumbotronSubmitted(false), 3000);
      }
    } catch (err) {
      console.error('Failed to submit to jumbotron:', err);
    } finally {
      setSubmittingJumbotron(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start"
      style={{ background: '#0F0F0F' }}
    >
      <div className="w-full max-w-[420px] flex flex-col" style={{ minHeight: '100svh' }}>
        <div className="flex items-center gap-3 px-4 pt-6 pb-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-xl w-10 h-10 transition-all active:scale-95"
            style={{ background: '#1A1A1A' }}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </button>
          <span className="text-base font-bold" style={{ color: '#FFFFFF' }}>
            Your FanCam Moment
          </span>
        </div>

        <div
          className="relative mx-4 overflow-hidden flex-1"
          style={{
            border: `8px solid ${team.color}`,
            borderRadius: '20px',
            minHeight: '420px',
            boxShadow: `0 0 0 2px ${team.color}44, 0 8px 40px ${team.color}22`,
          }}
        >
          {capture.type === 'photo' ? (
            <img
              src={capture.url}
              alt="Captured moment"
              className="w-full h-full object-cover"
              style={{ display: 'block', minHeight: '420px', background: '#000' }}
            />
          ) : (
            <video
              src={capture.url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ display: 'block', minHeight: '420px', background: '#000' }}
            />
          )}

          <div
            className="absolute top-3 left-3 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.65)' }}
          >
            <span className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
              {team.name}
            </span>
          </div>

          <div
            className="absolute top-3 right-3 px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <span className="text-xs font-semibold" style={{ color: '#AAAAAA' }}>
              §{seat.section} · R{seat.row} · S{seat.seat}
            </span>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between"
            style={{ background: 'rgba(0,0,0,0.65)' }}
          >
            <span className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>
              Brought to you by {SPONSOR}
            </span>
            <span className="text-xs font-semibold" style={{ color: team.color }}>
              {team.name}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 pt-4 pb-8">
          {shareError && (
            <p className="text-sm font-medium text-center" style={{ color: '#E8433A' }}>
              {shareError}
            </p>
          )}

          {jumbotronSubmitted && (
            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
            >
              <p className="text-sm font-bold" style={{ color: '#22C55E' }}>
                Submitted for the big screen!
              </p>
            </div>
          )}

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 rounded-xl font-bold text-base text-white transition-all duration-150 active:scale-[0.98]"
            style={{
              background: '#E8433A',
              height: '60px',
              boxShadow: '0 4px 24px rgba(232, 67, 58, 0.35)',
            }}
          >
            <Share2 size={20} />
            Share
          </button>

          <button
            onClick={handleSubmitJumbotron}
            disabled={submittingJumbotron || jumbotronSubmitted}
            className="w-full flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] disabled:opacity-50"
            style={{
              background: 'transparent',
              border: `2px solid ${team.color}`,
              color: team.color,
              height: '60px',
            }}
          >
            <Monitor size={20} />
            {submittingJumbotron ? 'Sending...' : 'Send to Jumbotron'}
          </button>

          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98]"
            style={{
              background: 'transparent',
              border: '2px solid #333333',
              color: '#FFFFFF',
              height: '60px',
            }}
          >
            <Download size={20} />
            Download
          </button>

          <button
            onClick={onRetake}
            className="w-full flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98]"
            style={{
              background: 'transparent',
              color: '#AAAAAA',
              height: '48px',
            }}
          >
            <RotateCcw size={18} />
            Retake
          </button>
        </div>
      </div>
    </div>
  );
}
