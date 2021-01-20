const { formatPrice } = require('../../lib/utils');

const Category = require('../models/Category-model');
const Product = require('../models/Product-model');
const File = require('../models/File')

module.exports = {
  create(req, res) {
    // Pega categorias, executando uma query que está descrita em Category-model
    Category.all()
      .then(function (results) {
        const categories = results.rows;
        // Array de categories que foi buscar no SQL
        return res.render('products/create.njk', { categories });
        // passe os dados da variável categories, que são os dados do SQL que retornamos da query SQL category-model. para a página create.njk
      })
      .catch(function (err) {
        throw new Error(err);
      });
  },
  async post(req, res) {
    // Salvar dados no SQL

    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Please, fill all fields!');

        // Verifica se o usuário preencheu todos os campos de entrada que nós pedimos, caso contrário, vai falar: por favor preencha todos os campos
      }
    }

    if(req.files.length == 0)
      return res.send('Please, send at least one image')    

    let results = await Product.create(req.body);
    const productId = results.rows[0]; //só vai retornar a primeira posição do sql, porque o model product retorna somente o ID que foi alvo da operação/query SQL (RETURNING id)

    const filesPromise = req.files.map(file => File.create({...file, product_id: productId}))
    await Promise.all(filesPromise)

    return res.redirect(`/products/${productId}/edit`);
  },
  async edit(req, res) {
    let results = await Product.find(req.params.id);
    const product = results.rows; //só vai retornar a primeira posição do sql, porque o model product retorna somente o ID que foi alvo da operação/query SQL (RETURNING id)

    if (!product) return res.send('Product not found');

    product.old_price = formatPrice(product.old_price);
    product.price = formatPrice(product.price);

    results = await Category.all();
    const categories = results.rows;

    // Aqui precisamos retornar tudo que vier da consulta/query categories, porque a gente vai mostrar no site todas as opções de categorias.

    results = await Product.files(product.id)
    let files = results.rowsfiles 
    files = files.map(file => ({
      ...file,
      src: `{req.protocol}://${req.headers.host}${file.path.replace("public", "")}` 
      // protocol: Se for http vai pegar http, https, https.
      // header.host: Qual o caminho URL completo do site/app
    }))

    // get images

    return res.render('products/edit.njk', { product, categories, files });
  },
  async put(req, res) {
    for (key of keys) {
      if (req.body[key] == '' && key != "removed_files") {
        return res.send('Please, fill all fields!');

        // A segunda condição é pq temos um campo removed_files, e se ele estiver hidden, mesmo assim é considerado uma key vazia, então essa verificação é pra o campo hidden não dar trigger na nossa verificação de campos vazios.

        // Verifica se o usuário preencheu todos os campos de entrada que nós pedimos, caso contrário, vai falar: por favor preencha todos os campos
      }
    }

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map(file => 
        File.create({...file, product_id: req.body.id}))

      await Promise.all(newFilesPromise)
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.splt(",")
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex,1)

      const removedFilesPromise = removedFiles.map(id => File.delete(id))

      await Promise.all(removedFilesPromise)
    }

    req.body.price = req.body.price.replace(/\D/g, '');

    if (req.body.old_price != req.body.price) {
      const oldProduct = await Product.find(req.body.id);

      req.body.old_price = oldProduct.rows[0].price;
    }

    await Product.update(req.body);

    return res.redirect(`/products/${req.body.id}/edit`);
  },
  async delete(req, res) {
    await Product.delete(req.body.id);

    return res.redirect('/products/create');
  },
};
