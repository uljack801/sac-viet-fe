import Image from "next/image";

export default function Loading() {
  return (
    <div className="w-screen h-full flex justify-center items-center">
      <Image src="/logo_.png" alt="logo" width={120} height={120} />
    </div>
  );
}
