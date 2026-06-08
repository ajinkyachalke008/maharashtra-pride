import React, { useState, useMemo, useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { Layers, Building2, X, MapPin, AlertTriangle, Database, Server, ExternalLink, Shield } from 'lucide-react';
import type { BankBranch } from '@/data/bankBranches';
import { BANK_REG_INFO } from '@/data/regulatoryData';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const INITIAL_VIEW_STATE = {
  longitude: 73.8567,
  latitude: 18.5204,
  zoom: 12,
  pitch: 40,
  bearing: -15
};

interface Props {
  locations?: any[];
  banks?: BankBranch[];
}

// All dots are uniform cyan — no fake risk color-coding
const DOT_COLOR: [number, number, number, number] = [14, 165, 233, 220];
const DOT_GLOW: [number, number, number, number] = [14, 165, 233, 60];

export default function SpatialMap({ banks = [] }: Props) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedBranch, setSelectedBranch] = useState<BankBranch | null>(null);
  const [showBanks, setShowBanks] = useState(true);

  const handleBankClick = useCallback((info: any) => {
    if (info.object && info.object.name && info.object.bank) {
      setSelectedBranch(info.object as BankBranch);
    }
  }, []);

  const layers = useMemo(() => {
    const activeLayers: any[] = [];

    if (showBanks && banks.length > 0) {
      // Outer glow ring
      activeLayers.push(
        new ScatterplotLayer({
          id: 'bank-glow',
          data: banks,
          getPosition: (d: BankBranch) => d.coordinates,
          getFillColor: DOT_GLOW,
          getRadius: 180,
          radiusMinPixels: 12,
          radiusMaxPixels: 22,
          opacity: 0.3,
          pickable: false,
        })
      );

      // Selected branch highlight ring
      if (selectedBranch) {
        activeLayers.push(
          new ScatterplotLayer({
            id: 'bank-selected-ring',
            data: [selectedBranch],
            getPosition: (d: BankBranch) => d.coordinates,
            getFillColor: [255, 255, 255, 0],
            getLineColor: [255, 255, 255, 200],
            getRadius: 300,
            radiusMinPixels: 20,
            radiusMaxPixels: 35,
            lineWidthMinPixels: 2,
            stroked: true,
            filled: false,
            pickable: false,
          })
        );
      }

      // Inner solid dot
      activeLayers.push(
        new ScatterplotLayer({
          id: 'bank-dots',
          data: banks,
          getPosition: (d: BankBranch) => d.coordinates,
          getFillColor: DOT_COLOR,
          getLineColor: [255, 255, 255, 80],
          getRadius: 80,
          radiusMinPixels: 5,
          radiusMaxPixels: 12,
          lineWidthMinPixels: 1,
          stroked: true,
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 80],
          onClick: handleBankClick,
        })
      );

      // Floating text labels
      activeLayers.push(
        new TextLayer({
          id: 'bank-labels',
          data: banks,
          getPosition: (d: BankBranch) => d.coordinates,
          getText: (d: BankBranch) => d.name,
          getSize: 13,
          getColor: [14, 165, 233, 220],
          getAngle: 0,
          getTextAnchor: 'start',
          getAlignmentBaseline: 'center',
          getPixelOffset: [14, -2],
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontWeight: 700,
          outlineWidth: 3,
          outlineColor: [3, 6, 8, 220],
          billboard: true,
          sizeMinPixels: 10,
          sizeMaxPixels: 16,
        })
      );
    }

    return activeLayers;
  }, [showBanks, banks, selectedBranch, handleBankClick]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/5 shadow-lg">
      <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={layers}
        onViewStateChange={(e) => setViewState(e.viewState as any)}
        onClick={(info: any) => {
          if (!info.object) setSelectedBranch(null);
        }}
        getTooltip={({object}: any) => {
          if (!object) return null;
          if (object.name && object.bank) {
            return {
              html: `<div style="font-family:monospace;font-size:11px;padding:2px 0"><strong style="color:#38bdf8">${object.name}</strong><br/><span style="color:#94a3b8">${object.bank} Bank · Click for details</span></div>`,
              style: { backgroundColor: '#0a0e14', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 10px' }
            };
          }
          return null;
        }}
      >
        <Map mapStyle={MAP_STYLE} reuseMaps />
      </DeckGL>

      {/* ── Layer Controls (top-left) ── */}
      <div className="absolute top-4 left-4 z-10 w-56">
        <div className="bg-background-surface/90 backdrop-blur border border-white/5 rounded-xl p-4 shadow-xl">
          <h3 className="text-primary-400 font-mono font-bold tracking-widest text-sm mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            LAYERS
          </h3>
          <div className="space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs font-mono text-white/60 group-hover:text-primary-400 transition-colors flex items-center gap-1.5">
                <Building2 className="w-3 h-3" /> Bank Branches
              </span>
              <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={showBanks} onChange={(e) => setShowBanks(e.target.checked)} />
            </label>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          BRANCH DETAIL PANEL (slides in from right)
          Shows ONLY real/verifiable data.
          Operational data shows empty state.
         ══════════════════════════════════════════════ */}
      <div className={`absolute top-0 right-0 h-full w-[380px] z-20 transition-transform duration-300 ease-out ${selectedBranch ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedBranch && (
          <div className="h-full bg-[#080c12]/95 backdrop-blur-xl border-l border-white/5 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-white/5 shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-display font-bold text-white truncate">{selectedBranch.name}</h2>
                  <p className="text-xs font-mono text-white/40 mt-0.5">{selectedBranch.bank} Bank</p>
                </div>
                <button
                  onClick={() => setSelectedBranch(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white ml-2 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* ── Location (Real Data) ── */}
              <section>
                <h3 className="text-[10px] font-mono text-white/30 tracking-widest mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> LOCATION
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-mono text-xs">Bank</span>
                    <span className="text-white/80">{selectedBranch.bank} Bank</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-mono text-xs">Branch</span>
                    <span className="text-white/80">{selectedBranch.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-mono text-xs">District</span>
                    <span className="text-white/80">{selectedBranch.district}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-mono text-xs">PIN Code</span>
                    <span className="text-white/80 font-mono">{selectedBranch.pincode}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-mono text-xs">State</span>
                    <span className="text-white/80">{selectedBranch.state}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-mono text-xs">Latitude</span>
                    <span className="text-white/80 font-mono">{selectedBranch.coordinates[1].toFixed(4)}°N</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-mono text-xs">Longitude</span>
                    <span className="text-white/80 font-mono">{selectedBranch.coordinates[0].toFixed(4)}°E</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-mono text-xs">Node ID</span>
                    <span className="text-white/80 font-mono text-xs">{selectedBranch.id}</span>
                  </div>
                </div>
              </section>

              <div className="h-px bg-white/5" />

              {/* ── IFSC / Branch Codes ── */}
              <section>
                <h3 className="text-[10px] font-mono text-white/30 tracking-widest mb-2 flex items-center gap-1.5">
                  <Database className="w-3 h-3" /> BRANCH IDENTIFIERS
                </h3>
                {selectedBranch.ifsc ? (
                  <div className="space-y-2">
                    <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5">
                      <div className="text-[9px] font-mono text-white/30 tracking-wider">IFSC CODE</div>
                      <div className="text-base font-mono text-primary-400 font-bold mt-0.5 tracking-wider">{selectedBranch.ifsc}</div>
                      <div className="text-[9px] font-mono text-white/15 mt-1">Source: RBI IFSC Registry</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Server className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-white/40 leading-relaxed">
                          IFSC code not yet verified for this branch. Will be fetched from RBI registry API when backend is connected.
                        </p>
                        <p className="text-[10px] font-mono text-white/20 mt-2">
                          Source: RBI IFSC Registry
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <div className="h-px bg-white/5" />

              {/* ── Bank Profile (Real Data from MCA/Exchange) ── */}
              {(() => {
                const regInfo = BANK_REG_INFO.find(b => b.bankCode === selectedBranch.bank);
                if (!regInfo) return null;
                return (
                  <section>
                    <h3 className="text-[10px] font-mono text-white/30 tracking-widest mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" /> BANK PROFILE
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40 font-mono text-xs">Full Name</span>
                        <span className="text-white/80 text-xs text-right">{regInfo.fullName}</span>
                      </div>
                      {regInfo.cin && (
                        <div className="flex justify-between items-start text-sm">
                          <span className="text-white/40 font-mono text-xs">CIN</span>
                          <span className="text-primary-400 font-mono text-[10px] text-right break-all max-w-[55%]">{regInfo.cin}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40 font-mono text-xs">RBI Type</span>
                        <span className="text-white/80 text-xs text-right">{regInfo.rbiRegType}</span>
                      </div>
                      {regInfo.nseSymbol && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/40 font-mono text-xs">NSE / BSE</span>
                          <span className="text-white/80 font-mono text-xs">{regInfo.nseSymbol} / {regInfo.bseCode}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40 font-mono text-xs">Founded</span>
                        <span className="text-white/80">{regInfo.foundedYear}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40 font-mono text-xs">HQ</span>
                        <span className="text-white/80 text-xs">{regInfo.headquarters}</span>
                      </div>
                      <div className="text-[9px] font-mono text-white/15 mt-1">Source: MCA / NSE / BSE</div>
                    </div>
                  </section>
                );
              })()}

              <div className="h-px bg-white/5" />

              {/* ── Risk & Threat Intel — Requires Backend ── */}
              <section>
                <h3 className="text-[10px] font-mono text-white/30 tracking-widest mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> THREAT INTELLIGENCE
                </h3>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Server className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Risk scores, flagged accounts, suspicious transactions, and open cases require a live connection to the FraudLens ML pipeline and Neo4j graph database.
                      </p>
                      <p className="text-[10px] font-mono text-white/20 mt-2">
                        Source: Neo4j + FastAPI /predict endpoint
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Financial Data — Requires Backend ── */}
              <section>
                <h3 className="text-[10px] font-mono text-white/30 tracking-widest mb-2 flex items-center gap-1.5">
                  <Database className="w-3 h-3" /> FINANCIAL DATA
                </h3>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Server className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Account volumes, transaction data, and KYC compliance metrics will be available when connected to authorised financial institution APIs.
                      </p>
                      <p className="text-[10px] font-mono text-white/20 mt-2">
                        Source: RBI-approved bank APIs
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 shrink-0">
              <div className="text-[9px] font-mono text-white/20 text-center tracking-wider">
                NODE: {selectedBranch.id.toUpperCase()} · NO FABRICATED DATA
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
