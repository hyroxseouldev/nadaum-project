import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
interface MainFloatingActionButtonProps {
  href: string;
  imageSrc: string;
  imageClassName?: string;
}

const MainFloatingActionButton = ({
  href,
  imageSrc,
  imageClassName,
}: MainFloatingActionButtonProps) => {
  return (
    <Link href={href}>
      <Button
        className="w-[71px] h-[71px] bg-white rounded-lg shadow-lg"
        variant="ghost"
      >
        <Image
          src={imageSrc}
          alt={href}
          width={24}
          height={24}
          className={imageClassName}
        />
      </Button>
    </Link>
  );
};

export default MainFloatingActionButton;
