import { contaUsuario } from './data';
import express, {Request, Response} from 'express'
import cors from 'cors'
import { v4 as generateId } from 'uuid';
import {erros} from './erros'



const app = express()
app.use(express.json())
app.use(cors())

app.get('/contas/usuarios', (req: Request, res: Response) => {
      const usuario = contaUsuario.map( (item) => [{id: item.id,name:item.name, cpf:item.cpf}]).flat()
      res.send(usuario)
})


// endpoit para criar uma conta!
app.post('/contas/criar', (req: Request, res: Response) => {

    try{
        const {name, cpf, dataNascimento} = req.body 
        const dataAtual = new Date()
        const anoAtual = dataAtual.getFullYear();
        const pegandoAno = dataNascimento.split('/')
        const anoParaSaberIdade : number = pegandoAno[2] as number
        const idade = anoAtual - anoParaSaberIdade

        const use = contaUsuario.find((user) => user.cpf === cpf)


        if(use?.cpf === cpf){
          throw new Error(erros.USER_NOT_FOUND.message)
        }

        if(!name || !cpf || !dataNascimento)
        throw new Error (erros.CAMPOSBODY_NOT_FOUND.message)
        
        if(idade < 18)
         throw new Error(erros.AGE_NOT_FOUND.message)

        contaUsuario.push({
            id:generateId(),
            name,
            cpf,
            dataNascimento,
            saldo: 0.00,
            extrato: [{valor: 0.00, descricao:"", data: ""}]
        })

       res.send("conta criada")
    
    } catch(error : any){
        switch (error.message) {
            case erros.AGE_NOT_FOUND.message:
                res.status(erros.AGE_NOT_FOUND.status).send(erros.AGE_NOT_FOUND.message)
                break
            case erros.CAMPOSBODY_NOT_FOUND.message:
                res.status(erros.CAMPOSBODY_NOT_FOUND.status).send(erros.CAMPOSBODY_NOT_FOUND.message)
                break
            case erros.USER_NOT_FOUND.message:
                res.status(erros.USER_NOT_FOUND.status).send(erros.USER_NOT_FOUND.message)
                break
            default:
                res.status(erros.SOME_ERROR.status).send(erros.SOME_ERROR.message)
        }
    }
})

app.get('/contas/saldo', (req: Request, res: Response) => {
   try{
       const authorization = req.headers.authorization
       const usuario = contaUsuario.find( (i) => i.cpf === authorization)
       const idUsuario = usuario?.name
       const idCpf = usuario?.cpf
       const saldo = usuario?.saldo
       
       if(!authorization)
       throw new Error(erros.SALDO_NOT_FOUND.message)

       if(!idUsuario )
         throw new Error(erros.USUARIO_NOT_FOUND.message)   

       if(idCpf !== authorization)
         throw new Error(erros.USUARIO_NOT_FOUND.message)   
       
         res.send( {name: idUsuario , saldo: saldo})
   }
   catch(error: any) {
    switch (error.message) {
        case erros.SALDO_NOT_FOUND.message:
            res.status(erros.SALDO_NOT_FOUND.status).send(erros.SALDO_NOT_FOUND.message)
            break
        case erros.USUARIO_NOT_FOUND.message:
            res.status(erros.USUARIO_NOT_FOUND.status).send(erros.USUARIO_NOT_FOUND.message)
            break
        case erros.USUARIO_NOT_FOUND.message:
            res.status(erros.USUARIO_NOT_FOUND.status).send(erros.USUARIO_NOT_FOUND.message)
            break     
        default: 
         res.status(erros.SOME_ERROR.status).send(erros.SOME_ERROR.message)         
    }
   }
})

