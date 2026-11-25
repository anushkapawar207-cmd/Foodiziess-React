
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(savedUsers);
  }, []);

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    const updatedUsers = users.filter(
      (user) => user.id !== id
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Clear the user's active session if this account was logged in
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    if (
      currentUser &&
      currentUser.id === id
    ) {
      localStorage.removeItem("currentUser");
    }
  }

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Foodiziess 💜</h2>
        <p className="sidebar-label">ADMIN PANEL</p>

        <nav>
          <Link to="/admin/dashboard">◈ Overview</Link>
          <Link to="/admin/recipes">◈ Manage Recipes</Link>
          <Link to="/admin/users" className="active">
            ◈ Manage Users
          </Link>
          <Link to="/admin/analytics">◈ Analytics</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">

        <div className="admin-heading">
          <div>
            <h1>Manage Users</h1>
            <p>View and manage your Foodiziess community.</p>
          </div>
        </div>

        {/* User Statistics */}
        <div className="dashboard-cards">
          <div className="dashboard-stat">
            <span>👥</span>
            <p>Total Registered Users</p>
            <h2>{users.length}</h2>
          </div>

          <div className="dashboard-stat">
            <span>🔍</span>
            <p>Matching Users</p>
            <h2>{filteredUsers.length}</h2>
          </div>
        </div>

        {/* User Table */}
        <section className="recipe-table-section">

          <div className="recipe-table-heading">
            <h2>Registered Users</h2>
            <span>{users.length} Users</span>
          </div>

          <input
            type="text"
            className="user-search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {filteredUsers.length === 0 ? (
            <div className="empty-users">
              <span>👤</span>
              <h3>No users found</h3>
              <p>
                {users.length === 0
                  ? "Registered accounts will appear here."
                  : "Try searching with another name or email."}
              </p>
            </div>
          ) : (
            <div className="recipe-table-wrapper">
              <table className="recipe-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-user-name">
                          <div className="user-avatar">
                            {(user.name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <strong>{user.name}</strong>
                        </div>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Not available"}
                      </td>

                      <td>
                        <button
                          className="delete-user-btn"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Users;
