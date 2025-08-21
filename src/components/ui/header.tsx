import logo from "../../assets/new_logo_small.png";
import appnadoLogo from "../../assets/appnado_logo.png";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Header() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    invoke<string | null>("fetch_logo_command")
      .then((result) => {
        if (result) {
          setLogoUrl(result); // could be base64 or file path
        }
      })
      .catch((err) => console.error("Failed to fetch logo:", err));
  }, []);

  return (
    <div className="min-w-screen bg-white py-3 px-24 font-redhat text-black flex items-center">
      <div className="flex items-center gap-4">
        <img src={logo} alt="logo" className="ml-19 max-w-[3rem]" />
       <p className="ml-3 text-xl font-bold">Barangay Management System</p>
        <img
          src={appnadoLogo}
          alt="company logo"
          className="ml-160 max-w-[7rem]"
        />
        {logoUrl && (
          <img
            src={logoUrl}
            alt="logo"
            className="max-w-[4rem]"
          />
        )}
      </div>
    </div>
  );
}
