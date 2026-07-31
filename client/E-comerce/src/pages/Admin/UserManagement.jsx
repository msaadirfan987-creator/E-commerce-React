import React, { useState, useEffect } from 'react';
import { Search, UserMinus, UserCheck, ShieldAlert, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(data.users || []);
      } else {
        setError(data.message || 'Failed to load user directory.');
      }
    } catch (err) {
      setError('Connection issue reaching admin endpoints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleToggleBlock = async (userId, currentBlockedState) => {
    setError('');
    setSuccess('');
    const targetState = !currentBlockedState;

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: targetState }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(data.message || 'User status updated.');
        setTimeout(() => setSuccess(''), 2000);
        
        // Refresh local list state
        setUsers(users.map(u => u._id === userId ? { 
          ...u, 
          isBlocked: targetState, 
          sellerStatus: u.role === 'seller' ? (targetState ? 'Suspended' : 'Approved') : u.sellerStatus 
        } : u));
      } else {
        alert(data.message || 'Failed to update user status.');
      }
    } catch (err) {
      alert('Error updating user block status.');
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    const targetRole = currentRole === 'customer' ? 'seller' : 'customer';
    const confirmChange = window.confirm(`Are you sure you want to change this user's role to '${targetRole}'?`);
    if (!confirmChange) return;

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('User role changed successfully.');
        setTimeout(() => setSuccess(''), 2000);
        
        // Refresh local state list
        setUsers(users.map(u => u._id === userId ? { 
          ...u, 
          role: targetRole,
          sellerStatus: targetRole === 'seller' ? 'Approved' : undefined
        } : u));
      } else {
        alert(data.message || 'Failed to change role.');
      }
    } catch (err) {
      alert('Error modifying user role.');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    const confirmDelete = window.confirm(`WARNING: Are you sure you want to permanently delete "${name}"? If they are a seller, all their listed products will also be deleted. This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('User deleted successfully.');
        setTimeout(() => setSuccess(''), 2000);
        // Exclude from local list
        setUsers(users.filter(u => u._id !== userId));
      } else {
        alert(data.message || 'Failed to delete user.');
      }
    } catch (err) {
      alert('Error executing user deletion.');
    }
  };

  // Filter list
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' ||
                          (statusFilter === 'Suspended' && u.isBlocked) ||
                          (statusFilter === 'Active' && !u.isBlocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">User Directory</h2>
        <p className="text-xs text-slate-400 font-bold">Audit platform customer registrations, manage merchant statuses, and change roles.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg animate-fadeIn">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-650 text-xs font-bold p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        
        {/* Search */}
        <div className="w-full sm:max-w-xs flex items-center rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 focus-within:border-slate-400">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 text-xs font-semibold bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-slate-400">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-slate-200 bg-white px-2 py-1 rounded text-slate-650 font-bold focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="customer">Buyer (Customer)</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 bg-white px-2 py-1 rounded text-slate-650 font-bold focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

        </div>

      </div>

      {/* Users table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">User Details</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Registration Date</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Last Login</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Account Status</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-xs font-bold text-slate-400 animate-pulse">
                    Loading users directories...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* User info */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{userItem.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{userItem.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4 text-xs font-bold capitalize text-slate-650">
                      {userItem.role === 'customer' ? 'Buyer' : userItem.role}
                    </td>

                    {/* Registration */}
                    <td className="py-3 px-4 text-[11px] font-semibold text-slate-500">
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>

                    {/* Last Login */}
                    <td className="py-3 px-4 text-[11px] font-semibold text-slate-500">
                      {userItem.lastLogin ? new Date(userItem.lastLogin).toLocaleString() : 'Never logged in'}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        userItem.isBlocked 
                          ? 'bg-rose-50 text-rose-600' 
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {userItem.isBlocked ? 'Suspended' : 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-xs font-bold">
                        <button
                          onClick={() => handleToggleBlock(userItem._id, userItem.isBlocked)}
                          className={`text-xs ${userItem.isBlocked ? 'text-emerald-600 hover:text-emerald-700' : 'text-amber-600 hover:text-amber-700'} cursor-pointer`}
                        >
                          {userItem.isBlocked ? 'Activate' : 'Suspend'}
                        </button>
                        
                        <button
                          onClick={() => handleChangeRole(userItem._id, userItem.role)}
                          className="text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          Change Role
                        </button>

                        <button
                          onClick={() => handleDeleteUser(userItem._id, userItem.fullName)}
                          className="text-rose-550 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-xs font-bold text-slate-400">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default UserManagement;
