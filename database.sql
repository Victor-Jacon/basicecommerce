CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int,
  "user_id" int,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int NOT NULL,
  "status" int NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "path" text NOT NULL,
  "product_id" int
);

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

/* Esta chave estrangeiro na category id, está referenciando a tabela categories, no campo id*/

ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

/* Depois de criado, o arquivo .sql é aberto no VS CODE, e o código é copiado para dentro do postbird para ser executado a query*/

/* Se vc tentar cadastrar algo no banco de dados que não respeite uma constraint , a tentativa vai retornar erro, e não vai realizar a criação ou atualização do registro*/

/* Se o valor daquele campo não puder ser null/vazio, vc pode usar [not null] */

/* Para deletar um banco de dados use DROP DATABASE "nome do db" */