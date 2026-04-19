import { useEffect, useState } from 'react';
import { LogOut, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TEAMS } from '../data';

interface Submission {
  id: string;
  team_id: number;
  team_name: string;
  team_color: string;
  section: string;
  row: string;
  seat: string;
  clip_url: string;
  clip_type: 'photo' | 'video';
  featured: boolean;
  submitted_at: string;
}

interface Props {
  onLogout: () => void;
}

export default function OpsDashboard({ onLogout }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTeamId, setFilterTeamId] = useState<number | null>(null);
  const [featuredCount, setFeaturedCount] = useState(0);

  useEffect(() => {
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('jumbotron_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions((data as Submission[]) || []);
      setFeaturedCount(((data as Submission[]) || []).filter((s) => s.featured).length);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('jumbotron_submissions')
        .update({
          featured: !currentFeatured,
          featured_at: !currentFeatured ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;
      fetchSubmissions();
    } catch (err) {
      console.error('Failed to update featured status:', err);
    }
  };

  const filteredSubmissions = filterTeamId
    ? submissions.filter((s) => s.team_id === filterTeamId)
    : submissions;

  const featuredSubmissions = filteredSubmissions.filter((s) => s.featured);

  return (
    <div style={{ background: '#0F0F0F', minHeight: '100vh' }} className="text-white">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black" style={{ color: '#E8433A', letterSpacing: '-0.02em' }}>
              FanCam Ops
            </h1>
            <p className="text-sm" style={{ color: '#AAAAAA' }}>
              Game-day submission feed
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-all"
            style={{ background: '#1A1A1A', color: '#AAAAAA' }}
          >
            <LogOut size={18} />
            Exit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div
            className="rounded-2xl px-5 py-4"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#555555' }}>
              Total Submissions
            </p>
            <p className="text-3xl font-black mt-2">{submissions.length}</p>
          </div>

          <div
            className="rounded-2xl px-5 py-4"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#555555' }}>
              Featured for Jumbotron
            </p>
            <p className="text-3xl font-black mt-2" style={{ color: '#E8433A' }}>
              {featuredCount}
            </p>
          </div>

          <div
            className="rounded-2xl px-5 py-4"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#555555' }}>
              Video Clips
            </p>
            <p className="text-3xl font-black mt-2">
              {submissions.filter((s) => s.clip_type === 'video').length}
            </p>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterTeamId(null)}
            className="px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm"
            style={{
              background: filterTeamId === null ? '#E8433A' : '#1A1A1A',
              color: filterTeamId === null ? '#FFFFFF' : '#AAAAAA',
              border: filterTeamId === null ? 'none' : '1px solid #2A2A2A',
            }}
          >
            All Teams
          </button>
          {TEAMS.map((team) => (
            <button
              key={team.id}
              onClick={() => setFilterTeamId(team.id)}
              className="px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm"
              style={{
                background: filterTeamId === team.id ? team.color : '#1A1A1A',
                color: filterTeamId === team.id ? '#FFFFFF' : '#AAAAAA',
                border: filterTeamId === team.id ? 'none' : '1px solid #2A2A2A',
              }}
            >
              {team.name}
            </button>
          ))}
        </div>

        {featuredSubmissions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#E8433A' }}>
              Now Featured on Jumbotron
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-xl overflow-hidden"
                  style={{ border: `2px solid ${sub.team_color}` }}
                >
                  {sub.clip_type === 'photo' ? (
                    <img
                      src={sub.clip_url}
                      alt={`${sub.team_name} submission`}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <video
                      src={sub.clip_url}
                      muted
                      playsInline
                      className="w-full h-40 object-cover bg-black"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold mb-4">All Submissions</h2>
          {loading ? (
            <p style={{ color: '#AAAAAA' }}>Loading submissions...</p>
          ) : filteredSubmissions.length === 0 ? (
            <p style={{ color: '#AAAAAA' }}>No submissions yet.</p>
          ) : (
            <div className="grid gap-3">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-xl p-4 flex items-center gap-4"
                  style={{
                    background: '#1A1A1A',
                    border: sub.featured ? `2px solid ${sub.team_color}` : '1px solid #2A2A2A',
                  }}
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black">
                    {sub.clip_type === 'photo' ? (
                      <img
                        src={sub.clip_url}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={sub.clip_url}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: sub.team_color }}>
                      {sub.team_name}
                    </p>
                    <p className="text-xs" style={{ color: '#AAAAAA' }}>
                      {sub.clip_type === 'photo' ? 'Photo' : 'Video'} · §{sub.section} R{sub.row} S{sub.seat}
                    </p>
                    <p className="text-xs" style={{ color: '#555555' }}>
                      {new Date(sub.submitted_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => handleFeatureToggle(sub.id, sub.featured)}
                    className="flex-shrink-0 rounded-xl p-3 font-bold transition-all active:scale-95"
                    style={{
                      background: sub.featured ? sub.team_color : '#252525',
                      color: sub.featured ? '#FFFFFF' : '#AAAAAA',
                    }}
                  >
                    <Zap size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
