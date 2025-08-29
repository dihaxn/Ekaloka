const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCustomerRole() {
  try {
    console.log('🔄 Starting role update process...');
    
    // Find all users with 'customer' role
    const customers = await prisma.user.findMany({
      where: {
        role: 'customer'
      },
      select: {
        id: true,
        uid: true,
        name: true,
        email: true,
        role: true
      }
    });

    console.log(`📊 Found ${customers.length} users with 'customer' role:`);
    customers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.uid}`);
    });

    if (customers.length === 0) {
      console.log('✅ No users with "customer" role found. Nothing to update.');
      return;
    }

    // Update all customers to have 'user' role
    const updateResult = await prisma.user.updateMany({
      where: {
        role: 'customer'
      },
      data: {
        role: 'user'
      }
    });

    console.log(`✅ Successfully updated ${updateResult.count} users from 'customer' to 'user' role`);

    // Verify the update
    const remainingCustomers = await prisma.user.findMany({
      where: {
        role: 'customer'
      }
    });

    if (remainingCustomers.length === 0) {
      console.log('✅ Verification successful: No users with "customer" role remain');
    } else {
      console.log(`⚠️  Warning: ${remainingCustomers.length} users still have "customer" role`);
    }

    // Show final role distribution
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });

    console.log('\n📈 Final role distribution:');
    roleStats.forEach(stat => {
      console.log(`  - ${stat.role}: ${stat._count.role} users`);
    });

  } catch (error) {
    console.error('❌ Error updating roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateCustomerRole();
