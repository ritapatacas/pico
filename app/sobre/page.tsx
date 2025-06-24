import Image from "next/image";


export default function About() {
  return (
    <main>
      <div className="pt-20 p-6">
        <Image
          className="dark:invert"
          src="/rosa.jpeg"
          alt="PICO DA ROSA text logo"
          width={1920}
          height={38}
          priority
        />
      </div>
    </main>
  );
}
