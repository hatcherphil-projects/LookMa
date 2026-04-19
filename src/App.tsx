import { useState, useEffect } from 'react';
import { Screen, Team, SeatInfo, CaptureData } from './types';
import HomeScreen from './components/HomeScreen';
import SeatEntryScreen from './components/SeatEntryScreen';
import CameraScreen from './components/CameraScreen';
import PreviewScreen from './components/PreviewScreen';
import ContestModal from './components/ContestModal';
import OpsDashboard from './components/OpsDashboard';

export default function App() {
  const [isOpsMode, setIsOpsMode] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [seatInfo, setSeatInfo] = useState<SeatInfo | null>(null);
  const [captureData, setCaptureData] = useState<CaptureData | null>(null);
  const [showContest, setShowContest] = useState(false);

  useEffect(() => {
    const handleRoute = () => {
      setIsOpsMode(window.location.pathname === '/ops');
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setScreen('seat');
  };

  const handleConfirmSeat = (seat: SeatInfo) => {
    setSeatInfo(seat);
    setScreen('camera');
  };

  const handleCapture = (data: CaptureData) => {
    setCaptureData(data);
    setScreen('preview');
  };

  const handleRetake = () => {
    setCaptureData(null);
    setScreen('camera');
  };

  const handleShowContest = () => {
    setShowContest(true);
  };

  const handleCloseContest = () => {
    setShowContest(false);
  };

  const handleLogout = () => {
    window.history.pushState({}, '', '/');
    setIsOpsMode(false);
  };

  if (isOpsMode) {
    return <OpsDashboard onLogout={handleLogout} />;
  }

  return (
    <div style={{ background: '#0F0F0F', minHeight: '100vh' }}>
      {screen === 'home' && (
        <HomeScreen onSelectTeam={handleSelectTeam} />
      )}

      {screen === 'seat' && selectedTeam && (
        <SeatEntryScreen
          team={selectedTeam}
          onConfirm={handleConfirmSeat}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'camera' && selectedTeam && seatInfo && (
        <CameraScreen
          team={selectedTeam}
          seat={seatInfo}
          onCapture={handleCapture}
          onBack={() => setScreen('seat')}
        />
      )}

      {screen === 'preview' && selectedTeam && seatInfo && captureData && (
        <PreviewScreen
          team={selectedTeam}
          seat={seatInfo}
          capture={captureData}
          onRetake={handleRetake}
          onBack={() => setScreen('camera')}
          onShowContest={handleShowContest}
        />
      )}

      {showContest && (
        <ContestModal onClose={handleCloseContest} />
      )}
    </div>
  );
}
