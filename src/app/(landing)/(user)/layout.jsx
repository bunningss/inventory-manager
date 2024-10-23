import { Container } from "@/components/container";
import { ProfileSidebar } from "@/components/sidebars/profile-sidebar";
import { getSession } from "@/utils/auth";

export default async function Layout({ children }) {
  const session = await getSession();

  return (
    <Container>
      <div className="lg:flex gap-4">
        <ProfileSidebar userData={session.payload} />

        <div className="w-full">{children}</div>
      </div>
    </Container>
  );
}
