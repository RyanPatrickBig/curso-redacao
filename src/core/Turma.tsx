export default class Material{
    #id: string | null
    #nome: string
    #disciplina: string
    #professor: string
    #dia: string
    #horario: string 
    #modalidade: string
    #excluido: boolean

    constructor( nome: string, disciplina: string, professor: string, dia: string, horario: string, modalidade: string, id: string | null = null, excluido: boolean ){
        this.#nome = nome
        this.#disciplina = disciplina
        this.#professor = professor
        this.#dia = dia
        this.#horario = horario
        this.#modalidade = modalidade
        this.#id = id
        this.#excluido = excluido
    }
    static vazio() {
        return new Material('','','','','','','',false)
    }

    get id(){
        return this.#id
    }
    get nome(){
        return this.#nome
    }
    get disciplina(){
        return this.#disciplina
    }
    get professor(){
        return this.#professor
    }
    get dia(){
        return this.#dia
    }
    get horario(){
        return this.#horario
    }
    get modalidade(){
        return this.#modalidade
    }
    get excluido(){
        return this.#excluido
    }
}
