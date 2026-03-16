export const supabaseGridStyles = `
  .supabase-grid {
    --ag-background-color: #141414;
    --ag-foreground-color: #ededed;
    --ag-border-color: #2a2a2a;
    --ag-secondary-border-color: #1f1f1f;
    --ag-header-background-color: #1c1c1c;
    --ag-header-foreground-color: #a0a0a0;
    --ag-odd-row-background-color: #141414;
    --ag-row-hover-color: #1c1c1c;
    --ag-selected-row-background-color: #1a2e23;
    --ag-range-selection-border-color: #3ecf8e;
    --ag-input-focus-border-color: #3ecf8e;
    --ag-checkbox-checked-color: #3ecf8e;
    --ag-font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
    --ag-font-size: 12.5px;
    --ag-row-height: 42px;
    --ag-header-height: 40px;
    --ag-cell-horizontal-padding: 16px;
    --ag-borders: solid 1px;
    --ag-border-radius: 0px;
    --ag-icon-font-color: #555;
    --ag-disabled-foreground-color: #555;
    --ag-input-border-color: #2a2a2a;
    --ag-input-background-color: #1c1c1c;
    --ag-menu-background-color: #1c1c1c;
    --ag-menu-separator-color: #2a2a2a;
    --ag-filter-tool-panel-header-color: #a0a0a0;
    --ag-pagination-button-color: #3ecf8e;
    --ag-card-shadow: 0 4px 24px rgba(0,0,0,0.6);
  }

  .supabase-grid .ag-root-wrapper {
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    overflow: hidden;
  }

  .supabase-grid .ag-header {
    border-bottom: 1px solid #2a2a2a;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-size: 11px;
  }

  .supabase-grid .ag-header-cell-text {
    color: #606060;
    font-weight: 500;
  }

  .supabase-grid .ag-header-cell:hover {
    background-color: #1f1f1f !important;
  }

  .supabase-grid .ag-row {
    border-bottom: 1px solid #1f1f1f;
    transition: background 0.1s ease;
  }

  .supabase-grid .ag-row:last-child {
    border-bottom: none;
  }

  .supabase-grid .ag-cell {
    color: #d4d4d4;
    display: flex;
    align-items: center;
  }

  .supabase-grid .ag-cell-value {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Null / empty values */
  .supabase-grid .ag-cell:empty::after,
  .supabase-grid [col-id] .ag-cell-value:empty::after {
    content: 'NULL';
    color: #3a3a3a;
    font-style: italic;
  }

  .supabase-grid .ag-paging-panel {
    border-top: 1px solid #2a2a2a;
    background: #1c1c1c;
    color: #606060;
    font-size: 12px;
    height: 44px;
    padding: 0 16px;
  }

  .supabase-grid .ag-paging-button {
    color: #3ecf8e !important;
    opacity: 0.8;
  }

  .supabase-grid .ag-paging-button:hover {
    opacity: 1;
  }

  .supabase-grid .ag-paging-button.ag-disabled {
    color: #333 !important;
    opacity: 1;
  }

  .supabase-grid .ag-overlay-loading-wrapper {
    background: rgba(14, 14, 14, 0.85);
    backdrop-filter: blur(2px);
  }

  .supabase-grid .ag-overlay-loading-center {
    color: #3ecf8e;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.05em;
    border: 1px solid #2a2a2a;
    background: #1c1c1c;
    padding: 10px 20px;
    border-radius: 6px;
  }

  .supabase-grid .ag-filter-toolpanel {
    background: #141414;
    border-left: 1px solid #2a2a2a;
  }

  .supabase-grid .ag-menu {
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  }

  .supabase-grid .ag-menu-option:hover {
    background: #1f1f1f;
  }

  .supabase-grid .ag-sort-indicator-icon {
    color: #3ecf8e;
  }

  .supabase-grid .ag-column-drag {
    cursor: grab;
  }

  .supabase-grid .ag-floating-filter-input {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    color: #ededed;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 12px;
  }

  .supabase-grid .ag-floating-filter-input:focus {
    border-color: #3ecf8e;
    outline: none;
    box-shadow: 0 0 0 2px rgba(62, 207, 142, 0.1);
  }

  .supabase-grid .ag-status-bar {
    border-top: 1px solid #2a2a2a;
    background: #1c1c1c;
    color: #555;
    font-size: 11px;
  }
`;
