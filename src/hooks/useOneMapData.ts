import { useState, useEffect, useCallback, useRef } from 'react';
import { OneMapAddressItem, OneMapApiResponse, OneMapStatus } from '../types';

export const EXACT_ONEMAP_ENDPOINT = '/api/GET https://www.onemap.gov.sg/api/common/elastic/search?searchVal=178903&returnGeom=Y&getAddrDetails=Y&pageNum=1';

export interface UseOneMapReturn {
  status: OneMapStatus;
  data: OneMapAddressItem | null;
  rawResponse: OneMapApiResponse | null;
  plainMessage: string;
  isLoading: boolean;
  isSlow: boolean;
  isEmpty: boolean;
  isRefused: boolean;
  refetch: () => Promise<void>;
  simulateState: (simState: 'normal' | 'empty' | 'slow' | 'refused' | 'key_not_configured') => void;
  currentSimulation: 'normal' | 'empty' | 'slow' | 'refused' | 'key_not_configured';
}

export function useOneMapData(): UseOneMapReturn {
  const [status, setStatus] = useState<OneMapStatus>('idle');
  const [data, setData] = useState<OneMapAddressItem | null>(null);
  const [rawResponse, setRawResponse] = useState<OneMapApiResponse | null>(null);
  const [plainMessage, setPlainMessage] = useState<string>('Initializing location connection...');
  const [isSlow, setIsSlow] = useState(false);
  const [simulation, setSimulation] = useState<'normal' | 'empty' | 'slow' | 'refused' | 'key_not_configured'>('normal');

  const slowTimerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (forcedSimulation?: 'normal' | 'empty' | 'slow' | 'refused' | 'key_not_configured') => {
    const activeSim = forcedSimulation ?? simulation;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (slowTimerRef.current) {
      clearTimeout(slowTimerRef.current);
      slowTimerRef.current = null;
    }

    setStatus('loading');
    setIsSlow(false);
    setPlainMessage('Fetching live location data from OneMap Singapore...');

    // If simulating slow:
    if (activeSim === 'slow') {
      setIsSlow(true);
      setStatus('slow');
      setData(null);
      setPlainMessage('The data is slow. The OneMap connection is taking longer than usual to respond.');
      return;
    }

    // If simulating empty:
    if (activeSim === 'empty') {
      setStatus('empty');
      setData(null);
      setRawResponse({ found: 0, results: [] });
      setPlainMessage('The data is empty. No location records found for postal code 178903.');
      return;
    }

    // If simulating refused:
    if (activeSim === 'refused') {
      setStatus('refused');
      setData(null);
      setPlainMessage('The data was refused: Connection to the OneMap API was refused or blocked by the server.');
      return;
    }

    // If simulating key not configured:
    if (activeSim === 'key_not_configured') {
      setStatus('key_not_configured');
      setData(null);
      setPlainMessage('The data was refused: API key is not configured (503 key not configured).');
      return;
    }

    // Start slow watchdog timer (3.5 seconds)
    slowTimerRef.current = window.setTimeout(() => {
      setIsSlow(true);
      setPlainMessage('The data is slow. Response from OneMap is taking longer than expected...');
    }, 3500);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Must fetch strictly through the specified path
      const res = await fetch(EXACT_ONEMAP_ENDPOINT, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (slowTimerRef.current) {
        clearTimeout(slowTimerRef.current);
        slowTimerRef.current = null;
      }
      setIsSlow(false);

      if (res.status === 503) {
        setStatus('key_not_configured');
        setData(null);
        setPlainMessage('The data was refused: key not configured (503). The server reported the API key is not configured.');
        return;
      }

      if (!res.ok) {
        setStatus('refused');
        setData(null);
        setPlainMessage(`The data was refused: OneMap API server returned status ${res.status} (${res.statusText || 'request refused'}).`);
        return;
      }

      const json: OneMapApiResponse = await res.json();
      setRawResponse(json);

      if (!json.results || json.results.length === 0 || json.found === 0) {
        setStatus('empty');
        setData(null);
        setPlainMessage('The data is empty. No address details were returned for search value 178903.');
      } else {
        setStatus('success');
        setData(json.results[0]);
        setPlainMessage(`Live data successfully verified: ${json.results[0].BUILDING} (${json.results[0].POSTAL})`);
      }
    } catch (err: any) {
      if (slowTimerRef.current) {
        clearTimeout(slowTimerRef.current);
        slowTimerRef.current = null;
      }

      if (err.name === 'AbortError') {
        return;
      }

      setStatus('refused');
      setData(null);
      setPlainMessage(`The data was refused: Unable to connect to OneMap API (${err.message || 'network connection error'}).`);
    }
  }, [simulation]);

  useEffect(() => {
    fetchData();
    return () => {
      if (slowTimerRef.current) {
        clearTimeout(slowTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const simulateState = (simState: 'normal' | 'empty' | 'slow' | 'refused' | 'key_not_configured') => {
    setSimulation(simState);
    fetchData(simState);
  };

  return {
    status,
    data,
    rawResponse,
    plainMessage,
    isLoading: status === 'loading',
    isSlow: status === 'slow' || isSlow,
    isEmpty: status === 'empty',
    isRefused: status === 'refused' || status === 'key_not_configured',
    refetch: () => fetchData('normal'),
    simulateState,
    currentSimulation: simulation,
  };
}
