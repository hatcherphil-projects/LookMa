import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function ContestModal({ onClose }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-end items-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="w-full max-w-[420px] flex flex-col gap-5 px-5 pt-6 pb-10 animate-slide-up"
        style={{
          background: '#1A1A1A',
          borderRadius: '24px 24px 0 0',
          border: '1px solid #2A2A2A',
          borderBottom: 'none',
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <h2
              className="text-2xl font-black"
              style={{ color: '#FFFFFF', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              🏒 Win Game Tickets!
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#AAAAAA' }}>
              Enter your email for a chance to win 2 tickets to the next home game.{' '}
              <span style={{ color: '#777777' }}>Presented by Molson Canadian.</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-xl w-9 h-9 flex-shrink-0 ml-3 transition-all active:scale-95"
            style={{ background: '#252525' }}
          >
            <X size={18} color="#AAAAAA" />
          </button>
        </div>

        {success ? (
          <div
            className="rounded-xl px-4 py-4 text-center"
            style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
          >
            <p className="text-base font-bold" style={{ color: '#22C55E' }}>
              You're entered! Good luck. 🎉
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="your@email.com"
                className="w-full rounded-xl px-4 text-base font-medium outline-none transition-all"
                style={{
                  background: '#252525',
                  border: `2px solid ${error ? '#E8433A' : email ? '#444444' : '#333333'}`,
                  color: '#FFFFFF',
                  height: '56px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
              {error && (
                <p className="text-sm font-medium" style={{ color: '#E8433A' }}>
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full rounded-xl font-bold text-base text-white transition-all duration-150 active:scale-[0.98]"
              style={{
                background: '#E8433A',
                height: '56px',
                boxShadow: '0 4px 20px rgba(232, 67, 58, 0.35)',
              }}
            >
              Enter to Win
            </button>

            <p className="text-xs text-center" style={{ color: '#555555' }}>
              No purchase necessary. Must be 19+. Contest ends at the final buzzer.
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}
