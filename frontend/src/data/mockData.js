export const initialStats = {
  active_blocks_today: 6,
  pending_approvals: 4,
  ai_optimized_slots: 12,
  detected_conflicts: 1,
  line_efficiency_rating: "94.8%",
  active_corridors: [
    { 
      id: "COR-01", 
      name: "Bhopal (BPL) – Itarsi (ET)", 
      status: "ACTIVE_MAINTENANCE", 
      track: "Down Main Line",
      speed_cap: "30 km/h (TSR)"
    },
    { 
      id: "COR-02", 
      name: "Bina (BINA) – Jhansi (JHS)", 
      status: "NORMAL_OPERATIONS", 
      track: "Up Main Line",
      speed_cap: "110 km/h (MPS)"
    },
    { 
      id: "COR-03", 
      name: "Nagpur (NGP) – Itarsi (ET)", 
      status: "POWER_BLOCK_ACTIVE", 
      track: "Both Lines (OHE Isolated)",
      speed_cap: "Halted / Speed Restricted"
    },
  ]
};

export const initialConflicts = [
  {
    conflict_id: "CONF-8821",
    section: "Bhopal (BPL) – Itarsi (ET)",
    track: "Down Main Line",
    block_a: "Civil Track Tamping (08:00 – 12:00)",
    block_b: "TRD Catenary Power Inspection (09:30 – 12:30)",
    overlap_window: "09:30 – 12:00 (150 mins overlap)",
    severity: "CRITICAL",
    ai_recommendation: "Execute 1-Click Integrated Shadow Block: Bundle TRD catenary maintenance inside Civil possession window (08:00 – 12:00). Saves 3.5 hours of corridor downtime."
  }
];

export const initialMasterBlocks = [
  {
    id: "BLK-2026-0901",
    department: "Civil Engineering",
    section: "Bhopal (BPL) – Itarsi (ET)",
    track: "Down Main Line",
    work_type: "Track Tamping & Deep Ballast Screening",
    time_window: "08:00 – 12:00",
    duration: "4.0 hrs",
    machine: "TTM-Duomatic-08",
    tsr_speed: "30 km/h",
    power_cut: false,
    disruption_score: "38.4",
    status: "CONFLICT_DETECTED",
    private_number: null
  },
  {
    id: "BLK-2026-0902",
    department: "Traction Distribution (TRD)",
    section: "Bhopal (BPL) – Itarsi (ET)",
    track: "Down Main Line",
    work_type: "25kV Catenary Wire Dropper Renewal",
    time_window: "09:30 – 12:30",
    duration: "3.0 hrs",
    machine: "Tower Wagon TW-02",
    tsr_speed: "45 km/h",
    power_cut: true,
    disruption_score: "28.0",
    status: "CONFLICT_DETECTED",
    private_number: null
  },
  {
    id: "BLK-2026-0889",
    department: "Signal & Telecom (S&T)",
    section: "Bina (BINA) – Jhansi (JHS)",
    track: "Up Main Line",
    work_type: "Electronic Interlocking & Digital Axle Counter Calibration",
    time_window: "13:00 – 15:30",
    duration: "2.5 hrs",
    machine: "Manual Technical Crew",
    tsr_speed: "Normal (MPS)",
    power_cut: false,
    disruption_score: "11.2",
    status: "APPROVED",
    private_number: "BPL-PN-4412"
  },
  {
    id: "BLK-2026-0872",
    department: "Civil Engineering",
    section: "Nagpur (NGP) – Itarsi (ET)",
    track: "Both Lines",
    work_type: "Turnout Sleeper Renewal & Rail Welding",
    time_window: "23:00 – 03:30",
    duration: "4.5 hrs",
    machine: "BCM-04 (Cleaner)",
    tsr_speed: "20 km/h",
    power_cut: false,
    disruption_score: "21.6",
    status: "PENDING_SANCTION",
    private_number: null
  }
];