import Image from "next/image";

export default function SalesReceiptCard({ item }) {
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
          <h6 className="text-sm font-bold">{item?.title}</h6>
          <h6 className="text-sm font-bold">
            ৳{(item?.price / 100).toFixed(2)}
          </h6>
        </div>
        <span className="text-sm text-muted-foreground">
          ৳{(item?.price / 100).toFixed(2)} x {item?.quantity}
        </span>
        <span className="text-sm text-muted-foreground">Jul 14, 2024</span>
      </div>
    </div>
  );
}
