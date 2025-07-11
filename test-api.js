// Test script to demonstrate API architecture
import fetch from 'node-fetch';

async function testAPI() {
  console.log('🧪 Testing API Architecture\n');
  
  // Test 1: Try to connect to backend (should fail without server)
  console.log('1️⃣ Testing API connection (no server running)...');
  try {
    const response = await fetch('http://localhost:3001/api/health');
    const data = await response.json();
    console.log('✅ Backend is running:', data);
  } catch (error) {
    console.log('❌ Backend not running (expected):', error.message);
  }
  
  // Test 2: Simulate what the smart data service does
  console.log('\n2️⃣ Simulating smart data service behavior...');
  
  async function simulateSmartDataService() {
    try {
      console.log('🌐 Attempting to call real API...');
      const response = await fetch('http://localhost:3001/api/agents/1/file-processing/metrics?dateFilter=today');
      const data = await response.json();
      console.log('✅ Got real data:', data);
      return data.data;
    } catch (error) {
      console.log('❌ API failed, using mock data:', error.message);
      
      // Fallback to mock data
      const mockData = {
        totalFilesProcessed: 25,
        successRateParsing: 80.0,
        successRateMatching: 84.0,
        totalParsingErrors: 5,
        totalMatchingErrors: 4
      };
      
      console.log('📊 Using mock data:', mockData);
      return mockData;
    }
  }
  
  const result = await simulateSmartDataService();
  console.log('🎯 Final result:', result);
  
  console.log('\n📋 Summary:');
  console.log('- Frontend tries to call real API');
  console.log('- If API fails, it falls back to mock data');
  console.log('- User sees data either way (graceful degradation)');
  console.log('- No errors shown to user');
}

// Run the test
testAPI().catch(console.error); 