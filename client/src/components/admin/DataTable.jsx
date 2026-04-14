export default function DataTable({ columns, data, loading, emptyMessage = 'No data available' }) {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            {columns.map((col) => (
                                <th key={col.key} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, rowIdx) => (
                            <tr key={rowIdx} className="border-b hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        {columns.map((col) => (
                            <th key={col.key} className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={row._id || idx} className={`border-b hover:bg-gray-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
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
    );
}
