const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
  // Create a tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'ConveyAI Demo',
      domain: 'conveyai.demo',
      logo_path: '/logo.png',
      primaryColor: '#4F46E5'
    }
  });
  console.log(`Created tenant: ${tenant.name}`);
  
  // Create admin user with hashed password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('password123', saltRounds);
  
  const admin = await prisma.conveyancer.create({
    data: {
      tenantId: tenant.id,
      name: 'Admin User',
      email: 'admin@conveyai.demo',
      password_hash: passwordHash,
      role: 'ADMIN'
    }
  });
  console.log(`Created admin user: ${admin.email}`);
  
  // Create additional conveyancer
  const conveyancer = await prisma.conveyancer.create({
    data: {
      tenantId: tenant.id,
      name: 'John Smith',
      email: 'john@conveyai.demo',
      password_hash: passwordHash,
      role: 'CONVEYANCER'
    }
  });
  console.log(`Created conveyancer: ${conveyancer.email}`);
  
  // Create sample clients
  const client1 = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '0412 345 678',
      address: '1 Example St, Sydney NSW 2000',
      contact_type: 'INDIVIDUAL',
      identity_verified: true,
      identification_type: 'DRIVERS_LICENSE',
      identification_number: '123456789',
      verified_at: new Date()
    }
  });
  
  const client2 = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'Robert Smith',
      email: 'robert@example.com',
      phone: '0423 456 789',
      address: '2 Sample Rd, Melbourne VIC 3000',
      contact_type: 'INDIVIDUAL'
    }
  });
  
  console.log(`Created clients: ${client1.name}, ${client2.name}`);
  
  // Create sample matter
  const matter = await prisma.matter.create({
    data: {
      tenantId: tenant.id,
      conveyancerId: conveyancer.id,
      matter_type: 'SALE',
      property_address: '10 Park Avenue',
      property_suburb: 'Sydney',
      property_state: 'NSW',
      property_postcode: '2000',
      folio_identifier: '1/123456',
      property_status: 'RESIDENTIAL',
      property_value: 850000,
      date: new Date(),
      settlement_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      sellerId: client1.id,
      buyerId: client2.id,
      amount: 850000,
      deposit_amount: 85000,
      deposit_paid: 85000,
      cooling_off_period: '5 business days',
      status: 'IN_PROGRESS'
    }
  });
  console.log(`Created sample matter: ${matter.property_address}`);
  
  // Create document folders
  const contracts = await prisma.documentFolder.create({
    data: {
      tenantId: tenant.id,
      matterId: matter.id,
      name: 'Contracts',
      created_by: admin.id
    }
  });
  
  const correspondence = await prisma.documentFolder.create({
    data: {
      tenantId: tenant.id,
      matterId: matter.id,
      name: 'Correspondence',
      created_by: admin.id
    }
  });
  
  const identification = await prisma.documentFolder.create({
    data: {
      tenantId: tenant.id,
      matterId: matter.id,
      name: 'Identification',
      created_by: admin.id
    }
  });
  
  console.log(`Created document folders: Contracts, Correspondence, Identification`);
  
  // Create sample todos
  const todo1 = await prisma.todo.create({
    data: {
      tenantId: tenant.id,
      title: 'Prepare contract of sale',
      description: 'Draft the contract of sale for review',
      matterId: matter.id,
      assignedToId: conveyancer.id,
      createdById: admin.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      priority: 'HIGH',
      status: 'OPEN'
    }
  });
  
  const todo2 = await prisma.todo.create({
    data: {
      tenantId: tenant.id,
      title: 'Contact client for ID verification',
      description: 'Call Jane to arrange ID verification',
      matterId: matter.id,
      assignedToId: conveyancer.id,
      createdById: admin.id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      priority: 'MEDIUM',
      status: 'OPEN'
    }
  });
  
  console.log(`Created todos: ${todo1.title}, ${todo2.title}`);
  
  console.log('Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
