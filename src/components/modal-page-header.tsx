import Image from "next/image";
interface ModalPageHeaderProps {
  subTitle: string;
}

const ModalPageHeader = ({ subTitle }: ModalPageHeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Image src="/logo/logo.png" alt="logo" width={75} height={27} />
      {/* // 폰트사이트10px, 굵기400, 색상 #000000 */}
      <p className="text-[10px] font-normal text-[#000000]">{subTitle}</p>
    </div>
  );
};

export default ModalPageHeader;
