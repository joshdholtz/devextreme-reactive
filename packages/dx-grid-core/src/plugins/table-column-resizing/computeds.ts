import { TABLE_DATA_TYPE } from '../table/constants';
import { TableColumn, SpecifyWidthsFn, TableColumnsWithWidthFn } from '../../types';

const UNSET_COLUMN_WIDTH_ERROR = [
  'The "$1" column\'s width is not specified.',
  'The TableColumnResizing plugin requires that all columns have the specified width.',
].join('\n');

const specifyWidths: SpecifyWidthsFn = (tableColumns, widths, defaultColumnWidth, onAbsence) => {
  if (!widths.length) return tableColumns;
  return tableColumns
    .reduce((acc, tableColumn) => {
      if (tableColumn.type === TABLE_DATA_TYPE) {
        const columnName = tableColumn.column!.name;
        const column = widths.find(el => el.columnName === columnName);

        let width = column && column.width;
        if (width === undefined && defaultColumnWidth) {
          width = defaultColumnWidth
        }

        if (width === undefined) {
          onAbsence(columnName);
          acc.push(tableColumn);
        } else {
          acc.push({ ...tableColumn, width });
        }
      } else {
        acc.push(tableColumn);
      }
      return acc;
    }, [] as TableColumn[]);
};

export const tableColumnsWithWidths: TableColumnsWithWidthFn = (
  tableColumns, columnWidths, defaultColumnWidth
) => specifyWidths(tableColumns, columnWidths, defaultColumnWidth, (columnName) => {
  throw new Error(UNSET_COLUMN_WIDTH_ERROR.replace('$1', columnName));
});

export const tableColumnsWithDraftWidths: TableColumnsWithWidthFn = (
  tableColumns, draftColumnWidths, defaultColumnWidth,
) => specifyWidths(tableColumns, draftColumnWidths, defaultColumnWidth, () => {});
