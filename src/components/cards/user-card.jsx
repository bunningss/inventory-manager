import { Card, CardContent, CardTitle } from "../ui/card";
import { Icon } from "../icon";
import { UpdateUser } from "../modals/update-user";
import { DeleteItem } from "../modals/delete";

export function UserCard({ user }) {
  return (
    <Card title={user?.title}>
      <CardContent className="flex items-center gap-2 p-1 md:p-1">
        <div className="bg-slate-100 px-1">
          <Icon icon="user" size={80} />
        </div>
        <div className="py-0 px-1 w-full flex flex-col gap-1">
          <CardTitle className="capitalize font-bold text-base">
            {user?.name}
          </CardTitle>
          <span>{user?.email}</span>
          <div className="flex items-center justify-between">
            <span>
              role:{" "}
              <span className="text-primary font-bold uppercase">
                {user?.role}
              </span>
            </span>
            <div className="space-x-2">
              <UpdateUser data={user} />
              <DeleteItem requestUrl={`users/${user?._id}`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
