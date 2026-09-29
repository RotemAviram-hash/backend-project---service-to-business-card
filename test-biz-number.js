const BASE_URL = "http://localhost:3000";

// Put your test users here
const ADMIN = {
  email: "admin@example.com",
  password: "12345678",
};

const REGULAR_USER = {
  email: "regular@example.com",
  password: "12345678",
};

const request = async (url, options = {}) => {
  const response = await fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  return {
    status: response.status,
    data,
  };
};

const login = async (user) => {
  const result = await request("/users/login", {
    method: "POST",
    body: JSON.stringify(user),
  });

  if (result.status !== 200) {
    throw new Error(`Login failed: ${JSON.stringify(result.data)}`);
  }

  return result.data.token;
};

const getCards = async () => {
  const result = await request("/cards");

  if (result.status !== 200) {
    throw new Error(`Could not get cards: ${JSON.stringify(result.data)}`);
  }

  return result.data;
};

const test = async () => {
  console.log("\n🚀 Starting bizNumber bonus tests...\n");

  // 1. Login as admin
  console.log("1️⃣ Login as admin...");
  const adminToken = await login(ADMIN);
  console.log("✅ Admin login successful\n");

  // 2. Get existing cards
  const cards = await getCards();

  if (cards.length < 2) {
    throw new Error(
      "You need at least 2 cards in the database for these tests.",
    );
  }

  const cardToUpdate = cards[0];
  const otherCard = cards[1];

  const originalBizNumber = cardToUpdate.bizNumber;
  const existingBizNumber = otherCard.bizNumber;

  // Use a number that should not already exist
  const newBizNumber = 99999999;

  // 3. Admin changes bizNumber to a free number
  console.log("2️⃣ Admin changes bizNumber to a free number...");

  const updateResult = await request(`/cards/${cardToUpdate._id}/bizNumber`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      bizNumber: newBizNumber,
    }),
  });

  if (updateResult.status === 200) {
    console.log("✅ Free bizNumber accepted\n");
  } else {
    console.log("❌ Free bizNumber test failed");
    console.log(updateResult);
    console.log(`/cards/${cardToUpdate._id}/bizNumber 123456`);
    return;
  }

  // 4. Admin tries to use an existing bizNumber
  console.log("3️⃣ Admin tries an existing bizNumber...");

  const duplicateResult = await request(
    `/cards/${cardToUpdate._id}/bizNumber`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        bizNumber: existingBizNumber,
      }),
    },
  );

  if (duplicateResult.status === 400) {
    console.log("✅ Duplicate bizNumber correctly rejected\n");
  } else {
    console.log("❌ Duplicate bizNumber test failed");
    console.log(duplicateResult);
    return;
  }

  // 5. Restore original bizNumber
  console.log("4️⃣ Restoring original bizNumber...");

  const restoreResult = await request(`/cards/${cardToUpdate._id}/bizNumber`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      bizNumber: originalBizNumber,
    }),
  });

  if (restoreResult.status === 200) {
    console.log("✅ Original bizNumber restored\n");
  } else {
    console.log("⚠️ Could not restore original bizNumber");
    console.log(restoreResult);
  }

  // 6. Login as regular user
  console.log("5️⃣ Login as regular user...");
  const userToken = await login(REGULAR_USER);
  console.log("✅ Regular user login successful\n");

  // 7. Regular user tries to change bizNumber
  console.log("6️⃣ Regular user tries to change bizNumber...");

  const unauthorizedResult = await request(
    `/cards/${cardToUpdate._id}/bizNumber`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        bizNumber: newBizNumber,
      }),
    },
  );

  if (unauthorizedResult.status === 403) {
    console.log("✅ Non-admin correctly rejected\n");
  } else {
    console.log("❌ Non-admin test failed");
    console.log(unauthorizedResult);
    return;
  }

  console.log("🎉 ALL BIZ NUMBER TESTS PASSED!\n");
};

test().catch((error) => {
  console.error("\n❌ Test failed:");
  console.error(error.message);
});
