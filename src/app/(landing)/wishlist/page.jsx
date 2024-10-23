import { Wishlist } from "@/components/wishlist";
import { Container } from "@/components/container";

export function metadata() {
  return {
    title: "Wishlist",
  };
}

export default async function Page() {
  return (
    <Container>
      <Wishlist />
    </Container>
  );
}
