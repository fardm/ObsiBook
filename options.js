// Default values
const DEFAULT_VAULT_NAME = 'my vault';
const DEFAULT_FILE_PATH = '';
const DEFAULT_FILE_NAME_TEMPLATE = '{{title}}';
const DEFAULT_TEMPLATE = `---
title: {{title}}
author: {{author}}
pages: {{pages}}
cover: {{cover}}
tags:
  - Book
---`;

// Save settings
document.getElementById('templateForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const vaultName = document.getElementById('vaultName').value;
  const filePath = document.getElementById('filePath').value;
  const fileNameTemplate = document.getElementById('fileNameTemplate').value;
  const template = document.getElementById('template').value;
  const saveMode = document.querySelector('input[name="saveMode"]:checked').value;

  chrome.storage.sync.set({ vaultName, filePath, fileNameTemplate, template, saveMode }, function() {
    alert('Settings saved successfully!');
  });
});

// Restore defaults
document.getElementById('restoreDefaults').addEventListener('click', function() {
  document.getElementById('vaultName').value = DEFAULT_VAULT_NAME;
  document.getElementById('filePath').value = DEFAULT_FILE_PATH;
  document.getElementById('fileNameTemplate').value = DEFAULT_FILE_NAME_TEMPLATE;
  document.getElementById('template').value = DEFAULT_TEMPLATE;
  document.getElementById('saveModeObsidian').checked = true;
  document.getElementById('vaultName').disabled = false;
  document.getElementById('filePath').disabled = false;
});

// Load saved settings
chrome.storage.sync.get(['vaultName', 'filePath', 'fileNameTemplate', 'template', 'saveMode'], function(data) {
  if (data.vaultName) document.getElementById('vaultName').value = data.vaultName;
  else document.getElementById('vaultName').value = DEFAULT_VAULT_NAME;

  if (data.filePath) document.getElementById('filePath').value = data.filePath;
  else document.getElementById('filePath').value = DEFAULT_FILE_PATH;

  if (data.fileNameTemplate) document.getElementById('fileNameTemplate').value = data.fileNameTemplate;
  else document.getElementById('fileNameTemplate').value = DEFAULT_FILE_NAME_TEMPLATE;

  if (data.template) document.getElementById('template').value = data.template;
  else document.getElementById('template').value = DEFAULT_TEMPLATE;

  // Set initial state of save mode
  if (data.saveMode === 'download') {
    document.getElementById('saveModeDownload').checked = true;
    document.getElementById('vaultName').disabled = true;
    document.getElementById('filePath').disabled = true;
  } else {
    document.getElementById('saveModeObsidian').checked = true;
    document.getElementById('vaultName').disabled = false;
    document.getElementById('filePath').disabled = false;
  }
});

// Add event listeners to radio buttons to toggle fields
document.getElementById('saveModeObsidian').addEventListener('change', function() {
  document.getElementById('vaultName').disabled = !this.checked;
  document.getElementById('filePath').disabled = !this.checked;
});

document.getElementById('saveModeDownload').addEventListener('change', function() {
  document.getElementById('vaultName').disabled = this.checked;
  document.getElementById('filePath').disabled = this.checked;
});

// Add copy to clipboard functionality
document.querySelectorAll('td[data-copy]').forEach(td => {
  td.addEventListener('click', () => {
    const textToCopy = td.getAttribute('data-copy');
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Change the icon from copy to check
      const icon = td.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-copy'); // Remove the copy icon
        icon.classList.add('fa-check');  // Add the check icon
      }

      // Revert the icon back to copy after 2 seconds
      setTimeout(() => {
        if (icon) {
          icon.classList.remove('fa-check'); // Remove the check icon
          icon.classList.add('fa-copy');    // Add the copy icon back
        }
      }, 2000); // 2 seconds delay
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });
});