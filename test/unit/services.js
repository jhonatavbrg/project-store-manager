const sinon = require('sinon');
const { expect } = require('chai');
const { ObjectId } = require('mongodb');

const productsModel = require('../../models/products');
const salesModel = require('../../models/sales');
const productsService = require('../../services/products');
const salesService = require('../../services/sales');

describe('Retorna todos os Produtos cadastrados', () => {
  describe('quando retorna com sucesso', () => {
    describe('a resposta', () => {
      const resposta = {
        products: [
          {
            _id: "6140fc0fb8bed969a7f1713b",
            name: "Playstation 5",
            quantity: 988,
          },
        ],
      };

      beforeEach(() => {
        sinon.stub(productsModel, 'getAll').resolves(resposta);
      });

      afterEach(() => {
        productsModel.getAll.restore();
      });

      it('é um objeto', async () => {
        const result = await productsService.getAll();
        expect(result).to.be.an('object');

      });

      it('retorna os produtos', async () => {
        const result = await productsService.getAll();
        expect(result).to.be.equal(resposta)
      });
    });
  });

  describe('quando não há produtos', () => {
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(productsModel, 'getAll').resolves({ products: [] });
      });

      afterEach(() => {
        productsModel.getAll.restore();
      });

      it('é um objeto', async () => {
        const result = await productsService.getAll();
        expect(result).to.be.an('object');
      });

      it('objeto contém a chave "products"', async () => {
        const result = await productsService.getAll();
        expect(result).to.have.property('products');
      });

      it('a chave "products" é um array vazio', async () => {
        const { products } = await productsService.getAll();
        expect(products).to.be.empty;
      });
    });
  });
});

describe('Retorna um produto pelo ID', () => {
  describe('quando o produto é encontrado', () => {
    describe('a resposta', () => {
      const resposta = {
        _id: "6140fc0fb8bed969a7f1713b",
        name: "Playstation 5",
        quantity: 988,
      }
      beforeEach(() => {
        sinon.stub(productsModel, 'getById').resolves(resposta)
      });

      afterEach(() => {
        productsModel.getById.restore();
      });

      it('é um objeto', async () => {
        const result = await productsService.getById("6140fc0fb8bed969a7f1713b")
        expect(result).to.be.an('object');
      });

      it('o objeto contém o produto encontrado', async () => {
        const result = await productsService.getById("6140fc0fb8bed969a7f1713b")
        expect(result).to.be.equal(resposta);
      });

      it('o produto contém as chaves "_id", "name" e "quantity"', async () => {
        const result = await productsService.getById("6140fc0fb8bed969a7f1713b")
        expect(result).to.have.all.keys('_id', 'name', 'quantity');
      });
    });
  });

  describe('quando o ID não é válido', () => {
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(productsModel, 'getById').returns(null);
      });

      afterEach(() => {
        productsModel.getById.restore();
      });

      it('é um erro', async () => {
        const result = await productsService.getById('123').catch((err) => err);
        expect(result).to.be.an('error')
        // const promise = new Promise((resolve, rejects) => {
        //   productsService.getById().then(rejects, resolve);
        // });
        // const res = await promise;
        // console.log(res);
        // expect(res).to.be.an("error");
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const result = await productsService.getById('123').catch((err) => err);
        expect(result).to.have.property('statusCode');
      });

      it('a propriedade "statusCode" possui o valor "invalidIdFormat', async () => {
        const { statusCode } = await productsService.getById().catch((err) => err);
        expect(statusCode).to.be.equal('invalidIdFormat')
      });
    });
  });
});

