const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Check if tenant exists
  const existingTenant = await prisma.tenant.findUnique({
    where: {
      domain: 'conveyai.demo'
    }
  });

  // Create or use existing tenant
  let tenant;
  if (existingTenant) {
    console.log(`Using existing tenant: ${existingTenant.name}`);
    tenant = existingTenant;
  } else {
    tenant = await prisma.tenant.create({
      data: {
        name: 'ConveyAI Demo',
        domain: 'conveyai.demo',
        primaryColor: '#4F46E5',
        backgroundImage: '/images/background.jpg'
      }
    });
    console.log(`Created tenant: ${tenant.name}`);
  }

  // Check if admin exists
  const existingAdmin = await prisma.conveyancer.findFirst({
    where: {
      email: 'admin@conveyai.demo',
      tenantId: tenant.id
    }
  });

  // Create admin if doesn't exist
  let admin;
  if (existingAdmin) {
    console.log(`Using existing admin user: ${existingAdmin.email}`);
    admin = existingAdmin;
  } else {
    const adminPassword = await bcrypt.hash('admin123', 10);
    admin = await prisma.conveyancer.create({
      data: {
        tenantId: tenant.id,
        email: 'admin@conveyai.demo',
        name: 'Admin User',
        password_hash: adminPassword,
        role: 'ADMIN'
      }
    });
    console.log(`Created admin user: ${admin.email}`);
  }

  // Check if conveyancer exists
  const existingConveyancer = await prisma.conveyancer.findFirst({
    where: {
      email: 'john@conveyai.demo',
      tenantId: tenant.id
    }
  });

  // Create conveyancer if doesn't exist
  let conveyancer;
  if (existingConveyancer) {
    console.log(`Using existing conveyancer: ${existingConveyancer.email}`);
    conveyancer = existingConveyancer;
  } else {
    const conveyancerPassword = await bcrypt.hash('password123', 10);
    conveyancer = await prisma.conveyancer.create({
      data: {
        tenantId: tenant.id,
        email: 'john@conveyai.demo',
        name: 'John Smith',
        password_hash: conveyancerPassword,
        role: 'CONVEYANCER'
      }
    });
    console.log(`Created conveyancer: ${conveyancer.email}`);
  }

  // Check for existing clients
  const existingClient = await prisma.client.findFirst({
    where: {
      email: 'jane@example.com',
      tenantId: tenant.id
    }
  });

  // Only create sample data if it doesn't exist yet
  if (existingClient) {
    console.log('Sample clients already exist. Skipping sample data creation.');
    return;
  }

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
      name: 'Acme Corporation',
      email: 'info@acme.com',
      phone: '02 9876 5432',
      address: '100 Business Ave, Sydney NSW 2000',
      contact_type: 'COMPANY'
    }
  });
  
  const client3 = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '0498 765 432',
      address: '42 Sample Rd, Melbourne VIC 3000',
      contact_type: 'INDIVIDUAL'
    }
  });
  
  const agent = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'Sarah Johnson',
      email: 'sarah@realestate.com',
      phone: '0433 211 678',
      address: '88 Agent St, Sydney NSW 2000',
      contact_type: 'REAL_ESTATE_AGENT'
    }
  });
  
  console.log(`Created ${4} clients/contacts`);

  // Create a sample matter (sale)
  const saleMatter = await prisma.matter.create({
    data: {
      tenantId: tenant.id,
      matter_number: 'M-2025-001',
      conveyancerId: conveyancer.id,
      matter_type: 'SALE',
      property_address: '61 Crieff Street',
      property_suburb: 'Ashbury',
      property_state: 'NSW',
      property_postcode: '2193',
      folio_identifier: '1/SP12345',
      property_value: 2000000,
      date: new Date(),
      settlement_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      sellerId: client1.id,
      amount: 2000000,
      deposit_amount: 200000,
      deposit_paid: 200000,
      cooling_off_period: '5 days',
      status: 'IN_PROGRESS'
    }
  });
  
  // Create a sample matter (purchase)
  const purchaseMatter = await prisma.matter.create({
    data: {
      tenantId: tenant.id,
      matter_number: 'M-2025-002',
      conveyancerId: conveyancer.id,
      matter_type: 'PURCHASE',
      property_address: '72 Auburn Street',
      property_suburb: 'Wollongong',
      property_state: 'NSW',
      property_postcode: '2040',
      folio_identifier: '2/SP54321',
      property_value: 875000,
      date: new Date(),
      settlement_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      buyerId: client2.id,
      amount: 875000,
      deposit_amount: 87500,
      deposit_paid: 87500,
      cooling_off_period: '5 days',
      status: 'PENDING'
    }
  });
  
  // Create a transfer matter
  const transferMatter = await prisma.matter.create({
    data: {
      tenantId: tenant.id,
      matter_number: 'M-2025-003',
      conveyancerId: conveyancer.id,
      matter_type: 'TRANSFER',
      property_address: '70 Test Avenue',
      property_suburb: 'Earlwood',
      property_state: 'NSW',
      property_postcode: '2111',
      folio_identifier: '3/SP67890',
      date: new Date(),
      settlement_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      sellerId: client1.id,
      buyerId: client3.id,
      status: 'IN_PROGRESS'
    }
  });
  
  console.log(`Created ${3} matters`);

  // Create document folders
  const contractsFolder = await prisma.documentFolder.create({
    data: {
      tenantId: tenant.id,
      matterId: saleMatter.id,
      name: 'Contracts',
      created_by: conveyancer.id
    }
  });
  
  const identificationFolder = await prisma.documentFolder.create({
    data: {
      tenantId: tenant.id,
      matterId: saleMatter.id,
      name: 'Identification',
      created_by: conveyancer.id
    }
  });
  
  console.log(`Created ${2} document folders`);

  // Create sample todo items
  const todo1 = await prisma.todo.create({
    data: {
      tenantId: tenant.id,
      title: 'Review contract',
      description: 'Review the contract of sale for 61 Crieff Street',
      matterId: saleMatter.id,
      assignedToId: conveyancer.id,
      createdById: admin.id,
      priority: 'HIGH',
      status: 'OPEN',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    }
  });
  
  const todo2 = await prisma.todo.create({
    data: {
      tenantId: tenant.id,
      title: 'Prepare settlement adjustment',
      description: 'Prepare settlement adjustment for 72 Auburn Street',
      matterId: purchaseMatter.id,
      assignedToId: conveyancer.id,
      createdById: admin.id,
      priority: 'MEDIUM',
      status: 'OPEN',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    }
  });
  
  console.log(`Created ${2} todo items`);

  // Create precedent folders and precedents
  const precedentFolder = await prisma.precedentFolder.create({
    data: {
      tenantId: tenant.id,
      name: 'Contracts',
      created_by: admin.id
    }
  });
  
  const purchasePrecedentFolder = await prisma.precedentFolder.create({
    data: {
      tenantId: tenant.id,
      name: 'Purchase',
      parent_folder_id: precedentFolder.id,
      created_by: admin.id
    }
  });
  
  const salePrecedentFolder = await prisma.precedentFolder.create({
    data: {
      tenantId: tenant.id,
      name: 'Sale',
      parent_folder_id: precedentFolder.id,
      created_by: admin.id
    }
  });
  
  // Create sample precedent
  const precedent = await prisma.precedent.create({
    data: {
      tenantId: tenant.id,
      folder_id: salePrecedentFolder.id,
      uploaded_by: admin.id,
      name: 'Contract of Sale',
      description: 'Standard contract of sale template',
      category: 'CONTRACT',
      file_path: '/precedents/contract_of_sale.docx',
      file_name: 'contract_of_sale.docx',
      file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      file_extension: 'docx',
      file_size: 25600,
      uploaded_at: new Date(),
    }
  });
  
  console.log(`Created precedent folder structure and sample precedent`);

  // Create an audit log entry
  const auditLog = await prisma.matterAuditLog.create({
    data: {
      tenantId: tenant.id,
      matterId: saleMatter.id,
      userId: conveyancer.id,
      action: 'CREATE',
      details: JSON.stringify({
        message: 'Matter created',
        timestamp: new Date().toISOString()
      })
    }
  });
  
  console.log(`Created audit log entry`);
  
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });