import Modal from "@/components/modal";
import ModalPageLayout from "@/components/modal-page-layout";

// 배포환경 모달 라우팅 문제 해결을 위한 dynamic export
export const dynamic = "force-dynamic";

export default function MediaModal() {
  const media = [
    {
      title: "캠페인 영상",
      link: "https://www.instagram.com/reel/DOn5mZyEnvy/?utm_source=ig_web_copy_link",
    },
    {
      title: "배너 영상",
      link: "https://www.google.com",
    },
    {
      title: "인스타그램",
      link: "https://www.google.com",
    },
  ];
  return (
    <Modal>
      <ModalPageLayout subTitle="MEDIA">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-y-3">
          {media.map((media) => (
            <div
              key={media.title}
              className="flex flex-col items-center justify-center"
            >
              <a
                href={media.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-normal text-[#000000] hover:underline"
              >
                {media.title}
              </a>
            </div>
          ))}
        </div>
      </ModalPageLayout>
    </Modal>
  );
}