describe('Testes da função "updateProduct"', () => {
  describe('quando o produto é atualizado com sucesso', () => {
    describe('a resposta', () => {
      const product = {
        _id: '6140bb9cb466da93c6393d5f',
        name: 'Produto Atualizado',
        quantity: 100,
      }
      const updatedProduct = {
        _id: '6140bb9cb466da93c6393d5f',
        name: 'Produto Atualizado',
        quantity: 100,
      };

      beforeEach(() => {
        sinon.stub(productsModel, 'updateProduct').resolves(updatedProduct);
      });

      afterEach(() => {
        productsModel.updateProduct.restore();
      });

      it('retorna o um objeto', async () => {
        const result = await productsService.updateProduct('id', product.name, product.quantity);
        expect(result).to.be.an('object');
      });

      it('o objeto possui as chaves "_id", "name" e "quantity"', async () => {
        const result = await productsService.updateProduct('id', product.name, product.quantity);
        expect(result).to.have.all.keys('_id', 'name', 'quantity');
      });

      it('objeto é o produto atualizado', async () => {
        const result = await productsService.updateProduct('id', product.name, product.quantity);
        expect(result).to.be.equal(updatedProduct);
      });
    });
  });

  describe('quando "name" é inválido', () => {
    describe('a resposta', () => {

      it('é um erro', async () => {
        const result = await productsService.updateProduct('id', 'a', 1).catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const result = await productsService.updateProduct('id', 'a', 1).catch((err) => err);
        expect(result).to.have.property('statusCode');
      });

      it('o "statusCode" possui o valor "invalidName"', async () => {
        const { statusCode } = await productsService.updateProduct('id', 'a', 1).catch((err) => err);
        expect(statusCode).to.be.equal('invalidName');
      });
    });
  });

  describe('quando "quantity" é menor que 1', () => {
    describe('a resposta', () => {

      it('é um erro', async () => {
        const result = await productsService.updateProduct('id', 'productName', 0).catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const result = await productsService.updateProduct('id', 'productName', 0).catch((err) => err);
        expect(result).to.have.property('statusCode');
      });

      it('o "statusCode" possui o valor "invalidName"', async () => {
        const { statusCode } = await productsService.updateProduct('id', 'productName', 0).catch((err) => err);
        expect(statusCode).to.be.equal('invalidQuantity');
      });
    });
  });

  describe('quando "quantity" não é do tipo "number"', () => {
    describe('a resposta', () => {

      it('é um erro', async () => {
        const result = await productsService.updateProduct('id', 'productName', '10').catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const result = await productsService.updateProduct('id', 'productName', '10').catch((err) => err);
        expect(result).to.have.property('statusCode');
      });

      it('o "statusCode" possui o valor "invalidName"', async () => {
        const { statusCode } = await productsService.updateProduct('id', 'productName', '10').catch((err) => err);
        expect(statusCode).to.be.equal('invalidQuantityType');
      });
    });
  });

  describe('quando o ID é inválido', () => {
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(ObjectId, 'isValid').returns(false);
      });

      afterEach(() => {
        ObjectId.isValid.restore();
      });

      it('é um erro', async () => {
        const result = await productsService.updateProduct('id', 'productName', 10).catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const result = await productsService.updateProduct('id', 'productName', 10).catch((err) => err);
        expect(result).to.have.property('statusCode');
      });

    it('o "statusCode" possui o valor "invalidQuantity"', async () => {
        const { statusCode } = await productsService.updateProduct('id', 'productName', 10).catch((err) => err);
        expect(statusCode).to.be.equal('invalidIdFormat');
      });
    });
  });
});

describe('Testes da função "deleteProduct"', () => {
  describe('quando um produto é deletado com sucesso', () => {
    const resposta = {
      _id: '614154f052108ab370e85b77',
      name: 'Playstation 5',
      quantity: 1000
    }
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(productsModel, 'deleteProduct').resolves(resposta);
      });

      afterEach(() => {
        productsModel.deleteProduct.restore();
      });

      it('retorna um objeto', async () => {
        const result = await productsService.deleteProduct('614154f052108ab370e85b77');
        expect(result).to.be.an('object');
      });

      it('o objeto é o produto removido', async () => {
        const result = await productsService.deleteProduct('614154f052108ab370e85b77');
        expect(result).to.be.equal(resposta);
      });

      it('o objeto possui as chaves "_id", "name" e "quantity"', async () => {
        const result = await productsService.deleteProduct('614154f052108ab370e85b77');
        expect(result).to.have.all.keys('_id', 'name', 'quantity');
      });
    });
  });

  describe('quando o ID é inválido', () => {
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(ObjectId, 'isValid').returns(false);
      });

      afterEach(() => {
        ObjectId.isValid.restore();
      });

      it('é um erro', async () => {
        const result = await productsService.deleteProduct('123').catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const result = await productsService.deleteProduct('123').catch((err) => err);
        expect(result).to.have.property('statusCode');
      });

    it('o "statusCode" possui o valor "invalidQuantity"', async () => {
        const { statusCode } = await productsService.deleteProduct('123').catch((err) => err);
        expect(statusCode).to.be.equal('invalidIdFormat');
      });
    });
  });
});

