export default function ResetPasswordPage() {
  return (
    <div className="content">
      <div className="card">
        <h2>Reset password</h2>
        <p>Token-based reset with Argon/Bcrypt hashing enforced.</p>
        <form>
          <label>
            New password
            <input type="password" name="password" aria-label="New password" />
          </label>
        </form>
      </div>
    </div>
  );
}
