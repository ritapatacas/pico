import React from "react";
import { Button } from "@/components/ui/button"; // Replace or remove if not using shadcn/ui
import { scrollToSection } from "@/lib/utils";

const CallToAction: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-gray-100 to-blue-200 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-30" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-4xl font-bold sm:text-5xl">
          Ready to take your project to the next level?
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-100">
          Start building with our tools today. It's fast, free, and easy to set up.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => scrollToSection('products')}
            className="inline-block px-6 py-3 text-base font-medium text-white bg-black rounded-md hover:bg-opacity-80 transition"
          >
            Encomendar
          </button>
{/*           <a
            href="/learn-more"
            className="inline-block px-6 py-3 text-base font-medium text-white border border-white rounded-md hover:bg-white hover:text-indigo-600 transition"
          >
            Marcar entrega
          </a> */}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
