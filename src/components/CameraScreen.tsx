import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Camera, Video } from 'lucide-react';
import { Team, SeatInfo, CaptureData } from '../types';
import { SPONSOR } from '../data';

interface Props {
  team: Team;
  seat: SeatInfo;
  onCapture: (data: CaptureData) => void;
  onBack: () => void;
}

export default function CameraScreen({ team, seat, onCapture, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [cameraError, setCameraError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch {
      setCameraError('Camera access denied or unavailable. Please allow camera permissions and reload.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const takePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 1080;
    canvas.height = video.videoHeight || 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const url = canvas.toDataURL('image/png');
    canvas.toBlob((blob) => {
      if (blob) onCapture({ type: 'photo', url, blob });
    }, 'image/png');
  }, [onCapture]);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    setCountdown(15);

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      onCapture({ type: 'video', url, blob });
    };

    recorder.start(100);
    setIsRecording(true);

    let remaining = 15;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) stopRecording();
    }, 1000);
  }, [onCapture]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
    setIsRecording(false);
    setCountdown(15);
  }, []);

  const handleVideoButton = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start"
      style={{ background: '#0F0F0F' }}
    >
      <div className="w-full max-w-[420px] flex flex-col" style={{ minHeight: '100svh' }}>
        <div
          className="relative flex-1 overflow-hidden"
          style={{
            border: `8px solid ${isRecording ? '#E8433A' : team.color}`,
            borderRadius: '20px',
            margin: '12px',
            animation: isRecording ? 'pulse-border 1s ease-in-out infinite' : 'none',
            boxShadow: isRecording
              ? '0 0 0 2px rgba(232,67,58,0.4), 0 0 24px rgba(232,67,58,0.3)'
              : `0 0 0 2px ${team.color}44`,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: 'block', minHeight: '480px', background: '#000' }}
          />

          {!cameraReady && !cameraError && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: '#111' }}
            >
              <p className="text-sm font-medium" style={{ color: '#AAAAAA' }}>
                Starting camera...
              </p>
            </div>
          )}

          {cameraError && (
            <div
              className="absolute inset-0 flex items-center justify-center px-6 text-center"
              style={{ background: '#111' }}
            >
              <p className="text-sm font-medium" style={{ color: '#E8433A' }}>
                {cameraError}
              </p>
            </div>
          )}

          <div
            className="absolute top-3 left-3 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.65)' }}
          >
            <span className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
              {team.name}
            </span>
          </div>

          {isRecording && (
            <div
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full flex items-center gap-1.5"
              style={{ background: 'rgba(232,67,58,0.85)' }}
            >
              <span className="text-sm font-bold text-white">REC ●</span>
              <span className="text-sm font-bold text-white">{countdown}s</span>
            </div>
          )}

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

          <div
            className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none"
          >
            <button
              onClick={onBack}
              className="pointer-events-auto flex items-center justify-center rounded-xl w-9 h-9 absolute left-3 transition-all active:scale-95"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              <ArrowLeft size={18} color="#FFFFFF" />
            </button>
          </div>

          <div
            className="absolute bottom-12 left-3 px-2 py-1 rounded"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <span className="text-xs" style={{ color: '#AAAAAA' }}>
              §{seat.section} · R{seat.row} · S{seat.seat}
            </span>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-4 px-4 pb-8 pt-2">
          <button
            onClick={takePhoto}
            disabled={!cameraReady || isRecording}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.97] disabled:opacity-40"
            style={{
              background: '#1A1A1A',
              border: `2px solid ${team.color}`,
              color: '#FFFFFF',
              height: '60px',
            }}
          >
            <Camera size={20} />
            Photo
          </button>

          <button
            onClick={handleVideoButton}
            disabled={!cameraReady}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.97] disabled:opacity-40"
            style={{
              background: isRecording ? '#E8433A' : '#1A1A1A',
              border: `2px solid ${isRecording ? '#E8433A' : team.color}`,
              color: '#FFFFFF',
              height: '60px',
              boxShadow: isRecording ? '0 4px 20px rgba(232,67,58,0.4)' : 'none',
            }}
          >
            <Video size={20} />
            {isRecording ? `Stop (${countdown}s)` : 'Video'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 2px rgba(232,67,58,0.4), 0 0 24px rgba(232,67,58,0.3); }
          50% { box-shadow: 0 0 0 4px rgba(232,67,58,0.7), 0 0 40px rgba(232,67,58,0.5); }
        }
      `}</style>
    </div>
  );
}
