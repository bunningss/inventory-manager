import Image from "next/image";

export function SalesReceiptCard({ item }) {
  return (
    <div className="flex space-x-2 border-b border-input">
      <figure className="relative h-16 w-16 rounded-md overflow-hidden">
        <Image
          src={item.images[0] ? item.images[0] : ""}
          alt={item?.title}
          className="object-contain"
          fill
        />
      </figure>
      <div className="w-full flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <h6 className="text-sm font-bold capitalize">{item?.title}</h6>
          <h6 className="text-sm font-bold">
            ৳{((item?.price * item?.quantity) / 100).toFixed(2)}
          </h6>
        </div>
        <span className="text-sm text-muted-foreground">
          ৳{(item?.price / 100).toFixed(2)} x {item?.quantity}
        </span>
        <span className="capitalize text-sm text-muted-foreground">
          {item?.brand}
        </span>
      </div>
    </div>
  );
}
