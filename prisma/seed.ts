import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding VentureMatch database...");

  // Capability Families + Capabilities
  const families = [
    { name: "Engineering & Technical", slug: "engineering", capabilities: ["Software Development","Mobile Development","System Architecture","Cloud & DevOps","Data Engineering","Embedded Systems","Cybersecurity"] },
    { name: "Design & Creative", slug: "design", capabilities: ["Product Design","UI/UX Design","Graphic Design","Brand Identity","Motion Graphics","3D Modeling"] },
    { name: "Business & Strategy", slug: "business", capabilities: ["Business Strategy","Financial Modeling","Market Research","Sales","Business Development","Operations Management"] },
    { name: "Marketing & Growth", slug: "marketing", capabilities: ["Digital Marketing","Content Creation","SEO/SEM","Social Media","Email Marketing","Growth Hacking"] },
    { name: "Science & Research", slug: "science", capabilities: ["Biotechnology","Data Science","Machine Learning","Research & Analysis","Chemistry","Environmental Science"] },
    { name: "Communication & Media", slug: "communication", capabilities: ["Public Speaking","Technical Writing","Copywriting","Journalism","Video Production","Photography"] },
    { name: "Management & Leadership", slug: "management", capabilities: ["Project Management","Team Leadership","Product Management","Agile/Scrum","Fundraising","Legal & Compliance"] },
  ];

  for (const family of families) {
    const fam = await db.capabilityFamily.upsert({
      where: { slug: family.slug },
      update: {},
      create: { name: family.name, slug: family.slug, status: "ACTIVE", sortOrder: families.indexOf(family) },
    });
    for (const [i, capName] of family.capabilities.entries()) {
      const slug = capName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await db.capability.upsert({
        where: { slug },
        update: {},
        create: { familyId: fam.id, name: capName, slug, status: "ACTIVE", sortOrder: i },
      });
    }
  }
  console.log("✓ Capabilities seeded");

  // Venture Sectors
  const sectors = [
    { name: "Technology", slug: "technology" },
    { name: "Fintech", slug: "fintech" },
    { name: "Health & Biotech", slug: "health-biotech" },
    { name: "Education", slug: "education" },
    { name: "Agritech", slug: "agritech" },
    { name: "Clean Energy", slug: "clean-energy" },
    { name: "Retail & Commerce", slug: "retail-commerce" },
    { name: "Media & Creative", slug: "media-creative" },
    { name: "Logistics & Mobility", slug: "logistics-mobility" },
    { name: "Social Impact", slug: "social-impact" },
    { name: "Manufacturing", slug: "manufacturing" },
    { name: "AI & Data", slug: "ai-data" },
  ];

  for (const [i, sector] of sectors.entries()) {
    await db.ventureSector.upsert({
      where: { slug: sector.slug },
      update: {},
      create: { name: sector.name, slug: sector.slug, status: "ACTIVE", sortOrder: i },
    });
  }
  console.log("✓ Sectors seeded");

  // Default matching configuration
  const existing = await db.matchingConfiguration.findFirst({ where: { active: true } });
  if (!existing) {
    await db.matchingConfiguration.create({
      data: {
        version: 1,
        capabilityWeight: 0.35,
        interestWeight: 0.20,
        commitmentWeight: 0.15,
        availabilityWeight: 0.10,
        goalWeight: 0.10,
        workingStyleWeight: 0.05,
        evidenceWeight: 0.05,
        active: true,
        publishedAt: new Date(),
      },
    });
    console.log("✓ Default matching config seeded");
  }

  // Demo admin user
  const adminEmail = "admin@venturematch.app";
  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const adminUser = await db.user.create({
      data: { name: "Admin User", email: adminEmail, role: "admin", emailVerified: true },
    });
    await db.adminProfile.create({ data: { userId: adminUser.id } });
    console.log("✓ Admin user created: admin@venturematch.app");
  }

  console.log("\n✅ Seed complete!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
