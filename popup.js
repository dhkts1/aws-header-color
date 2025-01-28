document.addEventListener('DOMContentLoaded', initPopup);

function initPopup() {
  const mappingBody = document.getElementById('mappingBody');
  const addButton = document.getElementById('addButton');
  const saveButton = document.getElementById('saveButton');
  const newAccountIdEl = document.getElementById('newAccountId');
  const newColorEl = document.getElementById('newColor');
  const saveStatusEl = document.getElementById('saveStatus');

  // Load stored mappings
  chrome.storage.sync.get({ accountColors: {} }, (result) => {
    const accountColors = result.accountColors;
    for (const [accountId, color] of Object.entries(accountColors)) {
      addTableRow(accountId, color);
    }
  });

  // Add button handler
  addButton.addEventListener('click', () => {
    const accountId = newAccountIdEl.value.trim();
    const color = newColorEl.value.trim();
    if (accountId) {
      addTableRow(accountId, color);
      newAccountIdEl.value = '';
    }
  });

  // Save button handler
  saveButton.addEventListener('click', () => {
    const tableRows = mappingBody.querySelectorAll('.account-row');
    const newMappings = {};

    tableRows.forEach(row => {
      const acctInput = row.querySelector('.acct-id');
      const colorInput = row.querySelector('.acct-color');
      const accountId = acctInput.value.trim();
      const color = colorInput.value;
      if (accountId) {
        newMappings[accountId] = color;
      }
    });

    chrome.storage.sync.set({ accountColors: newMappings }, () => {
      saveStatusEl.textContent = 'Saved!';
      setTimeout(() => {
        saveStatusEl.textContent = '';
      }, 1500);
    });
  });
}

function addTableRow(accountId, color) {
  const mappingBody = document.getElementById('mappingBody');
  const row = document.createElement('tr');
  row.className = 'account-row';
  row.innerHTML = `
    <td><input type="text" class="acct-id" value="${accountId}" size="15" /></td>
    <td><input type="color" class="acct-color" value="${color || '#ffeb3b'}" /></td>
    <td><button class="remove-btn">Remove</button></td>
  `;

  row.querySelector('.remove-btn').addEventListener('click', () => {
    row.remove();
  });

  mappingBody.appendChild(row);
} 