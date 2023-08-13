import firebase from "../config";
import Aluno from "../../core/Aluno";
import AlunoRepositorio from "../../core/AlunoRepositorio";

export default class ColecaoAluno implements AlunoRepositorio{
    
    #conversor = {
        toFirestore(aluno: Aluno){
            return{
                nome: aluno.nome,
                data: aluno.data,
                natural: aluno.natural,
                endereco: aluno.endereco,
                celular: aluno.celular,
                email: aluno.email,
                pai: aluno.pai,
                mae: aluno.mae,
                rg: aluno.rg,
                cpf: aluno.cpf,
                pagamento: aluno.pagamento
            }
        },
        fromFirestore(snapshot:firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions){
            const dados = snapshot.data(options)
            return new Aluno (dados.nome, dados.data, dados.natural, dados.endereco, dados.celular, dados.email, dados.pai, dados.mae, dados.rg, dados.cpf, dados.pagamento, snapshot.id)
        }
    }
    async salvar(aluno: Aluno): Promise<Aluno> {
        
        if(aluno?.id){
            await this.colecao().doc(aluno.id).set(aluno)
            return aluno
        } else {
           const docRef = await this.colecao().add(aluno)
           const doc = await docRef.get()
           return doc.data() as Aluno; 
        }
    }

    async excluir(aluno: Aluno): Promise<void> {
       return this.colecao().doc(aluno.id).delete()
    }

    async obterTodos(): Promise<Aluno[]> {
        const query = await this.colecao().get()
        return query.docs.map(doc => doc.data()) ?? []
    }

    private colecao(){
        return firebase
        .firestore().collection('alunos')
        .withConverter(this.#conversor)
    }
}