import authController from "../controller/auth.controller.js";

export default async function authRoutes(fastify) {
  fastify.post("/register", async (request, reply) =>
    authController.register(request, reply),
  );
  fastify.post("/login", async (request, reply) =>
    authController.login(request, reply),
  );
}
