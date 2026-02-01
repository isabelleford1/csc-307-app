// src/MyApp.jsx

import React, { useEffect, useState } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  // Fetch users from backend (MongoDB) on page load
  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    fetch("http://localhost:8000/users")
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error(`GET /users failed with status ${res.status}`);
      })
      .then((data) => {
        // backend returns { users_list: [...] }
        setCharacters(data.users_list);
      })
      .catch((err) => console.error(err));
  }

  // Delete by Mongo _id
  function removeOneCharacter(id) {
    fetch(`http://localhost:8000/users/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.status === 204) {
          // remove from state immediately
          setCharacters((prev) => prev.filter((c) => c._id !== id));
          return;
        }
        if (res.status === 404) throw new Error("User not found");
        throw new Error(`DELETE failed with status ${res.status}`);
      })
      .catch((err) => console.error(err));
  }

  // Create user in Mongo, then add returned doc (with _id) to UI
  function updateList(person) {
    fetch("http://localhost:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person), // { name, job }
    })
      .then((res) => {
        if (res.status === 201) return res.json();
        throw new Error(`POST /users failed with status ${res.status}`);
      })
      .then((createdUser) => {
        setCharacters((prev) => [...prev, createdUser]);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;



// import React, { useState } from "react";
// import Table from "./Table";
// import Form from "./Form";

// function MyApp() {
//   const [characters, setCharacters] = useState([]);

//   function removeOneCharacter(index) {
//     const updated = characters.filter((character, i) => {
//       return i !== index;
//     });
//     setCharacters(updated);
//   }
//   function updateList(person) {
//     setCharacters([...characters, person]);
//   }

//  return (
//     <div className="container">
//         <Table
//         characterData={characters}
//         removeCharacter={removeOneCharacter}
//         />
//         <Form handleSubmit={updateList} />
//     </div>
//     );
// }

// export default MyApp;