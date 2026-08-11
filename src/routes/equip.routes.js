import equipController from "../controller/equip.controller.js";

export default async function equipRoutes(fastify) {
  // ==================================================
  // EQUIPAMENTOS
  // ==================================================

  fastify.get("/getAllEquip", async () => {
    return equipController.get();
  });

  fastify.post("/create", async (request) => {
    return equipController.createEquipamento(request);
  });

  fastify.put("/:id", async (request) => {
    return equipController.updateEquipamento(request);
  });

  fastify.delete("/:id", async (request) => {
    return equipController.deleteEquipamento(request);
  });

  // ==================================================
  // PEÇAS
  // ==================================================

  fastify.post("/pecas", async (request) => {
    return equipController.createPeca(request);
  });

  fastify.put("/pecas/:id", async (request) => {
    return equipController.updatePeca(request);
  });

  fastify.delete("/pecas/:id", async (request) => {
    return equipController.deletePeca(request);
  });

  // ==================================================
  // ESTOQUE
  // ==================================================

  fastify.put("/pecas/:id/acrescentar", async (request) => {
    return equipController.acrescentarPeca(request);
  });

  fastify.put("/pecas/:id/retirar", async (request) => {
    return equipController.retirarPeca(request);
  });
}
