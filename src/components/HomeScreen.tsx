import { Video } from 'lucide-react';
import { TEAMS } from '../data';
import { Team } from '../types';

interface Props {
  onSelectTeam: (team: Team) => void;
}

export default function HomeScreen({ onSelectTeam }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10" style={{ background: '#0F0F0F' }}>
      <div className="w-full max-w-[420px] flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3 pt-6">
          <div className="flex items-center gap-2">
            <Video size={36} color="#E8433A" strokeWidth={2.5} />
            <span
              className="text-5xl font-black tracking-tight"
              style={{ color: '#E8433A', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.03em' }}
            >
              FanCam
            </span>
          </div>
          <p
            className="text-center text-lg font-medium mt-1"
            style={{ color: '#AAAAAA', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            You're at the game.{' '}
            <span style={{ color: '#FFFFFF' }} className="font-semibold">
              Make it legendary.
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#555555' }}>
            Select Your Team
          </p>
          {TEAMS.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team)}
              className="w-full text-left flex items-center gap-4 rounded-2xl px-5 py-5 transition-all duration-150 active:scale-[0.98]"
              style={{
                background: '#1A1A1A',
                borderLeft: `6px solid ${team.color}`,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.05)`,
              }}
            >
              <div className="flex flex-col gap-1 flex-1">
                <span
                  className="text-lg font-bold"
                  style={{ color: '#FFFFFF', fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {team.name}
                </span>
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: team.color }}
                >
                  {team.league}
                </span>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555555"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        <div
          className="rounded-2xl px-5 py-4 text-center text-sm"
          style={{ background: '#1A1A1A', color: '#555555', border: '1px solid #222222' }}
        >
          🏒 Official fan experience partner of{' '}
          <span style={{ color: '#AAAAAA' }} className="font-semibold">
            Molson Canadian
          </span>
        </div>
      </div>
    </div>
  );
}