describe('Testes da função "createProduct', () => {
  describe('quando um produto é criado com sucesso', () => {
    const newProduct = {
      _id: '61415781d7aba7c11d050146',
      name: 'Playstation 5',
      quantity: 1000,
    };

    const resposta = {
      _id: '61415781d7aba7c11d050146',
      name: 'Playstation 5',
      quantity: 1000,
    }
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(productsModel, 'createProduct').resolves(resposta);
      });

      afterEach(() => {
        productsModel.createProduct.restore();
      });

      it('retorna um objeto', async () => {
        const result = await productsService.createProduct(newProduct);
        expect(result).to.be.an('object');
      });

      it('o objeto é o produto adicionado', async () => {
        const result = await productsService.createProduct(newProduct);
        expect(result).to.be.equal(resposta);
      });

      it('o objeto contém as chaves "_id", "name" e "quantity"', async () => {
        const result = await productsService.createProduct(newProduct);
        expect(result).to.have.all.keys('_id', 'name', 'quantity');
      });
    });
  });

  describe('quando "name" for inválido', () => {
    const newProduct = { name: '', quantity: 100 };
    describe('a resposta', () => {
      it('é um erro', async () => {
        const result = await productsService.createProduct(newProduct).catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const { statusCode } = await productsService.createProduct(newProduct).catch((err) => err);
        expect(statusCode).to.exist;
      });

      it('"statusCode" possui o valor "invalidName"', async () => {
        const { statusCode } = await productsService.createProduct(newProduct).catch((err) => err);
        expect(statusCode).to.equal('invalidName');
      });
    });
  });

  describe('quando "quantity" for uma string', () => {
    const newProduct = { name: 'NewProduct', quantity: '10' };
    describe('a resposta', () => {
      it('é um erro', async () => {
        const result = await productsService.createProduct(newProduct).catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const { statusCode } = await productsService.createProduct(newProduct).catch((err) => err);
        expect(statusCode).to.exist;
      });

      it('"statusCode" possui o valor "invalidQuantityType"', async () => {
        const { statusCode } = await productsService.createProduct(newProduct).catch((err) => err);
        expect(statusCode).to.equal('invalidQuantityType');
      });
    });
  });

  describe('quando "quantity" for menor que 1', () => {
    const newProduct = { name: 'NewProduct', quantity: 0 };
    describe('a resposta', () => {
      it('é um erro', async () => {
        const result = await productsService.createProduct(newProduct).catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const { statusCode } = await productsService.createProduct(newProduct).catch((err) => err);
        expect(statusCode).to.exist;
      });

      it('"statusCode" possui o valor "invalidQuantity"', async () => {
        const { statusCode } = await productsService.createProduct(newProduct).catch((err) => err);
        expect(statusCode).to.equal('invalidQuantity');
      });
    });
  });

  describe('quando já existe um produto com o mesmo nome', () => {
    const alreadyExists = {
      _id: '61415781d7aba7c11d050146',
      name: 'Playstation 5',
      quantity: 1000,
    }

    const newProduct = {
      _id: '61415781d7aba7c11d050146',
      name: 'Playstation 5',
      quantity: 1000,
    }

    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(productsModel, 'findByName').resolves(alreadyExists);
      });

      afterEach(() => {
        productsModel.findByName.restore();
      });

      it('é um erro', async () => {
        const result = await productsService.createProduct(newProduct).catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const { statusCode } = await productsService.createProduct(newProduct).catch((err) => err);
        expect(statusCode).to.exist;
      });

      it('"statusCode" possui o valor "alreadyExists"', async () => {
        const { statusCode } = await productsService.createProduct(newProduct).catch((err) => err);
        expect(statusCode).to.equal('alreadyExists');
      });
    });
  });
});

