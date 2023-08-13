export default class Aluno {
    #id: string 
    #nome: string
    #data: Date
    #natural: string
    #endereco: string
    #celular: string
    #email: string
    #pai: string
    #mae: string
    #rg: string
    #cpf: string
    #pagamento: string

    constructor(nome: string, data: Date, natural:string, endereco: string, 
                celular: string, email: string, pai: string, mae: string, 
                rg: string, cpf: string, pagamento: string, id: string){
                this.#nome = nome
                this.#data = data
                this.#natural = natural
                this.#endereco = endereco
                this.#celular = celular
                this.#email = email
                this.#pai = pai
                this.#mae = mae
                this.#rg = rg
                this.#cpf = cpf
                this.#pagamento = pagamento
                this.#id = id
                }
    
    static vazio() {
        return new Aluno('',new Date(0),'','','','','','','','','','')
    }
    
    get id() {
        return this.#id
    }
    get nome() {
        return this.#nome
    }
    get data() {
        return this.#data
    }
    get natural() {
        return this.#natural
    }
    get endereco () {
        return this.#endereco 
    }
    get celular() {
        return this.#celular
    }
    get email() {
        return this.#email
    }
    get pai() {
        return this.#pai
    }
    get mae() {
        return this.#mae
    }
    get rg() {
        return this.#rg
    }
    get cpf() {
        return this.#cpf
    }
    get pagamento() {
        return this.#pagamento
    }
}