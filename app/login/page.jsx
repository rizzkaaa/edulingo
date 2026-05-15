import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container">

      <div className="left">

        <div className="logo">
          EduLingo
        </div>

        <div className="circle"></div>
        <div className="square"></div>
        <div className="small-square"></div>
        <div className="small-circle"></div>

        <div className="content">
          <h1>
            Learn English.
            <br />
            No Excuses.
          </h1>

          <div className="line"></div>

          <p>
            Master the English language with interactive lessons,
            real conversations, and personalized learning paths.
          </p>

          <div className="tags">
            <button>📖 Structure</button>
            <button>🎧 Listening</button>
            <button>📝 Reading</button>
          </div>
        </div>

      </div>

      <div className="right">

        <div className="auth-box">

          <div className="tab">

            <Link href="/login" className="tab-link active-tab">
              MASUK
            </Link>

            <Link href="/register" className="tab-link">
              DAFTAR
            </Link>

          </div>

          <div className="form">

            <label>Email</label>
            <input type="email" placeholder="nama@email.com" />

            <label>Password</label>
            <input type="password" placeholder="Masukkan password" />

            <a href="#">Lupa password?</a>

            <button className="login-btn">
              MASUK
            </button>

            <div className="divider">
              <span></span>
              atau
              <span></span>
            </div>

            <button className="google-btn">
              Lanjutkan dengan Google
            </button>

            <p className="bottom-text">
              Belum punya akun?
              <Link href="/register">
                <b> Daftar sekarang</b>
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}