"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "./Modal";
import { SignIn  } from "@clerk/nextjs";


export default function LogIn() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="bg-blue-800">
        Sign In
      </Button>

      

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SignIn  routing="hash"/>
      </Modal>
    </>
  );
}


