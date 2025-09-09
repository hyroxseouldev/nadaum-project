import MainFloatingActionButton from "@/components/main-floating-action-button";

// 가로 최대값이 최대 400px 이고 그 이상이 되면 가운데 정렬이 되도록 하는 레이아웃 컴포넌트
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[500px] mx-auto h-screen relative">
      {children}
      {/* // contact, media, upload 로 가는 링크 버튼 3개 가 화면의 우측 하단에 고정되어 있어야 합니다. */}
      <div className="absolute bottom-5 right-4 flex gap-1">
        <MainFloatingActionButton href="/contact" imageSrc="/logo/logo.png" />
        <MainFloatingActionButton href="/media" imageSrc="/logo/arrow.png" />
        <MainFloatingActionButton href="/upload" imageSrc="/logo/plus.png" />
      </div>
    </div>
  );
};

export default MainLayout;
