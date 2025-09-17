import MainFloatingActionButton from "@/components/main-floating-action-button";

// 가로 최대값이 최대 400px 이고 그 이상이 되면 가운데 정렬이 되도록 하는 레이아웃 컴포넌트
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[1162px] mx-auto h-screen flex flex-col relative">
      {children}
      {/* Floating action buttons fixed to viewport */}
      <div className="fixed bottom-7.5 right-1/2 transform translate-x-1/2 max-w-[1162px] w-full">
        <div className="flex gap-1 justify-end pr-7">
          <MainFloatingActionButton
            href="/contact"
            imageSrc="/logo/logo.png"
            imageWidth={100}
            imageHeight={100}
            buttonClassName="p-1.5"
          />
          <MainFloatingActionButton
            href="/media"
            imageSrc="/logo/arrow.png"
            imageWidth={24}
            imageHeight={24}
          />
          {/* 서울 401 */}
          {/* 정보는 카페 관리로 가서 밸류 값을 보고 바꿔주면 됨 */}
          <MainFloatingActionButton
            href="/upload?uploadValue=401"
            imageSrc="/logo/plus.png"
            imageWidth={24}
            imageHeight={24}
          />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
