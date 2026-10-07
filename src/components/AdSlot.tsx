import React, { useEffect, useRef } from 'react';
import { ADSENSE_CONFIG, type AdSlotConfig } from '../utils/adsense.config';

interface AdSlotProps {
  slotKey: keyof typeof ADSENSE_CONFIG.slots;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slotKey, className = '' }) => {
  const adConfig: AdSlotConfig = ADSENSE_CONFIG.slots[slotKey];
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ADSENSE_CONFIG.enabled && !ADSENSE_CONFIG.testMode) {
      try {
        // @ts-expect-error - Google AdSense window variable
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.warn('AdSense script error:', err);
      }
    }
  }, [slotKey]);

  // If ads are completely disabled and not in test mode, do not render anything
  if (!ADSENSE_CONFIG.enabled && !ADSENSE_CONFIG.testMode) {
    return null;
  }

  return (
    <div 
      ref={adRef}
      className={`w-full my-6 flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {/* <!-- ADSENSE SLOT: ${slotKey} --> */}
      {ADSENSE_CONFIG.enabled && !ADSENSE_CONFIG.testMode ? (
        <ins
          className="adsbygoogle block w-full text-center"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CONFIG.publisherId}
          data-ad-slot={adConfig.slotId}
          data-ad-format={adConfig.format}
          data-full-width-responsive={adConfig.responsive ? 'true' : 'false'}
        />
      ) : (
        /* Clean, non-intrusive preview container for layout testing & AdSense verification */
        <div className="w-full max-w-4xl px-4 py-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 text-center transition-all">
          <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-1">
            <span>{adConfig.label || 'Advertisement'}</span>
            <span>AdSense Slot: {slotKey}</span>
          </div>
          <div className="h-16 md:h-20 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-600">
            <span>Google AdSense placeholder — ({adConfig.format} • ID: {adConfig.slotId})</span>
          </div>
        </div>
      )}
    </div>
  );
};
