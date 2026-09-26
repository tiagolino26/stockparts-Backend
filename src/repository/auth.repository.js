import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const authRepository = {
  async criarUsuario({ nome, email, senha_hash }) {
    const resultado = await sql`
      INSERT INTO usuarios (nome, email, senha_hash)
      VALUES (${nome},${email},${senha_hash})
      RETURNING id, nome, email;
    `;
    return resultado[0];
  },

  async buscarPorEmail(email) {
    const resultado = await sql`
      SELECT * FROM usuarios WHERE email =${email};
    `;
    return resultado[0];
  },
};

export default authRepository;
