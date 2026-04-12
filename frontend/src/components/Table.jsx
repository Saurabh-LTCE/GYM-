import React from 'react';

/**
 * Simple reusable table.
 *
 * @param {object} props
 * @param {{ key: string, header: string, render?: (row: object) => React.ReactNode }[]} props.columns
 * @param {object[]} props.data
 * @param {string} [props.rowKey='_id']
 * @param {string} [props.emptyMessage]
 */
const Table = ({ columns, data, rowKey = '_id', emptyMessage = 'No rows to display.' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="table-empty" role="status">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table brutal-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[rowKey] ?? JSON.stringify(row)}>
              {columns.map((col) => (
                <td key={`${row[rowKey]}-${col.key}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
