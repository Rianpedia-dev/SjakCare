import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect ke dashboard (nanti akan cek session dulu)
  redirect("/login");
}
