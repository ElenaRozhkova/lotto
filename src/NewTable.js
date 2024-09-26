import React, { useState, useEffect, useRef } from 'react'
import { useTable } from 'react-table'

export const NewTable = ({ columns, data: initialData, message }) => {
    console.log("hallo2");
    const [data, setData] = useState(initialData);
    const [editingCell, setEditingCell] = useState(null);
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);

    const getInputStyle = (columnId) => ({
        width: columnId === 'col8' ? '130px' : '60px',
        padding: '0',
        border: isFocused ? '1px solid #ddd' : '1px solid #ccc',
        outline: 'none',
        transition: 'border 0.3s ease',
        resize: 'none',
        overflow: 'hidden',
        minHeight: '24px',
        lineHeight: '24px',
        fontSize: '16px'
    });
    useEffect(() => {
        setData(initialData);

    }, [initialData]);

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
        const value = e.target.value;
        // Validierung: Nur Zahlen und leer erlaubt
        if (columnId === 'col8') {
            // Валидация для формата даты yyyy-mm-dd
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value) && value !== '') {
                message("Bitte geben Sie das Datum im Format YYYY-MM-DD ein");
                return;
            }
        } else {
            if (!/^\d*$/.test(value)) {
                message("Bitte die Zahl angegen")
                return;
            }

            if (value !== '') {
                const numValue = parseInt(value, 10);
                if (columnId < 'col6' && numValue >= 50) {
                    message("Die Zahl soll weniger als 50 sein")
                    return;
                } else if (columnId >= 'col6' && numValue >= 12) {
                    message("Die Zahl soll weniger als 12 sein")
                    return;
                }
                else message("")
            }
        }

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
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
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
                                                    type={cell.column.id === 'col8' ? 'date' : 'text'}
                                                    style={getInputStyle(cell.column.id)}
                                                    onFocus={handleFocus}
                                                    onChange={(e) => handleCellChange(e, rowIndex, cell.column.id)}
                                                    onKeyDown={(e) => handleKeyDown(e, rowIndex, cell.column.id)}
                                                    onBlur={() => setEditingCell(null)}
                                                />
                                            ) : (
                                                cell.column.id === 'col8' ? formatDate(cell.value) : cell.render('Cell')
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