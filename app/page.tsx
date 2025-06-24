import Image from "next/image";


export default function HomePage() {
  return (
    <main className="p-0">
        <Image
          className="dark:invert"
          src="/PR-01.jpeg"
          alt="PICO DA ROSA logo"
          width={1920}
          height={30}
          priority
          />

      <Image
        className="dark:invert"
        src="/PR-01.jpeg"
        alt="PICO DA ROSA logo"
        width={1920}
        height={30}
        priority
      />
        <h1 className="title">PICO DA ROSA</h1>
    </main>
  );
}
