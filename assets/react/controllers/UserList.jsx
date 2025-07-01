import React, { useState, useEffect } from 'react';

export default function (props) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Use the full URL to ensure we're connecting to the right endpoint
                const response = await fetch('http://localhost:8080/api/users?page=1', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('API response:', data);
                // Ensure data is an array before setting state
                const usersArray = Array.isArray(data) ? data : [];
                console.log('Users array:', usersArray);
                setUsers(usersArray);
                setFilteredUsers(usersArray);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        // Ensure users is an array
        if (!Array.isArray(users)) {
            console.warn('Users is not an array:', users);
            setFilteredUsers([]);
            return;
        }

        // If no filter text is provided, show all users
        if (!filterText.trim()) {
            // Just sort the users without filtering
            try {
                const sorted = [...users].sort((a, b) => {
                    if (!a[sortField] || !b[sortField]) {
                        return 0;
                    }
                    const aValue = a[sortField].toLowerCase();
                    const bValue = b[sortField].toLowerCase();

                    if (sortDirection === 'asc') {
                        return aValue.localeCompare(bValue);
                    } else {
                        return bValue.localeCompare(aValue);
                    }
                });
                setFilteredUsers(sorted);
            } catch (error) {
                console.error('Error sorting users:', error);
                setFilteredUsers(users);
            }
            return;
        }

        // Filter users based on filterText
        const filtered = users.filter(user =>
            user && typeof user === 'object' && (
                (user.name && user.name.toLowerCase().includes(filterText.toLowerCase())) ||
                (user.username && user.username.toLowerCase().includes(filterText.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(filterText.toLowerCase()))
            )
        );

        // Sort filtered users
        try {
            const sorted = [...filtered].sort((a, b) => {
                if (!a[sortField] || !b[sortField]) {
                    return 0;
                }
                const aValue = a[sortField].toLowerCase();
                const bValue = b[sortField].toLowerCase();

                if (sortDirection === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            });
            setFilteredUsers(sorted);
        } catch (error) {
            console.error('Error sorting users:', error);
            setFilteredUsers(filtered);
        }
    }, [filterText, sortField, sortDirection, users]);

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleClearSearch = () => {
        setFilterText('');
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="user-list-container mb-10">
            <div className="mb-4 relative">
                <input
                    type="text"
                    placeholder="Filter by name, username or email"
                    className="px-4 py-2 border rounded w-full"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
                {filterText && (
                    <button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={handleClearSearch}
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            <table className="min-w-full bg-white border border-gray-200 table-auto">
                <thead>
                    <tr>
                        <th
                            className="px-4 py-2 border cursor-pointer"
                            onClick={() => handleSort('name')}
                        >
                            Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            className="px-4 py-2 border cursor-pointer"
                            onClick={() => handleSort('username')}
                        >
                            Username {sortField === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            className="px-4 py-2 border cursor-pointer"
                            onClick={() => handleSort('email')}
                        >
                            Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="px-4 py-2 border">Address</th>
                        <th className="px-4 py-2 border">Phone</th>
                        <th className="px-4 py-2 border">Website</th>
                        <th className="px-4 py-2 border">Company</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(filteredUsers) ? filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td className="px-4 py-2 border">{user.name}</td>
                            <td className="px-4 py-2 border">{user.username}</td>
                            <td className="px-4 py-2 border">{user.email}</td>
                            <td className="px-4 py-2 border">
                                <div>
                                    <p><span className="font-bold text-gray-600">Street:</span> {user.address.street}</p>
                                    <p><span className="font-bold text-gray-600">Suite:</span> {user.address.suite}</p>
                                    <p><span className="font-bold text-gray-600">City:</span> {user.address.city}</p>
                                    <p><span className="font-bold text-gray-600">Zip Code:</span> {user.address.zipCode}</p>
                                </div>
                            </td>
                            <td className="px-4 py-2 border">{user.phone}</td>
                            <td className="px-4 py-2 border">{user.website}</td>
                            <td className="px-4 py-2 border">{user.company.name}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="px-4 py-2 border text-center">
                                Error: Unable to display users. Please check console for details.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {Array.isArray(filteredUsers) && filteredUsers.length === 0 && (
                <div className="text-center py-4">No users found matching your filter criteria.</div>
            )}
        </div>
    );
}
