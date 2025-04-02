import { useState } from "react";
import { db } from "@/lib/firebase"; // Ensure this path correctly points to your firebase.js
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button"; // Adjust the import path as needed

export default function AddUser() {
  const [loading, setLoading] = useState(false);

  const addUserToFirestore = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: "New User",
        email: "user@example.com",
        createdAt: new Date(),
      });
      console.log("User added with ID:", docRef.id);
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    }
    setLoading(false);
  };

  return (
    <Button onClick={addUserToFirestore} disabled={loading}>
      {loading ? "Adding..." : "Add User to Firestore"}
    </Button>
  );
}
