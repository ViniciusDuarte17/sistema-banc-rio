"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/criar/conta', (req, res) => {
    try {
        const { name, cpf, nascimento } = req.body;
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const idade = anoAtual - nascimento;
        const contas = [{ name: "", cpf: "", idade }];
        console.log("conta", contas);
        if (!name)
            throw new Error("O campo name precisa ser preenchido!");
        if (!cpf)
            throw new Error("O campo cpf precisa ser preenchido!");
        if (idade < 18)
            throw new Error("É necessário ser maior de idade para criar uma conta!");
        const newConta = {
            name,
            cpf,
            idade
        };
        contas.push(newConta);
        res.send("conta criada");
    }
    catch (Error) {
    }
});
app.listen(3003, () => {
    console.log("Servidor de online");
});
// {valor: 100, data: "06/06/2022", descricao: "Compra magazine"}
