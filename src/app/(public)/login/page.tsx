export default function LoginPage() {
  return (
    <div className="content">
      <div className="card">
        <h2>Login</h2>
        <p>Role-based authentication with CSRF-protected sessions and rate limiting.</p>
        <form>
          <label>
            Email
            <input name="email" aria-label="Email" />
          </label>
          <br />
          <label>
            Password
            <input type="password" name="password" aria-label="Password" />
          </label>
          <p className="badge status-active">Secure session cookie</p>
        </form>
      </div>
    </div>
  );
}
