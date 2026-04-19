import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Team, SeatInfo } from '../types';

interface Props {
  team: Team;
  onConfirm: (seat: SeatInfo) => void;
  onBack: () => void;
}

export default function SeatEntryScreen({ team, onConfirm, onBack }: Props) {
  const [section, setSection] = useState('');
  const [row, setRow] = useState('');
  const [seat, setSeat] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!section.trim() || !row.trim() || !seat.trim()) {
      setError('Please fill in all three fields to continue.');
      return;
    }
    setError('');
    onConfirm({ section, row, seat });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-6" style={{ background: '#0F0F0F' }}>
      <div className="w-full max-w-[420px] flex flex-col gap-8">
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-xl w-10 h-10 transition-all active:scale-95"
            style={{ background: '#1A1A1A' }}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </button>
          <span className="text-sm font-semibold" style={{ color: '#AAAAAA' }}>
            Back
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1
            className="text-3xl font-black"
            style={{ color: team.color, fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}
          >
            {team.name}
          </h1>
          <p className="text-base font-medium" style={{ color: '#AAAAAA' }}>
            Where are you sitting?
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {[
            { label: 'Section', value: section, setter: setSection, placeholder: 'e.g. 101' },
            { label: 'Row', value: row, setter: setRow, placeholder: 'e.g. G' },
            { label: 'Seat', value: seat, setter: setSeat, placeholder: 'e.g. 14' },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label} className="flex flex-col gap-2">
              <label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: '#AAAAAA' }}
              >
                {label}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setter(e.target.value);
                  setError('');
                }}
                placeholder={placeholder}
                className="w-full rounded-xl px-4 text-lg font-semibold outline-none transition-all"
                style={{
                  background: '#1A1A1A',
                  border: `2px solid ${value ? team.color : '#333333'}`,
                  color: '#FFFFFF',
                  height: '60px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
            </div>
          ))}

          {error && (
            <p className="text-sm font-medium" style={{ color: '#E8433A' }}>
              {error}
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-xl text-white font-bold text-lg transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: '#E8433A',
            height: '60px',
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 4px 24px rgba(232, 67, 58, 0.35)',
          }}
        >
          Let's Go →
        </button>

        <div
          className="rounded-2xl px-5 py-4 flex flex-col gap-1"
          style={{ background: '#1A1A1A', border: '1px solid #222222' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#555555' }}>
            Your Info
          </p>
          <p className="text-sm font-medium" style={{ color: '#AAAAAA' }}>
            This will appear on your FanCam posts so your crew can find you in the stands.
          </p>
        </div>
      </div>
    </div>
  );
}
