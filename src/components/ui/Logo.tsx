import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="https://cedah.energia.gob.mx/demo1/media/logos/logo_blanco.svg"
      alt="Logo"
      width={32}
      height={32}
      className="w-8 h-8"
    />
  );
}