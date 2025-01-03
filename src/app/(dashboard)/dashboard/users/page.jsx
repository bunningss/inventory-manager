import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { UserCard } from "@/components/cards/user-card";
import { Loading } from "@/components/loading";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Users() {
  const { response } = await getData("users", 0);

  return (
    <CardView>
      {response.payload?.map((user, index) => (
        <UserCard key={index} user={user} />
      ))}
    </CardView>
  );
}

export default function Page() {
  return (
    <div className="space-y-4">
      <Block title="users" />
      <Suspense fallback={<Loading className="py-8" />}>
        <Users />
      </Suspense>
    </div>
  );
}
