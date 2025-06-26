import Image from "next/image";

export default function HomePage() {
  return (
    <main className="p-0 relative">
      <Image
        className="w-full h-screen object-cover object-top"
        src="/PR-01.jpeg"
        alt="PICO DA ROSA logo"
        width={1920}
        height={1080}
        priority
        style={{ marginTop: '-100px' }} // Compensar o header sticky
      />
      <h1 className="title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10">
        PICO DA ROSA
      </h1>
    </main>
  );
}