describe('Retorna todos as Vendas cadastradas', () => {
  describe('quando existem vendas cadastradas', () => {
    describe('a resposta', () => {
      const resposta = {
        sales: [
          {
            _id: '61415e989c49c0e2ee2c32a6',
            itensSold: [
              {
                productId: '61415781d7aba7c11d050146',
                quantity: 10,
              },
            ],
          },
        ],
      };

      beforeEach(() => {
        sinon.stub(salesModel, 'getAll').resolves(resposta);
      });

      afterEach(() => {
        salesModel.getAll.restore();
      });

      it('é um objeto', async () => {
        const result = await salesService.getAll();
        expect(result).to.be.an('object');

      });

      it('objeto contém a chave "sales"', async () => {
        const result = await salesService.getAll();
        expect(result).to.have.property('sales');
      });

      it('retorna as vendas cadastradas', async () => {
        const result = await salesService.getAll();
        expect(result).to.be.equal(resposta)
      });
    });
  });

  describe('quando não há produtos', () => {
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(salesModel, 'getAll').resolves({ sales: [] });
      });

      afterEach(() => {
        salesModel.getAll.restore();
      });

      it('é um objeto', async () => {
        const result = await salesService.getAll();
        expect(result).to.be.an('object');
      });

      it('objeto contém a chave "sales"', async () => {
        const result = await salesService.getAll();
        expect(result).to.have.property('sales');
      });

      it('a chave "sales" é um array vazio', async () => {
        const { sales } = await salesService.getAll();
        expect(sales).to.be.empty;
      });
    });
  });
});

describe('Retorna um produto pelo ID', () => {
  describe('quando o produto é encontrado', () => {
    describe('a resposta', () => {
      const resposta = {
        _id: '614160b4109145ec555b8426',
        itensSold: [
          {
            productId: '614160ab109145ec555b8425',
            quantity: 10,
          },
        ],
      };

      beforeEach(() => {
        sinon.stub(salesModel, 'getById').resolves(resposta)
      });

      afterEach(() => {
        salesModel.getById.restore();
      });

      it('é um objeto', async () => {
        const result = await salesService.getById('14160b4109145ec555b8426');
        expect(result).to.be.an('object');
      });

      it('o objeto contém a venda encontrado', async () => {
        const result = await salesService.getById('14160b4109145ec555b8426');
        expect(result).to.be.equal(resposta);
      });

      it('o produto contém as chaves "_id" e "itensSold"', async () => {
        const result = await salesService.getById('14160b4109145ec555b8426');
        expect(result).to.have.all.keys('_id', 'itensSold');
      });

      it('"itensSold" é um array', async () => {
        const { itensSold } = await salesService.getById('14160b4109145ec555b8426');
        expect(itensSold).to.be.an('array');
      });

      it('"itensSold" possui as chaves "productId" e "quantity"', async () => {
        const { itensSold } = await salesService.getById('14160b4109145ec555b8426');
        expect(itensSold[0]).to.have.all.keys('productId', 'quantity');
      });
    });
  });

  describe('quando o ID não é válido', () => {
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(ObjectId, 'isValid').returns(false);
      });

      afterEach(() => {
        ObjectId.isValid.restore();
      });

      it('é um erro', async () => {
        const result = await salesService.getById('123').catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const result = await salesService.getById('123').catch((err) => err);
        expect(result).to.have.property('statusCode');
      });

      it('a propriedade "statusCode" possui o valor "saleNotFound', async () => {
        const { statusCode } = await salesService.getById('123').catch((err) => err);
        expect(statusCode).to.be.equal('saleNotFound')
      });
    });
  });
});

