// Using built-in fetch (Node.js 18+)

async function testDummyJSON() {
  console.log('🧪 Testing DummyJSON API connectivity...\n');
  
  try {
    // Test 1: Basic connectivity
    console.log('1️⃣ Testing basic connectivity...');
    const response = await fetch('https://dummyjson.com/users?limit=1');
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Test 2: Parse response
    console.log('\n2️⃣ Parsing response...');
    const data = await response.json();
    console.log('Response structure:', Object.keys(data));
    console.log('Users array length:', data.users?.length || 0);
    console.log('Total:', data.total);
    console.log('Limit:', data.limit);
    
    // Test 3: Check user structure
    if (data.users && data.users.length > 0) {
      console.log('\n3️⃣ First user structure:');
      const user = data.users[0];
      console.log('User ID:', user.id);
      console.log('Name:', `${user.firstName} ${user.lastName}`);
      console.log('Email:', user.email);
      console.log('Age:', user.age);
      console.log('Phone:', user.phone);
      console.log('Image:', user.image ? 'Present' : 'Missing');
      console.log('Address:', user.address ? 'Present' : 'Missing');
    }
    
    // Test 4: Test with different limit
    console.log('\n4️⃣ Testing with limit=5...');
    const response2 = await fetch('https://dummyjson.com/users?limit=5');
    const data2 = await response2.json();
    console.log('Users returned:', data2.users?.length || 0);
    console.log('Total available:', data2.total);
    
    console.log('\n✅ All tests passed! DummyJSON is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testDummyJSON(); 