import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const equipRepository = {
  // ==================================================
  // BUSCAR TODOS OS EQUIPAMENTOS
  // ==================================================

  async get() {
    return await sql`

      SELECT 
        e.id,
        e.nome,
        e.descricao,
        e.imagem,
        e.quantidade,
        e.status,

        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'codigo', p.codigo,
              'nome', p.nome,
              'estoque', p.estoque,
              'grandeza', p.grandeza,
              'preco', p.preco,
              'localizacao', p.localizacao,
              'status', p.status,
              'categoria', c.nome
            )
          ) FILTER (WHERE p.id IS NOT NULL),

          '[]'
        ) AS pecas

      FROM equipamentos e

      LEFT JOIN pecas p
        ON p.equipamento_id = e.id

      LEFT JOIN categorias c
        ON c.id = p.categoria_id

      GROUP BY e.id;

    `;
  },

  // ==================================================
  // CRIAR EQUIPAMENTO
  // ==================================================

  async createEquipamento({ nome, descricao, imagem, quantidade, status }) {
    const resultado = await sql`

      INSERT INTO equipamentos
        (
          nome,
          descricao,
          imagem,
          quantidade,
          status
        )

      VALUES
        (
          ${nome},
          ${descricao},
          ${imagem},
          ${quantidade},
          ${status}
        )

      RETURNING *;

    `;

    return resultado[0];
  },

  // ==================================================
  // EDITAR EQUIPAMENTO
  // ==================================================

  async updateEquipamento(id, { nome, descricao, imagem, quantidade, status }) {
    const resultado = await sql`

      UPDATE equipamentos

      SET
        nome = ${nome},
        descricao = ${descricao},
        imagem = ${imagem},
        quantidade = ${quantidade},
        status = ${status}

      WHERE id = ${id}

      RETURNING *;

    `;

    return resultado[0];
  },

  // ==================================================
  // EXCLUIR EQUIPAMENTO
  // ==================================================

  async deleteEquipamento(id) {
    await sql`

      DELETE FROM equipamentos

      WHERE id = ${id};

    `;

    return {
      mensagem: "Equipamento excluído com sucesso",
    };
  },

  // ==================================================
  // CRIAR PEÇA
  // ==================================================

  async createPeca({
    equipamento_id,
    codigo,
    nome,
    categoria,
    estoque,
    grandeza,
    preco,
    localizacao,
    status,
  }) {
    // Primeiro encontra o ID da categoria
    const categoriaResult = await sql`

      SELECT id
      FROM categorias
      WHERE nome = ${categoria};

    `;

    if (categoriaResult.length === 0) {
      throw new Error("Categoria não encontrada");
    }

    const categoria_id = categoriaResult[0].id;

    // Depois cria a peça
    const resultado = await sql`

      INSERT INTO pecas (

        equipamento_id,
        codigo,
        nome,
        categoria_id,
        estoque,
        grandeza,
        preco,
        localizacao,
        status

      )

      VALUES (

        ${equipamento_id},
        ${codigo},
        ${nome},
        ${categoria_id},
        ${estoque},
        ${grandeza},
        ${preco},
        ${localizacao},
        ${status}

      )

      RETURNING *;

    `;

    return resultado[0];
  },

  // ==================================================
  // EDITAR PEÇA
  // ==================================================

  async updatePeca(
    id,
    { codigo, nome, categoria, estoque, grandeza, preco, localizacao, status },
  ) {
    const categoriaResult = await sql`

      SELECT id
      FROM categorias
      WHERE nome = ${categoria};

    `;

    if (categoriaResult.length === 0) {
      throw new Error("Categoria não encontrada");
    }

    const categoria_id = categoriaResult[0].id;

    const resultado = await sql`

      UPDATE pecas

      SET

        codigo = ${codigo},
        nome = ${nome},
        categoria_id = ${categoria_id},
        estoque = ${estoque},
        grandeza = ${grandeza},
        preco = ${preco},
        localizacao = ${localizacao},
        status = ${status}

      WHERE id = ${id}

      RETURNING *;

    `;

    return resultado[0];
  },

  // ==================================================
  // EXCLUIR PEÇA
  // ==================================================

  async deletePeca(id) {
    await sql`

      DELETE FROM pecas

      WHERE id = ${id};

    `;

    return {
      mensagem: "Peça excluída com sucesso",
    };
  },

  // ==================================================
  // ACRESCENTAR ESTOQUE
  // ==================================================

  async acrescentarPeca(id) {
    const resultado = await sql`

      UPDATE pecas

      SET estoque = estoque + 1

      WHERE id = ${id}

      RETURNING *;

    `;

    return resultado[0];
  },

  // ==================================================
  // RETIRAR ESTOQUE
  // ==================================================

  async retirarPeca(id) {
    const resultado = await sql`

      UPDATE pecas

      SET estoque = estoque - 1

      WHERE id = ${id}
      AND estoque > 0

      RETURNING *;

    `;

    return resultado[0];
  },
};

export default equipRepository;

