// scripts/admin.js

// Add a new member to Firestore
function addMember() {
    const name = document.getElementById("memberName").value;
    const email = document.getElementById("memberEmail").value;
    const feePackage = document.getElementById("feePackage").value;

    if (!name || !email || !feePackage) {
        alert("All fields are required.");
        return;
    }

    db.collection("members").add({
        name,
        email,
        feePackage,
        joinedAt: new Date()
    }).then(() => {
        alert("Member added successfully!");
        fetchMembers(); // Refresh member list
    }).catch((error) => {
        alert("Error: " + error.message);
    });
}

// Fetch all members from Firestore
// function fetchMembers() {
//     const memberListDiv = document.getElementById("memberList");
//     memberListDiv.innerHTML = "";

//     db.collection("members").orderBy("joinedAt", "desc").get()
//         .then(snapshot => {
//             snapshot.forEach(doc => {
//                 const member = doc.data();
//                 const memberDiv = document.createElement("div");
//                 memberDiv.innerHTML = `
//             <b>${member.name}</b> (${member.email}) - ${member.feePackage}
//             <button onclick="deleteMember('${doc.id}')">Delete</button>
//           `;
//                 memberListDiv.appendChild(memberDiv);
//             });
//         });
// }

let allMembers = [];

function fetchMembers() {
    const list = document.getElementById("memberList");
    list.innerHTML = "Loading...";

    db.collection("members").orderBy("joinedAt", "desc").get()
        .then(snapshot => {
            allMembers = [];
            list.innerHTML = "";

            snapshot.forEach(doc => {
                const data = doc.data();
                allMembers.push(data); // store in global array
            });

            renderMembers(allMembers);
        });
}

function renderMembers(members) {
    const list = document.getElementById("memberList");
    list.innerHTML = "";

    if (members.length === 0) {
        list.innerHTML = "<p>No matching members found.</p>";
        return;
    }

    members.forEach(member => {
        list.innerHTML += `
        <div>
          <b>${member.name}</b> (${member.email}) - ${member.feePackage}
        </div>
      `;
    });
}

function filterMembers() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allMembers.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query)
    );
    renderMembers(filtered);
}


// Delete member
function deleteMember(memberId) {
    db.collection("members").doc(memberId).delete()
        .then(() => {
            alert("Member deleted.");
            fetchMembers(); // Refresh
        });
}

// Call fetch on load
window.onload = fetchMembers;

// Generate bill & notify
function generateBill() {
    const email = document.getElementById("billMemberEmail").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const note = document.getElementById("note").value;

    if (!email || !amount || !note) {
        alert("All fields are required.");
        return;
    }

    // Add to 'bills' collection
    db.collection("bills").add({
        email,
        amount,
        note,
        createdAt: new Date()
    }).then(() => {
        alert("Bill generated and notification sent!");
    }).catch(err => {
        alert("Error: " + err.message);
    });
}

// Add diet/supplement item
function addItem() {
    const name = document.getElementById("itemName").value;
    const desc = document.getElementById("itemDesc").value;
    const price = parseFloat(document.getElementById("itemPrice").value);

    if (!name || !desc || isNaN(price)) {
        alert("Please fill all item fields correctly.");
        return;
    }

    db.collection("items").add({
        name,
        description: desc,
        price,
        addedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Item added successfully!");
    }).catch((err) => {
        alert("Error adding item: " + err.message);
    });
}

function fetchRequests() {
    const list = document.getElementById("requestList");
    list.innerHTML = "Loading...";

    db.collection("requests").orderBy("requestedAt", "desc").get()
        .then(snapshot => {
            if (snapshot.empty) {
                list.innerHTML = "<p>No requests yet.</p>";
                return;
            }

            list.innerHTML = "";
            snapshot.forEach(doc => {
                const r = doc.data();
                const time = r.requestedAt?.toDate().toLocaleString() || "Unknown";

                const div = document.createElement("div");
                div.innerHTML = `
            <b>${r.itemName}</b> requested by ${r.memberEmail}<br>
            <small>${time}</small><br>
            <b>Status:</b> ${r.status}<br>
            ${r.status === "Pending" ? `
              <button onclick="updateStatus('${doc.id}', 'Approved')">Approve</button>
              <button onclick="updateStatus('${doc.id}', 'Rejected')">Reject</button>
            ` : ""}
            <hr>
          `;
                list.appendChild(div);
            });
        });
}

function updateStatus(requestId, newStatus) {
    db.collection("requests").doc(requestId).update({
        status: newStatus
    }).then(() => {
        alert("Request updated to: " + newStatus);
        fetchRequests(); // Refresh the list
    });
}

function downloadCSV(filename, rows) {
    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function exportMembers() {
    db.collection("members").get().then(snapshot => {
        const rows = [["Name", "Email", "Fee Package", "Joined At"]];
        snapshot.forEach(doc => {
            const m = doc.data();
            rows.push([
                m.name,
                m.email,
                m.feePackage,
                m.joinedAt?.toDate().toLocaleString() || "N/A"
            ]);
        });
        downloadCSV("members.csv", rows);
    });
}

function exportBills() {
    db.collection("bills").get().then(snapshot => {
        const rows = [["Email", "Amount", "Note", "Date"]];
        snapshot.forEach(doc => {
            const b = doc.data();
            rows.push([
                b.email,
                b.amount,
                b.note,
                b.createdAt?.toDate().toLocaleString() || "N/A"
            ]);
        });
        downloadCSV("bills.csv", rows);
    });
}

function exportRequests() {
    db.collection("requests").get().then(snapshot => {
        const rows = [["Item", "Email", "Requested At", "Status"]];
        snapshot.forEach(doc => {
            const r = doc.data();
            rows.push([
                r.itemName,
                r.memberEmail,
                r.requestedAt?.toDate().toLocaleString() || "N/A",
                r.status
            ]);
        });
        downloadCSV("requests.csv", rows);
    });
}
