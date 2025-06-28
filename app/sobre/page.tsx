import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";


export default function About() {
  return (
    <main >
      <div id="rosa-section" className="h-[calc(100vh-6rem)] md:h-screen relative">

        <div className="h-full overflow-hidden">
          <Image
            className="h-full object-cover scale-11z0"
            src="/imgs/roza.png"
            alt="Roza photo"
            width={1920}
            height={38}
            priority
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="bg-gray-300 opacity-60 text-black text-base overflow-hidden transition-all hover:shadow-lg w-[70vw] flex flex-col justify-between">
            <CardContent className="flex flex-col flex-grow font-semibold	">
              <h1 className="text-2xl font-bold mb-2">O Pico da Rosa</h1>
              <p className="text-lg leading-relaxed mb-2">
                É num lugar no centro do país, no cabeço da aldeia dos Troviscais, em Pedrógão Grande, que o PICO DA ROSA cresce, naquelas que um dia foram as terras de sustento dos meus avós, Rosa e Américo.</p>
              <p className="text-lg leading-relaxed">
                Aqui, entre bagas coloridas e ainda jovens castanheiros, cultivamos também a memória do seu legado.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
      <div className="">

        <p className="text-lg leading-relaxed px-20 py-10">
          Este projeto não teria saído do imaginário sem o apoio desse legado maior - a minha família que permitiu que ele nascesse cedendo-lhe a sua terra. E tão só teria sido um devaneio não fosse a força, coragem e perseverança da minha mãe.
        </p>


        <Image
            className="w-full"
            src="/imgs/202304.jpeg"
            alt="Roza photo"
            width={1920}
            height={38}
            priority
          />

        <p className="text-lg leading-relaxed px-20 py-10">
          Uma ideia que surgiu em 2017, foi financiada em 2019 e celebra este ano a sua primeira colheita. O PICO DA ROSA cresce devagar, com a paciência que a terra nos ensina. <b>Somos três mulheres</b> vindas das artes e das humanidades, que não tinham experiência alguma em agricultura.
        </p>

        <Image
            className="w-full"
            src="/imgs/202505_01.jpeg"
            alt="Roza photo"
            width={1920}
            height={38}
            priority
          />
        <p className="text-lg leading-relaxed px-20 py-10 mb-20">

          Vamos aprendido com os erros e os conselhos, e temos vindo a investir em <b>formação</b> focada em modos alternativos de produção como <b>permacultura</b> e <b>agroflorestas</b>.
          <br></br>
          Queremos tornar este um espaço cada vez mais sustentável, resiliente e saudável.
          <br></br>
          Atualmente produzimos em <b>modo de protecção integrada</b> e estamos a preparar-nos para a certificação biológica.
        </p>
      </div>
    </main>
  );
}
