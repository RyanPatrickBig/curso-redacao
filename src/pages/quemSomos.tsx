import Layout from '../components/Layout'
import InitialSection from '../components/InitialSection'
import Link from 'next/link'

export default function Correcao(){
  return(
    <Layout className="text-black">
      <div className="grid gap-20">
        
        <section>
          <InitialSection ordem={false} titulo='Quem Somos' img='/images/IMG_QUEMSOMOS.JPG'>
            <p className='flex max-h-40 hover:max-h-[700px] transition-all duration-1000 delay-100 ease-in-out overflow-hidden '>
              O Curso Felipe Alves surgiu em 2020, inicialmente apenas on-line, somente com Redação, em um momento pandêmico, fruto de um desejo enorme de mudar o futuro de diversos jovens brasileiros por meio da educação. A ideia deu tão certo, felizmente, que, em 2021, além de inserirmos Linguagens, iniciamos com as primeiras turmas do curso presencial (compartilhando a sala com um amigo), no município de Garanhuns-PE, e continuamos o trabalho com o curso on-line. 
              <br/>Em 2022, por sua vez, nosso Curso mudou-se para uma unidade presencial só nossa e montamos nosso estúdio para o curso on-line. Em 2023, resolvemos crescer ainda mais… também trouxemos Matemática para o time das isoladas! Não menos importante, hoje, contamos com material didático autoral, plataforma própria e, claro, a melhor equipe para auxiliar na aprovação de nossos estudantes. Por fim, já colecionamos muitas aprovações nas principais faculdades públicas do país (UFPE, UPE, Ufape, Ufal, UFRGS, IFSC, IFPE, UFRPE)… e não queremos parar por aqui! 
              <br/>É importante dizer, ainda, que tanto eu (professor Felipe Alves) como Wellington (coidealizador do Curso) acreditamos que a educação é uma das mais potentes e humanas estratégias que podemos utilizar para mudar o mundo, parafraseando Nelson Mandela. Por isso, montamos todo um aparato teórico-didático-metodológico para ajudá-los a usar a escrita como forma de mudar suas vidas, pois, como disse Carolina Maria de Jesus: "ninguém vai apagar as palavras que eu escrevi". 
              <br/>Portanto, com a disposição de nossos estudantes e com a nossa mediação ao longo, não só das aulas, mas também dos eventos extracurriculares que oferecemos, está sendo possível fazer com que o esforço desenvolvido por eles consiga transformar suas vidas, auxiliando-os a conquistarem a tão sonhada aprovação, como também a reconhecerem-se enquanto cidadãos críticos e atuantes na sociedade em que vivem.
            </p>
            <div className='flex justify-center pt-3'>
              <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
              </svg>
            </div>
          </InitialSection>
          <InitialSection ordem={true} titulo='Wellington' img='/images/IMG_3817.jpg'>
            <p className='flex max-h-20 hover:max-h-96 transition-all duration-1000 delay-100 ease-in-out overflow-hidden'>
              Olá, pessoas! Eu sou Wellington Oliveira, coidealizador deste Curso, graduado em Psicologia pelo Centro Universitário do Vale do Ipojuca, como bolsista 100% pelo Prouni, e, agora, estudante de Medicina da Universidade Federal de Alagoas. 
              <br/>Como amante da Língua Portuguesa e da escrita, conquistei, nos anos de 2019, 2020 e 2021, 960 pontos na Redação do Enem. Em 2022, por sua vez, conquistei 980 pontos na Redação, o que me garantiu, além de um mil técnico, a aprovação em Medicina na Federal. 
              <br/>Por fim, sou um leitor assíduo, amante das artes, em geral, e gosto muito de compartilhar o que aprendo e estou disposto a ajudar nossos estudantes no que for preciso em suas produções textuais e na vida. Inclusive, estarei com vocês nas correções dos textos de modo on-line. Vamos juntos em busca da aprovação!
            </p>
            <div className='flex justify-center pt-3'>
              <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
              </svg>
            </div>
          </InitialSection>
          
          <InitialSection ordem={false} titulo='Felipe Alves' img='/images/IMG_FELIPE.JPG'>
            <p className='flex max-h-20 hover:max-h-[460px] transition-all duration-1000 delay-100 ease-in-out overflow-hidden'>
              Oi! Se você ainda não me conhece, prazer, eu sou o professor Felipe Alves, graduado em Letras - Português, Inglês e Respectivas Literaturas, pela Universidade Federal Rural de Pernambuco (UFRPE/UAG), e pós-graduado em Produção Textual, pela Farese. 
              <br/>Durante minha trajetória acadêmica, fui pesquisador do Programa de Bolsas de Iniciação Científica (PIBIC/CNPq), bolsista do Programa de Bolsas de Iniciação à Docência (PIBID/CAPES), professor estagiário na Rede Municipal de Educação de Garanhuns e no Serviço Social do Comércio (SESC-PE). 
              <br/>Além disso, após formado, já atuei, profissionalmente, como professor do Colégio Diocesano de Garanhuns, na área de Redação e Português. Também como professor da Rede Estadual de Pernambuco, corretor de bancas de concursos públicos e de vestibulares, corretor de plataformas digitais de ensino e coautor de materiais didáticos para cursinhos.
              <br/>Atualmente, por sua vez, além de dirigir o Curso Felipe Alves, na área administrativa, também ministro as aulas de Linguagens e Redação e, claro, corrijo as redações e elaboro parte do material didático utilizado, já que, aqui, tudo é autoral. 
              É importante mencionar, ainda, que, nesta área, já coleciono mais de 08 anos de experiência! Ademais, estou em constante estudo para, claro, desenvolver estratégias que ajudem nossos estudantes cada vez mais e melhor!
            </p>
            <div className='flex justify-center pt-3'>
              <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
              </svg>
            </div>
            </InitialSection>
        </section>

        <section className='flex flex-row rounded-xl bg-pink-500 p-20 text-white mt-16'>
          <h1 className='font-Montserrant'>Comece estudando com a gente agora</h1>
          <Link href="/cadastro" className="px-12 my-12 py-5 rounded-md text-black bg-white">CADASTRAR</Link>
        </section>
      </div>
    </Layout>
  )
}
