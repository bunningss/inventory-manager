import { DataCell } from "@/components/data-cell";
import { Heading } from "@/components/heading";
import { Icon } from "@/components/icon";
import { UpdateProfile } from "@/components/modals/update-profile";
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton";
import { getData } from "@/utils/api-calls";
import { getSession } from "@/utils/auth";
import { Suspense } from "react";

export async function generateMetadata() {
  const session = await getSession();

  return {
    title: `${session.payload?.name}'s profile`,
  };
}

async function ProfileData() {
  const session = await getSession();
  const { response } = await getData(`users/${session.payload?._id}`);

  return (
    <>
      <div className="flex justify-between items-center mb-4 md:mb-1">
        <Heading>{response?.payload?.name}</Heading>
        <UpdateProfile data={response?.payload} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-6">
        <div className="flex items-center gap-2">
          <Icon icon="location" size={20} />
          <p>Bangladesh</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="email" size={20} />
          <p>{response?.payload?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="verified" size={20} />
          <p>
            Member since {new Date(response?.payload?.createdAt).toDateString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse mt-4 mb-4 md:grid md:grid-cols-2">
        <div className="pt-2 pb-2 pl-0 pr-0 flex flex-col gap-x-0 gap-y-4 md:gap-y-8">
          <DataCell
            dataName="gender"
            dataValue={
              response?.payload?.gender ? response?.payload?.gender : "-----"
            }
          />
          <DataCell
            dataName="birthdate"
            dataValue={
              response?.payload?.birthdate
                ? new Date(response?.payload?.birthdate)?.toDateString()
                : "-----"
            }
          />
          <DataCell
            dataName="phone number"
            dataValue={
              response?.payload?.phone ? response?.payload?.phone : "-----"
            }
          />
        </div>
      </div>
    </>
  );
}

export default async function Page() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileData />
    </Suspense>
  );
}
