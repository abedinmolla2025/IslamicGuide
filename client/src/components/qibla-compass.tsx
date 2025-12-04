import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RotateCcw, Check, AlertTriangle, Navigation } from "lucide-react";

interface QiblaCompassProps {
  latitude: number;
  longitude: number;
  standalone?: boolean;
}

interface QiblaData {
  direction: number;
  distance: number;
  compassDirection: string;
}

export default function QiblaCompass({ latitude, longitude, standalone = false }: QiblaCompassProps) {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [hasCompass, setHasCompass] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isFacingQibla, setIsFacingQibla] = useState(false);
  const [compassActive, setCompassActive] = useState(false);
  
  const lastHeadingRef = useRef<number>(0);
  const orientationHandlerRef = useRef<((event: DeviceOrientationEvent) => void) | null>(null);

  const { data: qiblaData, isLoading } = useQuery<QiblaData>({
    queryKey: ["/api/qibla", { latitude, longitude }],
  });

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let heading: number | null = null;

    if ((event as any).webkitCompassHeading !== undefined) {
      heading = (event as any).webkitCompassHeading;
    } else if (event.alpha !== null) {
      heading = 360 - event.alpha;
    }

    if (heading !== null) {
      const diff = heading - lastHeadingRef.current;
      let normalizedDiff = diff;
      if (diff > 180) normalizedDiff = diff - 360;
      if (diff < -180) normalizedDiff = diff + 360;
      
      const smoothingFactor = 0.15;
      let smoothedHeading = lastHeadingRef.current + smoothingFactor * normalizedDiff;
      if (smoothedHeading < 0) smoothedHeading += 360;
      if (smoothedHeading >= 360) smoothedHeading -= 360;
      
      lastHeadingRef.current = smoothedHeading;
      setDeviceHeading(smoothedHeading);
    }
  }, []);

  const stopCompass = useCallback(() => {
    if (orientationHandlerRef.current) {
      window.removeEventListener('deviceorientation', orientationHandlerRef.current, true);
      orientationHandlerRef.current = null;
    }
    setCompassActive(false);
  }, []);

  const startCompass = useCallback(() => {
    stopCompass();
    
    if (!('DeviceOrientationEvent' in window)) {
      setHasCompass(false);
      return;
    }

    orientationHandlerRef.current = handleOrientation;
    window.addEventListener('deviceorientation', handleOrientation, true);
    setCompassActive(true);
  }, [handleOrientation, stopCompass]);

  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          startCompass();
        }
      } catch (err) {
        console.error('Permission denied:', err);
        setHasCompass(false);
      }
    } else {
      setPermissionGranted(true);
      startCompass();
    }
  };

  useEffect(() => {
    if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      setPermissionGranted(true);
      startCompass();
    }

    return () => {
      stopCompass();
    };
  }, [startCompass, stopCompass]);

  useEffect(() => {
    if (qiblaData && deviceHeading !== null) {
      const diff = Math.abs(qiblaData.direction - deviceHeading);
      const normalizedDiff = diff > 180 ? 360 - diff : diff;
      setIsFacingQibla(normalizedDiff < 10);
    }
  }, [qiblaData, deviceHeading]);

  const calibrateCompass = useCallback(() => {
    setIsCalibrating(true);
    stopCompass();
    lastHeadingRef.current = 0;
    setDeviceHeading(null);
    
    setTimeout(() => {
      startCompass();
      setIsCalibrating(false);
    }, 1500);
  }, [startCompass, stopCompass]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p className="text-white text-lg">কিবলা দিক গণনা করছি...</p>
        </div>
      </div>
    );
  }

  if (!qiblaData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-amber-100">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
          <p>কিবলা দিক গণনা করা যায়নি</p>
        </div>
      </div>
    );
  }

  const compassRotation = deviceHeading !== null ? -deviceHeading : 0;
  const qiblaArrowRotation = deviceHeading !== null ? qiblaData.direction - deviceHeading : qiblaData.direction;

  return (
    <section className={`${standalone ? 'flex flex-col items-center justify-center w-full' : 'p-4 border-t border-border'}`} data-testid="section-qibla">
      
      <div className="text-center space-y-4 w-full max-w-sm mx-auto px-4">
        {!permissionGranted && typeof (DeviceOrientationEvent as any).requestPermission === 'function' && (
          <div className="mb-4">
            <Button 
              onClick={requestPermission}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              data-testid="button-enable-compass"
            >
              <Navigation className="mr-2 h-4 w-4" />
              কম্পাস চালু করুন
            </Button>
          </div>
        )}

        <div className="relative w-72 h-72 mx-auto" data-testid="compass-container">
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id="compassBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="50%" stopColor="#065f46" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="qiblaArrow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <filter id="innerShadow">
                <feOffset dx="0" dy="2"/>
                <feGaussianBlur stdDeviation="3"/>
                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0"/>
                <feBlend in2="SourceGraphic"/>
              </filter>
              <filter id="glowFilter">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <circle 
              cx="150" cy="150" r="145" 
              fill="url(#compassBg)"
              stroke={isFacingQibla ? "#22c55e" : "#d97706"}
              strokeWidth={isFacingQibla ? "6" : "4"}
              filter="url(#innerShadow)"
              className="transition-all duration-300"
            />
            
            <circle cx="150" cy="150" r="135" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3"/>
            <circle cx="150" cy="150" r="100" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.2"/>
            <circle cx="150" cy="150" r="65" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.15"/>

            <g style={{ transform: `rotate(${compassRotation}deg)`, transformOrigin: '150px 150px', transition: 'transform 0.1s ease-out' }}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1="150"
                  y1="20"
                  x2="150"
                  y2={angle % 90 === 0 ? "35" : "30"}
                  stroke={angle === 0 ? "#ef4444" : "#fbbf24"}
                  strokeWidth={angle % 90 === 0 ? "3" : "2"}
                  style={{ transform: `rotate(${angle}deg)`, transformOrigin: '150px 150px' }}
                />
              ))}
              
              {[...Array(36)].map((_, i) => {
                const angle = i * 10;
                if (angle % 45 !== 0) {
                  return (
                    <line
                      key={`small-${angle}`}
                      x1="150"
                      y1="20"
                      x2="150"
                      y2="25"
                      stroke="#fbbf24"
                      strokeWidth="1"
                      opacity="0.5"
                      style={{ transform: `rotate(${angle}deg)`, transformOrigin: '150px 150px' }}
                    />
                  );
                }
                return null;
              })}

              <text x="150" y="52" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="bold">উ</text>
              <text x="260" y="155" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">পূ</text>
              <text x="150" y="265" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">দ</text>
              <text x="40" y="155" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">প</text>
            </g>

            <g style={{ transform: `rotate(${qiblaArrowRotation}deg)`, transformOrigin: '150px 150px', transition: 'transform 0.1s ease-out' }}>
              <path
                d="M150 40 L165 100 L155 100 L155 200 L145 200 L145 100 L135 100 Z"
                fill="url(#qiblaArrow)"
                filter={isFacingQibla ? "url(#glowFilter)" : ""}
                className="transition-all duration-300"
              />
              
              <circle cx="150" cy="70" r="18" fill="#065f46" stroke="#22c55e" strokeWidth="2"/>
              <text x="150" y="76" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">K</text>
            </g>

            <circle cx="150" cy="150" r="12" fill={isFacingQibla ? "#22c55e" : "#d97706"} stroke="white" strokeWidth="3" className="transition-all duration-300"/>
            <circle cx="150" cy="150" r="5" fill="white"/>
          </svg>

          {isFacingQibla && (
            <div className="absolute inset-0 rounded-full animate-pulse" style={{
              boxShadow: '0 0 40px rgba(34, 197, 94, 0.5), 0 0 80px rgba(34, 197, 94, 0.3)'
            }}/>
          )}
        </div>

        {isFacingQibla && (
          <div className="flex items-center justify-center gap-2 bg-green-500/20 py-3 px-6 rounded-full border border-green-500/50 animate-pulse">
            <Check className="h-6 w-6 text-green-400" />
            <span className="text-lg font-bold text-green-400">কিবলার দিকে আছেন!</span>
          </div>
        )}

        <div className="bg-emerald-900/60 rounded-2xl p-5 border border-amber-500/30 space-y-4 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-emerald-800/50 rounded-xl">
              <p className="text-amber-200/70 text-xs mb-1">কিবলা দিক</p>
              <p className="text-2xl font-bold text-amber-400" data-testid="text-qibla-direction">
                {Math.round(qiblaData.direction)}°
              </p>
              <p className="text-sm text-amber-300">{qiblaData.compassDirection}</p>
            </div>
            <div className="text-center p-3 bg-emerald-800/50 rounded-xl">
              <p className="text-amber-200/70 text-xs mb-1">কাবা থেকে দূরত্ব</p>
              <p className="text-xl font-bold text-white" data-testid="text-qibla-distance">
                {Math.round(qiblaData.distance).toLocaleString()}
              </p>
              <p className="text-sm text-amber-300">কিলোমিটার</p>
            </div>
          </div>
          
          {deviceHeading !== null && (
            <div className="text-center pt-2 border-t border-amber-500/20">
              <p className="text-amber-200/70 text-xs">আপনার বর্তমান দিক</p>
              <p className="text-lg font-semibold text-white">{Math.round(deviceHeading)}°</p>
            </div>
          )}
        </div>

        <Button 
          onClick={calibrateCompass}
          disabled={isCalibrating}
          variant="outline"
          className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
          data-testid="button-calibrate"
        >
          <RotateCcw className={`mr-2 h-4 w-4 ${isCalibrating ? 'animate-spin' : ''}`} />
          {isCalibrating ? 'ক্যালিব্রেট হচ্ছে...' : 'কম্পাস ক্যালিব্রেট করুন'}
        </Button>

        {!hasCompass && (
          <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-amber-200 text-sm font-medium">কম্পাস পাওয়া যায়নি</p>
                <p className="text-amber-200/70 text-xs mt-1">
                  আপনার ডিভাইসে কম্পাস নেই। উপরে দেখানো {Math.round(qiblaData.direction)}° দিক অনুসরণ করুন।
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1 pt-2">
          <p className="text-amber-200/50 text-xs flex items-center justify-center gap-1">
            <span className="inline-block w-3 h-3 bg-amber-500 rounded-sm"></span>
            তীরটি সবসময় কাবার দিকে নির্দেশ করে
          </p>
          <p className="text-amber-200/40 text-xs">
            ফোন সমতল রাখুন এবং ধীরে ধীরে ঘুরান
          </p>
        </div>
      </div>
    </section>
  );
}