describe('Testes da função "newSale"', () => {
  describe('quando uma venda é criada com sucesso', () => {
    const newSale = [
      {
        productId: '614160ab109145ec555b8425',
        quantity: 10,
      },
    ];

    const resposta = {
      itensSold: [
        {
          productId: '614160ab109145ec555b8425',
          quantity: 10,
        },
      ],
      _id: '614162f012c7a6f7795bc5d1',
    };

    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(salesModel, 'newSale').resolves(resposta);
        sinon.stub(salesModel, 'sellQuantity').returns({})
      });

      afterEach(() => {
        salesModel.sellQuantity.restore();
        salesModel.newSale.restore();
      });

      it('retorna um objeto', async () => {
        const result = await salesService.newSale(newSale);
        expect(result).to.be.an('object');
      });

      it('o objeto é a venda cadastrada', async () => {
        const result = await salesService.newSale(newSale);
        expect(result).to.equal(resposta);
      });

      it('o objeto contém as chaves "itensSold" e "_id"', async () => {
        const result = await salesService.newSale(newSale);
        expect(result).to.have.all.keys('_id', 'itensSold');
      });

      it('"itensSold é um array"', async () => {
        const { itensSold } = await salesService.newSale(newSale);
        expect(itensSold).to.be.an('array');
      });

      it('o array possui um objeto', async () => {
        const { itensSold } = await salesService.newSale(newSale);
        expect(itensSold[0]).to.be.an('object');
      });

      it('o objeto possui as chaves "productId" e "quantity"', async () => {
        const { itensSold } = await salesService.newSale(newSale);
        expect(itensSold[0]).to.have.all.keys('productId', 'quantity');
      });
    });
  });

  describe('a venda atualiza a quantidade dos produtos', () => {
    const newSale = [
      {
        productId: '614160ab109145ec555b8425',
        quantity: 10,
      },
    ];

    const resposta = {
      itensSold: [
        {
          productId: '614160ab109145ec555b8425',
          quantity: 10,
        },
      ],
      _id: '614162f012c7a6f7795bc5d1',
    };

    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(salesModel, 'sellQuantity').resolves({ modifiedCount: 1 })
        sinon.stub(salesModel, 'newSale').resolves(resposta);
      });

      afterEach(() => {
        salesModel.newSale.restore();
        salesModel.sellQuantity.restore();
      });

      it('é um objeto', async () => {
        const result = await salesService.newSale(newSale);
        expect(result).to.be.an('object');
      });

      it('o objeto é a venda cadastrada', async () => {
        const result = await salesService.newSale(newSale);
        expect(result).to.be.equal(resposta);
      });

      it('o objeto contém as chaves "itensSold" e "_id"', async () => {
        const result = await salesService.newSale(newSale);
        expect(result).to.have.all.keys('_id', 'itensSold');
      });

      it('"itensSold é um array"', async () => {
        const { itensSold } = await salesService.newSale(newSale);
        expect(itensSold).to.be.an('array');
      });

      it('o array possui um objeto', async () => {
        const { itensSold } = await salesService.newSale(newSale);
        expect(itensSold[0]).to.be.an('object');
      });

      it('o objeto possui as chaves "productId" e "quantity"', async () => {
        const { itensSold } = await salesService.newSale(newSale);
        expect(itensSold[0]).to.have.all.keys('productId', 'quantity');
      });
    });
  });

  describe('quando não há estoque', () => {
    const newSale = [
      {
        productId: '614160ab109145ec555b8425',
        quantity: 10,
      },
    ];
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(salesModel, 'sellQuantity').resolves(null)
      });

      afterEach(() => {
        salesModel.sellQuantity.restore();
      });
      it('é um erro', async () => {
        const result = await salesService.newSale(newSale).catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const { statusCode } = await salesService.newSale(newSale).catch((err) => err);
        expect(statusCode).to.exist;
      });

      it('"statusCode" possui o valor "stockProblem"', async () => {
        const { statusCode } = await salesService.newSale(newSale).catch((err) => err);
        expect(statusCode).to.equal('stockProblem');
      });
    });
  });

  describe('quando a venda possui uma quantidade inválida', () => {
    const newSale = [
      {
        productId: '614160ab109145ec555b8425',
        quantity: 0,
      },
    ];

    describe('a resposta', () => {
      it('é um erro', async () => {
        const result = await salesService.newSale(newSale).catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const { statusCode } = await salesService.newSale(newSale).catch((err) => err);
        expect(statusCode).to.exist;
      });

      it('"statusCode" possui o valor "invalidSale"', async () => {
        const { statusCode } = await salesService.newSale(newSale).catch((err) => err);
        expect(statusCode).to.equal('invalidSale');
      });
    });
  });
});

