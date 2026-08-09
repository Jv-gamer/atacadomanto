import React from "react";
import { Cpu, Heart, CheckCircle2 } from "lucide-react";

export default function VersionsPage() {
  const technicalSpecs = [
    {
      label: "Caimento / Modelagem",
      fan: "Classic Fit (Regular/Solta)",
      player: "Slim Fit (Mais ajustada/Fina)",
    },
    {
      label: "Escudo & Logos",
      fan: "Costuras Bordadas clássicas",
      player: "Termoselados emborrachados 3D",
    },
    {
      label: "Material / Tecido",
      fan: "100% Poliéster standard dry",
      player: "100% Poliéster reciclado Dry-Fit Active",
    },
    {
      label: "Ventilação / Perfurações",
      fan: "Fios entrelaçados convencionais",
      player: "Painéis traseiros microperfurados a laser",
    },
    {
      label: "Peso da Jersey",
      fan: "Aprox. 180g a 210g",
      player: "Super leve: Aprox. 130g a 150g",
    },
    {
      label: "Lavagem Recomendada",
      fan: "Ciclo normal de máquina",
      player: "Ciclo leve de máquina ou lavagem manual",
    },
  ];

  return (
    <div className="bg-bg-main dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-12 text-left">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-block bg-[#0f766e]/10 dark:bg-teal-400/10 text-primary dark:text-teal-400 text-xs font-bold font-poppins px-4 py-2 rounded-full uppercase tracking-wider">
            Comparativo Técnico de Fábrica
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-text-main dark:text-white">
            Torcedor vs Jogador: Qual escolher?
          </h2>

          <p className="text-text-sec dark:text-slate-400 text-sm sm:text-base font-inter">
            Aprenda a diferenciar as versões de fabricação para te ajudar na
            hora de comprar.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Versão Torcedor */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-xs flex flex-col justify-between transition-colors duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-700">
                <div>
                  <h3 className="text-2xl font-extrabold font-poppins text-text-main dark:text-white">
                    Versão Torcedor
                  </h3>

                  <p className="text-xs text-text-sec dark:text-slate-400 font-semibold font-inter mt-1">
                    Conforto clássico e alta durabilidade
                  </p>
                </div>

                <span className="bg-[#F5F6F8] dark:bg-slate-700 p-3 rounded-full text-primary dark:text-teal-400">
                  <Heart className="w-6 h-6" />
                </span>
              </div>

              <p className="text-xs text-text-sec dark:text-slate-400 leading-relaxed font-inter">
                A versão torcedor é focada no bem-estar e no uso casual do dia a
                dia. Com corte tradicional mais reto, ela veste confortavelmente
                todos os biotipos físicos. Possui o escudo e detalhes bordados,
                garantindo que o manto resista a inúmeras lavagens sem perder o
                aspecto original.
              </p>

              <div className="space-y-3.5 pt-4">
                <h4 className="text-xs font-bold font-poppins text-text-main dark:text-slate-200 tracking-wider uppercase">
                  Destaques da Versão
                </h4>

                <ul className="space-y-3 text-xs font-semibold text-text-main dark:text-slate-300 font-inter">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary dark:text-teal-400 shrink-0" />
                    Modelagem Classic Fit de caimento relaxado
                  </li>

                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary dark:text-teal-400 shrink-0" />
                    Escudos e logotipos bordados diretamente no tecido
                  </li>

                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary dark:text-teal-400 shrink-0" />
                    Alta resistência e lavável na máquina sem preocupações
                  </li>

                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary dark:text-teal-400 shrink-0" />
                    Excelente custo-benefício para giro rápido de revenda
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6" />
          </div>

          {/* Versão Jogador */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-primary/20 dark:border-teal-500/30 shadow-sm flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
            {/* Tag Premium */}
            <div className="absolute top-0 right-0 bg-[#0F766E] text-white text-[9px] font-extrabold px-4 py-1.5 uppercase font-poppins tracking-widest rounded-bl-xl shadow-xs">
              Performance Premium
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-700">
                <div>
                  <h3 className="text-2xl font-extrabold font-poppins text-primary dark:text-teal-400">
                    Versão Jogador
                  </h3>

                  <p className="text-xs text-text-sec dark:text-slate-400 font-semibold font-inter mt-1">
                    Alta tecnologia e caimento atlético
                  </p>
                </div>

                <span className="bg-primary/10 dark:bg-teal-400/10 p-3 rounded-full text-primary dark:text-teal-400">
                  <Cpu className="w-6 h-6" />
                </span>
              </div>

              <p className="text-xs text-text-sec dark:text-slate-400 leading-relaxed font-inter">
                A versão jogador é a mesma camisa utilizada pelos atletas
                profissionais em campo. Ela conta com modelagem Slim Fit (bem
                justa ao corpo), escudo e patrocínios termoselados emborrachados
                para evitar qualquer atrito na pele, e tecido inteligente
                Dry-Fit Active com microperfurações a laser para rápida
                evaporação de suor.
              </p>

              <div className="space-y-3.5 pt-4">
                <h4 className="text-xs font-bold font-poppins text-text-main dark:text-slate-200 tracking-wider uppercase">
                  Destaques da Versão
                </h4>

                <ul className="space-y-3 text-xs font-semibold text-text-main dark:text-slate-300 font-inter">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary dark:text-teal-400 shrink-0" />
                    Modelagem Slim Fit aerodinâmica e atlética
                  </li>

                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary dark:text-teal-400 shrink-0" />
                    Escudos termoselados emborrachados (reduz peso)
                  </li>

                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary dark:text-teal-400 shrink-0" />
                    Tecido Dry-Fit Active com microperfurações de ar
                  </li>

                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary dark:text-teal-400 shrink-0" />
                    Sistema de gerenciamento térmico avançado
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6" />
          </div>
        </div>

        {/* Tabela de Especificações */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden mt-12 transition-colors duration-200">
          <div className="p-6 border-b border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold font-poppins text-text-main dark:text-white">
              Tabela de Especificações Técnicas
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F6F8] dark:bg-slate-900/50 text-xs font-bold text-text-sec dark:text-slate-400 font-poppins uppercase">
                  <th className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                    Característica
                  </th>

                  <th className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                    Versão Torcedor
                  </th>

                  <th className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                    Versão Jogador
                  </th>
                </tr>
              </thead>

              <tbody>
                {technicalSpecs.map((spec, index) => (
                  <tr
                    key={spec.label}
                    className={`text-xs font-inter transition-colors duration-200 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-gray-50/70 dark:bg-slate-900/20"
                    }`}
                  >
                    <td className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 font-bold text-text-main dark:text-slate-200">
                      {spec.label}
                    </td>

                    <td className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 text-text-sec dark:text-slate-300">
                      {spec.fan}
                    </td>

                    <td className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 text-text-sec dark:text-slate-300">
                      {spec.player}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
