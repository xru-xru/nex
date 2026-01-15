export const getHiddenColumns = (tableId: string): string[] => {
  if (!tableId) return [];
  const stateJson = localStorage.getItem('table_' + tableId);
  if (!stateJson) return [];
  const state = JSON.parse(stateJson);
  return state;
};

export const getInitialHiddenColumnsByUser = (
  key: string
): { hiddenColumns: string[]; stickyColumns: string[]; columnWidths: any } => {
  const storedData = localStorage.getItem(key);
  try {
    return JSON.parse(storedData) || { hiddenColumns: [], stickyColumns: [], columnWidths: [] };
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    return { hiddenColumns: [], stickyColumns: [], columnWidths: [] }; // Fallback to default if parsing fails
  }
};
