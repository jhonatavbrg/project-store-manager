# Habilidades

Nesse projeto, você será capaz de:

- Entender o funcionamento da camada de Model;
- Delegar responsabilidades específicas para essa camada;
- Conectar sua aplicação com diferentes bancos de dados;
- Estruturar uma aplicação em camadas;
- Delegar responsabilidades específicas para cada parte do seu app;
- Melhorar manutenibilidade e reusabilidade do seu código;
- Entender e aplicar os padrões REST;
- Escrever assinaturas para APIs intuitivas e facilmente entendíveis.

---

## Lista de requisitos

### 1 - Crie um endpoint para o cadastro de produtos

- O endpoint deve ser acessível através do caminho (`/products`);

- Os produtos enviados devem ser salvos em uma **collection** do MongoDB;

- O endpoint deve receber a seguinte estrutura:

```json
{
  "name": "product_name",
  "quantity": "product_quantity"
}
```

O retorno da API de um produto cadastrado com sucesso deverá ser:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "name": "Produto do Batista",
  "quantity": 100
}
```

#### Requisição de Cadastro de Produtos:

O projeto deve rodar na porta `http://localhost:3000`

#### Observações Técnicas:

- `name` deve ser uma _string_ com mais de 5 caracteres e deve ser único;

- `quantity` deve ser um número inteiro maior que 0;

- Cada produto deve ter um id que seja único e gerado no momento em que o recurso for criado. Você pode utilizar o ID gerado pelo MongoDB

- A resposta do endpoint em caso de sucesso deve ser o produto criado.

### 2 - Crie um endpoint para listar os produtos

- O endpoint deve ser acessível através do caminho (`/products`) ou (`/products/:id`);

- Através do caminho `/products`, todos os produtos devem ser retornados;

- Através do caminho `/products/:id`, apenas o produto com o `id` presente na URL deve ser retornado;

### 3 - Crie um endpoint para atualizar um produto

- O endpoint deve ser acessível através do caminho (`/products/:id`);

- O corpo da requisição deve seguir a mesma estrutura do método responsável por adicionar um produto;

- Apenas o produto com o `id` presente na URL deve ser atualizado;

### 4 - Crie um endpoint para deletar um produto

- O endpoint deve ser acessível através do caminho (`/products/:id`);

- Apenas o produto com o `id` presente na URL deve ser deletado;

### 5 - Crie um endpoint para cadastrar vendas

- O endpoint deve ser acessível através do caminho (`/sales`);

- As vendas enviadas devem ser salvas em uma `collection` do MongoDB;

- Deve ser possível cadastrar a venda de vários produtos através da uma mesma requisição;

- O endpoint deve receber a seguinte estrutura:

```json
[
  {
  "productId": "product_id",
  "quantity": "product_quantity",
  },
  ...
]
```

O retorno de uma venda cadastrada com sucesso deverá ser:

```json
{
  "_id": "5f43ba333200020b101fe4a0",
  "itensSold": [
    {
      "productId": "5f43ba273200020b101fe49f",
      "quantity": 2
    }
  ]
}
```

#### Observações Técnicas:

- O `productId` devem ser igual ao `id` de um produto anteriormente cadastrado;

- `quantity` deve ser um número inteiro maior que 0;

- Cada venda deve ter um id que seja único e gerado no momento em que o recurso for criado;

- A resposta do endpoint em caso de sucesso deve ser a(s) venda(s) criada(s).

### 6 - Crie um endpoint para listar as vendas

- O endpoint deve ser acessível através do caminho (`/sales`) ou (`/sales/:id`);

- Através do caminho `/sales`, todas as vendas devem ser retornadas;

- Através do caminho `/sales/:id`, apenas a venda com o `id` presente na URL deve ser retornada;

### 7 - Crie um endpoint para atualizar uma venda

- O endpoint deve ser acessível através do caminho (`/sales/:id`);

