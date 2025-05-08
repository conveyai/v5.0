import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.matterAuditLog.deleteMany({}),
    prisma.todo.deleteMany({}),
    prisma.titleSearch.deleteMany({}),
    prisma.document.deleteMany({}),
    prisma.documentFolder.deleteMany({}),
    prisma.matter.deleteMany({}),
    prisma.passwordReset.deleteMany({}),
    prisma.client.deleteMany({}),
    prisma.conveyancer.deleteMany({}),
    prisma.tenant.deleteMany({}),
  ]);

  // Create tenants
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'Sydney Conveyancing',
      domain: 'sydneyconveyancing.com',
      primaryColor: '#4F46E5',
      logo_path: '/logos/sydney-conveyancing.png',
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'Melbourne Property Law',
      domain: 'melbournepropertylaw.com',
      primaryColor: '#10B981',
      logo_path: '/logos/melbourne-property-law.png',
    },
  });

  // Hash for password 'Password123!'
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Create conveyancers (users)
  const john = await prisma.conveyancer.create({
    data: {
      email: 'john@sydneyconveyancing.com',
      name: 'John Smith',
      password_hash: passwordHash,
      role: 'ADMIN',
      tenantId: tenant1.id,
    },
  });

  const sarah = await prisma.conveyancer.create({
    data: {
      email: 'sarah@sydneyconveyancing.com',
      name: 'Sarah Johnson',
      password_hash: passwordHash,
      role: 'CONVEYANCER',
      tenantId: tenant1.id,
    },
  });

  const michael = await prisma.conveyancer.create({
    data: {
      email: 'michael@melbournepropertylaw.com',
      name: 'Michael Brown',
      password_hash: passwordHash,
      role: 'ADMIN',
      tenantId: tenant2.id,
    },
  });

  const emma = await prisma.conveyancer.create({
    data: {
      email: 'emma@melbournepropertylaw.com',
      name: 'Emma Wilson',
      password_hash: passwordHash,
      role: 'CONVEYANCER',
      tenantId: tenant2.id,
    },
  });

  // Create clients
  const client1 = await prisma.client.create({
    data: {
      tenantId: tenant1.id,
      name: 'Robert Chen',
      email: 'robert.chen@example.com',
      phone: '0412345678',
      address: '42 Park Street, Sydney NSW 2000',
      client_type: 'INDIVIDUAL',
      identity_verified: true,
      identification_type: 'DRIVERS_LICENSE',
      identification_number: 'DL12345678',
      verified_at: new Date(),
      notes: 'Prefers communication via email',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      tenantId: tenant1.id,
      name: 'Lucy Zhang',
      email: 'lucy.zhang@example.com',
      phone: '0423456789',
      address: '15 Market Street, Sydney NSW 2000',
      client_type: 'INDIVIDUAL',
      identity_verified: true,
      identification_type: 'PASSPORT',
      identification_number: 'PA98765432',
      verified_at: new Date(),
    },
  });

  const client3 = await prisma.client.create({
    data: {
      tenantId: tenant2.id,
      name: 'Horizon Developments Pty Ltd',
      email: 'contact@horizondev.com.au',
      phone: '0398765432',
      address: '78 Collins Street, Melbourne VIC 3000',
      client_type: 'COMPANY',
      identity_verified: true,
      identification_type: 'ACN',
      identification_number: '123456789',
      verified_at: new Date(),
      notes: 'Major property developer',
    },
  });

  const client4 = await prisma.client.create({
    data: {
      tenantId: tenant2.id,
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      phone: '0387654321',
      address: '25 Elizabeth Street, Melbourne VIC 3000',
      client_type: 'INDIVIDUAL',
      identity_verified: false,
    },
  });

  // Create matters
  const matter1 = await prisma.matter.create({
    data: {
      tenantId: tenant1.id,
      conveyancerId: john.id,
      matter_type: 'PURCHASE',
      property_address: '42 Ocean View Drive',
      property_suburb: 'Bondi',
      property_state: 'NSW',
      property_postcode: '2026',
      folio_identifier: '1/SP12345',
      property_status: 'APARTMENT',
      property_value: 1250000,
      date: new Date(2025, 3, 15), // April 15, 2025
      settlement_date: new Date(2025, 6, 20), // July 20, 2025
      buyerId: client1.id,
      sellerId: null,
      amount: 1250000,
      deposit_amount: 125000,
      deposit_paid: 125000,
      cooling_off_period: '5 BUSINESS DAYS',
      status: 'IN_PROGRESS',
    },
  });

  const matter2 = await prisma.matter.create({
    data: {
      tenantId: tenant1.id,
      conveyancerId: sarah.id,
      matter_type: 'SALE',
      property_address: '15 Harbour View Avenue',
      property_suburb: 'Kirribilli',
      property_state: 'NSW',
      property_postcode: '2061',
      folio_identifier: '7/DP98765',
      property_status: 'HOUSE',
      property_value: 2800000,
      date: new Date(2025, 4, 5), // May 5, 2025
      settlement_date: new Date(2025, 7, 10), // August 10, 2025
      buyerId: null,
      sellerId: client2.id,
      amount: 2800000,
      deposit_amount: 280000,
      deposit_paid: 280000,
      cooling_off_period: 'NONE',
      status: 'PENDING',
    },
  });

  const matter3 = await prisma.matter.create({
    data: {
      tenantId: tenant2.id,
      conveyancerId: michael.id,
      matter_type: 'PURCHASE',
      property_address: '78 River Road',
      property_suburb: 'South Yarra',
      property_state: 'VIC',
      property_postcode: '3141',
      folio_identifier: '12/LP56789',
      property_status: 'TOWNHOUSE',
      property_value: 980000,
      date: new Date(2025, 3, 20), // April 20, 2025
      settlement_date: new Date(2025, 6, 25), // July 25, 2025
      buyerId: client4.id,
      sellerId: null,
      amount: 980000,
      deposit_amount: 98000,
      deposit_paid: 98000,
      cooling_off_period: '3 BUSINESS DAYS',
      status: 'IN_PROGRESS',
    },
  });

  const matter4 = await prisma.matter.create({
    data: {
      tenantId: tenant2.id,
      conveyancerId: emma.id,
      matter_type: 'TRANSFER',
      property_address: '35 Mountain View Road',
      property_suburb: 'Doncaster',
      property_state: 'VIC',
      property_postcode: '3108',
      folio_identifier: '25/LP34567',
      property_status: 'HOUSE',
      property_value: 1500000,
      date: new Date(2025, 2, 25), // March 25, 2025
      settlement_date: new Date(2025, 5, 30), // June 30, 2025
      buyerId: client3.id,
      sellerId: null,
      amount: 0, // $0 for a transfer
      status: 'COMPLETED',
      archived_at: new Date(),
    },
  });

  // Create document folders
  const folder1 = await prisma.documentFolder.create({
    data: {
      tenantId: tenant1.id,
      matterId: matter1.id,
      name: 'Contracts',
      created_by: john.id,
    },
  });

  const folder2 = await prisma.documentFolder.create({
    data: {
      tenantId: tenant1.id,
      matterId: matter1.id,
      name: 'Client ID',
      created_by: john.id,
    },
  });

  const folder3 = await prisma.documentFolder.create({
    data: {
      tenantId: tenant1.id,
      matterId: matter2.id,
      name: 'Property Documents',
      created_by: sarah.id,
    },
  });

  const folder4 = await prisma.documentFolder.create({
    data: {
      tenantId: tenant2.id,
      matterId: matter3.id,
      name: 'General',
      created_by: michael.id,
    },
  });

  // Create documents
  const document1 = await prisma.document.create({
    data: {
      tenantId: tenant1.id,
      matterId: matter1.id,
      parent_folder_id: folder1.id,
      uploaded_by: john.id,
      name: 'Contract of Sale',
      description: 'Contract of sale for 42 Ocean View Drive',
      category: 'CONTRACT',
      file_path: '/documents/tenant1/matter1/contract-of-sale.pdf',
      file_name: 'contract-of-sale.pdf',
      file_type: 'application/pdf',
      file_extension: 'pdf',
      file_size: 2540000,
      uploaded_at: new Date(),
    },
  });

  const document2 = await prisma.document.create({
    data: {
      tenantId: tenant1.id,
      matterId: matter1.id,
      parent_folder_id: folder2.id,
      uploaded_by: john.id,
      name: 'Client Identification',
      description: 'Client identification documents',
      category: 'IDENTIFICATION',
      file_path: '/documents/tenant1/matter1/client-id.pdf',
      file_name: 'client-id.pdf',
      file_type: 'application/pdf',
      file_extension: 'pdf',
      file_size: 1250000,
      uploaded_at: new Date(),
    },
  });

  const document3 = await prisma.document.create({
    data: {
      tenantId: tenant1.id,
      matterId: matter2.id,
      parent_folder_id: folder3.id,
      uploaded_by: sarah.id,
      name: 'Property Title',
      description: 'Property title document for 15 Harbour View Avenue',
      category: 'TITLE',
      file_path: '/documents/tenant1/matter2/property-title.pdf',
      file_name: 'property-title.pdf',
      file_type: 'application/pdf',
      file_extension: 'pdf',
      file_size: 1850000,
      uploaded_at: new Date(),
    },
  });

  // Create title searches
  const titleSearch1 = await prisma.titleSearch.create({
    data: {
      tenantId: tenant1.id,
      matterId: matter1.id,
      requestedById: john.id,
      folio_identifier: '1/SP12345',
      property_address: '42 Ocean View Drive, Bondi NSW 2026',
      property_suburb: 'Bondi',
      property_state: 'NSW',
      property_postcode: '2026',
      search_type: 'STANDARD',
      status: 'COMPLETED',
      results: JSON.stringify({
        owner: 'Current Owner Name',
        encumbrances: ['Mortgage to Big Bank Ltd', 'Easement for drainage'],
        title_details: 'Strata Plan 12345, Lot 1',
      }),
      requested_at: new Date(2025, 3, 16), // April 16, 2025
      completed_at: new Date(2025, 3, 17), // April 17, 2025
    },
  });

  const titleSearch2 = await prisma.titleSearch.create({
    data: {
      tenantId: tenant2.id,
      matterId: matter3.id,
      requestedById: michael.id,
      folio_identifier: '12/LP56789',
      property_address: '78 River Road, South Yarra VIC 3141',
      property_suburb: 'South Yarra',
      property_state: 'VIC',
      property_postcode: '3141',
      search_type: 'DETAILED',
      status: 'IN_PROGRESS',
      requested_at: new Date(2025, 3, 21), // April 21, 2025
    },
  });

  // Create todos
  const todo1 = await prisma.todo.create({
    data: {
      tenantId: tenant1.id,
      title: 'Review contract of sale',
      description: 'Review the contract of sale for 42 Ocean View Drive',
      matterId: matter1.id,
      assignedToId: john.id,
      createdById: john.id,
      dueDate: new Date(2025, 3, 20), // April 20, 2025
      priority: 'HIGH',
      status: 'COMPLETED',
      completedById: john.id,
      completedAt: new Date(2025, 3, 18), // April 18, 2025
    },
  });

  const todo2 = await prisma.todo.create({
    data: {
      tenantId: tenant1.id,
      title: 'Request strata inspection report',
      description: 'Arrange for a strata inspection report for 42 Ocean View Drive',
      matterId: matter1.id,
      assignedToId: sarah.id,
      createdById: john.id,
      dueDate: new Date(2025, 3, 25), // April 25, 2025
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    },
  });

  const todo3 = await prisma.todo.create({
    data: {
      tenantId: tenant1.id,
      title: 'Prepare contract for signature',
      description: 'Prepare the contract of sale for 15 Harbour View Avenue for signature',
      matterId: matter2.id,
      assignedToId: sarah.id,
      createdById: sarah.id,
      dueDate: new Date(2025, 4, 10), // May 10, 2025
      priority: 'HIGH',
      status: 'OPEN',
    },
  });

  const todo4 = await prisma.todo.create({
    data: {
      tenantId: tenant2.id,
      title: 'Follow up on building inspection',
      description: 'Follow up on building inspection report for 78 River Road',
      matterId: matter3.id,
      assignedToId: michael.id,
      createdById: michael.id,
      dueDate: new Date(2025, 3, 30), // April 30, 2025
      priority: 'HIGH',
      status: 'OPEN',
    },
  });

  // Create audit logs
  const auditLog1 = await prisma.matterAuditLog.create({
    data: {
      tenantId: tenant1.id,
      matterId: matter1.id,
      userId: john.id,
      action: 'CREATE',
      details: JSON.stringify({
        action: 'Created matter',
        property_address: '42 Ocean View Drive, Bondi NSW 2026',
        matter_type: 'PURCHASE',
      }),
    },
  });

  const auditLog2 = await prisma.matterAuditLog.create({
    data: {
      tenantId: tenant1.id,
      matterId: matter1.id,
      userId: john.id,
      action: 'UPDATE',
      details: JSON.stringify({
        action: 'Updated settlement date',
        old_value: '2025-06-15',
        new_value: '2025-07-20',
      }),
    },
  });

  const auditLog3 = await prisma.matterAuditLog.create({
    data: {
      tenantId: tenant2.id,
      matterId: matter4.id,
      userId: emma.id,
      action: 'ARCHIVE',
      details: JSON.stringify({
        action: 'Archived matter',
        reason: 'Matter completed',
      }),
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });