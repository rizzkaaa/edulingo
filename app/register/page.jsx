import Link from "next/link";

export default function RegisterPage() {
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

            <Link href="/login" className="tab-link">
              MASUK
            </Link>

            <Link href="/register" className="tab-link active-tab">
              DAFTAR
            </Link>

          </div>

          <div className="form">

            <label>Nama Lengkap</label>
            <input type="text" placeholder="Masukkan nama lengkap" />

            <label>Email</label>
            <input type="email" placeholder="nama@email.com" />

            <label>Password</label>
            <input type="password" placeholder="Buat password" />

            <label>Konfirmasi Password</label>
            <input type="password" placeholder="Ulangi password" />

            <button className="login-btn">
              DAFTAR SEKARANG
            </button>

            <p className="bottom-text">
              Sudah punya akun?
              <Link href="/login">
                <b> Masuk sekarang</b>
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}