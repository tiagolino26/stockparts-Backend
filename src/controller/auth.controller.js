import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRepository from "../repository/auth.repository.js";

const authController = {
  async register(request, reply) {
    const { nome, email, senha } = request.body;

    if (!nome || !email || !senha) {
      return reply
        .status(400)
        .send({ erro: "Nome, email e senha são obrigatórios." });
    }

    const existente = await authRepository.buscarPorEmail(email);
    if (existente) {
      return reply.status(409).send({ erro: "Email já cadastrado." });
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const usuario = await authRepository.criarUsuario({
      nome,
      email,
      senha_hash,
    });

    return usuario;
  },

  async login(request, reply) {
    const { email, senha } = request.body;

    if (!email || !senha) {
      return reply
        .status(400)
        .send({ erro: "Email e senha são obrigatórios." });
    }

    const usuario = await authRepository.buscarPorEmail(email);
    if (!usuario) {
      return reply.status(401).send({ erro: "Credenciais inválidas." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return reply.status(401).send({ erro: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    };
  },
};

export default authController;
