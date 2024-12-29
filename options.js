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
  
  chrome.storage.sync.set({ vaultName, filePath, fileNameTemplate, template }, function() {
    alert('Settings saved successfully!');
  });
});

// Restore defaults
document.getElementById('restoreDefaults').addEventListener('click', function() {
  document.getElementById('vaultName').value = DEFAULT_VAULT_NAME;
  document.getElementById('filePath').value = DEFAULT_FILE_PATH;
  document.getElementById('fileNameTemplate').value = DEFAULT_FILE_NAME_TEMPLATE;
  document.getElementById('template').value = DEFAULT_TEMPLATE;
  alert('Default settings restored!');
});

// Load saved settings
chrome.storage.sync.get(['vaultName', 'filePath', 'fileNameTemplate', 'template'], function(data) {
  if (data.vaultName) document.getElementById('vaultName').value = data.vaultName;
  else document.getElementById('vaultName').value = DEFAULT_VAULT_NAME;
  if (data.filePath) document.getElementById('filePath').value = data.filePath;
  else document.getElementById('filePath').value = DEFAULT_FILE_PATH;
  if (data.fileNameTemplate) document.getElementById('fileNameTemplate').value = data.fileNameTemplate;
  else document.getElementById('fileNameTemplate').value = DEFAULT_FILE_NAME_TEMPLATE;
  if (data.template) document.getElementById('template').value = data.template;
  else document.getElementById('template').value = DEFAULT_TEMPLATE;
});