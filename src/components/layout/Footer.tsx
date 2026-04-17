export function Footer() {
  return (
    <footer className="border-t bg-card/30 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} SjakCare. Sistem Pendukung Kesehatan Mental Mahasiswa.</p>
        <p>
          ⚠️ Layanan ini <span className="font-medium">bukan pengganti</span> konsultasi profesional.
        </p>
      </div>
    </footer>
  );
}
