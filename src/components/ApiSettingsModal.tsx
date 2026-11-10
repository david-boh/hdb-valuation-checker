import React, { useState } from 'react';
import {
  getApiConfig,
  updateApiConfig,
  setCustomLoadedRecords,
  getCustomLoadedRecords,
  parseRawApiRecord,
  ApiConfig,
} from '../services/hdbService';
import { RAW_SAMPLE_API_RECORDS } from '../data/seedTransactions';
import {
  X,
  Globe,
  Check,
  AlertCircle,
  RefreshCw,
  Key,
  ShieldCheck,
  Code2,
  FileCode,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReloadData: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  onReloadData,
}) => {
  const [activeTab, setActiveTab] = useState<'endpoint' | 'paste_json' | 'schema'>('endpoint');
  const [config, setConfig] = useState<ApiConfig>(getApiConfig());
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(RAW_SAMPLE_API_RECORDS, null, 2)
  );
  const [parseError, setParseError] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSaveEndpoint = () => {
    updateApiConfig(config);
    onReloadData();
    onClose();
  };

  const handleApplyPastedJson = () => {
    setParseError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      let rawArray: any[] = [];
      if (Array.isArray(parsed)) {
        rawArray = parsed;
      } else if (Array.isArray(parsed.records)) {
        rawArray = parsed.records;
      } else if (Array.isArray(parsed.result?.records)) {
        rawArray = parsed.result.records;
      } else {
        throw new Error('JSON must be an array of transaction objects or contain a "records" array.');
      }

      if (rawArray.length === 0) {
        throw new Error('JSON array is empty.');
      }

      const normalized = rawArray.map(parseRawApiRecord);
      setCustomLoadedRecords(normalized);
      onReloadData();
      onClose();
    } catch (err: any) {
      setParseError(err.message || 'Invalid JSON format');
    }
  };

  const handleResetToDefaultSeed = () => {
    setCustomLoadedRecords(null);
    setParseError(null);
    onReloadData();
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('');

    if (!config.customEndpointUrl || config.customEndpointUrl.trim() === '') {
      setTimeout(() => {
        setTestStatus('success');
        setTestMessage('Using active high-fidelity HDB dataset (all 26 towns, ~1,400 transactions).');
      }, 300);
      return;
    }

    try {
      const url = new URL(config.customEndpointUrl);
      url.searchParams.set('town', 'TAMPINES');
      url.searchParams.set('flat_type', '4 ROOM');

      const headers: Record<string, string> = { Accept: 'application/json' };
      if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

      const res = await fetch(url.toString(), { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      setTestStatus('success');
      setTestMessage('Successfully connected to external HDB API endpoint!');
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'Connection failed. Check URL or CORS headers.');
    }
  };

  const isUsingCustomPasted = Boolean(getCustomLoadedRecords());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                HDB API Integration
              </h3>
              <p className="text-xs text-slate-500">
                Connect your upstream API endpoint or test with raw API JSON responses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('endpoint')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'endpoint'
                ? 'border-red-600 text-red-600 dark:text-red-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            API Endpoint Setup
          </button>
          <button
            onClick={() => setActiveTab('paste_json')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'paste_json'
                ? 'border-red-600 text-red-600 dark:text-red-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Paste API JSON {isUsingCustomPasted && '(Active)'}
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'border-red-600 text-red-600 dark:text-red-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Expected JSON Schema
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: ENDPOINT CONFIG */}
          {activeTab === 'endpoint' && (
            <div className="space-y-4">
              {/* Architecture info note */}
              <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-semibold text-red-700 dark:text-red-400 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  API Contract Compliance
                </span>
                <p className="text-[11px] leading-relaxed">
                  Your backend API will be sent only{' '}
                  <code className="px-1 py-0.5 rounded bg-red-100 dark:bg-red-900/60 font-mono text-[10px]">
                    town
                  </code>{' '}
                  and{' '}
                  <code className="px-1 py-0.5 rounded bg-red-100 dark:bg-red-900/60 font-mono text-[10px]">
                    flat_type
                  </code>{' '}
                  query parameters. All data normalization and analytics (price ranges, floor area, date filters, PSF calculations, and cross-town comparisons) are computed in-memory.
                </p>
              </div>

              {/* Endpoint URL */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Custom HDB Transaction API URL (Optional)
                </label>
                <input
                  type="text"
                  value={config.customEndpointUrl}
                  onChange={(e) => setConfig({ ...config, customEndpointUrl: e.target.value })}
                  placeholder="e.g. https://api.mygateway.com/v1/hdb-resale"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
                />
                <span className="text-[10px] text-slate-400 block">
                  Leave blank to use the built-in Singapore historical dataset.
                </span>
              </div>

              {/* API Key */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 dark:text-slate-200 block">
                  API Authorization Key / Bearer Token (Optional)
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    placeholder="Bearer token or API secret..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Latency Simulation */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    Simulated Network Latency
                  </label>
                  <span className="font-mono text-slate-500">{config.simulateLatencyMs} ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="800"
                  step="50"
                  value={config.simulateLatencyMs}
                  onChange={(e) =>
                    setConfig({ ...config, simulateLatencyMs: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* Test Status feedback */}
              {testStatus !== 'idle' && (
                <div
                  className={`p-3 rounded-lg text-[11px] flex items-center gap-2 ${
                    testStatus === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : testStatus === 'error'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {testStatus === 'testing' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {testStatus === 'success' && <Check className="w-3.5 h-3.5" />}
                  {testStatus === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{testMessage || 'Testing connection...'}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PASTE RAW JSON */}
          {activeTab === 'paste_json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Paste Raw API Response JSON
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Paste JSON array matching the team email structure (e.g. Tampines 2026-11 records).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setJsonInput(JSON.stringify(RAW_SAMPLE_API_RECORDS, null, 2))
                  }
                  className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Load Email Sample
                </button>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={10}
                className="w-full p-3 font-mono text-[11px] bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
                placeholder="Paste JSON array here..."
              />

              {parseError && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {isUsingCustomPasted && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center justify-between">
                  <span>Currently active: Custom loaded JSON records</span>
                  <button
                    type="button"
                    onClick={handleResetToDefaultSeed}
                    className="font-medium underline cursor-pointer hover:text-emerald-900 dark:hover:text-emerald-100"
                  >
                    Reset to Default Dataset
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXPECTED SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Official API Response Structure Reference
              </span>
              <p className="text-[11px] text-slate-500">
                The frontend parser normalizes strings and numbers automatically:
              </p>
              <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
                <pre className="text-slate-300 leading-relaxed">
{`[
  {
    "_id": 238977,                          // number (primary record ID)
    "month": "2026-11",                     // string (YYYY-MM)
    "town": "TAMPINES",                     // string (official town)
    "flat_type": "4 ROOM",                  // string (flat type)
    "block": "809",                         // string (block number)
    "street_name": "TAMPINES AVE 4",        // string (street name)
    "storey_range": "07 TO 09",             // string (storey interval)
    "floor_area_sqm": "105.00",             // string/number (area in sqm)
    "flat_model": "Model A",                // string (model type)
    "lease_commence_date": "1984",          // string/number (year)
    "remaining_lease": "56 years 05 months",// string (lease string)
    "resale_price": "668000"                // string/number (price in SGD)
  }
]`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          {activeTab === 'endpoint' && (
            <button
              type="button"
              onClick={handleTestConnection}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-colors"
            >
              Test Connection
            </button>
          )}

          {activeTab === 'paste_json' && (
            <button
              type="button"
              onClick={handleResetToDefaultSeed}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Full Dataset
            </button>
          )}

          {activeTab === 'schema' && <div />}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Close
            </button>

            {activeTab === 'endpoint' && (
              <button
                type="button"
                onClick={handleSaveEndpoint}
                className="px-4 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
              >
                Save Endpoint
              </button>
            )}

            {activeTab === 'paste_json' && (
              <button
                type="button"
                onClick={handleApplyPastedJson}
                className="px-4 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
              >
                Apply Pasted JSON
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