app.put('/contas/adicionar/saldo', (req: Request, res: Response) => {
    try{
        const idName = req.body.name as string
        const cpfBody = req.body.cpf as string
        const saldoAdicionado = req.body.saldo
        const saldoAtual : number = saldoAdicionado

        const usuario = contaUsuario.find( (u) => u.cpf === cpfBody)
        const idUsuario = usuario?.name
        const idCpf = usuario?.cpf

        if(!cpfBody || !idName || saldoAtual < 0 || saldoAtual === 0)
        throw new Error(erros.SALDO_NOT_FOUND.message)


        if(!idUsuario)
         throw new Error(erros.USUARIO_NOT_FOUND.message) 

         if(idCpf !== cpfBody)
         throw new Error(erros.USUARIO_NOT_FOUND.message) 
         
         if(usuario?.cpf !== cpfBody || idName !== idUsuario)
            throw new Error(erros.USUARIO_NOT_FOUND.message)

         usuario.saldo = saldoAtual + usuario.saldo
        

       res.send("saldo adicionado!")
    }
    catch (error : any) {
        switch (error.message){
            case erros.SALDO_NOT_FOUND.message:
                res.status(erros.SALDO_NOT_FOUND.status).send(erros.SALDO_NOT_FOUND.message)
                break
            case erros.USUARIO_NOT_FOUND.message:
                res.status(erros.USUARIO_NOT_FOUND.status).send(erros.USUARIO_NOT_FOUND.message)
                break
            case erros.USUARIO_NOT_FOUND.message:
                res.status(erros.USUARIO_NOT_FOUND.status).send(erros.USUARIO_NOT_FOUND.message)
                break   
            case erros.USUARIO_NOT_FOUND.message:
                res.status(erros.USUARIO_NOT_FOUND.status).send(erros.USUARIO_NOT_FOUND.message)    
            default: 
                res.status(erros.SOME_ERROR.status).send(erros.SOME_ERROR.message)            
        }
    }
})

app.post('/contas/pagar', (req: Request, res: Response) => {
    let errorCode = 500 
    try {
        const {data, descricao, cpf, valor} = req.body 
        const cpfBody: string = cpf
        const descricaoBody: string = descricao
        const dataBody: string = data
        const novoValor : number = valor
        
        const user = contaUsuario.find( (user) => user.cpf === cpfBody) 

        if( !descricao || !cpf || !valor){
            errorCode = 422
            throw new Error("falta parâmento a ser passado!")
        }

        if(!user){
            errorCode = 404
            throw new Error("usuário não encontrado")
        }
        if(user.cpf !== cpfBody){
            errorCode = 404
            throw new Error("usuário não encontrado!")
        }
        
        if(user.saldo < novoValor){
            errorCode = 404
            throw new Error("saldo insuficiente")
        }
        if(!data){
            user.saldo = user.saldo - novoValor

            res.status(200).send("Boleto pago!")
        }

        user.extrato[0].valor = novoValor
        user.extrato[0].descricao = descricaoBody
        user.extrato[0].data = dataBody

    res.status(200).send(`Boleto agendado para a data! ${dataBody}`)

    } catch (error : any) {
        res.status(errorCode).send(error.message)
    }
})

app.put('/conta/:id/saldo/atualizar', (req: Request, res: Response) => {
    let errorCode = 500

    try{
        const id = req.params.id
        const dataAtual = new Date()
        const anoAtual = dataAtual.getFullYear();
        const dataString = JSON.stringify(dataAtual)
        const separandoTempo = dataString.split('T')
        const novaData = separandoTempo[0].split('-')
        const date  = `${novaData[2]}/${novaData[1]}/${anoAtual}`
        const user = contaUsuario.find( (user) => user.id === id)
    

        if(!id){
            errorCode = 401
            throw new Error("precisa passar um id")
        }

        if(user?.id!== id){
            errorCode = 402
            throw new Error("id não encontrado!")
        }
       
        for(let i = 0; i < contaUsuario.length; i++){
            if(contaUsuario[i].saldo < contaUsuario[i].extrato[0].valor){
                errorCode = 402
                throw new Error("saldo insuficiente!")
            }
            if(id === contaUsuario[i].id){
             
                if( !contaUsuario[i].extrato[0].data){
                    errorCode = 303
                    throw new Error(`não tem boleto para pagar`)
                }
            } 
        }
        if(user?.extrato[0].data === date){
            user.saldo = user.saldo - user.extrato[0].valor 
        } else {
            errorCode = 404
            throw new Error("No momento só aceita pagamento com a data presente!")
        }
            
          
    res.send(`transferência ou boleto pago, seu saldo disponivél é: ${user.saldo}`)
    }
    catch(error : any) {
        res.status(errorCode).send(error.message)
    }
})

app.listen(3003, () => {
    console.log("Servidor aberto na porta 3003")
})