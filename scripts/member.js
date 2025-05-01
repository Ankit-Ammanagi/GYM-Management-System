// scripts/member.js

auth.onAuthStateChanged(user => {
  if (!user) {
    alert("You must log in first.");
    return window.location.href = "index.html";
  }
  fetchBills(user.email.trim().toLowerCase());
});

function fetchBills(email) {
  console.log("fetchBills() for:", email);
  const billListDiv = document.getElementById("billList");
  billListDiv.innerHTML = "<p>Loading…</p>";

  db.collection("bills")
    .where("email", "==", email)
    // .orderBy("createdAt","desc")  ← remove for now
    .get()
    .then(snapshot => {
      console.log("Bills snapshot size:", snapshot.size);
      billListDiv.innerHTML = "";

      if (snapshot.empty) {
        return billListDiv.innerHTML = "<p>No bills found.</p>";
      }

      snapshot.forEach(doc => {
        const bill = doc.data();
        const date = bill.createdAt
          ? bill.createdAt.toDate().toLocaleString()
          : "Unknown date";
        const div = document.createElement("div");
        div.innerHTML = `
            <b>Amount:</b> ₹${bill.amount}<br>
            <b>Note:</b> ${bill.note}<br>
            <small><i>${date}</i></small>
            <hr>
          `;
        billListDiv.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error fetching bills:", err);
      billListDiv.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}


// Fetch store items

function fetchStoreItems() {
  const storeDiv = document.getElementById("storeItems");
  storeDiv.innerHTML = "<p>Loading...</p>";

  db.collection("items").orderBy("addedAt", "desc").get()
    .then(snapshot => {
      if (snapshot.empty) {
        storeDiv.innerHTML = "<p>No items available.</p>";
        return;
      }

      storeDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const item = doc.data();
        const itemId = doc.id;

        const div = document.createElement("div");
        div.innerHTML = `
          <b>${item.name}</b><br>
          ${item.description}<br>
          ₹${item.price}<br>
          <button onclick="requestItem('${itemId}')">Request</button>
          <hr>
        `;
        storeDiv.appendChild(div);
      });
    });
}

function requestItem(itemId) {
  const user = auth.currentUser;
  if (!user) return alert("Please log in.");

  db.collection("items").doc(itemId).get().then(doc => {
    if (!doc.exists) return alert("Item not found.");
    const item = doc.data();

    db.collection("requests").add({
      itemId,
      itemName: item.name,
      memberEmail: user.email,
      requestedAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: "Pending"
    }).then(() => {
      alert("Item requested successfully!");
    });
  });
}

function fetchMemberRequests() {
  const user = auth.currentUser;
  const container = document.getElementById("memberRequests");

  if (!user) {
    container.innerHTML = "<p>Please log in.</p>";
    return;
  }

  db.collection("requests")
    .where("memberEmail", "==", user.email)
    .orderBy("requestedAt", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = "<p>No requests yet.</p>";
        return;
      }

      container.innerHTML = "";
      snapshot.forEach(doc => {
        const r = doc.data();
        const time = r.requestedAt?.toDate().toLocaleString() || "Unknown";
        const div = document.createElement("div");
        div.innerHTML = `
          <b>${r.itemName}</b><br>
          Requested At: ${time}<br>
          Status: <b>${r.status}</b>
          <hr>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      container.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}


// Call this after fetching bills
auth.onAuthStateChanged(user => {
  if (!user) {
    alert("Not logged in.");
    return window.location.href = "index.html";
  }

  const email = user.email.trim().toLowerCase();
  fetchBills(email);
  fetchStoreItems();
  fetchMemberRequests();
});
