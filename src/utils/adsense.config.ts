/**
 * Google AdSense Configuration
 * 
 * To enable real Google AdSense ads:
 * 1. Set `enabled: true` below
 * 2. Fill in your valid `client` ID (e.g., 'ca-pub-XXXXXXXXXXXXXXXX')
 * 3. Fill in your respective ad slot IDs for each placement
 * 4. Add the Google AdSense script tag to index.html with your publisher ID
 */

export interface AdSlotConfig {
  slotId: string;
  format: 'auto' | 'horizontal' | 'rectangle' | 'vertical';
  responsive: boolean;
  label?: string;
}

export interface AdSenseSettings {
  enabled: boolean;
  publisherId: string;
  testMode: boolean; // Shows sleek developer placeholders when true and ads are enabled/testing
  slots: {
    heroBelow: AdSlotConfig;
    toolBelow: AdSlotConfig;
    contentMid: AdSlotConfig;
    footerAbove: AdSlotConfig;
    sidebar: AdSlotConfig;
  };
}

export const ADSENSE_CONFIG: AdSenseSettings = {
  // Set to TRUE when you are ready to serve AdSense ads
  enabled: false,
  
  // Replace with your Google AdSense Publisher ID
  publisherId: 'ca-pub-9418145553394789',
  
  // When true, renders a clean preview box indicating the active ad slot
  testMode: true,
  
  slots: {
    // 1. Horizontal banner placed below the Hero upload zone
    heroBelow: {
      slotId: '0000000001',
      format: 'horizontal',
      responsive: true,
      label: 'Sponsored'
    },
    // 2. Banner placed below conversion result actions
    toolBelow: {
      slotId: '0000000002',
      format: 'horizontal',
      responsive: true,
      label: 'Advertisement'
    },
    // 3. In-feed banner between content & FAQ sections
    contentMid: {
      slotId: '0000000003',
      format: 'rectangle',
      responsive: true,
      label: 'Sponsored'
    },
    // 4. Banner above footer
    footerAbove: {
      slotId: '0000000004',
      format: 'horizontal',
      responsive: true,
      label: 'Advertisement'
    },
    // 5. Desktop sidebar banner
    sidebar: {
      slotId: '0000000005',
      format: 'vertical',
      responsive: true,
      label: 'Sponsored'
    },
  },
};
