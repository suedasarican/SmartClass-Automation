// ==============================================================
//  src/components/SinifVeriTest.jsx
//
//  Hook'un doğru çalışıp çalışmadığını test etmek için
//  geçici debug bileşeni.
//  Firebase'e bağlanıp veri gelince konsola yazdırır ve
//  ham JSON'u ekranda gösterir.
// ==============================================================

import { useSinifVerisi, useTumSiniflar } from "../hooks/useSinifVerisi";

// ---------------------------------------------------------------
//  Tek bir sınıfı dinleyen test kartı
// ---------------------------------------------------------------
function TekSinifKarti({ sinifId }) {
  const { veri, yukleniyor, hata, sonGuncelleme } = useSinifVerisi(sinifId);

  if (yukleniyor) {
    return (
      <div style={stiller.kart}>
        <p>⏳ <strong>{sinifId}</strong> için veri bekleniyor...</p>
      </div>
    );
  }

  if (hata) {
    return (
      <div style={{ ...stiller.kart, borderColor: "#ef4444" }}>
        <p>❌ Hata: {hata.message}</p>
        <p style={{ fontSize: "0.8rem", color: "#888" }}>
          Firebase bağlantısını ve Database Rules'u kontrol et.
        </p>
      </div>
    );
  }

  return (
    <div style={stiller.kart}>
      <h3>📡 Sınıf: {sinifId}</h3>

      <table style={stiller.tablo}>
        <tbody>
          <tr>
            <td>🚶 Hareket</td>
            <td>
              <span style={{
                color: veri.hareket_durumu === 1 ? "#22c55e" : "#94a3b8"
              }}>
                {veri.hareket_durumu === 1 ? "Var" : "Yok"}
              </span>
            </td>
          </tr>
          <tr>
            <td>🌡️ Sıcaklık</td>
            <td>{veri.sicaklik} °C</td>
          </tr>
          <tr>
            <td>💡 Işık</td>
            <td>{veri.isik_lux} lüx</td>
          </tr>
          <tr>
            <td>❄️ Klima</td>
            <td style={{ color: veri.klima_durumu === "ACIK" ? "#3b82f6" : "#94a3b8" }}>
              {veri.klima_durumu}
            </td>
          </tr>
          <tr>
            <td>🔆 Aydınlatma</td>
            <td style={{ color: veri.aydinlatma_durumu === "ACIK" ? "#f59e0b" : "#94a3b8" }}>
              {veri.aydinlatma_durumu}
            </td>
          </tr>
          <tr>
            <td>🕐 Zaman</td>
            <td style={{ fontSize: "0.8rem" }}>
              {veri.zaman_damgasi
                ? new Date(veri.zaman_damgasi).toLocaleString("tr-TR")
                : "—"}
            </td>
          </tr>
        </tbody>
      </table>

      {sonGuncelleme && (
        <p style={stiller.altBilgi}>
          Son güncelleme: {sonGuncelleme.toLocaleTimeString("tr-TR")}
        </p>
      )}

      {/* Debug: ham JSON */}
      <details style={{ marginTop: "0.5rem" }}>
        <summary style={{ cursor: "pointer", fontSize: "0.8rem", color: "#888" }}>
          Ham JSON verisi
        </summary>
        <pre style={stiller.json}>{JSON.stringify(veri, null, 2)}</pre>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------
//  Tüm sınıfları dinleyen özet bileşen
// ---------------------------------------------------------------
function TumSiniflarOzet() {
  const { siniflar, yukleniyor, hata } = useTumSiniflar();

  if (yukleniyor) return <p>⏳ Tüm sınıflar yükleniyor...</p>;
  if (hata)       return <p>❌ {hata.message}</p>;

  const sinifIdleri = Object.keys(siniflar);

  if (sinifIdleri.length === 0) {
    return <p>📭 Henüz hiç sınıf verisi yok.</p>;
  }

  return (
    <div>
      <h2>📊 Tüm Sınıflar ({sinifIdleri.length} adet)</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {sinifIdleri.map((id) => (
          <TekSinifKarti key={id} sinifId={id} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
//  Ana test bileşeni — App.jsx içinde kullanılır
// ---------------------------------------------------------------
export default function SinifVeriTest() {
  return (
    <div style={stiller.sarici}>
      <h1>🏫 Akıllı Sınıf — Firebase Bağlantı Testi</h1>
      <p style={{ color: "#888" }}>
        Bu ekran yalnızca geliştirme aşamasında Firebase bağlantısını
        doğrulamak için kullanılır.
      </p>

      <hr style={{ margin: "1rem 0", borderColor: "#334155" }} />

      {/* Belirli bir sınıfı doğrudan dinle */}
      <h2>🎯 Tek Sınıf Testi (A101)</h2>
      <TekSinifKarti sinifId="A101" />

      <hr style={{ margin: "1rem 0", borderColor: "#334155" }} />

      {/* Tüm sınıfları dinle */}
      <TumSiniflarOzet />
    </div>
  );
}

// ---------------------------------------------------------------
//  Satır içi stiller (henüz Tailwind yapılandırılmadan)
// ---------------------------------------------------------------
const stiller = {
  sarici: {
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "1.5rem",
    fontFamily: "system-ui, sans-serif",
    color: "#e2e8f0",
    background: "#0f172a",
    minHeight: "100vh",
  },
  kart: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "1rem 1.5rem",
    marginBottom: "1rem",
    minWidth: "260px",
  },
  tablo: {
    width: "100%",
    borderCollapse: "collapse",
  },
  altBilgi: {
    fontSize: "0.75rem",
    color: "#64748b",
    marginTop: "0.5rem",
  },
  json: {
    background: "#0f172a",
    padding: "0.75rem",
    borderRadius: "8px",
    fontSize: "0.75rem",
    overflowX: "auto",
    color: "#7dd3fc",
    marginTop: "0.5rem",
  },
};
