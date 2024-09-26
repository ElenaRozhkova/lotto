import React, { useState, useEffect, useRef } from 'react'
import { useTable } from 'react-table'

export const Table = ({ columns, data: initialData }) => {
    const [data, setData] = useState(initialData);
    const [editingCell, setEditingCell] = useState(null);
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);

    useEffect(() => {
        console.log("hallo3");
        setData(initialData);
    }, [initialData]);

    const inputStyle = {
        width: '80px',
        padding: '0',
        border: isFocused ? '1px solid #ddd' : '1px solid #ccc',
        outline: 'none',
        transition: 'border 0.3s ease',
        resize: 'none',
        overflow: 'hidden',
        minHeight: '24px',
        lineHeight: '24px',
        fontSize: '16px'
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingCell]);

    const handleCellClick = (rowIndex, columnId) => {
        setEditingCell({ rowIndex, columnId });
    };

    const handleCellChange = (e, rowIndex, columnId) => {
        const newData = [...data];
        newData[rowIndex][columnId] = e.target.value;
        setData(newData);
    };

    const moveCell = (rowIndex, columnIndex, rowDelta, columnDelta) => {
        const newRowIndex = (rowIndex + rowDelta + rows.length) % rows.length;
        const newColumnIndex = (columnIndex + columnDelta + columns.length) % columns.length;
        const newColumnId = columns[newColumnIndex].accessor;
        setEditingCell({ rowIndex: newRowIndex, columnId: newColumnId });
    };

    const handleKeyDown = (e, rowIndex, columnId) => {
        const columnIndex = columns.findIndex(col => col.accessor === columnId);

        switch (e.key) {
            case 'Tab':
                e.preventDefault();
                moveCell(rowIndex, columnIndex, 0, 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                moveCell(rowIndex, columnIndex, 0, -1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                moveCell(rowIndex, columnIndex, 0, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                moveCell(rowIndex, columnIndex, -1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                moveCell(rowIndex, columnIndex, 1, 0);
                break;
        }
    };
    const rowHeight = 38.7; // Annahme: jede Zeile ist 40px hoch
    const maxHeight = (rowHeight * 10) + 'px';

    return (
        <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ overflowY: 'auto', maxHeight: maxHeight }}>
                <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ position: 'sticky', top: -1, background: '#ddd ', zIndex: 1 }}>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()} style={{
                                        border: '1px solid black',
                                        background: '#ddd',
                                        padding: '8px',
                                        minWidth: '40px'
                                    }}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, rowIndex) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td
                                            {...cell.getCellProps()}
                                            onClick={() => handleCellClick(rowIndex, cell.column.id)}
                                            style={{
                                                border: '1px solid black',
                                                padding: '8px',
                                                background: '#fff',
                                                height: '21.6px'
                                            }}
                                        >
                                            {editingCell && editingCell.rowIndex === rowIndex && editingCell.columnId === cell.column.id ? (
                                                <input
                                                    ref={inputRef}
                                                    value={cell.value}
                                                    style={inputStyle}
                                                    onFocus={handleFocus}
                                                    onChange={(e) => handleCellChange(e, rowIndex, cell.column.id)}
                                                    onKeyDown={(e) => handleKeyDown(e, rowIndex, cell.column.id)}
                                                    onBlur={() => setEditingCell(null)}
                                                />
                                            ) : (
                                                cell.render('Cell')
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};