- O corpo da requisição deve receber a seguinte estrutura:

```json
[
  {
    "productId": "5f3ff849d94d4a17da707008",
    "quantity": 3
  }
]
```

- `quantity` deve ser um número inteiro maior que 0;

- Apenas a venda com o `id` presente na URL deve ser atualizada;

### 8 - Crie um endpoint para deletar uma venda

- O endpoint deve ser acessível através do caminho (`/sales/:id`);

- Apenas a venda com o `id` presente na URL deve ser deletado;

### 9 - Atualize a quantidade de produtos

- Ao realizar uma venda, atualizá-la ou deletá-la, você deve também atualizar a quantidade do produto em questão presente na `collection` responsável pelos produtos;

- Por exemplo: suponha que haja um produto chamado _Bola de Futebol_ e a sua propriedade `quantity` tenha o valor _10_. Caso seja feita uma venda com _8_ unidades desse produto, a quantidade do produto deve ser atualizada para _2_ , pois 10 - 8 = 2;

### 10 - Valide a quantidade de produtos

- Um produto nunca deve ter a quantidade em estoque menor que 0;

- Quando uma venda for realizada, garanta que a quantidade sendo vendida está disponível no estoque

## Bônus

## 11 - Escreva testes para seus models

- Utilize o mocha, chai e sinon para escrever seus testes

- Coloque todos os testes de models no arquivo `test/unit/models.js`

- Será validado que cobertura total das linhas dos arquivos na pasta `models` é maior ou igual a 80%

## 12 - Escreva testes para seus services

- Utilize o mocha, chai e sinon para escrever seus testes

- Coloque todos os testes de services no arquivo `test/unit/services.js`

- Será validado que cobertura total das linhas dos arquivos na pasta `services` é maior ou igual a 80%

## 13 - Escreva testes para seus controllers

- Utilize o mocha, chai e sinon para escrever seus testes

- Coloque todos os testes de controllers no arquivo `test/unit/controllers.js`

- Será validado que cobertura total das linhas dos arquivos na pasta `controllers` é maior ou igual a 80%

---

## Depois de terminar o desenvolvimento

Para **"entregar"** seu projeto, siga os passos a seguir:

* Vá até a página **DO SEU** _Pull Request_, adicione a label de _"code-review"_ e marque seus colegas
  * No menu à direita, clique no _link_ **"Labels"** e escolha a _label_ **code-review**
  * No menu à direita, clique no _link_ **"Assignees"** e escolha **o seu usuário**
  * No menu à direita, clique no _link_ **"Reviewers"** e digite `students`, selecione o time `tryber/students-sd-00`

Se ainda houver alguma dúvida sobre como entregar seu projeto, [aqui tem um video explicativo](https://vimeo.com/362189205).

⚠ Lembre-se que garantir que todas as _issues_ comentadas pelo **Lint** estão resolvidas! ⚠

---

## Revisando um pull request

À medida que você e as outras pessoas que estudam na Trybe forem entregando os projetos, vocês receberão um alerta via Slack para também fazer a revisão dos Pull Requests dos seus colegas. Fiquem atentos às mensagens do "Pull Reminders" no Slack!

Use o material que você já viu sobre [Code Review](https://course.betrybe.com/real-life-engineer/code-review/) para te ajudar a revisar os projetos que chegaram para você.

---

# Avisos finais

Ao finalizar e submeter o projeto, não se esqueça de avaliar sua experiência preenchendo o formulário. Leva menos de 3 minutos!

Link: [FORMULÁRIO DE AVALIAÇÃO DE PROJETO](https://be-trybe.typeform.com/to/ZTeR4IbH#cohort_name=Turma%2011)

O avaliador automático não necessariamente avalia seu projeto na ordem em que os requisitos aparecem no readme. Isso acontece para deixar o processo de avaliação mais rápido. Então, não se assuste se isso acontecer, ok?
