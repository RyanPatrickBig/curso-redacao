import Aluno from "./Aluno";

export default interface AlunoRepositorio {
    salvar(aluno: Aluno): Promise<Aluno>
    excluir(aluno: Aluno): Promise<void>
    obterTodos(): Promise<Aluno[]>
}