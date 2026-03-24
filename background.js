chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    const { musicTabId, duckVolume = 20, isEnabled = true, isDucking = false } = 
      await chrome.storage.local.get(['musicTabId', 'duckVolume', 'isEnabled', 'isDucking']);
    
    if (musicTabId === undefined || !isEnabled) return;

    // EDGE CASE 1: The Page Refresh Blast
    // If the music tab refreshes while we are supposed to be ducking, re-apply the duck!
    if (tabId === musicTabId && changeInfo.status === 'complete' && isDucking) {
      console.log("Music tab reloaded. Re-applying duck...");
      await fadeVolume(musicTabId, true, duckVolume / 100);
      return;
    }

    // Standard trigger: Only proceed if a tab's audio state changed
    if (changeInfo.audible === undefined) return;
    
    // Ignore if the music tab itself is making noise
    if (tabId === musicTabId) return;
    
    // Ask Chrome right now what is playing
    const allTabs = await chrome.tabs.query({ audible: true });
    const otherNoisyTabs = allTabs.filter(t => t.id !== musicTabId);
    
    const shouldDuck = otherNoisyTabs.length > 0;
    const duckLevel = duckVolume / 100;
    
    console.log(`${shouldDuck ? 'Ducking' : 'Restoring'} music...`);
    await chrome.storage.local.set({ isDucking: shouldDuck });
    
    await fadeVolume(musicTabId, shouldDuck, duckLevel);
    
  } catch (err) {
    console.error("Error in tab listener:", err);
  }
});

// Clean up if the music tab is closed
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const { musicTabId } = await chrome.storage.local.get('musicTabId');
  if (tabId === musicTabId) {
    await chrome.storage.local.remove(['musicTabId', 'musicTabTitle', 'isDucking']);
  }
});

// The Bulletproof Fade Algorithm
async function fadeVolume(targetTabId, isDucking, duckLevel) {
  try {
    await chrome.tabs.get(targetTabId);
    
    await chrome.scripting.executeScript({
      target: { tabId: targetTabId },
      func: (ducking, duckLimit) => {
        // EDGE CASE 2: Find ALL media elements, not just the first one
        const medias = document.querySelectorAll('video, audio');
        
        medias.forEach(media => {
          // EDGE CASE 3: Clean up overlapping intervals specifically for this element
          if (media.duckytabsFadeInterval) clearInterval(media.duckytabsFadeInterval);
          
          let targetVol;

          if (ducking) {
            // Save original volume (only if we haven't already to prevent glitching)
            if (media.dataset.savedVol === undefined) {
              media.dataset.savedVol = media.volume;
            }
            
            targetVol = duckLimit;
            // If they already had it lower than the duck limit, leave it low
            if (parseFloat(media.dataset.savedVol) < duckLimit) {
              targetVol = parseFloat(media.dataset.savedVol);
            }
            
            // Save what we EXPECT to duck it to for the override check
            media.dataset.expectedDuckedVol = targetVol;

          } else {
            // RESTORING
            let saved = media.dataset.savedVol !== undefined ? parseFloat(media.dataset.savedVol) : null;
            let expectedDucked = media.dataset.expectedDuckedVol !== undefined ? parseFloat(media.dataset.expectedDuckedVol) : null;

            // EDGE CASE 4: The Smart Override
            if (expectedDucked !== null && Math.abs(media.volume - expectedDucked) > 0.05) {
              console.log("DuckyTabs: User manually adjusted volume. Aborting auto-restore.");
              delete media.dataset.savedVol;
              delete media.dataset.expectedDuckedVol;
              return; 
            }

            // Restore to the saved volume, or 1.0 if memory failed
            targetVol = saved !== null ? saved : 1.0;
            delete media.dataset.savedVol;
            delete media.dataset.expectedDuckedVol;
          }

          // The Smooth Fade Loop
          const startVol = media.volume;
          const duration = 800; 
          const steps = 40; 
          const stepTime = duration / steps;
          const volStep = (targetVol - startVol) / steps;
          let currentStep = 0;
          
          media.duckytabsFadeInterval = setInterval(() => {
            currentStep++;
            if (currentStep >= steps) {
              media.volume = Math.max(0, Math.min(1, targetVol));
              clearInterval(media.duckytabsFadeInterval);
            } else {
              const newVol = startVol + (volStep * currentStep);
              media.volume = Math.max(0, Math.min(1, newVol));
            }
          }, stepTime);
        });
      },
      args: [isDucking, duckLevel]
    });
    
  } catch (err) {
    if (err.message.includes("No tab with id")) {
      await chrome.storage.local.remove(['musicTabId', 'musicTabTitle', 'isDucking']);
    }
  }
}

// Popup listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'testDuck') {
    chrome.storage.local.get(['musicTabId', 'duckVolume'], async ({ musicTabId, duckVolume = 20 }) => {
      if (musicTabId) {
        await fadeVolume(musicTabId, true, duckVolume / 100);
        setTimeout(async () => {
          await fadeVolume(musicTabId, false, duckVolume / 100);
        }, 2000);
      }
    });
  }
  
  if (message.action === 'restoreVolume') {
      fadeVolume(message.tabId, false, 0); 
  }
  return true;
});