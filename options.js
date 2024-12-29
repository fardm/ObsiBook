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

// Restore defaults and save them immediately
document.getElementById('restoreDefaults').addEventListener('click', function() {
  // Set the default values in the form
  document.getElementById('vaultName').value = DEFAULT_VAULT_NAME;
  document.getElementById('filePath').value = DEFAULT_FILE_PATH;
  document.getElementById('fileNameTemplate').value = DEFAULT_FILE_NAME_TEMPLATE;
  document.getElementById('template').value = DEFAULT_TEMPLATE;

  // Save the default values to storage
  chrome.storage.sync.set({
    vaultName: DEFAULT_VAULT_NAME,
    filePath: DEFAULT_FILE_PATH,
    fileNameTemplate: DEFAULT_FILE_NAME_TEMPLATE,
    template: DEFAULT_TEMPLATE
  }, function() {
    alert('Default settings restored and saved successfully!');
  });
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