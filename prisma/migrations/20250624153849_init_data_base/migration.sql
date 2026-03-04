-- CreateEnum
CREATE TYPE "TypeConnaissance" AS ENUM ('BONNE_PRATIQUE', 'LECON_APPRISE', 'INNOVATION', 'ETUDE_DE_CAS', 'TEMOIGNAGE');

-- CreateEnum
CREATE TYPE "StatutConnaissance" AS ENUM ('BROUILLON', 'EN_VALIDATION', 'PUBLIE', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('LECTEUR', 'CONTRIBUTEUR', 'ADMINISTRATEUR');

-- CreateEnum
CREATE TYPE "TypeActeur" AS ENUM ('ONG', 'MINISTERE', 'BENEFICIAIRE', 'CTD', 'PARTENAIRE_TECHNIQUE', 'EQUIPE_PROJET');

-- CreateTable
CREATE TABLE "Connaissance" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TypeConnaissance" NOT NULL,
    "statut" "StatutConnaissance" NOT NULL DEFAULT 'BROUILLON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "auteurId" INTEGER NOT NULL,

    CONSTRAINT "Connaissance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nomComplet" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "RoleUtilisateur" NOT NULL DEFAULT 'LECTEUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acteurId" INTEGER,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acteur" (
    "id" SERIAL NOT NULL,
    "nomActeur" TEXT NOT NULL,
    "typeActeur" "TypeActeur" NOT NULL,

    CONSTRAINT "Acteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "fichierUrl" TEXT NOT NULL,
    "typeDocument" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "televerseParId" INTEGER NOT NULL,
    "produitParAtelierId" INTEGER,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AxeAnalytique" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,

    CONSTRAINT "AxeAnalytique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComposanteProjet" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "ComposanteProjet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localisation" (
    "id" SERIAL NOT NULL,
    "nomCommune" TEXT NOT NULL,
    "nomDistrict" TEXT NOT NULL,
    "nomRegion" TEXT NOT NULL,

    CONSTRAINT "Localisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicateur" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "valeurCible" TEXT,
    "valeurAtteinte" TEXT,

    CONSTRAINT "Indicateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atelier" (
    "id" SERIAL NOT NULL,
    "sujet" TEXT NOT NULL,
    "dateAtelier" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Atelier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConnaissanceToLocalisation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ConnaissanceToLocalisation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ConnaissanceToDocument" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ConnaissanceToDocument_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ConnaissanceToIndicateur" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ConnaissanceToIndicateur_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ActeurToConnaissance" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ActeurToConnaissance_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ActeurToAtelier" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ActeurToAtelier_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AxeAnalytiqueToConnaissance" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AxeAnalytiqueToConnaissance_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ComposanteProjetToConnaissance" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ComposanteProjetToConnaissance_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_acteurId_key" ON "Utilisateur"("acteurId");

-- CreateIndex
CREATE UNIQUE INDEX "Acteur_nomActeur_key" ON "Acteur"("nomActeur");

-- CreateIndex
CREATE UNIQUE INDEX "AxeAnalytique_libelle_key" ON "AxeAnalytique"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "ComposanteProjet_nom_key" ON "ComposanteProjet"("nom");

-- CreateIndex
CREATE INDEX "_ConnaissanceToLocalisation_B_index" ON "_ConnaissanceToLocalisation"("B");

-- CreateIndex
CREATE INDEX "_ConnaissanceToDocument_B_index" ON "_ConnaissanceToDocument"("B");

-- CreateIndex
CREATE INDEX "_ConnaissanceToIndicateur_B_index" ON "_ConnaissanceToIndicateur"("B");

-- CreateIndex
CREATE INDEX "_ActeurToConnaissance_B_index" ON "_ActeurToConnaissance"("B");

-- CreateIndex
CREATE INDEX "_ActeurToAtelier_B_index" ON "_ActeurToAtelier"("B");

-- CreateIndex
CREATE INDEX "_AxeAnalytiqueToConnaissance_B_index" ON "_AxeAnalytiqueToConnaissance"("B");

-- CreateIndex
CREATE INDEX "_ComposanteProjetToConnaissance_B_index" ON "_ComposanteProjetToConnaissance"("B");

-- AddForeignKey
ALTER TABLE "Connaissance" ADD CONSTRAINT "Connaissance_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_acteurId_fkey" FOREIGN KEY ("acteurId") REFERENCES "Acteur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_televerseParId_fkey" FOREIGN KEY ("televerseParId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_produitParAtelierId_fkey" FOREIGN KEY ("produitParAtelierId") REFERENCES "Atelier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnaissanceToLocalisation" ADD CONSTRAINT "_ConnaissanceToLocalisation_A_fkey" FOREIGN KEY ("A") REFERENCES "Connaissance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnaissanceToLocalisation" ADD CONSTRAINT "_ConnaissanceToLocalisation_B_fkey" FOREIGN KEY ("B") REFERENCES "Localisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnaissanceToDocument" ADD CONSTRAINT "_ConnaissanceToDocument_A_fkey" FOREIGN KEY ("A") REFERENCES "Connaissance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnaissanceToDocument" ADD CONSTRAINT "_ConnaissanceToDocument_B_fkey" FOREIGN KEY ("B") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnaissanceToIndicateur" ADD CONSTRAINT "_ConnaissanceToIndicateur_A_fkey" FOREIGN KEY ("A") REFERENCES "Connaissance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnaissanceToIndicateur" ADD CONSTRAINT "_ConnaissanceToIndicateur_B_fkey" FOREIGN KEY ("B") REFERENCES "Indicateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActeurToConnaissance" ADD CONSTRAINT "_ActeurToConnaissance_A_fkey" FOREIGN KEY ("A") REFERENCES "Acteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActeurToConnaissance" ADD CONSTRAINT "_ActeurToConnaissance_B_fkey" FOREIGN KEY ("B") REFERENCES "Connaissance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActeurToAtelier" ADD CONSTRAINT "_ActeurToAtelier_A_fkey" FOREIGN KEY ("A") REFERENCES "Acteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActeurToAtelier" ADD CONSTRAINT "_ActeurToAtelier_B_fkey" FOREIGN KEY ("B") REFERENCES "Atelier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AxeAnalytiqueToConnaissance" ADD CONSTRAINT "_AxeAnalytiqueToConnaissance_A_fkey" FOREIGN KEY ("A") REFERENCES "AxeAnalytique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AxeAnalytiqueToConnaissance" ADD CONSTRAINT "_AxeAnalytiqueToConnaissance_B_fkey" FOREIGN KEY ("B") REFERENCES "Connaissance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComposanteProjetToConnaissance" ADD CONSTRAINT "_ComposanteProjetToConnaissance_A_fkey" FOREIGN KEY ("A") REFERENCES "ComposanteProjet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComposanteProjetToConnaissance" ADD CONSTRAINT "_ComposanteProjetToConnaissance_B_fkey" FOREIGN KEY ("B") REFERENCES "Connaissance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
