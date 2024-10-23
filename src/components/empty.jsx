import { Heading } from "./heading";

export function Empty({ message }) {
  return (
    <div className="h-[250px] rounded-md bg-muted mt-2 pt-8 pb-8 pl-2 pr-2 flex flex-col items-center justify-center gap-2">
      <Heading>Uh-Oh</Heading>
      <p className="text-center">{message}</p>
    </div>
  );
}
