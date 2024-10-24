import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { UserCard } from "@/components/cards/user-card";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Users() {
  const res = await getData("users", 0);

  return (
    <CardView>
      {res.response.payload?.map((user, index) => (
        <UserCard key={index} user={user} />
      ))}
    </CardView>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Block title="users">
        <Users />
      </Block>
    </Suspense>
  );
}
