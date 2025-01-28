/******************************************************
 * options.js
 * Logic for the AWS Header Colorizer Options page.
 ******************************************************/

document.addEventListener('DOMContentLoaded', initOptions);

function initOptions() {
  const mappingBody = document.getElementById('mappingBody');
  const addButton = document.getElementById('addButton');
  const saveButton = document.getElementById('saveButton');
  const newAccountIdEl = document.getElementById('newAccountId');
  const newColorEl = document.getElementById('newColor');
  const saveStatusEl = document.getElementById('saveStatus');

  // 1) Load stored mappings from chrome.storage
  chrome.storage.sync.get({ accountColors: {} }, (result) => {
    const accountColors = result.accountColors;
    // For each accountId in the stored object, build a row
    for (const [accountId, color] of Object.entries(accountColors)) {
      addTableRow(accountId, color);
    }
  });

  // 2) “Add” button handler: add a row in the table
  addButton.addEventListener('click', () => {
    const accountId = newAccountIdEl.value.trim();
    const color = newColorEl.value.trim();
    if (accountId) {
      addTableRow(accountId, color);
      // Clear input fields
      newAccountIdEl.value = '';
    }
  });

  // 3) “Save All Changes” button -> gather all rows → store
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
      console.log(newMappings);
    });

    // Write to storage
    chrome.storage.sync.set({ accountColors: newMappings }, () => {
      saveStatusEl.textContent = 'Saved!';
      setTimeout(() => {
        saveStatusEl.textContent = '';
      }, 1500);
    });
  });
}

/** Helper function that appends a row to the table for a single account+color. */
function addTableRow(accountId, color) {
  const mappingBody = document.getElementById('mappingBody');

  // Create new row
  const row = document.createElement('tr');
  row.className = 'account-row';
  row.innerHTML = `
    <td>
      <input type="text" class="acct-id" value="${accountId}" size="15" />
    </td>
    <td>
      <input type="color" class="acct-color" value="${color || '#ffeb3b'}" />
    </td>
    <td>
      <button class="remove-btn">Remove</button>
    </td>
  `;

  // “Remove” button handler
  row.querySelector('.remove-btn').addEventListener('click', () => {
    row.remove();
  });

  mappingBody.appendChild(row);
}
