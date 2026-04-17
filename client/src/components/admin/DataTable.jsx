export default function DataTable({ columns, data, loading, emptyMessage = 'No data available' }) {
    if (loading) {
        return (
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                {columns.map((col) => (
                                    <th key={col.key} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, rowIdx) => (
                                <tr key={rowIdx} className="border-b border-gray-200 hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4">
                                            <div className="skeleton h-4 rounded"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="card p-12 text-center">
                <p className="text-gray-600 font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {columns.map((col) => (
                                <th key={col.key} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={row._id || idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
