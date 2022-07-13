export const erros = {
    GENERICO_NOT_FOUND: {
      status: 400,
      message: "método ou caminho inválidos, JSON inválido…",
    },
   CAMPOSBODY_NOT_FOUND: {
      status: 401,
      message: "Todos os campos devem ser preenchidos!",
    },
    USER_NOT_FOUND: {
      status: 404,
      message: "usuário já existe!",
    },
   SALDO_NOT_FOUND: {
      status: 401,
      message: "credenciais ausentes ou inválidas!",
    },
    AGE_NOT_FOUND: {
      status: 403,
      message: "Usuário deve ter no mínimo 18 anos, para abertura da conta!",
    },
    USUARIO_NOT_FOUND: {
      status: 403,
      message: "usuário não tem as permissões necessárias",
    },
    NAME_NOT_FOUND: { status: 401, message: "name ou price está faltando!" },
    PRICE_NOT_FOUND: {
      status: 422,
      message: "O valor inserido não pode ser igual a zera ou menor",
    },
    PRICE2_NOT_FOUND: {
      status: 422,
      message: "O valor inserido deve ser do tipo number",
    },
    SOME_ERROR: { status: 500, message: "Algo deu errado" },
  };