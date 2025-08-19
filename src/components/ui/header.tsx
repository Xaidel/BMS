import logo from "../../assets/new_logo_small.png";
import appnadoLogo from "../../assets/appnado_logo.png";
import { useEffect, useState } from "react";

export default function Header() {
  const [, setUsername] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) {
      setUsername(stored.charAt(0).toUpperCase() + stored.slice(1));
    }
  }, []);

  return (
    <div className="min-w-screen bg-white py-3 px-24 font-redhat text-black flex items-center">
      <div className="flex items-center gap-7">
        <img src={logo} alt="logo" className="max-w-[3rem]" />
        <p className="text-xl">Barangay Management System</p>
        <img src={appnadoLogo} alt="company logo" className="ml-195 max-w-[7rem]" />
      </div>
    </div>
  );
}
