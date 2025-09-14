// load-test-detail.ts
import { setTimeout } from "timers/promises";

interface TestResult {
  status: number;
  responseTime: number;
  success: boolean;
  error?: string;
}

async function sendRequest(url: string, ip: string): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(url, {
      headers: {
        "x-real-ip": ip,
        "Content-Type": "application/json",
      },
    });

    const responseTime = Date.now() - start;
    let responseData;

    try {
      responseData = await response.text();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log("Error parsing response:", e.message);

      responseData = "Could not parse response";
    }

    console.log(
      `Status: ${response.status}, Response: ${responseData.substring(0, 100)}...`,
    );

    return {
      status: response.status,
      responseTime,
      success: response.status === 200,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const responseTime = Date.now() - start;
    console.error(`Request failed: ${error.message}`);

    return {
      status: 0,
      responseTime,
      success: false,
      error: error.message,
    };
  }
}

async function runLoadTest() {
  // Coba beberapa endpoint yang mungkin ada
  const endpoints = [
    "http://localhost:3000/api/test-rate-limit",
    // "http://localhost:3000/api/users",
    // "http://localhost:3000/",
  ];

  for (const endpoint of endpoints) {
    console.log(`\nTesting endpoint: ${endpoint}`);

    try {
      const testResult = await sendRequest(endpoint, "192.168.1.100");

      if (testResult.status > 0) {
        console.log(
          `✅ Endpoint ${endpoint} responded with status: ${testResult.status}`,
        );
        // Jika endpoint ini bekerja, gunakan untuk testing
        await runTestOnEndpoint(endpoint);
        return;
      }
    } catch (e) {
      console.log(`❌ Endpoint ${endpoint} failed: ${e}`);
    }
  }

  console.log(
    "❌ No working endpoints found. Please check if server is running.",
  );
}

async function runTestOnEndpoint(url: string) {
  const ip = "192.168.1.100";
  const totalRequests = 110;
  const concurrentRequests = 10;
  const delayBetweenBatches = 100;

  const results: TestResult[] = [];
  let successful = 0;
  let rateLimited = 0;
  let failed = 0;

  console.log(
    `\nStarting load test with ${totalRequests} requests to ${url}...`,
  );

  for (let i = 0; i < totalRequests; i += concurrentRequests) {
    const batchSize = Math.min(concurrentRequests, totalRequests - i);
    const batchPromises = [];

    for (let j = 0; j < batchSize; j++) {
      batchPromises.push(sendRequest(url, ip));
    }

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    console.log(`Completed ${i + batchSize}/${totalRequests} requests`);

    if (i + concurrentRequests < totalRequests) {
      await setTimeout(delayBetweenBatches);
    }
  }

  for (const result of results) {
    if (result.success) successful++;
    else if (result.status === 429) rateLimited++;
    else failed++;
  }

  console.log("\n=== LOAD TEST RESULTS ===");
  console.log(`Total requests: ${totalRequests}`);
  console.log(`Successful (200): ${successful}`);
  console.log(`Rate limited (429): ${rateLimited}`);
  console.log(`Failed (other): ${failed}`);
  console.log(
    `Success rate: ${((successful / totalRequests) * 100).toFixed(2)}%`,
  );

  if (successful <= 100 && rateLimited >= 10) {
    console.log(
      "✅ RATE LIMITER TEST PASSED - System correctly limited requests",
    );
  } else if (successful > 0) {
    console.log("⚠️  RATE LIMITER MAY NOT BE WORKING - Check configuration");
  } else {
    console.log("❌ ALL REQUESTS FAILED - Server/endpoint issue");
  }
}

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

runLoadTest().catch(console.error);
