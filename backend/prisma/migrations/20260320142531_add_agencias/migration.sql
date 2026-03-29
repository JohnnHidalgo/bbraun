-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clientes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "agenciaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "clientes_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "agencias" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_clientes" ("ciudad", "createdAt", "direccion", "id", "nombre", "tipo", "updatedAt") SELECT "ciudad", "createdAt", "direccion", "id", "nombre", "tipo", "updatedAt" FROM "clientes";
DROP TABLE "clientes";
ALTER TABLE "new_clientes" RENAME TO "clientes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
