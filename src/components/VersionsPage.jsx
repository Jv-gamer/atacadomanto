import React from "react";
import { Check, ShieldAlert, Cpu, Heart, CheckCircle2 } from "lucide-react";

export default function VersionsPage() {
  const fanSpecs = [
    { label: "Modelagem / Caimento", val: "Classic Fit (Mais solta no corpo)" },
    { label: "Costuras e Acabamento", val: "Costuras e escudos bordados de alta resistência" },
    { label: "Tecido Principal", val: "Poliéster Dry-Tech (Foco em durabilidade)" },
    { label: "Respirabilidade", val: "Média (Indicado para uso casual diário)" },
    { label: "Durabilidade em Lavagens", val: "Alta durabilidade de uso prolongado" },
    { label: "Uso Ideal", val: "Arquibancada, uso urbano e casual diário" }
  ];

  const playerSpecs = [
    { label: "Modelagem / Caimento", val: "Slim Fit (Ajustada e aerodinâmica)" },
    { label: "Costuras e Acabamento", val: "Escudos e marcas termoselados (Sem costura interna)" },
    { label: "Tecido Principal", val: "Dry-Fit Active premium texturizado" },
    { label: "Respirabilidade", val: "Máxima (Microperfurações a laser para fluxo de ar)" },
    { label: "Durabilidade em Lavagens", val: "Requer cuidados de lavagem especial (Ciclo delicado)" },
    { label: "Uso Ideal", val: "Alta performance, futebol amador/profissional e treino" }
  ];

  return (
    <div className="bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 text-left">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="bg-[#0f766e]/10 text-primary text-xs font-bold font-poppins px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Comparativo Técnico de Fábrica
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-text-main">
            Torcedor vs Jogador: Qual escolher?
          </h2>
          <p className="text-text-sec text-sm sm:text-base font-inter">
            Aprenda a diferenciar as versões de fabricação para orientar seus clientes e turbinar suas vendas no atacado.
          </p>
        </div>

        {/* Side-by-Side Dual Card Showroom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          
          {/* Fan Version Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl font-extrabold font-poppins text-text-main">Versão Torcedor</h3>
                  <p className="text-xs text-text-sec font-semibold font-inter mt-1">Conforto clássico e alta durabilidade</p>
                </div>
                <span className="bg-[#F5F6F8] p-3 rounded-full text-primary">
                  <Heart className="w-6 h-6" />
                </span>
              </div>

              <p className="text-xs text-text-sec leading-relaxed font-inter">
                A versão torcedor é focada no bem-estar e no uso casual do dia a dia. Com corte tradicional mais reto, ela veste confortavelmente todos os biotipos físicos. Possui o escudo e detalhes bordados, garantindo que o manto resista a inúmeras lavagens sem perder o aspecto original.
              </p>

              <div className="space-y-3.5 pt-4">
                <h4 className="text-xs font-bold font-poppins text-text-main tracking-wider uppercase">Destaques da Versão</h4>
                <ul className="space-y-3 text-xs font-semibold text-text-main font-inter">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                    Modelagem Classic Fit de caimento relaxado
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                    Escudos e logotipos bordados diretamente no tecido
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                    Alta resistência e lavável na máquina sem preocupações
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                    Excelente custo-benefício para giro rápido de revenda
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 bg-[#F5F6F8]/60 p-4 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-text-sec font-poppins tracking-wider">Atenção Lojista</span>
              <p className="text-[11px] text-text-sec font-inter mt-1 leading-relaxed">
                Esta é a versão mais vendida no Brasil por vestir de forma confortável a grande maioria do público torcedor.
              </p>
            </div>
          </div>

          {/* Player Version Card */}
          <div className="bg-white rounded-2xl p-8 border border-primary/20 shadow-sm flex flex-col justify-between relative overflow-hidden">
            {/* Premium tag overlay */}
            <div className="absolute top-0 right-0 bg-[#0F766E] text-white text-[9px] font-extrabold px-4 py-1.5 uppercase font-poppins tracking-widest rounded-bl-xl shadow-xs">
              Performance Premium
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl font-extrabold font-poppins text-primary">Versão Jogador</h3>
                  <p className="text-xs text-text-sec font-semibold font-inter mt-1">Alta tecnologia e caimento atlético</p>
                </div>
                <span className="bg-primary/10 p-3 rounded-full text-primary">
                  <Cpu className="w-6 h-6" />
                </span>
              </div>

              <p className="text-xs text-text-sec leading-relaxed font-inter">
                A versão jogador é a mesma camisa utilizada pelos atletas profissionais em campo. Ela conta com modelagem Slim Fit (bem justa ao corpo), escudo e patrocínios termoselados emborrachados para evitar qualquer atrito na pele, e tecido inteligente Dry-Fit Active com microperfurações a laser para rápida evaporação de suor.
              </p>

              <div className="space-y-3.5 pt-4">
                <h4 className="text-xs font-bold font-poppins text-text-main tracking-wider uppercase">Destaques da Versão</h4>
                <ul className="space-y-3 text-xs font-semibold text-text-main font-inter">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                    Modelagem Slim Fit aerodinâmica e atlética
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                    Escudos termoselados emborrachados (reduz peso)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                    Tecido Dry-Fit Active com microperfurações de ar
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                    Sistema de gerenciamento térmico avançado
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 bg-[#0F766E]/5 p-4 rounded-xl border border-[#0F766E]/10">
              <span className="text-[10px] uppercase font-bold text-primary font-poppins tracking-wider">Cuidado ao Revender</span>
              <p className="text-[11px] text-text-sec font-inter mt-1 leading-relaxed">
                Avise seu cliente que, devido ao corte Slim, costuma ser recomendado comprar um tamanho acima do habitual.
              </p>
            </div>
          </div>

        </div>

        {/* Detailed Tech Comparison Grid Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-12">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold font-poppins text-text-main">
              Tabela de Especificações Técnicas
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F6F8] text-xs font-bold text-text-sec font-poppins uppercase">
                  <th className="px-6 py-4 border-b border-gray-100">Característica</th>
                  <th className="px-6 py-4 border-b border-gray-100">Versão Torcedor</th>
                  <th className="px-6 py-4 border-b border-gray-100">Versão Jogador</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-text-main font-inter divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 bg-gray-50/50 font-bold text-text-main font-poppins">Caimento / Modelagem</td>
                  <td className="px-6 py-4 text-text-sec">Classic Fit (Regular/Solta)</td>
                  <td className="px-6 py-4 text-primary font-bold">Slim Fit (Mais ajustada/Fina)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 bg-gray-50/50 font-bold text-text-main font-poppins">Escudo & Logos</td>
                  <td className="px-6 py-4 text-text-sec">Costuras Bordadas clássicas</td>
                  <td className="px-6 py-4 text-text-sec">Termoselados emborrachados 3D</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 bg-gray-50/50 font-bold text-text-main font-poppins">Material / Tecido</td>
                  <td className="px-6 py-4 text-text-sec">100% Poliéster standard dry</td>
                  <td className="px-6 py-4 text-text-sec">100% Poliéster reciclado Dry-Fit Active</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 bg-gray-50/50 font-bold text-text-main font-poppins">Ventilação / Perfurações</td>
                  <td className="px-6 py-4 text-text-sec">Fios entrelaçados convencionais</td>
                  <td className="px-6 py-4 text-text-sec">Painéis traseiros microperfurados a laser</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 bg-gray-50/50 font-bold text-text-main font-poppins">Peso da Jersey</td>
                  <td className="px-6 py-4 text-text-sec">Aprox. 180g a 210g</td>
                  <td className="px-6 py-4 text-text-sec">Super leve: Aprox. 130g a 150g</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 bg-gray-50/50 font-bold text-text-main font-poppins">Lavagem Recomendada</td>
                  <td className="px-6 py-4 text-text-sec">Ciclo normal de máquina</td>
                  <td className="px-6 py-4 text-text-sec">Ciclo leve de máquina ou lavagem manual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
