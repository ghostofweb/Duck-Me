document.addEventListener('DOMContentLoaded', async () => {
  const duckVol = document.getElementById('duckVol');
  const duckVal = document.getElementById('duckVal');
  const setMusicTabBtn = document.getElementById('setMusicTab');
  const clearMusicTabBtn = document.getElementById('clearMusicTab');
  const tabTitleElement = document.getElementById('tabTitle');
  const duckingIndicator = document.getElementById('duckingIndicator');
  const testDuckBtn = document.getElementById('testDuck');
  const toggleSwitch = document.getElementById('toggleSwitch');
  const headerDot = document.getElementById('headerDot');
  const toast = document.getElementById('toast');
  
  // Load saved settings (REMOVED normalVolume)
  const data = await chrome.storage.local.get([
    'duckVolume', 
    'musicTabId', 
    'musicTabTitle',
    'isDucking',
    'isEnabled'
  ]);
  
  // Initialize slider
  if (data.duckVolume !== undefined) {
    duckVol.value = data.duckVolume;
    duckVal.innerText = `${data.duckVolume}%`;
  }
  
  // Initialize toggle
  if (data.isEnabled !== undefined) {
    toggleSwitch.checked = data.isEnabled;
    headerDot.className = data.isEnabled ? 'status-dot' : 'status-dot inactive';
  } else {
    toggleSwitch.checked = true;
    chrome.storage.local.set({ isEnabled: true });
  }
  
  // Update UI on load
  updateMusicTabUI(data.musicTabId, data.musicTabTitle, data.isDucking);
  
  // Slider listener
  duckVol.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    duckVal.innerText = `${value}%`;
    chrome.storage.local.set({ duckVolume: value });
  });
  
  // Toggle Switch listener
  toggleSwitch.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    chrome.storage.local.set({ isEnabled });
    headerDot.className = isEnabled ? 'status-dot' : 'status-dot inactive';
    
    // If turning off, instantly tell background script to restore volume
    if (!isEnabled) {
      chrome.storage.local.get('musicTabId', ({ musicTabId }) => {
        if (musicTabId) {
          // We don't need to pass a volume number. Background script handles the memory!
          chrome.runtime.sendMessage({ action: 'restoreVolume', tabId: musicTabId });
        }
      });
    }
  });
  
  // Bind Tab listener
  setMusicTabBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return showToast('Error: No active tab found');
      
      await chrome.storage.local.set({ 
        musicTabId: tab.id,
        musicTabTitle: tab.title || 'Unknown Tab'
      });
      
      updateMusicTabUI(tab.id, tab.title);
      showToast('Tab bound successfully');
    } catch (err) {
      console.error(err);
      showToast('Error binding tab');
    }
  });
  
  // Clear Tab listener
  clearMusicTabBtn.addEventListener('click', async () => {
    await chrome.storage.local.remove(['musicTabId', 'musicTabTitle', 'isDucking']);
    updateMusicTabUI(null, null, false);
    showToast('Tab unbound');
  });
  
  // Test Button listener
  testDuckBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'testDuck' });
    showToast('Previewing transition...');
  });
  
  // Real-time sync with background script
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.isDucking) {
      duckingIndicator.style.display = changes.isDucking.newValue ? 'flex' : 'none';
    }
    if (changes.musicTabId || changes.musicTabTitle) {
      chrome.storage.local.get(['musicTabId', 'musicTabTitle', 'isDucking'], (newData) => {
        updateMusicTabUI(newData.musicTabId, newData.musicTabTitle, newData.isDucking);
      });
    }
  });
  
  // UI Update Helper
  function updateMusicTabUI(tabId, tabTitle, isDucking) {
    if (tabId) {
      tabTitleElement.innerText = truncateText(tabTitle || 'Unknown Tab', 45);
      tabTitleElement.className = 'tab-title';
      setMusicTabBtn.innerText = 'Rebind Tab';
      setMusicTabBtn.className = 'btn-secondary';
      clearMusicTabBtn.style.display = 'block';
      testDuckBtn.style.display = 'block';
    } else {
      tabTitleElement.innerText = 'No tab selected';
      tabTitleElement.className = 'tab-title empty';
      setMusicTabBtn.innerText = 'Bind Current Tab';
      setMusicTabBtn.className = 'btn-primary';
      clearMusicTabBtn.style.display = 'none';
      testDuckBtn.style.display = 'none';
    }
    duckingIndicator.style.display = isDucking ? 'flex' : 'none';
  }
  
  // Toast Notification Helper
  function showToast(message) {
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }
  
  // Text Truncator Helper
  function truncateText(text, maxLength) {
    return text.length <= maxLength ? text : text.substring(0, maxLength - 3) + '...';
  }
});