describe('Testes da função "updateSale"', () => {
  describe('quando a venda é atualizada com sucesso', () => {
    describe('a resposta', () => {
      const newSale = [{
        productId: '6140bb9cb466da93c6393d5f',
        quantity: 100,
      }];

      const resposta = {
        _id: '614160b4109145ec555b8426',
        itensSold: [
          {
            productId: '6140fd5080d16d1aed89az',
            quantity: 100,
          },
        ],
      };

      beforeEach(() => {
        sinon.stub(salesModel, 'updateSale').resolves(resposta);
      });

      afterEach(() => {
        salesModel.updateSale.restore();
      });

      it('retorna um objeto', async () => {
        const result = await salesService.updateSale('id', newSale);
        expect(result).to.be.an('object');
      });

      it('o objeto possui as chaves "_id" e "itensSold"', async () => {
        const result = await salesService.updateSale('id', newSale);
        expect(result).to.have.all.keys('_id', 'itensSold');
      });

      it('objeto é o produto atualizado', async () => {
        const result = await salesService.updateSale('id', newSale);
        expect(result).to.be.equal(resposta);
      });
    });
  });

  describe('quando o ID é inválido', () => {
    describe('a resposta', () => {
      const newSale = [{
        productId: '6140bb9cb466da93c6393d5f',
        quantity: 100,
      }];

      beforeEach(() => {
        sinon.stub(ObjectId, 'isValid').returns(false);
      });

      afterEach(() => {
        ObjectId.isValid.restore();
      });

      it('é null', async () => {
        const result = await salesService.updateSale('id', newSale);
        expect(result).to.be.null;
      });
    });
  });

  describe('quando a venda possui uma quantidade inválida', () => {
    describe('a resposta', () => {
      const newSale = [{
        productId: '6140bb9cb466da93c6393d5f',
        quantity: 0,
      }];

      it('é um erro', async () => {
        const result = await salesService.updateSale('id', newSale).catch((err) => err);
        expect(result).to.be.an('error');
      });

      it('o erro possui uma propriedade "statusCode"', async () => {
        const result = await salesService.updateSale('id', newSale).catch((err) => err);
        expect(result).to.have.property('statusCode');
      });

      it('o "statusCode" possui o valor "invalidSale"', async () => {
        const { statusCode } = await salesService.updateSale('id', newSale).catch((err) => err);
        expect(statusCode).to.be.equal('invalidSale');
      });
    });
  });

  describe('Testa a funcao "updateProductQtts"', () => {
    describe('quando sucesso', () => {
      describe('a resposta', () => {
        beforeEach(() => {
          sinon.stub(salesModel, 'sellQuantity').resolves({ _id: '123', name: 'Teste', quantity: 100 });
        });

        afterEach(() => {
          salesModel.sellQuantity.restore();
        });

        it('é uma Promise', async () => {
          const result = await salesService.updateProductQtts([{ productId: '614160ab109145ec555b8425' , quantity: 100 }]);
          expect(result).to.be.an('array');
        });
      });
    });

    describe('quando falha', () => {
      describe('a resposta', () => {
        beforeEach(() => {
          sinon.stub(salesModel, 'sellQuantity').resolves(false);
        });

        afterEach(() => {
          salesModel.sellQuantity.restore();
        });

        it('é um erro', async () => {
          const result = await salesService
            .updateProductQtts(
              [{ productId: '614160ab109145ec555b8425' , quantity: 100 }]
            ).catch((err) => err);
          expect(result).to.be.an('error');
        });
      });
    });
  });
});

describe('Testes da função "deleteSale"', () => {
  describe('quando uma venda é excluída com sucesso', () => {
    const resposta = {
      _id: '614177d2759bd24939c2059c',
      itensSold: [
        {
          productId: '614177c3759bd24939c2059b',
          quantity: 10,
        },
      ],
    };
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(salesModel, 'deleteSale').resolves(resposta);
        sinon.stub(salesModel, 'getById').returns(resposta);
        sinon.stub(salesModel, 'sellQuantity').resolves(true)
      });

      afterEach(() => {
        salesModel.sellQuantity.restore();
        salesModel.getById.restore();
        salesModel.deleteSale.restore();
      });

      it('retorna um objeto', async () => {
        const result = await salesService.deleteSale('614177d2759bd24939c2059c');
        expect(result).to.be.an('object');
      });

      it('o objeto é a venda removida', async () => {
        const result = await salesService.deleteSale('614177d2759bd24939c2059c');
        expect(result).to.be.equal(resposta);
      });

      it('o objeto possui as chaves "_id" e "itensSold"', async () => {
        const result = await salesService.deleteSale('614177d2759bd24939c2059c');
        expect(result).to.have.all.keys('_id', 'itensSold');
      });
    });
  });

  describe('quando o ID é inválido', () => {
    describe('a resposta', () => {
      beforeEach(() => {
        sinon.stub(salesModel, 'getById').resolves(false);
        sinon.stub(ObjectId, 'isValid').returns(false);
      });

      afterEach(() => {
        salesModel.getById.restore();
        ObjectId.isValid.restore();
      });

      it('retorna um erro', async () => {
        const result = await salesService.deleteSale('614177d2759bd24939c2059c').catch((err) => err);
        expect(result).to.be.an('error');
      });
    });
  });
});
