export default function SignupPage() {
  return (
    <div className="content">
      <div className="card">
        <h2>Vendor Signup</h2>
        <p>Self-signup creates a pending vendor and user. Admin approval required before activation.</p>
        <form>
          <label>
            Vendor Name
            <input name="vendor" aria-label="Vendor name" />
          </label>
          <br />
          <label>
            Email
            <input name="email" aria-label="Email" />
          </label>
          <br />
          <label>
            Password
            <input type="password" name="password" aria-label="Password" />
          </label>
          <p className="badge status-pending">Approval required</p>
        </form>
      </div>
    </div>
  );
}
