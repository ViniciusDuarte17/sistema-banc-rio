import { v4 as generateId } from 'uuid';

type Cont = 
    {
        id: string,
        name: string,
        cpf: string,
        dataNascimento: string,
        saldo: number,
        extrato: [{valor: number, descricao: string, data: string}]
    }


export const contaUsuario : Cont[] = [
    {
    id:  generateId(),
    name: "vinicius",
    cpf: "48836585225",
    dataNascimento: "21/10/1999",
    saldo: 0,
    extrato: [{valor: 0, descricao:"", data: ""}]
},
    {
    id: generateId(),
    name: "vitor",
    cpf: "82936529285",
    dataNascimento: "21/10/1999",
    saldo: 0,
    extrato: [{valor: 0, descricao:"", data: ""}]
},
    {
    id: generateId(),
    name: "Rosivaldo",
    cpf: "32537829278",
    dataNascimento: "21/10/2001",
    saldo: 0,
    extrato: [{valor: 0, descricao:"", data: ""}]
}
]