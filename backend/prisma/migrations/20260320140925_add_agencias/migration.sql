-- CreateTable
CREATE TABLE "agencias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ageCentro" INTEGER NOT NULL,
    "ageOficina" INTEGER NOT NULL,
    "ageCodigo" TEXT NOT NULL,
    "ageNombre" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "agencias_ageCentro_ageOficina_ageCodigo_key" ON "agencias"("ageCentro", "ageOficina", "ageCodigo");
