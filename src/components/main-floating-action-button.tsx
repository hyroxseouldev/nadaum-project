import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
interface MainFloatingActionButtonProps {
  href: string;
  imageSrc: string;
  imageClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  buttonClassName?: string;
}

const MainFloatingActionButton = ({
  href,
  imageSrc,
  imageClassName,
  buttonClassName,
  imageWidth,
  imageHeight,
}: MainFloatingActionButtonProps) => {
  return (
    <Link href={href}>
      <Button
        className={`w-[71px] h-[71px] bg-white rounded-lg shadow-lg ${buttonClassName}`}
        variant="ghost"
      >
        <Image
          src={imageSrc}
          alt={href}
          width={imageWidth}
          height={imageHeight}
          className={imageClassName}
        />
      </Button>
    </Link>
  );
};

export default MainFloatingActionButton;
