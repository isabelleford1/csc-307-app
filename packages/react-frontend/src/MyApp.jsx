// src/MyApp.jsx

//import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  // function removeOneCharacter(index) {
  //   const updated = characters.filter((character, i) => {
  //     return i !== index;
  //   });
  //   setCharacters(updated);
  // }
  function removeOneCharacter(index) {
    const userToDelete = characters[index];
    const id = userToDelete.id;

    deleteUser(id)
      .then((res) => {
        if (res.status !== 204) throw new Error("DELETE failed (expected 204)");
        setCharacters((prev) => prev.filter((c) => c.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  
  // function updateList(person) {
  //   setCharacters([...characters, person]);
  // }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    // return promise;
  }

  // function updateList(person) {
  //   postUser(person)
  //     .then(() => setCharacters([...characters, person]))
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
// only updates table if backend returns 201,
// and it uses the server-returned object with id
  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status !== 201) throw new Error("POST failed (expected 201)");
        return res.json();
      })
      .then((newUserFromServer) => {
        setCharacters((prev) => [...prev, newUserFromServer]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteUser(id) {
    return fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });
  }



  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

 return (
    <div className="container">
        <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
        />
        <Form handleSubmit={updateList} />
    </div>
    );
}




export default MyApp;