export default function ForgotPasswordPage() {
  return (
    <div className="content">
      <div className="card">
        <h2>Forgot password</h2>
        <p>Rate limited token flow with email verification.</p>
        <form>
          <label>
            Email
            <input name="email" aria-label="Email" />
          </label>
          <p className="badge">Reset link will be emailed.</p>
        </form>
      </div>
    </div>
  );
}
