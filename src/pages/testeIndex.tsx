import InitialSection from '@/components/InitialSection'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home(){
  return(
    <Layout className="text-black">
      <div className="grid gap-20">
        
        <section>
          <InitialSection ordem={true} titulo='Sabe o que vamos estudar por aqui?' img='/images/Estudaraqui.jpg' className='font-bold'>Olha só esses 3 jeitinhos que você pode estar estudando com a gente:</InitialSection>
          <InitialSection ordem={false} titulo='Presencial' img='/images/IMG_3834.JPG'>

            <div className=' max-h-40 hover:max-h-[700px] transition-all duration-1000 delay-100 ease-in-out overflow-hidden '>
              <h3>
                Estes são os benefícios da nossa modalidade presencial: 
                <br/>〰️ Aulas dinâmicas semanais e presencias com duração de <span className='font-bold'>4h para Linguagens e Redação</span> (sendo 2h de Linguagens e 2h de Redação) e <span className='font-bold'>3h de Matemática.</span> 
                <br/>〰️ Material próprio (produzido por mim, <span className='font-bold'>Felipe Alves</span>, coautor também do material de Redação do curso on-line Me Salva! e pelo professor de Matemática, <span className='font-bold'>Thiago Fernandes</span>, especialista em Enem e vestibulares).
                <br/>〰️ <span className='font-bold'>#SOSRED</span> (monitorias individuais de Redação e de Matemática).
                <br/>〰️ <span className='font-bold'>#SOSCORREÇÃO </span>(quadro de correção de redação ao vivo, no YouTube). 
                <br/>〰️ <span className='font-bold'>#CORRIGECOMOPROF</span> (plantões de correções presenciais).
                <br/>〰️ <span className='font-bold'>#SENTAQUELÁVEMREPERTÓRIO</span> (momentos coletivos de discussões de repertórios socioculturais). 
                <br/>〰️ <span className='font-bold'>#CORRIGEDECASA</span> (correções personalizadas em nosso sistema). 
                <br/>〰️ <span className='font-bold'>#MOMENTODOCUIDADO</span> (apoio emocional e psicológico). 
                <br/>〰️ <span className='font-bold'>#REDAÇÃOÉCULTURA</span> (eventos culturais). 
                <br/>〰️ <span className='font-bold'>#TÔLIGADONOENEM</span> (simulados das cinco áreas do conhecimento pela Evolucional)*.
                <br/>〰️ <span className='font-bold'>#AULADECAMPOCHEEEECK</span> (viagens adicionais para aulas de campo em regiões do Nordeste brasileiro)**.
                <br/><span className='font-bold'>& muito mais! </span>
                <br/>*contratados à parte. 
                <br/>**eventos comprados à parte.
              </h3>
            </div>

            <div className='flex justify-center pt-3'>
              <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
              </svg>
            </div>
          </InitialSection>
            <div className="flex justify-center">
              <div className='flex flex-col p-10 mb-20 w-11/12 bg-slate-700 rounded-lg text-white'>
                  <h2>Informações das Turmas Presenciais</h2>
                <h4>
                  <br/>🗓️ Em 2024, nosso início está previsto para 30 de janeiro, ok? Depende do dia em que você for fazer a isolada, conforme quadro de horários a seguir: 
                  <br/>⚪ - Matemática (nas terças-feiras, à tarde, das 14h às 17h; nas terças-feiras, à noite, das 18h às 21h). 
                  <br/>⚪ - Linguagens (nas quintas-feiras, à tarde, das 13h às 15h; nas quintas-feiras, à noite, das 18h às 20h; nos sábados, de manhã, das 8h às 10h). 
                  <br/>⚪ - Redação (nas quintas-feiras, à tarde, das 15h15 às 17h15; nas quintas-feiras, à noite, das 20h15 às 22h15; nos sábados, de manhã, das 10h15 às 12h15). 
                  ⚠️ Para cada disciplina, você escolhe um dia e horário. No caso de Linguagens e Redação, é interessante que a escolha seja feita no mesmo dia para as duas disciplinas.
                </h4>
              </div>
            </div>
          <InitialSection ordem={true} titulo='Online' img='/images/IMG_3810.JPG'>

            <div className=' max-h-[140px] hover:max-h-[400px] transition-all duration-1000 delay-100 ease-in-out overflow-hidden '>
              <h3>
                Estes são os benefícios da nossa modalidade <span className='font-bold'>on-line</span>:
                <br/>〰️ <span className='font-bold'>1 aula gravada</span> para cada disciplina <span className='font-bold'>por semana.</span>
                <br/>〰️ <span className='font-bold'>Monitoria coletiva</span> semanal com o professor Felipe Alves. 
                <br/>〰️ <span className='font-bold'></span> Material próprio (produzido por mim, <span className='font-bold'>Felipe Alves</span>, coautor também do material de Redação do curso on-line Me Salva! e pelo professor <span className='font-bold'>Thiago Fernandes</span>, de Matemática).
                <br/>〰️ <span className='font-bold'>#SOSRED</span> (monitorias individuais).
                <br/>〰️ <span className='font-bold'>#SOSCORREÇÃO</span>  (quadro de correção de redação ao vivo, no YouTube).
                <br/>〰️ <span className='font-bold'>#SENTAQUELÁVEMREPERTÓRIO</span> (momentos coletivos de discussões de repertórios socioculturais). 
                <br/>〰️ <span className='font-bold'>#CORRIGEDECASA</span> (correções personalizadas em nosso sistema). 
                <br/>〰️ <span className='font-bold'>#MOMENTODOCUIDADO</span> (apoio emocional e psicológico). 
                <br/>〰️ <span className='font-bold'>#REDAÇÃOÉCULTURA</span> (eventos culturais). 
                <br/>〰️ <span className='font-bold'>#TÔLIGADONOENEM</span> (simulados das cinco áreas do conhecimento pela Evolucional)*.
                <br/><span className='font-bold'>& muito mais!</span>
                <br/>*contratados à parte.
              </h3>
            </div>

            <div className='flex justify-center pt-3'>
              <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
              </svg>
            </div>
          </InitialSection>
        </section>

        <section className="grid lg:flex lg:flex-row gap-20">
          <div className="grid justify-items-center lg:col-span-1">
            <h1 className="text-4xl font-Montserrant">Planos</h1>
            <h2 className="text-2xl text-center">Você pode escolher um entre os planos <br/> Presencial e Online</h2>
          </div>
          <div className="grid grid-cols-2 gap-7 items-center">
            <div className="bg-slate-700 p-9 text-white rounded-md shadow-2xl">
              <div className="rounded-full h-12 w-12 bg-blue-300 mb-6"/>
              <h1 className="font-bold font-Montserrant text-2xl text-white">Presencial</h1><br/>
              
              <h3>
                Quanto aos valores para 2024, no presencial, nossa matrícula custará R$ 300,00. <br/>
                ➡️ Pelo valor da matrícula, você receberá apostilas impressas, caderno de anotações, nova camiseta do Curso, mochila e copo. 
                Em relação às mensalidades, para 2024:<br/>
                <br/>⚪ R$ 150,00* - para Linguagens e Redação. 
                <br/>⚪ R$ 200,00* - para o combo (Linguagens, Redação e Matemática). 
                <br/>⚪ R$ 100,00* - só Matemática. 
                <br/><br/> *para pagamento até a data de vencimento (dia 05 ou dia 10). Após o vencimento, haverá acréscimo de R$ 15,00 na parcela.
              </h3>
              
              <br/>
              <Link href={"https://api.whatsapp.com/send/?phone=5587981640749&text=matr%C3%ADculas+23&type=phone_number&app_absent=0"} className="text-3xl text-slate-700 bg-white px-10 py-3 rounded-md">Comprar</Link>
            </div>
            <div className="p-9 shadow-2xl rounded-md">
              <div className="rounded-full h-12 w-12 bg-pink-400 mb-6"></div>
              <h1 className="font-bold font-Montserrant text-2xl">Online</h1><br/>
              
              <h3>
              ⚠️No caso do curso on-line, em 2024, será cobrada taxa única. <br/> 
              <br/>🔴 R$ 399,00* - Curso completo de Linguagens e Redação, 10 meses de acesso, com 1 aula semanal gravada para cada disciplina + 20 créditos de correções. Além disso, também acompanha todos os benefícios do padrão CFA (consultá-los abaixo). 
              <br/>🔴 R$ 499,00* - Curso completo de Linguagens, Redação e Matemática, 10 meses de acesso, com 1 aula gravada semanal para cada disciplina + 20 créditos de correções. Além disso, também acompanha todos os benefícios do padrão CFA (consultá-los abaixo). 
              <br/><br/> *Cursos vendidos apenas à vista, via boleto bancário, pix ou cartão de crédito. Em até 3x, parcelamento sem juros. Acima disso, o cliente assume o valor adicional do parcelamento.
              </h3>
              
              <br/>
              <Link href={"https://api.whatsapp.com/send/?phone=5587981640749&text=matr%C3%ADculas+23&type=phone_number&app_absent=0"} className="text-3xl text-white bg-pink-400 px-10 py-3 rounded-md">Comprar</Link>
            </div>
          </div>
        </section>
        
      </div>
    </Layout>
  )
}