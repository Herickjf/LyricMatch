# Song Guesser - Backend

Este é o repositório do backend do projeto **Song Guesser**, desenvolvido com o framework **NestJS**. Este documento contém instruções para configurar o ambiente, rodar o projeto e executar as principais tarefas.


## Configuração do Ambiente

Antes de iniciar, crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```properties

# Musixmatch API keys
MUSIXMATCH_API_KEY=seu_musixmatch_api_key

# Database URL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
```

Substitua os valores acima pelos dados reais do seu ambiente.

## Principais Comandos

### Atualizar o Repositório

Antes de instalar as dependências, certifique-se de que o repositório está atualizado:
```bash
git pull
```

### Instalar Dependências
```bash
npm install
```

### Rodar o Projeto

- **Modo de Desenvolvimento**:
  ```bash
  npm run start:dev
  ```

### Rodar Migrations do Prisma

- **Aplicar todas as Migrations**:
  ```bash
  npx prisma migrate deploy
  ```

## Documentação da API

Acesse a documentação da API gerada automaticamente pelo Swagger em:
```
http://localhost:4000/api
```
