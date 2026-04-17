import { UsersTable } from "@/components/admin/UsersTable";

export default function AdminUsersPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">Kelola Pengguna</h1>
        <p className="text-muted-foreground">Lihat dan atur peran serta status pengguna SjakCare.</p>
      </div>

      <UsersTable />
    </div>
  );
}
