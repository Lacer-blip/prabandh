import React, { useState, useEffect } from 'react';
import GovHeader from './components/GovHeader';
import UserSessionCard from './components/UserSessionCard';
import LoginPortal from './components/LoginPortal';
import Dashboard from './components/Dashboard';
import BlockRequestForm from './components/BlockRequestForm';
import MasterRegistry from './components/MasterRegistry';
import TimeDistanceChart from './components/TimeDistanceChart';
import DisruptionSimulator from './components/DisruptionSimulator';
import COATrafficManager from './components/COATrafficManager';
import { initialStats } from './data/mockData';
import { api, setAuthToken } from './api';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [textSize, setTextSize] = useState('base');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(initialStats);
  const [conflicts, setConflicts] = useState([]);
  const [blocks, setBlocks] = useState([]);

  // Dynamic maintenance block window plotted on string chart
  const [blockWindow, setBlockWindow] = useState({
    start: 8.0,
    end: 12.0,
    label: "SANCTIONED SHADOW BLOCK (08:00 – 12:00)"
  });

  // Shared Timetable State for COA Ingestion & String Chart
  const [trains, setTrains] = useState([]);

   useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const fetchAllData = async () => {
    try {
      const [blocksData, conflictsData, trainsData] = await Promise.all([
        api.getBlocks(),
        api.getConflicts(),
        api.getTrains(),
      ]);
      setBlocks(blocksData);
      setConflicts(conflictsData);
      setTrains(trainsData);
      setStats(prev => ({
        ...prev,
        pending_approvals: blocksData.filter(b => b.status === 'PENDING_SANCTION' || b.status === 'CONFLICT_DETECTED').length,
        active_blocks_today: blocksData.filter(b => b.status === 'APPROVED').length,
        ai_optimized_slots: blocksData.filter(b => b.status === 'INTEGRATED_SHADOW_APPROVED').length,
        detected_conflicts: conflictsData.length,
      }));
    } catch (err) {
      console.error('Failed to load data from backend:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const handleLoginSuccess = (officer) => {
    setUser(officer);
    if (officer.portalType === 'APPROVER') {
      setActiveTab('dashboard');
    } else if (officer.portalType === 'COA') {
      setActiveTab('timetable-feed');
    } else {
      setActiveTab('requisition');
    }
  };

    const handleExecuteShadowMerge = async (conflictId) => {
    try {
      await api.shadowMerge(conflictId);
      await fetchAllData();
      alert("⚡ AI Shadow Block Executed! Possessions merged into one unified window.");
    } catch (err) {
      alert(`Shadow merge failed: ${err.message}`);
    }
  };
    const handleSanctionBlock = async (blockId) => {
    try {
      const updatedBlock = await api.sanctionBlock(blockId);
      setBlocks(prev => prev.map(b => (b.id === blockId ? updatedBlock : b)));
      setStats(prev => ({
        ...prev,
        pending_approvals: Math.max(0, prev.pending_approvals - 1),
        active_blocks_today: prev.active_blocks_today + 1
      }));
      alert(`Block ${blockId} Sanctioned! Section Controller Private Number: ${updatedBlock.private_number}`);
    } catch (err) {
      alert(`Sanction failed: ${err.message}`);
    }
  };

    // Called when Controller clicks "Apply AI Re-Slotted Plan to Live Schedule"
  const handleApplyReSlot = async ({ trainNo, delayMinutes, startHour, endHour, timeWindowStr, affected_block_id }) => {
    // 1. Shift the maintenance window on the graph
    setBlockWindow({
      start: startHour,
      end: endHour,
      label: `TRAIN #${trainNo} SHIFTED (${timeWindowStr})`
    });

    // 2. Shift the delayed train trajectory line on the graph
    setTrains(prev => prev.map(t => {
      if (t.trainNo === trainNo) {
        const addedHours = delayMinutes / 60;
        return {
          ...t,
          originTime: t.originTime + addedHours,
          destTime: t.destTime + addedHours,
          name: `${t.name} (+${delayMinutes}m)`
        };
      }
      return t;
    }));

    // 3. Re-fetch blocks/conflicts from the backend (the solver already updated
    // the affected block's window server-side, if any)
    await fetchAllData();

    alert(
      affected_block_id
        ? `✓ AI Solution Applied Live!\n• Block ${affected_block_id} re-slotted to ${timeWindowStr}\n• Train #${trainNo} shifted by +${delayMinutes} mins\nSwitching to COA String Chart...`
        : `✓ Simulation Applied!\n• Train #${trainNo} shifted by +${delayMinutes} mins\n• No maintenance block was affected\nSwitching to COA String Chart...`
    );
    setActiveTab('strings');
  };

    const handleNewDemandSubmit = async (newDemand) => {
    try {
      const createdBlock = await api.createBlock(newDemand);
      await fetchAllData();
      alert(`Requisition ${createdBlock.id} successfully lodged into Master Registry!`);
      setActiveTab('registry');
    } catch (err) {
      alert(`Failed to submit requisition: ${err.message}`);
    }
  };

  const isApprover = user?.portalType === 'APPROVER';
  const isCOA = user?.portalType === 'COA';
  const isDept = user?.portalType === 'DEPT';

  return (
    <div className={`min-h-screen ${textSize === 'sm' ? 'text-xs' : textSize === 'lg' ? 'text-base' : 'text-sm'} bg-slate-100 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200`}>
      {!user ? (
        <LoginPortal onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <GovHeader
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            textSize={textSize}
            onChangeTextSize={(sz) => setTextSize(sz)}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <UserSessionCard
              user={user}
              onSignOut={() => { setAuthToken(null); setUser(null); }}
              onOpenNewRequest={() => setActiveTab('requisition')}
              onOpenTimetableSync={() => setActiveTab('timetable-feed')}
              onOpenSanctions={() => setActiveTab('registry')}
            />

            {/* Role-Specific Navigation */}
            <div className="flex flex-wrap gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
              {(isApprover || isCOA) && (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeTab === 'dashboard' ? 'bg-emerald-700 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Operations Command
                </button>
              )}

              <button
                onClick={() => setActiveTab('registry')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeTab === 'registry' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {isApprover ? 'Master Registry & Sanctions' : 'Master Registry'} ({blocks.length})
              </button>

              <button
                onClick={() => setActiveTab('strings')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeTab === 'strings' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                COA String Chart ({trains.length})
              </button>

              {isApprover && (
                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeTab === 'simulator' ? 'bg-purple-600 text-white shadow' : 'text-purple-600 dark:text-purple-400'
                  }`}
                >
                  ⚡ AI What-If Engine
                </button>
              )}

              {isCOA && (
                <button
                  onClick={() => setActiveTab('timetable-feed')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeTab === 'timetable-feed' ? 'bg-purple-600 text-white shadow' : 'text-purple-600 dark:text-purple-400'
                  }`}
                >
                  📊 Timetable & Goods Feed (COA)
                </button>
              )}

              {isDept && (
                <button
                  onClick={() => setActiveTab('requisition')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeTab === 'requisition' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  + Lodge Block Request ({user.initials})
                </button>
              )}
            </div>

            {/* Tab Views */}
            {activeTab === 'dashboard' && (
              <Dashboard
                stats={stats}
                conflicts={conflicts}
                onExecuteShadowMerge={handleExecuteShadowMerge}
              />
            )}

            {activeTab === 'registry' && (
              <MasterRegistry
                blocks={blocks}
                conflicts={conflicts}
                onSanctionBlock={isApprover ? handleSanctionBlock : null}
                onExecuteShadowMerge={handleExecuteShadowMerge}
                isApprover={isApprover}
              />
            )}

            {activeTab === 'strings' && (
              <TimeDistanceChart trains={trains} blockWindow={blockWindow} />
            )}

            {activeTab === 'simulator' && isApprover && (
              <DisruptionSimulator onApplyReSlot={handleApplyReSlot} />
            )}

            {activeTab === 'requisition' && isDept && (
              <BlockRequestForm
                currentUser={user}
                onSubmitSuccess={handleNewDemandSubmit}
                onCancel={() => setActiveTab('registry')}
              />
            )}

            {activeTab === 'timetable-feed' && isCOA && (
              <COATrafficManager
                trains={trains}
                onUpdateTrains={(newTrains) => setTrains(newTrains)}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}