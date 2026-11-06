function AdminLogin() {
  return (
    <div className="page">
      <h1>Foodiziess Admin Login</h1>

      <form>
        <input type="email" placeholder="Admin Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
}

export default AdminLogin;