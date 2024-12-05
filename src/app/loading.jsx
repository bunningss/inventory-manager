import { Icon } from "@/components/icon";

export default function Loaing() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Icon icon="loading" className="animate-spin" size={28} />
    </div>
  );
}
